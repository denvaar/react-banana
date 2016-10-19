export const ADD_ACTIVE_TILE = 'ADD_ACTIVE_TILE';
export const REMOVE_INACTIVE_TILE = 'REMOVE_INACTIVE_TILE';
export const UPDATE_TILE = 'UPDATE_TILE';


export const updateTile = (data, index) => {
  return dispatch => {
    return dispatch(_updateTile(data, index));
  }
}


const _updateTile = (data, index) => {
  return {
    type: UPDATE_TILE,
    index: index,
    payload: data
  }
}

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

