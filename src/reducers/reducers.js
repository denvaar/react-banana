import { combineReducers } from 'redux';

import {
  ADD_ACTIVE_TILE,
  REMOVE_INACTIVE_TILE
} from '../actions/actions';

const INITIAL_STATE = {
  activeTiles: [],
  inactive: [
    {
      id: 1,
      letter: 'A'
    },
    {
      id: 2,
      letter: 'A'
    },
    {
      id: 3,
      letter: 'B'
    },
    {
      id: 4,
      letter: 'C'
    }
  ]
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) { 
    case ADD_ACTIVE_TILE:
      return Object.assign({}, state, {
        activeTiles: [...state.activeTiles, {
          x: action.data.x,
          y: action.data.y,
          letter: action.data.letter
        }]
      });
    case REMOVE_INACTIVE_TILE:
      return Object.assign({}, state, {
        inactive: [
          ...state.inactive.slice(0, action.index),
          ...state.inactive.slice(action.index + 1)
        ]
      });
    default:
      return state;
  }
}

/*
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
*/

const rootReducer = combineReducers({
  appReducer
});

export default rootReducer;
