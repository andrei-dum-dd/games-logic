import './styles.scss';
import { nrCells, winLose, TURN, MARK } from './consts/board';
import { element, createElement } from './helpers/dom';

(() => {
    const game = {
        nrMoves: 0,
        turnUser: 0,
        turnAI: 0,
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

            // get player mark
            const mark = MARK[game.turn];

            // nr of turns per player
            game.turn === TURN.AI ? ++game.turnAI : ++game.turnUser;

            // set mark in cell
            const cell = element('.cell[cellPos="' + cellId + '"]')[0];
            cell.innerHTML = mark;
            cell.classList.add(mark);

            //let
            if (game.determinWinLoose(cellId, mark)) {
                // do alert or something on win
                alert('win -> ' + mark);
                return;
            }

            // change trun
            game.updateTurn();

            // check is AI turn
            if (game.turn === TURN.AI) setTimeout(() => game.AITurn(), 500);
        },

        updateTurn: () => {
            game.turn = game.turn === TURN.USER ? TURN.AI : TURN.USER;
        },

        // pattern win-lose
        determinWinLoose: (cellId, mark) => {
            // get win pattern
            const winPattern = winLose[cellId] !== undefined ? winLose[cellId] : [];
            if (winPattern.length === 0) return;

            let win = false;
            winPattern.forEach((parttern) => {
                const status = parttern.every((cellPos) => element('.cell[cellPos="' + cellPos + '"]')[0].innerHTML === mark);
                console.log(mark, parttern, status);
                if (!win && status) win = status;
            });

            return win;
        },

        // turn (player vs pc - random)
        AITurn: () => {
            if (game.turnAI === 0) {
                // free cells
                const cells = element('.cell:not(.checked)');
                // get random cell
                const randomNr = Math.floor(Math.random() * cells.length);
                console.log(randomNr);
                const randomCell = cells[randomNr];

                // trigger click event
                randomCell.click();
                return;
            }

            const mark = MARK[game.turn];

            // free cells
            const cells = element('.cell.checked.' + mark);
            // if (cells.length === 1) {
            const pattern = winLose[cells[0].getAttribute('cellpos')];
            const aiWinPatterns = [];
            const status = pattern.forEach((pat) => {
                const win = pat.every((cellPos) => {
                    const cell = element('.cell[cellPos="' + cellPos + '"]')[0];
                    return cell.innerHTML === mark || cell.innerHTML === '';
                });

                if (win) aiWinPatterns.push(pat);
            });
            // get only one winning patters
            const nextWinPattern = aiWinPatterns[Math.floor(Math.random() * aiWinPatterns.length)];
            const availableCell = nextWinPattern.filter((cell) => element('[cellPos="' + cell + '"]'));
            const nextRandomCellMove = availableCell[Math.floor(Math.random() * 2)];
            element('[cellPos="' + nextRandomCellMove + '"]')[0].click();
            // }
        },

        // alert - winning

        // game reset
    };

    game.init();
})();
