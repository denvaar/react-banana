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
    this.onTileDoubleClick = this.onTileDoubleClick.bind(this);
    this.onBoardSquareClick = this.onBoardSquareClick.bind(this);
  }

  onTileDoubleClick(event, id, letter) {
    var tile = this.props.tiles.filter(obj => { return(obj.id === id) })[0];
    if (tile.isActive) {
      // put tile into pile
    } else {
      // take tile out of pile
    
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
  };
}

export default connect(mapStateToProps, { updateTile })(App);
