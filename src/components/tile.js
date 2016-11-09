import React from 'react';
import { Component } from 'react';
var classNames = require('classnames');


export default class Tile extends Component {
  
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps));
  }
  
  render() {
    let classes = classNames({
      "tile": true,
      "tile--active": this.props.isSelected
    });
    let styles = {
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      zIndex: 1
    };
    console.log("rendering tile");
    return (
      <div className={classes}
           style={styles}
           onClick={this.props.onClick}
           >{this.props.letter}</div>
    );
  }
}
