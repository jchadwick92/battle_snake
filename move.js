// Todo: follow tail
// remove tails if not 1 space from food
// split initial moves up
// only go for food if smaller and above size x
// fill other snakes possible moves

let gameState;
let snakeHeadPos;
let foodPositions;
let closestFoodPos;
let board;
let initialPossibleMoves;
let possibleMoves;
let copiedBoard;
let globalLeft;
let gloablRight;
let globalUp;
let globalDown;

module.exports = function move(state) {
  closestFoodPos = false
  globalLeft = 0
  gloablRight = 0
  globalUp = 0
  globalDown = 0
  console.log("----------------------------------------------");
  gameState = state;
  setSnakeHeadPos(state);
  setFoodPositions(state);

  board = createEmptyBoard(state);
  markCells(state, board);

  initialPossibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log("initial possible moves: ", initialPossibleMoves);

  copiedBoard = createEmptyBoard(state);
  markCells(state, copiedBoard);

  markCloseSnakeMoves(state, board)
  markCloseSnakeMoves(state, copiedBoard)

  // mark dead ends
  markDeadEnds(initialPossibleMoves)

  possibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log("possible moves: ", possibleMoves)

  if (state.you.health < 50) {
    closestFoodPos = findClosestFood();
  } else {
    if (getLongestSnake(state) >=  state.you.body.length - 2) {
      closestFoodPos = findClosestFood();
    }
  }
  return determineMove();
};

function getLongestSnake(state) {
  return Math.max(...state.board.snakes.filter(snake => !(snake.body[0].x === snakeHeadPos.x && snake.body[0].y === snakeHeadPos.y))
  .map(snake => snake.body.length))
}

function markCloseSnakeMoves(state, board) {
  const enemySnakes = state.board.snakes.filter(snake => !(snake.body[0].x === snakeHeadPos.x && snake.body[0].y === snakeHeadPos.y))
  enemySnakes
  .forEach(snake => {
    if (snake.body.length >= state.you.body.length) {
      if (snake.body[0].x > 0) {
        fillPoint(snake.body[0].x -1, snake.body[0].y, 1, board)
      }
      if (snake.body[0].x < state.board.width -1) {
        fillPoint(snake.body[0].x +1, snake.body[0].y, 1, board)
      }
      if (snake.body[0].y > 0) {
        fillPoint(snake.body[0].x, snake.body[0].y -1, 1, board)
      }
      if (snake.body[0].y < state.board.height -1) {
        fillPoint(snake.body[0].x, snake.body[0].y + 1, 1, board)
      }
    } 
  })
}

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
      gloablRight = countAvailableSpaces(snakeHeadPos.x + 1, snakeHeadPos.y, 2);
      if (gloablRight > 0 && gloablRight < 15) {
        fillBoardFromCopy(2, copiedBoard, board);
      }
    }
    if (move === "left") {
      globalLeft = countAvailableSpaces(snakeHeadPos.x - 1, snakeHeadPos.y, 3);
      if (globalLeft > 0 && globalLeft < 15) {
        fillBoardFromCopy(3, copiedBoard, board);
      }
    }
    if (move === "down") {
      globalDown = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y + 1, 4);
      if (globalDown > 0 && globalDown < 15) {
        fillBoardFromCopy(4, copiedBoard, board);
      }
    }
    if (move === "up") {
      globalUp = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y - 1, 5);
      if (globalUp > 0 && globalUp < 15) {
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

function fillPoint(x, y, number, board) {
  board[y][x] = number;
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
  if (initialPossibleMoves.length === 1) {
    return {
      move:
        initialPossibleMoves[
          Math.floor(Math.random() * initialPossibleMoves.length)
        ]
    }
  }
  if (possibleMoves.length == 0) {
    console.log("0 possible moves")
    console.log("globalDown: ", globalDown)
    console.log("globalUp: ", globalUp)
    console.log("gloablRight: ", gloablRight)
    console.log("globalLeft: ", globalLeft)
    if (globalDown > 0 && globalDown >= gloablRight && globalDown >= globalLeft && globalDown >= globalUp) {
      console.log("move down")
      return {move: "down"}
    } else if (globalDown > 0 && globalUp >= gloablRight && globalUp >= globalLeft && globalUp >= globalDown) {
      console.log("move up")
      return {move: "up"}
    } else if (globalDown > 0 && gloablRight >= globalUp && gloablRight >= globalLeft && gloablRight >= globalDown) {
      console.log("move right")
      return {move: "right"}
    } else if (globalDown > 0 && globalLeft >= globalUp && globalLeft >= globalRight && globalLeft >= globalDown) {
      console.log("move left")
      return {move: "left"}
    } else {
      return {
        move:
          initialPossibleMoves[
            Math.floor(Math.random() * initialPossibleMoves.length)
          ]
      }
    }
  }
  if (possibleMoves.length == 1) {
    return { move: possibleMoves[0] };
  }
  if (closestFoodPos) {
    console.log("going for food")
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
