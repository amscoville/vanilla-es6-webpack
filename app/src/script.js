import BoardState from './board/boardState';
// import Piece from './pieces/piece';

require('../styles/chess.css');

const $ = require('jquery');

$(document).ready(() => {
	createBoard();
	displayPieces();
	$('#board > div > div').click(handleSquareClick);
});

let selectedPiece;

function handleSquareClick(event) {
	const coordinates = getSquareData(event);
	const row = coordinates[0];
	const col = coordinates[1];
	if (selectedPiece && $(`#${row}${col}`).hasClass('highlight')) { // click on highlighted square
		movePiece(row, col);
		$('div').removeClass('highlight');
		selectedPiece = null;
	} else if (!selectedPiece && BoardState.state[row][col].color === BoardState.turn) {
		$('div').removeClass('originalSquare');
		selectedPiece = BoardState.state[row][col];
		const targets = selectedPiece.getTargets(BoardState.forCheck);
		highlightTargets(targets, row, col);
	}
}

function createBoard() {
	for (let i = 0; i < 8; i++) {
		const rowNum = String(i);
		const row = $('<div>');
		for (let j = 0; j < 8; j++) {
			const squareNum = String(j);
			const square = $('<div>');
			square.attr('id', `${rowNum}${squareNum}`);
			$(row).append(square);
		}
		$('#board').append(row);
	}
}

function displayPieces() {
	for (let i = 0; i < 8; i++) {
		// if (i === 1) {
		// 	BoardState.state[i] = [];
		// }
		for (let j = 0; j < BoardState.state[i].length; j++) {
			if (BoardState.state[i][j]) {
				$(`#${BoardState.state[i][j].row}${BoardState.state[i][j].col}`).html(BoardState.state[i][j].img);
			}
		}
	}
}

function getSquareData(event) {
	const id = event.currentTarget.id;
	return id.split('');
}

function highlightTargets(arr, row, col) {
	$('.highlight').removeClass('highlight');
	$(`#${row}${col}`).addClass('highlight');
	for (let i = 0; i < arr.length; i++) {
		$(`#${arr[i]}`).addClass('highlight');
	}
}

function movePiece(row, col) { // still breaking after clicking self!!!!!
	const originalSpot = $(`#${selectedPiece.row}${selectedPiece.col}`);
	const targetSpot = $(`#${row}${col}`);
	if (`#${selectedPiece.row}${selectedPiece.col}` !== `#${row}${col}`) {
		targetSpot.html(selectedPiece.img);
		originalSpot.html('');
		selectedPiece.move(row, col);
		BoardState.turn = BoardState.turn === 'black' ? 'white' : 'black';
	} else {
		BoardState.turn = BoardState.turn === 'black';
	}
}
