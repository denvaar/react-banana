import React from 'react';
import { Component } from 'react';
var classNames = require('classnames');
import { connect } from 'react-redux';

import { playerMove } from '../actions/actions';


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


class Tile extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: false
    };
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({ selected: !this.state.selected });
  }

  render() {
    var tileClass = classNames({
      'tile': true,
      'tile--active': this.state.selected
    });

    let styles = {
      top: this.props.x + 'px',
      left: this.props.y + 'px',
      transform: `rotate(${this.props.tilt}deg)`
    };
    return (
      <div className={tileClass}
           style={styles}
           onClick={this.handleClick} >
        {this.props.letter}
      </div>
    );
  }
}

class BoardSquare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="empty-tile">?</div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
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


  render() {
    var tiles = [];
    for (var i = 0; i < 145; i++) {
      tiles.push(<Tile key={i}
                       letter={this.getLetter()}
                       x={this.getRandom(170, 0)}
                       y={this.getRandom(700, 0)}
                       tilt={this.getRandom(11, -11)} />);
    }

    return (
      <div className="game">
        <div className="grid">
        
        </div>
        <div className="pile">
          {tiles}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
}

export default connect(mapStateToProps, { })(App);
