
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


var tileStack = [];


const _getNextTileCoords = (x, y, z) => {
  var canGoRight = (testTiles[`${x+1},${y}`] && !testTiles[`${x+1},${y}`].visited);
  var canGoDown = (testTiles[`${x},${y+1}`] && !testTiles[`${x},${y+1}`].visited);
  var canGoUp = (testTiles[`${x},${y-1}`] && !testTiles[`${x},${y-1}`].visited);
  var canGoLeft = (testTiles[`${x-1},${y}`] && !testTiles[`${x-1},${y}`].visited);

  if (canGoRight) {
    if (testTiles[`${x-1},${y}`] && testTiles[`${x-1},${y}`].visited === false)
      canGoRight = false;
  }

  if (z === 'right' && canGoRight) return [`${x+1},${y}`, 'right'];
  if (z === 'down' && canGoDown) return [`${x},${y+1}`, 'down'];


  // check right
  if (testTiles[`${x+1},${y}`]) {
    if ((!testTiles[`${x+1},${y}`].visited || testTiles[`${x+1},${y}`].canVisitAgain) &&
        !canGoLeft) {
      return [`${x+1},${y}`, 'right'];
    }
  }

  // check down
  if (testTiles[`${x},${y+1}`] && !testTiles[`${x},${y+1}`].visited && !canGoUp) {
    return [`${x},${y+1}`, 'down'];
  }

  return undefined;
}

export const depthFirstSearch = (x, y) => {
  tileStack.push(testTiles[`${x},${y}`]);
  testTiles[`${x},${y}`].visited = true;
  var words = testTiles[`${x},${y}`].letter;
  var directionDelta = null;
  var z = null;
  while (tileStack.length > 0) {
    var tile = tileStack[tileStack.length - 1];
    var nextTile = _getNextTileCoords(tile.x, tile.y, z);

    if (nextTile) {
      if (directionDelta !== nextTile[1] && directionDelta !== null) {
        words += ';';
        words = words + tile.letter;
        testTiles[nextTile[0]].visited = false;


      } else {
        var c = nextTile[0].split(',');
        if (testTiles[`${c[0]-1},${c[1]}`] &&
            directionDelta !== null &&
            testTiles[`${c[0]-1},${c[1]}`].visited === false) {
          testTiles[nextTile[0]].canVisitAgain = true;
        } else if (testTiles[`${c[0]},${c[1]-1}`] &&
                   directionDelta !== null &&
                   testTiles[`${c[0]},${c[1]-2}`] &&
                   testTiles[`${c[0]-1},${c[1]-1}`] &&
                   testTiles[`${c[0]},${c[1]-1}`].visited === false) {
          testTiles[nextTile[0]].canVisitAgain = true;
          words = words + testTiles[nextTile[0]].letter;
          tileStack.pop();
          continue;
        } else {
          testTiles[nextTile[0]].canVisitAgain = false;
        }
        testTiles[nextTile[0]].visited = true;
        words = words + testTiles[nextTile[0]].letter;
        tileStack.push(testTiles[nextTile[0]]);
      }
      if (nextTile[1] !== directionDelta) z = nextTile[1];
      directionDelta = nextTile[1];
    } else {
      tileStack.pop();
      directionDelta = '';
      words = words + '/';
    }
  }


  for (var key in testTiles) {
    if (!testTiles.hasOwnProperty(key)) continue;
    var obj = testTiles[key];
    obj.visited = false;
  }

  return words;
}

