import { combineReducers } from 'redux';
import merge from 'lodash/merge';

import { getRandom, buildInitialState } from '../utils/utils';
import {
  UPDATE_TILE,
  GRAPH_ADD,
  GRAPH_REMOVE,
  UPDATE_TEST_TILE,
  UPDATE_WORDS
} from '../actions/actions';

const INITIAL_STATE = {
  tiles: buildInitialState(),
  time: 100000,
  words: [],
  testTiles: {

  }
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_WORDS:
      return {
        ...state,
        words: action.words
      };
    case UPDATE_TILE:
      return Object.assign({}, state, {
        tiles: [
          ...state.tiles.slice(0, action.index),
          action.payload,
          ...state.tiles.slice(action.index + 1)
        ]
      });
    case GRAPH_ADD:
      return { 
        ...state,
        testTiles: {
          ...state.testTiles,
          [`${action.x},${action.y}`]: {
            x: action.x,
            y: action.y,
            letter: action.letter,
            visited: false,
            canVisitAgain: false
          }
        }
      }
    case GRAPH_REMOVE:
      var testTiles = {};
      Object.keys(state.testTiles).forEach(key => {
        if (key !== action.key) testTiles[key] = state.testTiles[key];
      });
      console.log(action.key);
      return {
        ...state,
        testTiles: {
          ...testTiles
        }
      }
    case UPDATE_TEST_TILE:
      var testTiles = {};
      Object.keys(state.testTiles).forEach(key => {
        if (key !== action.key) {
          testTiles[key] = state.testTiles[key];
        }
      });
      return { 
        ...state,
        testTiles: {
          ...testTiles,
          [`${action.x},${action.y}`]: {
            ...state.testTiles[action.key],
            x: action.x,
            y: action.y
          }
        }
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appReducer
});

export default rootReducer;
