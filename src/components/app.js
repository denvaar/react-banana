import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { getRandom } from '../utils/utils';
import {
  updateTile,
} from '../actions/actions';

import BoardSquare from './boardSquare';
import Tile from './tile';


class App extends Component {
  constructor(props) {
    super(props);
    this.onTileClick = this.onTileClick.bind(this);
    this.onBoardSquareClick = this.onBoardSquareClick.bind(this);
  }

  onTileClick(event, id, letter) {
    var index = this.props.tiles.findIndex(obj => obj.id === id);
    
    var clickedTiles = this.props.tiles.filter(obj => obj.clicked === true);
    if (clickedTiles.length > 0) {
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
      clicked: true
    }), index);
  }

  onBoardSquareClick(event) {
    event.preventDefault();
    var tile = this.props.tiles.filter(obj => obj.clicked === true)[0];
    if (tile) {
      console.log('doing it',event.clientY);
      var index = this.props.tiles.findIndex(obj => obj.id === tile.id);
      var x = event.clientY - (event.clientY % 40);
      var y = event.clientX - (event.clientX % 40);
      this.props.updateTile(Object.assign(
        this.props.tiles[index], {
        x: x,
        y: y,
        clicked: false
      }), index);
    }
  }

  render() {
    var activeTiles = [];
    var inactiveTiles = [];
    
    this.props.tiles.map((tile, i) => {
      if (!tile.isActive) {
        inactiveTiles.push(<Tile key={i}
                                 id={tile.id}
                                 letter={tile.letter}
                                 x={tile.x}
                                 y={tile.y}
                                 tilt={tile.tilt}
                                 clicked={tile.clicked} />);
      } else {
        activeTiles.push(<Tile key={i}
                               id={tile.id}
                               onTileClick={this.onTileClick}
                               letter={tile.letter}
                               x={tile.x}
                               y={tile.y}
                               tilt={0} 
                               clicked={tile.clicked} />);
      }
    });

    var droppables = [];
    var i = 0;
    for (var y = 0; y < 15; y++) {
      for (var x = 0; x < 15; x++) {
        let styles = {
          top: y * 40,
          left: x * 40,
          zIndex: 0,
        };
        droppables.push(<BoardSquare key={i}
                                     onBoardSquareClick={this.onBoardSquareClick}
                                     tiles={this.props.tiles}
                                     updateTile={this.props.updateTile}
                                     styles={styles} />);
        i++;
      }
    }

    return (
      <div className="game">
        <div className="grid">
          {droppables}
          {activeTiles}
        </div>
        <div className="pile">
          {inactiveTiles}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    tiles: state.appReducer.tiles,
  };
}

export default connect(mapStateToProps, { updateTile })(App);
