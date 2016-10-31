export const UPDATE_TILE = 'UPDATE_TILE';
export const GRAPH_ADD = 'GRAPH_ADD';
export const GRAPH_REMOVE = 'GRAPH_REMOVE';
export const UPDATE_TEST_TILE = 'UPDATE_TEST_TILE';
export const UPDATE_WORDS = 'UPDATE_WORDS';

export const removeFromGraph = (x, y) => {
  return dispatch => {
    return dispatch(_removeFromGraph(x, y));
  }
}

const _removeFromGraph = (x, y) => {
  return {
    type: GRAPH_REMOVE,
    key: `${x},${y}`
  }
}


export const updateWords = (wordList) => {
  return dispatch => {
    return dispatch(_updateWords(wordList));
  }
}

const _updateWords = (wordList) => {
  return {
    type: UPDATE_WORDS,
    words: wordList
  };
}

export const updateTestTile = (key, newX, newY) => {
  return dispatch => {
    return dispatch(_updateTestTile(key, newX, newY));
  }
}

export const updateTile = (data, index) => {
  return dispatch => {
    return dispatch(_updateTile(data, index));
  }
}


export const addToGraph = (x, y, letter) => {
  return dispatch => {
    return dispatch(_addToGraph(x, y, letter));
  }
}


const _updateTestTile = (key, newX, newY) => {
  return {
    type: UPDATE_TEST_TILE,
    x: newX,
    y: newY,
    key: key
  }
}

const _addToGraph = (x, y, letter) => {
  return {
    type: GRAPH_ADD,
    x: x,
    y: y,
    letter: letter
  }
}

const _updateTile = (data, index) => {
  return {
    type: UPDATE_TILE,
    index: index,
    payload: data
  }
}


