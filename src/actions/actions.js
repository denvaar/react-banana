export const UPDATE_TILE = 'UPDATE_TILE';
export const GRAPH_ADD = 'GRAPH_ADD';

export const updateTile = (data, index) => {
  return dispatch => {
    return dispatch(_updateTile(data, index));
  }
}


export const addToGraph = (x, y) => {
  return dispatch => {
    return dispatch(_addToGraph(x, y));
  }
}

const _addToGraph = (x, y) => {
  return {
    type: GRAPH_ADD,
    x: x,
    y: y
  }
}

const _updateTile = (data, index) => {
  return {
    type: UPDATE_TILE,
    index: index,
    payload: data
  }
}


