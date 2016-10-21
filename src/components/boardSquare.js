import React from 'react';
import { Component } from 'react';
var classNames = require('classnames');


class BoardSquare extends Component {

  constructor(props) {
    super(props);
    this.state = {
      occupied: false,
      dragOver: false
    };
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragEnter(event) {
    this.setState({
      dragOver: true
    });
  }

  onDragLeave(event) {
    this.setState({
      dragOver: false,
      occupied: false
    });
  }

  allowDrop(event) {
    event.preventDefault();
  }

  onDrop(event) {
    event.preventDefault();
    this.setState({
      dragOver: false,
      occupied: true
    });
    var data = JSON.parse(event.dataTransfer.getData('text'));

    var x = event.clientY - (event.clientY % 40);
    var y = event.clientX - (event.clientX % 40);
    var index = this.props.tiles.findIndex(obj => obj.id === data.id);
    this.props.updateTile({
      id: data.id,
      x: x,
      y: y,
      tilt: 0,
      letter: data.letter,
      isActive: true
    }, index);
  }

  render() {
    var boardSquareClass = classNames({
      'empty-tile': true,
      'empty-tile--hover': this.state.dragOver
    });
    return (
      <div className={boardSquareClass}
           style={this.props.styles}
           onClick={this.props.onBoardSquareClick}
           onDragOver={this.allowDrop}
           onDragEnter={this.onDragEnter}
           onDragLeave={this.onDragLeave}
           onDrop={this.onDrop}>
      </div>
    );
  }
}

export default BoardSquare;

