export const PLAYER_MOVE = 'PLAYER_MOVE';

export const MOVE_RIGHT = 'MOVE_RIGHT';
export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_UP = 'MOVE_UP';
export const MOVE_DOWN = 'MOVE_DOWN';
export const SPACE = 'SPACE';

export const UPDATE_PLAYER_POSITION = 'UPDATE_PLAYER_POSITION';


export const playerMove = (keys) => {
  return dispatch => { 
    return dispatch(updatePlayerPosition(keys));
  }

}

const updatePlayerPosition = (keys) => {
  return {
    type: UPDATE_PLAYER_POSITION,
    keys: keys
  };
}

const moveLeft = () => {
  return {
    type: MOVE_LEFT
  };
}

const moveRight = (ctx) => {
  return {
    type: MOVE_RIGHT,
    context: ctx
  };
}

const moveUp = () => {
  return {
    type: MOVE_UP
  };
}

const moveDown = () => {
  return {
    type: MOVE_DOWN
  };
}

const space = () => {
  return {
    type: SPACE
  };
}
