function countMineNeighbors(board, cellI, cellJ) {
    var neighborsCount = 0; 
    var rowLength = board.length;
    var colLength = board[0].length;
    for (var i = (cellI-1 >= 0) ? cellI-1 : 0; i <= cellI+1 && i < rowLength; i++) {
        for (var j = (cellJ-1 >= 0) ? cellJ-1 : 0; j <= cellJ+1 && j < colLength; j++) {
            if (i === cellI && j === cellJ) continue; // the cell itself 
            var cell = board[i][j];
            if(cell.content === MINE) neighborsCount++;
        } 
    }
    return neighborsCount;
}

function showAllNeighborsNotMines(board, cellI, cellJ) {
    var rowLength = board.length;
    var colLength = board[0].length;
    for (var i = (cellI-1 >= 0) ? cellI-1 : 0; i <= cellI+1 && i < rowLength; i++) {
        for (var j = (cellJ-1 >= 0) ? cellJ-1 : 0; j <= cellJ+1 && j < colLength; j++) {
            if (i === cellI && j === cellJ) continue; // the cell itself 
            var cell = board[i][j];
            if(cell.content === MINE) continue;
            cell.isShown = true;
        } 
    }
    renderBoard(board);
}

function isNeighborFirstCell(board, cellI, cellJ) {
    var rowLength = board.length;
    var colLength = board[0].length;
    for (var i = (cellI-1 >= 0) ? cellI-1 : 0; i <= cellI+1 && i < rowLength; i++) {
        for (var j = (cellJ-1 >= 0) ? cellJ-1 : 0; j <= cellJ+1 && j < colLength; j++) {
            if (cellI === i && cellJ === j) continue; 
            if (i === gFirstCellclicked.location.i && j === gFirstCellclicked.location.j) return true;
        } 
    }
    return false;
}

function showAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (let j = 0; j < row.length; j++) {
            var cell = row[j];
            if (cell.isMine) cell.isShown = true;
        }
    }
    renderBoard(board);
}


function renderCell(location, value) {
    var elCell = document.querySelector(`#cell-${location.i}-${location.j}`);
    elCell.innerText = value;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ######### Timer Functions #########

function initTimer() {
    var elTimer = document.getElementById('timer');
    elTimer.innerText = '00 : 00 : 000';
}

function getTime() {
    return Date.now();
}

function renderTimer() {
    var delta = getTime() - gStartTimer;
    var time = timeFormatter(delta);
    var elTimer = document.getElementById('timer');
    elTimer.innerText = time;
}

function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if (minutes.length < 2) {
        minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }

    while (milliseconds.length < 3) {
        milliseconds = '0' + milliseconds;
    }

    return minutes + ' : ' + seconds + ' : ' + milliseconds;

}
