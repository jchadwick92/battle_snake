let snakeHeadPos;
let foodPositions;
let closestFoodPos;


function findClosestFood(state) {
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

function setSnakeHeadPos(state) {
  snakeHeadPos = state.you.body[0];
}

function setFoodPositions(state) {
  foodPositions = state.board.food;
}

const move = state => {
  // Cannot go backwards
  setSnakeHeadPos(state);
  setFoodPositions(state);
  closestFoodPos = findClosestFood(state);
  console.log("snake: ", snakeHeadPos);
  console.log("food: ", closestFoodPos);
  if (snakeHeadPos.x < closestFoodPos.x) {
    return { move: "right" };
  } else if (snakeHeadPos.x > closestFoodPos.x) {
    return { move: "left" };
  } else if (snakeHeadPos.y > closestFoodPos.y) {
    return { move: "up" };
  } else if (snakeHeadPos.y < closestFoodPos.y) {
    return { move: "down" };
  }
};

module.export = { move };
