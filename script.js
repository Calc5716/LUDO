let squares = localStorage.getItem("squares");
let pieces = localStorage.getItem("pieces");

squares = parseInt(squares);
pieces = parseInt(pieces);

const redSpans = document.querySelectorAll('#redBoard span i');
const blueSpans = document.querySelectorAll('#blueBoard span i');
const greenSpans = document.querySelectorAll('#greenBoard span i');
const yellowSpans = document.querySelectorAll('#yellowBoard span i');

for (let i = 0; i < (4-pieces); i++) {
    redSpans[i].remove();
    yellowSpans[i].remove();
    blueSpans[i].remove();
    greenSpans[i].remove();
}