import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { getRandom, depthFirstSearch } from '../utils/utils';
import {
  updateTile,
  addToGraph,
  removeFromGraph,
  updateTestTile,
  updateWords
} from '../actions/actions';

import BoardSquare from './boardSquare';
import Tile from './tile';
import CountdownTimer from './timer';

class App extends Component {
  constructor(props) {
    super(props);
    this.onTileClick = this.onTileClick.bind(this);
    this.onTileDoubleClick = this.onTileDoubleClick.bind(this);
    this.onBoardSquareClick = this.onBoardSquareClick.bind(this);
    this.doWordCheck = this.doWordCheck.bind(this);
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
        console.log("occupied");
      }

    }
  }

  onTileClick(event, id, letter) {
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
  }

  onBoardSquareClick(event, _x, _y) {
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

  }

  doWordCheck(testTiles, startTiles = []) {
    /*
      depth first search for each
      tile that is placed without
      another above and to the left
      of it.
    */
    var words = '';
    startTiles.forEach(tile => {
      var result = depthFirstSearch(tile.y, tile.x, testTiles);
      words += ';' + result; 
    });
    console.log(words, words.split(';').filter(s => { return (s !== "") }));

    this.props.updateWords(words.split(';').filter(s => {
      return s !== "";
    }));
  }

  render() {
    var activeTiles = [];
    var inactiveTiles = [];
    
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

      var words = this.props.words.map((word, index) => {
        return (<li key={index}>{word}</li>);
      });
    }

    return (
      <div className="game">
        <div className="score-board">
          <CountdownTimer initialTimeRemaining={this.props.time} />
          <span className="active">Active tiles: {activeTiles.length}</span>
          <span className="inactive">Inactive tiles: {inactiveTiles.length}</span>
          <div className="word-list">
            <ol>
              {words}
            </ol>
          </div>
        </div>
        <div className="pile">
          {inactiveTiles}
        </div>
        <div className="grid">
          {droppables}
          {activeTiles}
        </div>
      </div>
    );
  }
}


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
