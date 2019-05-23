// Todo: follow tail
// remove tails if not 1 space from food

let gameState;
let snakeHeadPos;
let foodPositions;
let closestFoodPos;
let board;
let initialPossibleMoves;
let possibleMoves;
let copiedBoard;

module.exports = function move(state) {
  console.log("----------------------------------------------");
  gameState = state;
  setSnakeHeadPos(state);
  setFoodPositions(state);
  board = createEmptyBoard(state);
  markCells(state, board);

  copiedBoard = createEmptyBoard(state);
  markCells(state, copiedBoard);

  initialPossibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log(initialPossibleMoves);

  // mark dead ends
  markDeadEnds(initialPossibleMoves)
  console.log("aaaa")

  possibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log(possibleMoves)

  console.log(board);
  console.log(copiedBoard);
  closestFoodPos = findClosestFood();
  return determineMove();
};

function fillBoardFromCopy(fill, copiedBoard, board) {
  for (let y = 0; y < copiedBoard.length; y++) {
    for (let x = 0; x < copiedBoard[y].length; x++) {
      if (copiedBoard[y][x] === fill) {
        board[y][x] = 1;
      }
    }
  }
}

function markDeadEnds(possibleMoves) {
  possibleMoves.forEach(move => {
    if (move === "right") {
      let right = countAvailableSpaces(snakeHeadPos.x + 1, snakeHeadPos.y, 2);
      console.log("available spaces right: ", right)
      if (right > 0 && right < 15) {
        fillBoardFromCopy(2, copiedBoard, board);
      }
    }
    if (move === "left") {
      let left = countAvailableSpaces(snakeHeadPos.x - 1, snakeHeadPos.y, 3);
      console.log("available spaces left: ", left)
      if (left > 0 && left < 15) {
        fillBoardFromCopy(3, copiedBoard, board);
      }
    }
    if (move === "down") {
      let down = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y + 1, 4);
      console.log("available spaces down: ", down)
      if (down > 0 && down < 15) {
        fillBoardFromCopy(4, copiedBoard, board);
      }
    }
    if (move === "up") {
      let up = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y - 1, 5);
      console.log("available spaces up: ", up)
      if (up > 0 && up < 15) {
        fillBoardFromCopy(5, copiedBoard, board);
      }
    }
  });
}

function findClosestFood() {
  return foodPositions
    .map(food =>
      Object.assign({}, food, { dist: calculateDistance(snakeHeadPos, food) })
    )
    .reduce((prev, curr) => (prev.dist < curr.dist ? prev : curr));
}

function calculateDistance(snakeHead, food) {
  const xDist = Math.abs(snakeHead.x - food.x);
  const yDist = Math.abs(snakeHead.y - food.y);
  return xDist + yDist;
}
function getXDist(snakeHead, point) {
  return point.x - snakeHead.x;
}
function getYDist(snakeHead, point) {
  return point.y - snakeHead.y;
}

function setSnakeHeadPos(state) {
  snakeHeadPos = state.you.body[0]; // state.you.body.data[0];
}
function setFoodPositions(state) {
  foodPositions = state.board.food; // state.food.data;
}

function markCells(state, board) {
  //state.snakes.data.map(snake =>
    state.board.snakes.map(snake =>
    //snake.body.data.map(point => {
      snake.body.map(point => {
      fillPoint(point.x, point.y, 1, board);
    })
  );
}

function fillPoint(x, y, number, board) {
  return (board[y][x] = number);
}

function createEmptyBoard(state) {
  let board = new Array();
  for (let x = 0; x < state.board.width; x++) {
    board[x] = new Array();
    for (let y = 0; y < state.board.height; y++) {
      board[x][y] = 0;
    }
  }
  return board;
}

function getPossibleMoves(x, y) {
  function removeFromArray(arr, val) {
    return arr.filter(el => el != val);
  }
  let availableMoves = ["up", "down", "left", "right"];
  if (x === 0 || board[y][x - 1] !== 0) {
    availableMoves = removeFromArray(availableMoves, "left");
  }
  if (x === gameState.board.width - 1 || board[y][x + 1] !== 0) {
    availableMoves = removeFromArray(availableMoves, "right");
  }
  if (y === 0 || board[y - 1][x] !== 0) {
    availableMoves = removeFromArray(availableMoves, "up");
  }
  if (y === gameState.board.height - 1 || board[y + 1][x] !== 0) {
    availableMoves = removeFromArray(availableMoves, "down");
  }
  return availableMoves;
}

function determineMove() {
  if (possibleMoves.length == 0) {
    return {
      move:
        initialPossibleMoves[
          Math.floor(Math.random() * initialPossibleMoves.length)
        ]
    };
  }
  if (possibleMoves.length == 1) {
    return { move: possibleMoves[0] };
  }
  if (
    getXDist(snakeHeadPos, closestFoodPos) > 0 &&
    possibleMoves.includes("right")
  ) {
    console.log("food unblocked right");
    return { move: "right" };
  }
  if (
    getXDist(snakeHeadPos, closestFoodPos) < 0 &&
    possibleMoves.includes("left")
  ) {
    console.log("food unblocked left");
    return { move: "left" };
  }
  if (
    getYDist(snakeHeadPos, closestFoodPos) > 0 &&
    possibleMoves.includes("down")
  ) {
    console.log("food unblocked down");
    return { move: "down" };
  }
  if (
    getYDist(snakeHeadPos, closestFoodPos) < 0 &&
    possibleMoves.includes("up")
  ) {
    console.log("food unblocked up");
    return { move: "up" };
  } else
    return {
      move: possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    }; // do better here
}

function countAvailableSpaces(x, y, fill) {
  console.log("x: ", x)
  console.log("y: ", y)
  console.log("fill: ", fill)
  console.log(copiedBoard[y][x])
  let right = 0;
  let left = 0;
  let down = 0;
  let up = 0;
  if (copiedBoard[y][x] !== 0) {
    // if point is filled end recursion
    return 0;
  }
  copiedBoard[y][x] = fill;

  console.log(x < game.board.width - 1)
  if (x < game.board.width - 1) {
    console.log("a")
    right = countAvailableSpaces(x + 1, y, fill);
  }
  console.log(x > 0)
  if (x > 0) {
    console.log("b")
    left = countAvailableSpaces(x - 1, y, fill);
  }
  console.log(y < gameState.board.height - 1)
  if (y < gameState.board.height - 1) {
    console.log("c")
    down = countAvailableSpaces(x, y + 1, fill);
  }
  console.log(y > 0)
  if (y > 0) {
    console.log("d")
    up = countAvailableSpaces(x, y - 1, fill);
  }
  return 1 + right + left + up + down;
}
