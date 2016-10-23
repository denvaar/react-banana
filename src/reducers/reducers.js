import { combineReducers } from 'redux';
import merge from 'lodash/merge';

import { getRandom, buildInitialState } from '../utils/utils';
import {
  UPDATE_TILE
} from '../actions/actions';

const INITIAL_STATE = {
  tiles: buildInitialState()
  /*[
    {
      id: 1,
      letter: 'B',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 2,
      letter: 'A',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 3,
      letter: 'N',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 4,
      letter: 'A',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 5,
      letter: 'N',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 6,
      letter: 'A',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    },
    {
      id: 7,
      letter: 'S',
      x: getRandom(170, 0),
      y: getRandom(700, 0),
      tilt: getRandom(15, -15),
      isActive: false,
      clicked: false
    }
  ]*/
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
