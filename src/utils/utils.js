
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

