const life = (() => {
  const SIZE = 50; 
  const INTERVAL = 300; 
  const THRESHOLD = 33;
  
  let LIVE = '#';
  let DEAD = ' ';

  const FEW = 2;
  const MANY = 3;
  const PLENTY = 3;

  const isLive = c => c === LIVE;
  const isUnderPopulated = n => n < FEW;
  const isOverPopulated = n => n > MANY;
  const canReproduce = n => n === PLENTY;
  const willContinue = n => !(isUnderPopulated(n)) && !(isOverPopulated(n));

  

  const getRandomInt = (max, min=0) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const newRow = () => Array(SIZE).fill(DEAD);
  const newBoard = shouldSeed => {
    let board = newRow().map(newRow);
    if (shouldSeed) {
      board = board.map(row => row.map(_ => getRandomInt(100) < THRESHOLD ? LIVE : DEAD))
    }
    return board;
  }

  const isWithinBounds = v => v >= 0 && v < SIZE;
  const areWithinBounds = (x, y) => isWithinBounds(x) && isWithinBounds(y);

  const neighborCoordinates = (x, y) => [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y],             [x+1, y],
    [x-1, y+1], [x, y+1], [x+1, y+1],  
  ].filter(xyArr => areWithinBounds(...xyArr));

  const coordsForRow = (r, x=0) => r.map((_, y) => [x, y]);
  const coordsForBoard = b => b.map(coordsForRow);

  
  const neighborCoordinatesForRow = (r, x=0) => coordsForRow(r, x).map(xyArr => neighborCoordinates(...xyArr));
  const neighborCoordinatesForBoard = b => b.map(neighborCoordinatesForRow);

  const cellAtCoorinate = (board, x, y) => board[x][y];

 
  const neighborCellsForCoordinateArray = (board, arrayOfNeighborCoors) => {
    return arrayOfNeighborCoors.map(neighborCoordsForCell => {
      return neighborCoordsForCell.map(coordsArray => {
        return coordsArray.map(xyArray => cellAtCoorinate(board, ...xyArray))
      })
    })
  };

  const boardAsNumberOfNeighbors = (board, arrayOfNeighborCoords) => {
    return neighborCellsForCoordinateArray(board, arrayOfNeighborCoords).map(neighborCellsForRow => {
      return neighborCellsForRow.map(neighborCellsForCell => {
        return neighborCellsForCell
          .filter(isLive)
          .reduce((total, _) => total + 1, 0)
      });
    });
  };

  
  const numberToLiveDead = (number, cell) => {
    if (isLive(cell)) {
      if (isUnderPopulated(number)) {
        return DEAD;
      } else if (isOverPopulated(number)) {
        return DEAD;
      } else if (willContinue(number)) {
        return LIVE;
      }
    } else if (canReproduce(number)){
      return LIVE;
    } else {
      return DEAD;
    }
  };

  
  const numberRowAsLiveDeadCells = (rowOfNumbers, rowOfCells) => rowOfNumbers.map((n, i) => numberToLiveDead(n, rowOfCells[i]));
  const numberBoardAsLiveDeadCells = (boardOfNumbers, boardOfCells) => boardOfNumbers.map((r, i) => numberRowAsLiveDeadCells(r, boardOfCells[i]));

 
  const printRow = r => r.join(' '); 
  const printBoard = b => {
    const boardAsString = b.map(printRow).join('\n');
    console.log(boardAsString);
    return boardAsString;
  };

  const main = board => {
   
    const coords = neighborCoordinatesForBoard(board);
    
    let neighbors;         
    let generation = 0;    
    let curr = '';        
    let prev = '';         
    let prevMinusOne = ''; 
    
    let tick = setInterval(() => {
      neighbors = boardAsNumberOfNeighbors(board, coords);  
      board = numberBoardAsLiveDeadCells(neighbors, board); 
      prevMinusOne = prev.slice();  
      prev = curr.slice();         
      curr = printBoard(board);    
      console.log(`Generation ${generation}\n\n\nNext generation:\n`);
      generation++;

      
      if (curr === prev || curr === prevMinusOne) {
        clearInterval(tick);
      }
    }, INTERVAL);
  };




  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = () => {
      main(newBoard(true)); 
    }
  } else {
    LIVE = true;
    DEAD = false;
    
    return {
      newBoard,
      neighborCoordinatesForBoard,
      boardAsNumberOfNeighbors,
      isLive,
      isUnderPopulated,
      isOverPopulated,
      willContinue,
      canReproduce,
      SIZE
    }
  }
})();
