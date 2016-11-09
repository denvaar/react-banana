import React from 'react';
import { Component } from 'react';
//import { connect } from 'react-redux';

import { getRandom, depthFirstSearch } from '../utils/utils';
/*
import {
  updateTile,
  addToGraph,
  removeFromGraph,
  updateTestTile,
  updateWords
} from '../actions/actions';
*/
import BoardSquare from './boardSquare';
import Tile from './tile';

const buildTestTiles = () => {
  let tiles = [];
  let i = 0;
  for (var y = 5; y < 10; y++) {
    for (var x = 5; x < 10; x++) {
      tiles.push({
        id: i,
        letter: String.fromCharCode(97+x+y),
        x: x*40,
        y: y*40,
        visited: false,
        isSelected: false
      });
      i++;
    }
  }
  return tiles;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.onTileClick = this.onTileClick.bind(this);
    this.onTileDoubleClick = this.onTileDoubleClick.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.doWordCheck = this.doWordCheck.bind(this);
    
    let tiles = buildTestTiles();
    this.state = {
      tiles: tiles,
      words: this.doWordCheck(tiles, tiles.filter(t => { return t.x === 0 && t.y === 0 }))
    };
    
    this.cells = this.setupGrid();
    
    document.addEventListener("keydown", (event) => {
      if (event.which === 65) this.spacePressed = true;
    }, false);
    document.addEventListener("keyup", (event) => {
      if (event.which === 65) this.spacePressed = false;
    }, false);
  }

  setupGrid() {
    let cells = []; 
    var i = 0;
    for (var y = 0; y < 15; y++) {
      for (var x = 0; x < 20; x++) {
        let styles = { 
          top: y * 40, 
          left: x * 40, 
          zIndex: 0
        };  
        cells.push(<div key={i}
                        className={"empty-tile"}
                        onMouseOver={(event) => {
                        }}
                        style={styles}
                        onClick={this.onCellClick}
                   ></div>);
        i++;
      }   
    }
    return cells;
  } 
  
  onTileDoubleClick(event, id, letter) {
    var index = this.props.tiles.findIndex(obj => obj.id === id);
    var tile = this.props.tiles.filter(obj => { return(obj.id === id) })[0];
    
    if (tile.isActive) {
      var x = tile.x - (tile.x % 40);
      var y = tile.y - (tile.y % 40);
      this.props.removeFromGraph(y, x);
      // put tile into pile
      this.props.updateTile(Object.assign(
        tile, {
        id: id,
        x: getRandom(150, 10),
        y: getRandom(750, 20),
        isActive: false
      }), index);
      
    
    } else {
      // take tile out of pile
    
      var x = tile.x - (tile.x % 40);
      var y = tile.y - (tile.y % 40);

      var existingTiles = this.props.tiles.filter(obj => {
        return (obj.isActive && (obj.x === x && obj.y === y));
      });
      
      this.props.addToGraph(y,x, letter);
      
      if (existingTiles.length === 0) {
        this.props.updateTile(Object.assign(
          tile, {
          id: id,
          x: x,
          y: y,
          isActive: true
        }), index);
      } else {
      }

    }
  }

  onTileClick(event, id, letter) {
    let tile = {
      ...this.state.tiles[id],
      isSelected: !this.state.tiles[id].isSelected
    };
    // Is space key pressed?
    if (this.spacePressed) {
      this.setState({
        tiles: [
          ...this.state.tiles.slice(0, id),
          tile,
          ...this.state.tiles.slice(id + 1)
        ]
      });
    } else {
      let selectedTiles = this.state.tiles.filter(obj => obj.isSelected);
      
      if (selectedTiles.length === 1) {
        // swap coordinates with other tile. 
        let temp = {
          x: selectedTiles[0].x,
          y: selectedTiles[0].y,
        };
        selectedTiles[0] = {
          ...selectedTiles[0],
          x: tile.x,
          y: tile.y,
          isSelected: false
        };
        tile = { ...tile, ...temp, isSelected: false};
        
        let tilesCopy = [
          ...this.state.tiles.slice(0, tile.id),
          tile,
          ...this.state.tiles.slice(tile.id + 1)
        ];
        
        tilesCopy = [
          ...tilesCopy.slice(0, selectedTiles[0].id),
          selectedTiles[0],
          ...tilesCopy.slice(selectedTiles[0].id + 1)
        ];
        
        
        this.setState({
          tiles: tilesCopy,
          words: this.doWordCheck(tilesCopy, tilesCopy.filter(t => { return t.x === 0 && t.y === 0 }))
        });
      } else {
        this.setState({
          tiles: [
            ...this.state.tiles.slice(0, id),
            tile,
            ...this.state.tiles.slice(id + 1)
          ]
        });
      }

    }
  }

  onCellClick(event, _x, _y) {
    var selectedTiles = this.state.tiles.filter(tile => tile.isSelected);
    
    if (selectedTiles.length === 1) {
      let newCoords = {
        x: event.target.style.left.split("px")[0],
        y: event.target.style.top.split("px")[0]
      };
      let newTiles = [
        ...this.state.tiles.slice(0, selectedTiles[0].id),
        {
          ...selectedTiles[0],
          ...newCoords,
          isSelected: false
        },
        ...this.state.tiles.slice(selectedTiles[0].id + 1)
      ];
      
      
      this.setState({
        tiles: newTiles,
        words: this.doWordCheck(newTiles, newTiles.filter(t => {return t.x === 0 && t.y === 0}))
      });
    }
  }

  doWordCheck(testTiles, startTiles = []) {
    /*
      depth first search for each
      tile that is placed without
      another above and to the left
      of it.
    */
    let _testTiles = {};
    let _startTiles = {};
    testTiles.forEach(tile => {
      _testTiles[`${tile.x},${tile.y}`] = {
        x: tile.x,
        y: tile.y,
        letter: tile.letter,
        visited: false,
        canVisitAgain: false
      };
    });
    
    
    testTiles.forEach(tile => {
      if (!_testTiles[`${tile.x-40},${tile.y}`] && !_testTiles[`${tile.x},${tile.y-40}`]) {
        _startTiles[`${tile.x},${tile.y}`] = {
          x: tile.x,
          y: tile.y,
          letter: tile.letter,
          visited: false,
          canVisitAgain: false
        }
      }
    });


    var words = '';
    Object.keys(_startTiles).forEach(tile => {
      let x = parseInt(tile.split(',')[0]);
      let y = parseInt(tile.split(',')[1]);
      var result = depthFirstSearch(x, y, _testTiles);
      words += ';' + result; 
    });
    return words.split(';').filter(s => { return s !== "" });
  }
  
  render() {
    let tiles = this.state.tiles.map((obj, i) => {
      return (<Tile key={i}
                    onClick={() => {
                      this.onTileClick(event, obj.id, obj.letter);
                    }}
                    {...obj} />);
    });
    console.log("rendering app");
    return (
      <div className="game">
        <div className="score-board">
          <span className="active">Active tiles: {0}</span>
          <span className="inactive">Inactive tiles: {0}</span>
          
          {this.state.words.length > 0 && <div className="word-list">
            <ol>
            {this.state.words.map((word, i) => {
              return <li key={i}>{word}</li>
            })}
            </ol>
          </div>}
        </div>
        <div className="pile">
        </div>
        <div className="grid">
          {tiles}
          {this.cells}
        </div>
      </div>
    );
  }
}
/*

const mapStateToProps = (state) => {
  return {
    tiles: state.appReducer.tiles,
    time: state.appReducer.time,
    words: state.appReducer.words,
    testTiles: state.appReducer.testTiles
  };
}

export default connect(mapStateToProps, {
  updateTile,
  addToGraph,
  removeFromGraph,
  updateTestTile,
  updateWords
})(App);
*/
