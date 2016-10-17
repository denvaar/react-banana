import React from 'react';
import { Component } from 'react';
var classNames = require('classnames');
import { connect } from 'react-redux';

import {
  addActiveTile,
  removeInactiveTile
} from '../actions/actions';

/*
var ALPHABET = {
  'A': 13,
  'B': 3,
  'C': 3,
  'D': 6,
  'E': 18,
  'F': 3,
  'G': 4,
  'H': 3,
  'I': 12,
  'J': 2,
  'K': 2,
  'L': 5,
  'M': 3,
  'N': 8,
  'O': 12,
  'P': 3,
  'Q': 2,
  'R': 9,
  'S': 6,
  'T': 9,
  'U': 6,
  'V': 3,
  'W': 3,
  'X': 2,
  'Y': 3,
  'Z': 2
}
*/

class Tile extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.drag = this.drag.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.drag(event);
  }
 
  drag(event) {
    event.dataTransfer.setData('text', JSON.stringify(this.props));
  }

  render() {
    var tileClass = classNames({
      'tile': true,
    });

    let styles = {
      top: this.props.x + 'px',
      left: this.props.y + 'px',
      transform: `rotate(${this.props.tilt}deg)`
    };
    return (
      <div className={tileClass}
           draggable={"true"}
           onDragStart={this.drag}
           style={styles}
           onClick={this.handleClick} >
        {this.props.letter}
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.allowDrop = this.allowDrop.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    window.addEventListener("dragover", this.onDragEnter);
  }
  
  componentWillUnmount() {
    window.removeEventListener("dragover", this.onDragEnter);
  }

  onDragEnter(event) {
    console.log(event.clientX, event.clientY);

  }

  makePile() {

    var tiles = [];
    for (var i = 0; i < 145; i++) {
      tiles.push(<Tile key={i}
                       letter={this.getLetter()}
                       x={this.getRandom(170, 0)}
                       y={this.getRandom(700, 0)}
                       tilt={this.getRandom(11, -11)} />);
    }
    return tiles;
  }

  getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getLetter() {
    var index = this.getRandom(Object.keys(ALPHABET).length-1, 0);
    var letter = Object.keys(ALPHABET)[index];
    if (ALPHABET[letter] <= 1) {
      delete ALPHABET[letter];
    } else {
      ALPHABET[letter]--;
    }
    return letter;
  }

  allowDrop(event) {
    event.preventDefault();
  }
  
  onDrop(event) {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData('text'));
    console.log('received', data, event.clientX, event.clientY);
    
    var activeTiles = this.props.activeTiles;
    
    var x = event.clientX - (event.clientX % 40);
    var y = event.clientY - (event.clientY % 40);
    
    this.props.addActiveTile({x: y, y: x, letter: data.letter});
    var index = this.props.inactiveTiles.findIndex(obj => obj.id === data.id);
    this.props.removeInactiveTile(index);
  }

  render() {
    var activeTiles = [];
    this.props.activeTiles.map((tile, i) => {
      activeTiles.push(<Tile key={i}
                             letter={tile.letter}
                             x={tile.x}
                             y={tile.y}
                             tilt={0} />);
    });

    var inactiveTiles = [];
    this.props.inactiveTiles.map((tile, i) => {
      inactiveTiles.push(<Tile key={i}
                               id={tile.id}
                               letter={tile.letter}
                               x={this.getRandom(170, 0)}
                               y={this.getRandom(700, 0)}
                               tilt={this.getRandom(11, -11)} />);
    });

    return (
      <div className="game">
        <div className="grid"
             onDragOver={this.allowDrop}
             onDrop={this.onDrop}>
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
    activeTiles: state.appReducer.activeTiles,
    inactiveTiles: state.appReducer.inactive
  };
}

export default connect(mapStateToProps, { addActiveTile, removeInactiveTile })(App);
