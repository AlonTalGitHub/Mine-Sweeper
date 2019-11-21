'use strict'

function showAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (let j = 0; j < row.length; j++) {
            var cell = row[j];
            if (cell.isMarked) continue;
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
    elTimer.innerText = '00 : 00';
}
 

function startTimer() {
    if (!gTimerIntervalId) {
        gStartTimer = getTime();
        gTimerIntervalId = setInterval(renderTimer, 10);
    }
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

    return minutes + ' : ' + seconds;

}
