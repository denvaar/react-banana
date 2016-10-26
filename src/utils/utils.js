
export const getRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const LETTERS = {
  'A': 13,
  'B': 3,
  'C': 3,
  'D': 6,
  'E': 18,
  'F': 3,
  'G': 4,
  'H': 3,
  'I': 12,
  'J': 2,
  'K': 2,
  'L': 5,
  'M': 3,
  'N': 8,
  'O': 12,
  'P': 3,
  'Q': 2,
  'R': 9,
  'S': 6,
  'T': 9,
  'U': 6,
  'V': 3,
  'W': 3,
  'X': 2,
  'Y': 3,
  'Z': 2
};

export const buildInitialState = () => {
  var letters = Object.keys(LETTERS);
  var results = [];
  var index = 0;
  letters.forEach(letter => {
    for (var i = 0; i < LETTERS[letter]; i++) {
      results.push({
        id: index,
        letter: letter,
        x: getRandom(150, 10),
        y: getRandom(750, 20),
        tilt: getRandom(15, -15),
        isActive: false,
        clicked: false
      });
      index++
    }
  });
  return results;
}
/*
export const getNextTile = (x, y, prev = null, done = [], tiles) => {
  if (!done.includes('left')) {
    // check left
    if (tiles[`${x-1},${y}`] && prev !== 'right') {
      return tiles[`${x},${y}`].letter + getNextTile(x-1, y, 'left', tiles);
    }
  }
  if (!done.includes('right')) {
    // check to the right
    if (tiles[`${x+1},${y}`] && prev !== 'left') {
      return tiles[`${x},${y}`].letter + getNextTile(x+1, y, 'right', tiles);
    }
  }
  if (!done.includes('up')) {
    // Check above
    if (tiles[`${x},${y-1}`] && prev !== 'down') {
      return getNextTile(x, y-1, 'up', tiles) + tiles[`${x},${y}`].letter;
    }
  }
  if (!done.includes('down')) {
    // check below
    if (tiles[`${x},${y+1}`] && prev !== 'up') {
      return tiles[`${x},${y}`].letter + getNextTile(x, y+1, 'down', tiles);
    }
  }

  if (prev === null) {
    console.log(done);
    return tiles[`${x},${y}`].letter;
  } else {
    done.push(prev);
    return getNextTile(x, y, null, done, tiles);
  }
}
*/
var testTiles = {
  ['0,0']: {letter:'u', visited: false, x: 0, y: 0},
  ['0,1']: {letter:'t', visited: false, x: 0, y: 1},
  ['0,2']: {letter:'o', visited: false, x: 0, y: 2},
  ['1,2']: {letter:'x', visited: false, x: 1, y: 2},
  ['1,0']: {letter:'t', visited: false, x: 1, y: 0},
  ['2,0']: {letter:'p', visited: false, x: 2, y: 0},
  ['3,0']: {letter:'r', visited: false, x: 3, y: 0}
};

var tileStack = [];

const _getNextTileCoords = (x, y) => {
  // check left
  if (testTiles[`${x-1},${y}`] && !testTiles[`${x-1},${y}`].visited) {
    return [`${x-1},${y}`, 'left'];
  }
  // check right
  if (testTiles[`${x+1},${y}`] && !testTiles[`${x+1},${y}`].visited) {
    return [`${x+1},${y}`, 'right'];
  }
  // check up
  if (testTiles[`${x},${y-1}`] && !testTiles[`${x},${y-1}`].visited) {
    return [`${x},${y-1}`, 'up'];
  }
  // check down
  if (testTiles[`${x},${y+1}`] && !testTiles[`${x},${y+1}`].visited) {
    return [`${x},${y+1}`, 'down'];
  }
  return undefined; 
}

export const depthFirstSearch = (x, y) => {
  tileStack.push(testTiles[`${x},${y}`]);
  testTiles[`${x},${y}`].visited = true;
  var words = testTiles[`${x},${y}`].letter;
  var directionDelta = null;
  
  while (tileStack.length > 0) {
    var tile = tileStack[tileStack.length - 1];
    var coords = _getNextTileCoords(tile.x, tile.y);
    if (coords) {
      if (directionDelta !== coords[1] && directionDelta !== null) {
        words += ' ';
        words = words + tile.letter;
        testTiles[coords[0]].visited = false;
      } 
      else {
        testTiles[coords[0]].visited = true;
        words = words + testTiles[coords[0]].letter;
        tileStack.push(testTiles[coords[0]]);
      }
      
      directionDelta = coords[1];
    } else {
      tileStack.pop();
      words = words + '-';
    }
  }
  return words;
}
