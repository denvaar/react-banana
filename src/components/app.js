import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { getRandom } from '../utils/utils';
import {
  updateTile,
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

  onTileDoubleClick(event, id, letter) {
    var index = this.props.tiles.findIndex(obj => obj.id === id);
    var tile = this.props.tiles.filter(obj => { return(obj.id === id) })[0];
    
    if (tile.isActive) {
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
      
      
      clickedTiles[0].clicked = false;

      clickedTiles[0].x = clickedTiles[0].x + this.props.tiles[index].x;
      this.props.tiles[index].x = clickedTiles[0].x - this.props.tiles[index].x;
      clickedTiles[0].x = clickedTiles[0].x - this.props.tiles[index].x;
      
      clickedTiles[0].y = clickedTiles[0].y + this.props.tiles[index].y;
      this.props.tiles[index].y = clickedTiles[0].y - this.props.tiles[index].y;
      clickedTiles[0].y = clickedTiles[0].y - this.props.tiles[index].y;
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

  doWordCheck() {
    var allWords = [];
    // loop through each row.
    for (var x = 0; x < 15; x++) {
      // get all of the letters that are on this row.
      var letters = this.props.tiles.filter(letter => {
        return (letter.x === x*40) && letter.isActive;
      });
      // if there are more than one letters on same row.
      if (letters.length > 1) {
        var word = "";
        for (var y = 0; y < 20; y++) {

          var nextTile = this.props.tiles.find(obj => {
            return (obj.isActive &&
                    (obj.x === x*40 &&
                     obj.y === y*40)
            );
          });
          
          if (nextTile) {
            word = word + nextTile.letter;
          } else {
            if (word.length > 1) {
              allWords.push({
                [word]: {
                  startY: x * 40,
                  startX: (y - word.length) * 40,
                  endX: (y - 1) * 40,
                  length: word.length,
                  direction: "horizontal"
                }
              });
            }
            word = "";
          }
        }
      }
    }
  
    // loop through each column.
    for (var y = 0; y < 20; y++) {
      // get all of the letters that are on this column.
      var letters = this.props.tiles.filter(letter => {
        return (letter.y === y*40) && letter.isActive;
      });
      // if there are more than one letters on same row.
      if (letters.length > 1) {
        var word = "";
        for (var x = 0; x < 15; x++) {

          var nextTile = this.props.tiles.find(obj => {
            return (obj.isActive &&
                    (obj.x === x*40 &&
                     obj.y === y*40)
            );
          });
          
          if (nextTile) {
            word = word + nextTile.letter;
          } else {
            if (word.length > 1) {
              allWords.push({
                [word]: {
                  startY: (x - word.length) * 40,
                  startX: y * 40,
                  endY: (x - 1) * 40,
                  length: word.length,
                  direction: "vertical"
                }
              });
            }
            word = "";
          }
        }
      }
    }
    console.log(allWords);
    for (var i = 0; i < allWords.length; i++) {
      for (var j = 1; j < allWords.length; j++) {
        console.log("compare", allWords[i], allWords[j]);
      }
    }
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
                                     styles={styles} />);
        i++;
      }
    }

    return (
      <div className="game">
        <div className="score-board">
          <button onClick={this.doWordCheck}>Check</button>
          <CountdownTimer initialTimeRemaining={this.props.time} />
          <span className="active">Active tiles: {activeTiles.length}</span>
          <span className="inactive">Inactive tiles: {inactiveTiles.length}</span>
          <span className="words">Words: {Object.keys(this.props.words).length}</span>
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
    words: state.appReducer.words
  };
}

export default connect(mapStateToProps, { updateTile })(App);
