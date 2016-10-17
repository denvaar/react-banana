export const ADD_ACTIVE_TILE = 'ADD_ACTIVE_TILE';
export const REMOVE_INACTIVE_TILE = 'REMOVE_INACTIVE_TILE';

export const addActiveTile = (data) => {
  return dispatch => {
    return dispatch(_addActiveTile(data));
  }
}

export const removeInactiveTile = (index) => {
  console.log(index);
  return dispatch => {
    return dispatch(_removeInactiveTile(index));
  }
}

const _removeInactiveTile = (index) => {
  return {
    type: REMOVE_INACTIVE_TILE,
    index: index
  };
}

const _addActiveTile = (data) => {
  return {
    type: ADD_ACTIVE_TILE,
    data: data
  };
}

