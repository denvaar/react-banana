import React from 'react';
import { Component } from 'react';

import { connect } from 'react-redux';
import { playerMove } from '../actions/actions';


const ALPHABET = [
  'A', '?', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', '?', 'L', 'M', 'N', 'O', 'P', '?', 'Q', 'R',
  'O', 'P', '?', 'Q', 'R', 'J', 'K', '?', 'L', 'M', 'N', 
  'S', 'T', '?', 'U', 'V', '?', 'W', '?', 'X', 'Y', 'Z', '?',
  'W', '?', 'X', 'Y', 'Z', '?', 'S', 'T', '?', 'U', 'V', '?' 
];

class Tile extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
  }

  render() {
    return (
      <div className="tile">{this.props.letter}</div>
    );
  }
}

class BoardSquare extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
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

  render() {
    var tiles = ALPHABET.map((letter, i) => {
      const x = (letter !== '?') ? <Tile key={i} letter={letter} /> : <BoardSquare />;
      return (
        x
      );
    });
    return (
      <div className="grid">
        {tiles}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
}

export default connect(mapStateToProps, { })(App);
