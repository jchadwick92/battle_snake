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
  markSnakesMoves(state, board)

  copiedBoard = createEmptyBoard(state);
  markCells(state, copiedBoard);
  markSnakesMoves(state, copiedBoard)

  initialPossibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log("initial possible moves: ", initialPossibleMoves);

  // mark dead ends
  markDeadEnds(initialPossibleMoves)

  possibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);

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
      if (right > 0 && right < 15) {
        fillBoardFromCopy(2, copiedBoard, board);
      }
    }
    if (move === "left") {
      let left = countAvailableSpaces(snakeHeadPos.x - 1, snakeHeadPos.y, 3);
      if (left > 0 && left < 15) {
        fillBoardFromCopy(3, copiedBoard, board);
      }
    }
    if (move === "down") {
      let down = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y + 1, 4);
      if (down > 0 && down < 15) {
        fillBoardFromCopy(4, copiedBoard, board);
      }
    }
    if (move === "up") {
      let up = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y - 1, 5);
      if (up > 0 && up < 15) {
        fillBoardFromCopy(5, copiedBoard, board);
      }
    }
  });
}

function findClosestFood() {
  if (foodPositions.length !== 0) {
    return foodPositions
    .map(food =>
      Object.assign({}, food, { dist: calculateDistance(snakeHeadPos, food) })
    )
    .reduce((prev, curr) => (prev.dist < curr.dist ? prev : curr));
  } else {
    return false
  }
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
    state.board.snakes.forEach(snake =>
      snake.body.forEach(point => {
      fillPoint(point.x, point.y, 1, board);
    })
  );
}

function markSnakesMoves(state, board) {
  board.snakes.filter(snake => !(snake.body[0].x === snakeHeadPos.x && snake.body[0].y === snakeHeadPos.y)).forEach(snake => {
    console.log("my snake: ", snakeHeadPos)
    console.log("snake: ", snake.body[0])
    if (snake.body[0].x > 0) {
      fillPoint(snake.body[0].x -1, snake.body[0].y, 1, board)
    }
    if (snake.body[0].x < board.width) {
      fillPoint(snake.body[0].x +1, snake.body[0].y, 1, board)

    }
    if (snake.body[0].y > 0) {
      fillPoint(snake.body[0].x, snake.body[0].y -1, 1, board)
    }
    if (snake.body[0].y < board.height) {
      fillPoint(snake.body[0].x, snake.body[0].y + 1, 1, board)
    }
  })
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
  if (closestFoodPos) {
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
  } else
  return {
    move: possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  }; // do better here
}

function countAvailableSpaces(x, y, fill) {
  let right = 0;
  let left = 0;
  let down = 0;
  let up = 0;
  if (copiedBoard[y][x] !== 0) {
    // if point is filled end recursion
    return 0;
  }
  copiedBoard[y][x] = fill;

  if (x < gameState.board.width - 1) {
    right = countAvailableSpaces(x + 1, y, fill);
  }
  if (x > 0) {
    left = countAvailableSpaces(x - 1, y, fill);
  }
  if (y < gameState.board.height - 1) {
    down = countAvailableSpaces(x, y + 1, fill);
  }
  if (y > 0) {
    up = countAvailableSpaces(x, y - 1, fill);
  }
  return 1 + right + left + up + down;
}
