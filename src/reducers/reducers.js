import { combineReducers } from 'redux';
import merge from 'lodash/merge';

import { getRandom, buildInitialState } from '../utils/utils';
import {
  UPDATE_TILE
} from '../actions/actions';

const INITIAL_STATE = {
  tiles: buildInitialState(),
  time: 100000,
  words: {
    "test": {
      startX: 0,
      startY: 0,
      endX: 160,
      endY: 0
    }
  }
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_TILE:
      return Object.assign({}, state, {
        tiles: [
          ...state.tiles.slice(0, action.index),
          action.payload,
          ...state.tiles.slice(action.index + 1)
        ]
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appReducer
});

export default rootReducer;
