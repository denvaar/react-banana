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


