'use strict'

function countMineNeighbors(board, cellI, cellJ) {
    var neighborsCount = 0; 

    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (i === cellI && j === cellJ) continue; // the cell itself 
            var cell = board[i][j];
            if(cell.content === MINE) neighborsCount++;
        } 
    }
    return neighborsCount;
}

function showAllNeighborsNotMines(board, cellI, cellJ) {
    var cell = board[cellI][cellJ];
    if (cell.content !== EMPTY) return;

    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (i === cellI && j === cellJ) continue; // the cell itself 
            var currNeighbor = board[i][j];
            if (currNeighbor.content === MINE || 
                currNeighbor.isMarked) continue;
            if (!currNeighbor.isShown) {
                currNeighbor.isShown = true;
                gGame.shownCount++;
            }  
        } 
    }
}

function isNeighborFirstCell(board, cellI, cellJ) {

    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || i < 0 || i >= board.length || j >= board.length) continue;
            if (cellI === i && cellJ === j) continue; 
            if (i === gFirstCellClicked.location.i && j === gFirstCellClicked.location.j) return true;
        } 
    }
    return false;
}

function showAllNeighborsRecursive(board, cellI, cellJ) {
    var cell = board[cellI][cellJ];
    if (cell.content !== EMPTY) return;

    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (i === cellI && j === cellJ) continue; // the cell itself 
            var currNeighbor = board[i][j];
            if (currNeighbor.content === MINE || 
                currNeighbor.isMarked) continue;
            if (!currNeighbor.isShown) {
                currNeighbor.isShown = true;
                gGame.shownCount++;
                showAllNeighborsRecursive(board, i, j);
            }             
        } 
    }
}

function isNeighborMineOrShown(board, cellI, cellJ) {
    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            if (cellI === i && cellJ === j) continue; 
            var neighborCell = board[i][j];
            if (neighborCell.isMine || neighborCell.isShown) return true; 
        } 
    }
    return false;
}

function showCellAndNeighbors(board, cellI, cellJ) {
    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            var cell = board[i][j];
            cell.isShown = true; 
        } 
    }
}
function hideCellAndNeighbors(board, cellI, cellJ) {
    for (var i = cellI-1; i <= cellI+1; i++) {
        for (var j = cellJ-1; j <= cellJ+1; j++) {
            if (i < 0 || j < 0 || i >= board.length || j >= board.length) continue;
            var cell = board[i][j];
            cell.isShown = false; 
        } 
    }
}