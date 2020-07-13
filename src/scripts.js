import './styles.scss';
import { nrCells, winLose, TURN, MARK } from './consts/board';
import { element, createElement } from './helpers/dom';

(() => {
    const game = {
        nrMoves: 0,
        turn: TURN.USER,

        init: () => {
            game.createBoard();
        },

        // init board
        createBoard: () => {
            const board = createElement('div');
            board.classList.add('board');

            for (let index = 0; index < nrCells; index++) {
                const cell = createElement('div');
                cell.classList.add('cell');
                //cell.innerHTML = index;
                cell.setAttribute('cellPos', index);

                // set click event on each cell
                game.events.cellEvent(cell);

                // add cell to board
                board.append(cell);
            }

            const body = element('body')[0];
            // append board to body
            body.append(board);
        },

        // event / celule
        events: {
            cellEvent: (cell) => {
                cell.addEventListener('click', (event) => {
                    const clickedCell = event.currentTarget;
                    if (clickedCell.classList.contains('checked')) return;
                    // mark as checked
                    clickedCell.classList.add('checked');
                    // extract pos
                    let cellId = clickedCell.getAttribute('cellPos');
                    // make it int
                    cellId = cellId == parseInt(cellId) ? parseInt(cellId) : -1;
                    // calculate pos
                    game.calculateMove(cellId);
                });
            },
        },

        calculateMove: (cellId) => {
            if (cellId < 0) return;

            // get win pattern
            const winPattern = winLose[cellId] !== undefined ? winLose[cellId] : [];
            if (winPattern.length === 0) return;

            // get player mark
            const mark = MARK[game.turn];

            // set mark in cell
            const cell = element('.cell[cellPos="' + cellId + '"]')[0];
            cell.innerHTML = mark;

            //let
            winPattern.forEach((pattern) => {});

            // change trun
            game.updateTurn();
        },

        updateTurn: () => {
            game.turn = game.turn === TURN.USER ? TURN.AI : TURN.USER;
        },

        // pattern win-lose

        // turn (player vs pc - random)

        // alert - winning

        // game reset
    };

    game.init();
})();
