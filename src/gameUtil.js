export function initGameBoard(width, height) {
  let gameBoard = []

  for (let i = 0; i < height; i++) {
    let gameRow = [];

    for (let j = 0; j < width; j++) {
      let gameCell = {
        pattern: "",
        active: false,
      };
      gameRow.push(gameCell);
    }
    
    gameBoard.push(gameRow);
  }

  return gameBoard;
}

function directionResult(gameBoard, x, y, dx, dy, pattern) {
  let countL = 0, countR = 0;
  let blockL = false, blockR = false;

  for (let i = 1; i < 5; i++) {
    let x1 = x + i * dx;
    let y1 = y + i * dy;

    if (gameBoard[y1] == undefined || gameBoard[y1][x1] == undefined) {
      blockR = true;
      break;
    } 
    else 
      if (gameBoard[y1][x1].pattern === pattern) {
        countR += 1;
      } 
      else 
        if (gameBoard[y1][x1].pattern != "") {
          blockR = true;
          break;
        } 
        else break;
  }

  for (let i = 1; i < 5; i++) {
    let x1 = x - i * dx;
    let y1 = y - i * dy;

    if (gameBoard[y1] == undefined || gameBoard[y1][x1] == undefined) {
      blockL = true;
      break;
    } 
    else 
      if (gameBoard[y1][x1].pattern === pattern) {
        countL += 1;
      } 
      else 
        if (gameBoard[y1][x1].pattern != "") {
          blockL = true;
          break;
        } 
        else break;
  }

  if (countL + countR + 1 >= 5 && (!blockL || !blockR)) {
    drawWinCells(gameBoard, x, y, countL, countR, dx, dy)
    return true;
  }

  return false;
}

function calculate(gameBoard, newX, newY, pattern) {
  let horizontalResult = directionResult(gameBoard, newX, newY, 1, 0, pattern);

  let verticallResult = directionResult(gameBoard, newX, newY, 0, 1, pattern);

  let majorDiagonalResult = directionResult(
    gameBoard,
    newX,
    newY,
    1,
    1,
    pattern
  );

  let minorDiagonalResult = directionResult(
    gameBoard,
    newX,
    newY,
    1,
    -1,
    pattern
  );

  return horizontalResult ||
    verticallResult ||
    majorDiagonalResult ||
    minorDiagonalResult
    ? "win"
    : "";
}

export function calculateResult(gameBoard, x, y, pattern, emptyCellNum) {
  let result = calculate(gameBoard, x, y, pattern)
  if (result != "") return result
  if (emptyCellNum - 1 === 0) return "draw"
  return  result
}

export function drawWinCells(gameBoard, x, y, countL, countR, dx, dy) {
  if (countL + countR >= 5) {
    countL = 4 - countR
  }

  // Horizontal
  if (dx > 0 && dy == 0) {
    for (let i=countL; i>=0; --i) {
      gameBoard[y][x + (i * -1)].active = true
    }

    for (let i=countR; i>=0; --i) {
      gameBoard[y][x + (i * 1)].active = true
    }

    return
  }

  // Vertical
  if (dx == 0 && dy > 0) {
    for (let i=countL; i>=0; --i) {
      gameBoard[y + (i * -1)][x].active = true
    }

    for (let i=countR; i>=0; --i) {
      gameBoard[y + (i * 1)][x].active = true
    }

    return
  }

  // Major diagonal
  if (dx > 0 && dy > 0) {
    for (let i=countL; i>=0; --i) {
      gameBoard[y + (i * -1)][x + (i * -1)].active = true
    }

    for (let i=countR; i>=0; --i) {
      gameBoard[y + (i * 1)][x + (i * 1)].active = true
    }

    return
  }

  // Minor diagonal
  if (dx > 0 && dy < 0) {
    for (let i=0; i<=countL; ++i) {
      gameBoard[y + (i * 1)][x + (i * -1)].active = true
    }

    for (let i=0; i<=countR; ++i) {
      gameBoard[y + (i * -1)][x + (i * 1)].active = true
    }

    return
  }
}
