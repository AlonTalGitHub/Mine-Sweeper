'use strict'
var MINE = '☢️';
var EMPTY = '';
var FLAG = '⛳';

var gBoard;
var gStartTimer;
var gTimerIntervalId;
var gFirstCellClicked;

var gLevel = {
    size: 4,
    mines: 2,
    hintsLeft: 3
};

var gGame = {
    isOn: false,
    isWin: false,  
    minesCount: 0,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {  
    initgGameObjs();
    gGame.isOn = true;
    renderSmiley('smiley');
    closeModal();
    initTimer();
    buildBoard(gLevel.size);
    renderBoard(gBoard);
}


function buildBoard(n) {
    gBoard = [];
    for (var i = 0; i < n; i++) {
        gBoard[i] = [];
        for (var j = 0; j < n; j++) {
            var cell = {
                content: '',
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            gBoard[i][j] = cell;
        }
    }
}

function changeLevel(size, mines) {
    initgGameObjs();
    gLevel.size = size;
    gLevel.mines = mines;
    clearInterval(gTimerIntervalId);
    gTimerIntervalId = null;
    gFirstCellClicked = null;
    gBoard = null;
    initGame();
}


function renderBoard(board) {
    var rows = board.length;
    var cols = board[0].length;
    var strHTML = '<table border="1"><tbody>';
    for (let i = 0; i < rows; i++) {
        strHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
            var cell = board[i][j];
            var content = (cell.isShown) ? cell.content : EMPTY;
            var flag = (cell.isMarked) ? FLAG : '';
            var cellClass = (cell.isShown) ? 'white' : '';
            strHTML += `<td data-id="cell-${i}-${j}" class="${cellClass}" onclick="cellClicked(${i},${j})" oncontextmenu="markCell(event,${i},${j})">${content}${flag}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}


function renderSmiley(imgName) {
    if (gGame.isOn) imgName = 'smiley';
    var strHtml = '';
    var elSmileyContainer = document.querySelector('.smiley-container');
    strHtml += `<img onclick="changeLevel(${gLevel.size}, ${gLevel.mines})" src="img/${imgName}.jpg" width="30" height="30"/>`;
    elSmileyContainer.innerHTML = strHtml;
}


function setMinesNeighborsCount(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (let j = 0; j < row.length; j++) {
            var cell = row[j];
            if (cell.isMine) continue;
            cell.minesAroundCount = countMineNeighbors(board, i, j);
            var minesAround = cell.minesAroundCount;
            if (cell.minesAroundCount !== 0) cell.content = minesAround.toString();
        }
    }
    return board;
}


function cellClicked(cellI, cellJ) {
    if (!gGame.isOn) return;
    var cell = gBoard[cellI][cellJ];
    if (cell.isShown || cell.isMarked) return;

    // First cell clicked
    startTimer();

    if (!gFirstCellClicked) {
        gFirstCellClicked = {
            location: { i: cellI, j: cellJ }
        };
        setMinesOnBoard(gBoard);
        setMinesNeighborsCount(gBoard);
    }
    if (cell.isMine) {
        showAllMines(gBoard);
        renderBoard(gBoard);
        gameOver('YOU LOOSE');
        return;
    }
    if (!cell.isShown) {
        cell.isShown = true;
        gGame.shownCount++;
    }
    showAllNeighborsRecursive(gBoard, cellI, cellJ);
    renderBoard(gBoard);
    checkGameOver();
}


function markCell(elEvent, cellI, cellJ) {
    startTimer();
    elEvent.preventDefault();
    var cell = gBoard[cellI][cellJ];
    cell.isMarked = (cell.isMarked) ? false : true;
    if (cell.isMarked) {
        gGame.markedCount++;
    } else {
        gGame.markedCount--;
    }
    renderBoard(gBoard);
    checkGameOver();
}


function setMinesOnBoard(board) {
    while (gGame.minesCount < gLevel.mines) {
        var randI = getRandomInt(0, board.length-1);
        var randJ = getRandomInt(0, board.length-1);  
        var cell = board[randI][randJ];

        if (cell.isMine) continue;    
        if (isNeighborFirstCell(board, randI, randJ)) continue;
        if (randI === gFirstCellClicked.location.i && randJ === gFirstCellClicked.location.j) continue;

        cell.content = MINE;
        gGame.minesCount++;
        cell.isMine = true;
    }
}

function gameOver(text) {
    gGame.isOn = false;
    if (gGame.isWin) {
        renderSmiley('sunglasses-smiley');
    } else {
        renderSmiley('sad');
    }
    initgGameObjs();
    clearInterval(gTimerIntervalId);
    gTimerIntervalId = null;
    gFirstCellClicked = null
    gBoard = null;
    openModal(text);
}


function checkGameOver() {
    var allShownOrMines = gGame.shownCount + gGame.minesCount;
    var allShownOrFlaged = gGame.shownCount + gGame.markedCount;
    var numCells = gLevel.size ** 2;
    if (allShownOrFlaged === numCells && allShownOrMines === numCells) {
        gGame.isWin = true;
        gameOver('YOU WON');
    }
}


function openModal(text) {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';

    var elModalContent = document.querySelector('.modal-content');
    elModalContent.innerText = text;
}

function closeModal() {
    var elModal = document.querySelector('.modal');
    if (elModal) elModal.style.display = "none";
}

function initgGameObjs() {
    gGame = {
        isOn: false,
        isWin: false,
        minesCount: 0,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    gLevel.hintsLeft = 3;
}


function showHint() {
    if (!gLevel.hintsLeft) return;
    gLevel.hintsLeft--;
    var isHintSucceed = false
    while (!isHintSucceed) {
        var randI = getRandomInt(0, gBoard.length-1);
        var randJ = getRandomInt(0, gBoard.length-1);  
        var cell = gBoard[randI][randJ];
        if (cell.isMine || cell.isShown) continue;
        if (isNeighborMineOrShown(gBoard, randI, randJ)) continue;
        showCellAndNeighbors(gBoard, randI, randJ);
        renderBoard(gBoard);
        setTimeout(hideCellAndNeighbors(gBoard, randI, randJ), 1000);
        renderBoard(gBoard);
        isHintSucceed = true;
    }
}