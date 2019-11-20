'use strict'
var MINE = '☢️';
var EMPTY = '';
var FLAG = '';

var gBoard;
var gStartTimer;
var gIntervalId;
var gFirstCellclicked;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    gGame.isOn = true;
    closeModal();
    initTimer();
    buildBoard();
    renderBoard(gBoard);
}


function buildBoard() {
    gBoard = [];
    for (var i = 0; i < 8; i++) {
        gBoard[i] = [];
        for (var j = 0; j < 8; j++) {
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


function renderBoard(board) {
    var rows = board.length;
    var cols = board[0].length;
    var strHTML = '<table border="1"><tbody>';
    for (let i = 0; i < rows; i++) {
        strHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
            var cell = board[i][j];
            var content = (cell.isShown) ? cell.content : EMPTY;
            var cellClass = (cell.isShown) ? 'white' : '';
            strHTML += `<td data-id="cell-${i}-${j}" class="${cellClass}" onclick="cellClicked(${i},${j})">${content}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
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
    if (cell.isShown) return;

    // First cell clicked
    if (!gIntervalId) {
        gStartTimer = getTime();
        gIntervalId = setInterval(renderTimer, 10);
    }
    if (!gFirstCellclicked) {
        gFirstCellclicked = {
            location: { i: cellI, j: cellJ }
        };
        setRandomMinesOnBoard(gBoard);
        setMinesNeighborsCount(gBoard);
    }
    if (cell.isMine) {
        showAllMines(gBoard);
        renderBoard(gBoard);
        gemeOver('YOU LOOSE');
        return;
    }
    showAllNeighborsNotMines(gBoard, cellI, cellJ);
    cell.isShown = true;
    gGame.shownCount++;
    renderBoard(gBoard);
}


function setRandomMinesOnBoard(board) {
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (let j = 0; j < row.length; j++) {
            var cell = row[j];
            if (isNeighborFirstCell(board, i, j)) continue;
            if (i === gFirstCellclicked.location.i && j === gFirstCellclicked.location.j) continue;

            var randNum = getRandomInt(1, 101);
            if (randNum < 40) {
                cell.content = MINE;
                cell.isMine = true;
            }
        }
    }
}


function gemeOver(text) {
    gGame.isOn = false;
    clearInterval(gIntervalId);
    gIntervalId = null;
    gFirstCellclicked = null
    gBoard = null;
    openModal(text);
}


function cellMarked(elCell) { }

function checkGameOver() { }

function expandShown(board, elCell, i, j) { }


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

