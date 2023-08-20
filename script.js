function chessNotation(position) {
  let letter;
  let num;
  switch (position[0]) {
    case 0:
      num = 8;
      break;
    case 1:
      num = 7;
      break;
    case 2:
      num = 6;
      break;
    case 3:
      num = 5;
      break;
    case 4:
      num = 4;
      break;
    case 5:
      num = 3;
      break;
    case 6:
      num = 2;
      break;
    case 7:
      num = 1;
      break;
  }
  switch (position[1]) {
    case 0:
      letter = 'a';
      break;
    case 1:
      letter = 'b';
      break;
    case 2:
      letter = 'c';
      break;
    case 3:
      letter = 'd';
      break;
    case 4:
      letter = 'e';
      break;
    case 5:
      letter = 'f';
      break;
    case 6:
      letter = 'g';
      break;
    case 7:
      letter = 'h';
      break;
  }
  return `${letter}${num}`;
}

//take in position of a knight [i, j] and return possible moves from that position
const possibleMoves = (position) => {
  const possibleMoves = [];

  const i = position[0];
  const j = position[1];

  const up1 = i - 1;
  const down1 = i + 1;
  const up2 = i - 2;
  const down2 = i + 2;
  const left1 = j - 1;
  const left2 = j - 2;
  const right1 = j + 1;
  const right2 = j + 2;

  function inBounds(position) {
    const i = position[0];
    const j = position[1];
    return i >= 0 && i <= 7 && j >= 0 && j <= 7;
  }

  if (inBounds([up2, left1])) {
    possibleMoves.push([up2, left1]);
  }
  if (inBounds([up2, right1])) {
    possibleMoves.push([up2, right1]);
  }
  if (inBounds([up1, left2])) {
    possibleMoves.push([up1, left2]);
  }
  if (inBounds([up1, right2])) {
    possibleMoves.push([up1, right2]);
  }
  if (inBounds([down1, left2])) {
    possibleMoves.push([down1, left2]);
  }
  if (inBounds([down1, right2])) {
    possibleMoves.push([down1, right2]);
  }
  if (inBounds([down2, left1])) {
    possibleMoves.push([down2, left1]);
  }
  if (inBounds([down2, right1])) {
    possibleMoves.push([down2, right1]);
  }
  return possibleMoves;
};

const findShortestPath = (
  start,
  end,
  visited = new Set(),
  queue = [],
  parentOf = {}
) => {
  visited.add(start.toString());
  let children = [];
  //children of a square are possibleMoves from that square that havent been visited yet
  possibleMoves(start).forEach((position) => {
    if (!visited.has(position.toString())) {
      children.push(position);
    }
  });
  for (let child of children) {
    parentOf[child] = start;
    if (child[0] === end[0] && child[1] === end[1]) {
      let shortestPath = [];
      shortestPath.push(child);
      while (child in parentOf) {
        shortestPath.push(parentOf[child]);
        child = parentOf[child];
      }
      return shortestPath.reverse();
    }
    queue.push(child);
  }
  while (queue.length > 0) {
    let curr = queue.shift(); //returns and removes the first element in array
    const path = findShortestPath(curr, end, visited, queue, parentOf);
    if (path) {
      return path;
    }
  }
};

function printPath(path) {
  let msg = `<p>You made it in ${path.length - 1} moves! Here's your path:</p>`;
  for (let i = 0; i < path.length; i++) {
    msg += `<p>${chessNotation(path[i])}</p>`;
  }
  return msg;
}

const Chessboard = () => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i].push(Square(i, j));
    }
  }
  return board;
};

const board = document.querySelector('.board');

let start = null;
let end = null;

let startColor = 'lime';
let endColor = 'magenta';
let betweenColor = 'black';
let filter = 'brightness(0.8)';

const Square = (i, j) => {
  const chessLabel = chessNotation([i, j]);
  const arrayLabel = [i, j];
  const square = document.createElement('button');
  // square.textContent = chessLabel;
  square.id = chessLabel;
  square.addEventListener('click', () => {
    if (start === null) {
      start = arrayLabel;
      // square.style.backgroundColor = startColor;
      square.style.filter = filter;
      square.style.border = `2px solid ${startColor}`;
      square.textContent = chessLabel;
    } else if (end === null && square.textContent !== chessNotation(start)) {
      end = arrayLabel;
      // square.style.backgroundColor = endColor;
      square.style.filter = filter;
      square.style.border = `2px solid ${endColor}`;
      square.textContent = chessLabel;
    }
  });
  square.classList.add('square');
  board.append(square);
};

Chessboard();

const squares = document.querySelectorAll('.square');
function colorChessBoard(
  defaultColor = '#edd6b0',
  nonDefaultColor = '#b98761',
  makeDefaultColor = true
) {
  for (let square of squares) {
    if (makeDefaultColor === true) {
      square.style.backgroundColor = defaultColor;
      if (square.id.charAt(0) === 'h') {
        makeDefaultColor = true;
        continue;
      }
      makeDefaultColor = false;
    } else {
      square.style.backgroundColor = nonDefaultColor;

      if (square.id.charAt(0) === 'h') {
        makeDefaultColor = false;
        continue;
      }
      makeDefaultColor = true;
    }
  }
}

colorChessBoard();

const travailBtn = document.querySelector('.travail-btn');
travailBtn.addEventListener('click', () => {
  const path = findShortestPath(start, end);
  document.querySelector('.msg').innerHTML = printPath(path);
  for (let position of path) {
    for (let square of squares) {
      if (
        square.id === chessNotation(position) &&
        square.id !== chessNotation(path[0]) &&
        square.id !== chessNotation(path[path.length - 1])
      ) {
        // square.style.backgroundColor = betweenColor;
        // square.style.filter = filter;
        square.style.border = `2px solid ${betweenColor}`;
        square.textContent = square.id;
      }
    }
  }
});

const resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', () => {
  start = null;
  end = null;
  colorChessBoard();
  for (let square of squares) {
    square.style.border = 'none';
    square.style.filter = 'brightness(1)';
    square.textContent = '';
  }
});
