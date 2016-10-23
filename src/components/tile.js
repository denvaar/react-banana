import React from 'react';
import { Component } from 'react';
var classNames = require('classnames');


class Tile extends Component {
  constructor(props) {
    super(props);
    this.drag = this.drag.bind(this);
  }
  
  drag(event) {
    event.dataTransfer.setData('text', JSON.stringify(this.props));
  }

  render() {
    var tileClass = classNames({
      'tile': true,
      'tile--active': this.props.clicked
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
           onDoubleClick={() => { this.props.onTileDoubleClick(event, this.props.id, this.props.letter) }} 
           onClick={() => { this.props.onTileClick(event, this.props.id, this.props.letter) }}> 
        {this.props.isActive && this.props.letter}
      </div>
    );
  }

}

export default Tile;
