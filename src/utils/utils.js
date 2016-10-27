
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

var testTiles = { 
  ['0,0']: {letter:'z', visited: false, x: 0, y: 0}, 
  ['0,1']: {letter:'i', visited: false, x: 0, y: 1}, 
  ['0,2']: {letter:'y', visited: false, x: 0, y: 2}, 
  ['1,2']: {letter:'u', visited: false, x: 1, y: 2}, 
  ['1,0']: {letter:'e', visited: false, x: 1, y: 0},
  ['3,2']: {letter:'m', visited: false, x: 3, y: 2},
  ['1,3']: {letter:'y', visited: false, x: 1, y: 3},
  ['2,0']: {letter:'v', visited: false, x: 2, y: 0},
  ['3,1']: {letter:'r', visited: false, x: 3, y: 1},
  ['4,1']: {letter:'u', visited: false, x: 4, y: 1},
  ['5,1']: {letter:'i', visited: false, x: 5, y: 1},
  ['5,0']: {letter:'s', visited: false, x: 5, y: 0},
  ['5,2']: {letter:'v', visited: false, x: 5, y: 2},
  ['6,1']: {letter:'t', visited: false, x: 6, y: 1},
  ['3,0']: {letter:'p', visited: false, x: 3, y: 0}
};

var tileStack = []; 

const _getNextTileCoords = (x, y, z) => {
  var canGoRight = (testTiles[`${x+1},${y}`] && !testTiles[`${x+1},${y}`].visited);
  var canGoDown = (testTiles[`${x},${y+1}`] && !testTiles[`${x},${y+1}`].visited);
  var canGoUp = (testTiles[`${x},${y-1}`] && !testTiles[`${x},${y-1}`].visited);
  var canGoLeft = (testTiles[`${x-1},${y}`] && !testTiles[`${x-1},${y}`].visited);
  
  if (z === 'right' && canGoRight) return [`${x+1},${y}`, 'right'];
  if (z === 'down' && canGoDown) return [`${x},${y+1}`, 'down'];
  // check right
  if (testTiles[`${x+1},${y}`] && !testTiles[`${x+1},${y}`].visited && !canGoLeft) {
    return [`${x+1},${y}`, 'right'];
  }
  
  // check down
  if (testTiles[`${x},${y+1}`] && !testTiles[`${x},${y+1}`].visited && !canGoUp) {
    return [`${x},${y+1}`, 'down'];
  }
  
  return undefined; 
}

const depthFirstSearch = (x, y) => {
  tileStack.push(testTiles[`${x},${y}`]);
  testTiles[`${x},${y}`].visited = true;
  var words = testTiles[`${x},${y}`].letter;
  var directionDelta = null;
  var z = null;
  while (tileStack.length > 0) {
    var tile = tileStack[tileStack.length - 1]; 
    var coords = _getNextTileCoords(tile.x, tile.y, z);
    
    if (coords) {
      if (directionDelta !== coords[1] && directionDelta !== null) {
        words += ';';
        words = words + tile.letter;
        testTiles[coords[0]].visited = false;
      } else {
        testTiles[coords[0]].visited = true;
        words = words + testTiles[coords[0]].letter;
        tileStack.push(testTiles[coords[0]]);
      }   
      if (coords[1] !== directionDelta) z = coords[1];
      directionDelta = coords[1];
    } else {
      tileStack.pop();
      directionDelta = '';
      words = words + '/';
    }   
  }
  
  
  for (var key in testTiles) {
    // skip loop if the property is from prototype
    if (!testTiles.hasOwnProperty(key)) continue;

    var obj = testTiles[key];
    obj.visited = false;
  }
  
  return words;
}



console.log(depthFirstSearch(0,0));
console.log(depthFirstSearch(5,0));
