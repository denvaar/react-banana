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
  }

  onTileClick(event, id, letter) {
    var index = this.props.tiles.findIndex(obj => obj.id === id);
    this.props.updateTile({
      id: id,
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      letter: letter,
      isActive: false
    }, index);
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
                                 tilt={tile.tilt} />);
      } else {
        activeTiles.push(<Tile key={i}
                               id={tile.id}
                               onTileClick={this.onTileClick}
                               letter={tile.letter}
                               x={tile.x}
                               y={tile.y}
                               tilt={0} />);
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
