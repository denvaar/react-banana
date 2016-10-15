import { combineReducers } from 'redux';

import {
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_UP,
  MOVE_DOWN,
  UPDATE_PLAYER_POSITION
} from '../actions/actions';

const INITIAL_STATE = {
  keys: {
    left: 0,
    right: 0,
    up: 0,
    down: 0
  },
  player: {
    x: 300,
    y: 300
  }
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PLAYER_POSITION:
      return Object.assign({}, state, {
        player: {x: state.player.x+7, y: 300}
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  player
});

export default rootReducer;
