// Todo: follow tail

let gameState;

let snakeHeadPos;
let foodPositions;
let closestFoodPos;
let board;
let possibleMoves;
let copiedBoard;

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
  foodPositions = state.food; // state.food.data;
}

module.exports = function move(state) {
  console.log("----------------------------------------------")
  gameState = state;
  setSnakeHeadPos(state);
  setFoodPositions(state);
  board = createEmptyBoard(state);
  markCells(state, board);

  copiedBoard = createEmptyBoard(state)
  markCells(state, copiedBoard)

  possibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);
  console.log(possibleMoves)

  possibleMoves.forEach(move => {
      if (move === "right") {
         let spacesRight = countAvailableSpaces(snakeHeadPos.x+1, snakeHeadPos.y, 2)
         if (spacesRight > 0 && spacesRight < 15) {
             // mark spaces on board
             for (let y=0; y < copiedBoard.length; y++){
                for (let x=0; x < copiedBoard[y].length; x++) {
                    if (copiedBoard[y][x] === 2) {
                        board[y][x] = 1;
                    }
                }
            }
         }
      }
      if (move === "left") {
        let spacesLeft = countAvailableSpaces(snakeHeadPos.x-1, snakeHeadPos.y, 3)
        if (spacesLeft > 0 && spacesLeft < 15) {
            // mark spaces on board
            for (let y=0; y < copiedBoard.length; y++){
                for (let x=0; x < copiedBoard[y].length; x++) {
                    if (copiedBoard[y][x] === 3) {
                        board[y][x] = 1;
                    }
                }
            }
        }
      }
      if (move === "down") {
        let spacesDown = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y+1, 4)
        if (spacesDown > 0 && spacesDown < 15) {
            // mark spaces on board
            for (let y=0; y < copiedBoard.length; y++){
                for (let x=0; x < copiedBoard[y].length; x++) {
                    if (copiedBoard[y][x] === 4) {
                        board[y][x] = 1;
                    }
                }
            }
        }
      }
      if (move === "up") {
        let spacesUp = countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y-1, 5)
        if (spacesUp > 0 && spacesUp < 15) {
            // mark spaces on board
            for (let y=0; y < copiedBoard.length; y++){
                for (let x=0; x < copiedBoard[y].length; x++) {
                    if (copiedBoard[y][x] === 5) {
                        board[y][x] = 1;
                    }
                }
            }
        }
      }
  })

  possibleMoves = getPossibleMoves(snakeHeadPos.x, snakeHeadPos.y);

//   console.log("Available spaces right: ", countAvailableSpaces(snakeHeadPos.x+1, snakeHeadPos.y, 2))
//   console.log("Available spaces left: ", countAvailableSpaces(snakeHeadPos.x-1, snakeHeadPos.y, 3))
//   console.log("Available spaces down: ", countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y+1, 4))
//   console.log("Available spaces up: ", countAvailableSpaces(snakeHeadPos.x, snakeHeadPos.y-1, 5)) // if y=0 then this will break


  console.log(board);
  console.log(copiedBoard)
  closestFoodPos = findClosestFood();
  return determineMove();
};

function markCells(state, board) {
  //  state.snakes.data.map(snake =>
  state.snakes.map(snake =>
  //  snake.body.data.map(point => {
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
  for (let x = 0; x < state.width; x++) {
    board[x] = new Array();
    for (let y = 0; y < state.height; y++) {
      board[x][y] = 0;
    }
  }
  return board;
}

function getPossibleMoves(x, y) {
  let availableMoves = ["up", "down", "left", "right"];
  if (x === 0 || board[y][x - 1] !== 0) {
    availableMoves = removeFromArray(availableMoves, "left");
  }
  if (x === gameState.width - 1 || board[y][x + 1] !== 0) {
    availableMoves = removeFromArray(availableMoves, "right");
  }
  if (y === 0 || board[y - 1][x] !== 0) {
    availableMoves = removeFromArray(availableMoves, "up");
  }
  if (y === gameState.height - 1 || board[y + 1][x] !== 0) {
    availableMoves = removeFromArray(availableMoves, "down");
  }
  return availableMoves;
}

function removeFromArray(arr, val) {
  return arr.filter(el => el != val);
}

function determineMove() {
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

// function recursiveFill(x, y) {
//   let possibleMoves = getPossibleMoves(x, y);
//   if (possibleMoves.length === 0) {
//     return 0;
//   } else {
//     let total = 0;
//     for (dir of possibleMoves) {
//       if (dir === "right") {
//         total = 1 + recursiveFill(x + 1, y);
//       }
//       if (dir === "left") {
//         total = 1 + recursiveFill(x - 1, y);
//       }
//       if (dir === "up") {
//         total = 1 + recursiveFill(x, y - 1);
//       }
//       if (dir === "down") {
//         total = 1 + recursiveFill(x, y + 1);
//       }
//       return total;
//     }
//   }
// }

function recursion(x, y) {
  let possibleMoves = getPossibleMoves(x, y);
  if ((possibleMoves.length === 0)) {
    fillPoint(x, y, 2);
  }
  if (possibleMoves.length == 1) {

  }
}

function countAvailableSpaces(x, y, fill) {
    let right = 0;
    let left = 0;
    let down = 0;
    let up = 0;
    if (copiedBoard[y][x] !== 0) { // if point is filled end recursion
        return 0
    }
    copiedBoard[y][x] = fill;

    if (x < gameState.width - 1) {
        right = countAvailableSpaces(x+1, y, fill)
    }
    if (x > 0) {
        left = countAvailableSpaces(x-1, y, fill)
    }
    if (y < gameState.height -1) {
        down = countAvailableSpaces(x, y+1, fill)
    }
    if (y > 0) {
        up = countAvailableSpaces(x, y-1, fill)
    }
    return 1 + right + left + up + down;
}
