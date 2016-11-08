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
  for (var y = 0; y < 100; y++) {
    for (var x = 0; x < 10; x++) {
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
    this.state = {
      tiles: buildTestTiles(),
    };
    
    this.onTileClick = this.onTileClick.bind(this);
    this.onTileDoubleClick = this.onTileDoubleClick.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.doWordCheck = this.doWordCheck.bind(this);
    
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
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.testTiles !== this.props.testTiles) {
      var startTiles = nextProps.tiles.filter(tile => {
        return (tile.isActive &&
                !nextProps.testTiles[`${tile.y-40},${tile.x}`] &&
                !nextProps.testTiles[`${tile.y},${tile.x-40}`]);
      });
      this.doWordCheck(nextProps.testTiles, startTiles);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.doWordCheck(this.state.tiles,
                     this.state.tiles.filter(t => {
                       return t.x === 0 && t.y === 0
                     }));
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
        console.log(selectedTiles[0].id, tile.id) 
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
          tiles: tilesCopy
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


    /*
    var index = this.props.tiles.findIndex(obj => obj.id === id);

    var clickedTiles = this.props.tiles.filter(obj => obj.clicked === true);
    if (clickedTiles.length > 0 && (id != clickedTiles[0].id)) {
      
      var oldX = clickedTiles[0].x;
      var oldY = clickedTiles[0].y;

      clickedTiles[0].clicked = false;

      clickedTiles[0].x = clickedTiles[0].x + this.props.tiles[index].x;
      this.props.tiles[index].x = clickedTiles[0].x - this.props.tiles[index].x;
      clickedTiles[0].x = clickedTiles[0].x - this.props.tiles[index].x;
      
      clickedTiles[0].y = clickedTiles[0].y + this.props.tiles[index].y;
      this.props.tiles[index].y = clickedTiles[0].y - this.props.tiles[index].y;
      clickedTiles[0].y = clickedTiles[0].y - this.props.tiles[index].y;
      
      this.props.updateTestTile(`${clickedTiles[0].y},${clickedTiles[0].x}`,
                                this.props.tiles[index].y, this.props.tiles[index].x);
      this.props.updateTestTile(`${this.props.tiles[index].y},${this.props.tiles[index].x}`,
                                oldY, oldX);
    }
    
    this.props.updateTile(Object.assign(
      this.props.tiles[index], {
      id: id,
      clicked: (clickedTiles.length > 0) ? false : true
    }), index);
    */
  }

  onCellClick(event, _x, _y) {
    console.log(event.target.style.left, event.target.style.top);
    
    var selectedTiles = this.state.tiles.filter(tile => tile.isSelected);
    
    if (selectedTiles.length === 1) {
      let newCoords = {
        x: event.target.style.left.split("px")[0],
        y: event.target.style.top.split("px")[0]
      };
      this.setState({
        tiles: [
          ...this.state.tiles.slice(0, selectedTiles[0].id),
          {
            ...selectedTiles[0],
            ...newCoords,
            isSelected: false
          },
          ...this.state.tiles.slice(selectedTiles[0].id + 1)
        ]
      });
    }
    /*
    var tile = this.props.tiles.filter(obj => obj.clicked === true)[0];
    if (tile) {
      
      this.props.testTiles[`${tile.y},${tile.x}`]
      this.props.updateTestTile(`${tile.y},${tile.x}`, _x, _y);

      var index = this.props.tiles.findIndex(obj => obj.id === tile.id);

      this.props.updateTile(Object.assign(
        this.props.tiles[index], {
        x: _y,
        y: _x,
        clicked: false
      }), index);
      this.doWordCheck();
    }
    */
  }

  doWordCheck(testTiles, startTiles = []) {
    /*
      depth first search for each
      tile that is placed without
      another above and to the left
      of it.
    */
    let _testTiles = {}
    testTiles.forEach(tile => {
      _testTiles[`${tile.x},${tile.y}`] = {
        x: tile.x,
        y: tile.y,
        visited: false
      };
    });
    console.log(_testTiles);

    var words = '';
    startTiles.forEach(tile => {
      var result = depthFirstSearch(tile.y, tile.x, _testTiles);
      words += ';' + result; 
    });
    console.log(words, words.split(';').filter(s => { return (s !== "") }));

    this.props.updateWords(words.split(';').filter(s => {
      return s !== "";
    }));
  }
  
  render() {
    /* 
    this.props.tiles.map((tile, i) => {
      if (!tile.isActive) {
        inactiveTiles.push(<Tile key={i}
                                 onTileClick={this.onTileClick}
                                 onTileDoubleClick={this.onTileDoubleClick}
                                 {...tile} />);
      } else {
        activeTiles.push(<Tile key={i}
                               {...tile}
                               onTileClick={this.onTileClick}
                               onTileDoubleClick={this.onTileDoubleClick}
                               tilt={0} />);
      }
    });
    var droppables = [];
    var i = 0;
    for (var y = 0; y < 15; y++) {
      for (var x = 0; x < 20; x++) {
        let styles = {
          top: y * 40,
          left: x * 40,
          zIndex: 0
        };
        droppables.push(<BoardSquare key={i}
                                     x={x*40} y={y*40}
                                     onBoardSquareClick={this.onBoardSquareClick}
                                     tiles={this.props.tiles}
                                     updateTile={this.props.updateTile}
                                     updateTestTile={this.props.updateTestTile}
                                     styles={styles} />);
        i++;
      }
    }
    */
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
          <div className="word-list">
            <ol>
            </ol>
          </div>
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
