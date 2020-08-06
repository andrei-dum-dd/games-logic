import './styles.scss';
import { nrCells, winLose, TURN, MARK } from './consts/board';
import { element, createElement } from './helpers/dom';

(() => {
    const game = {
        nrMoves: 0,
        turnUser: 0,
        turnAI: 0,
        turn: TURN.USER,
        end: false,

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
                    if (clickedCell.classList.contains('checked') || game.end) return;
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
            if (game.determineWinLoose(cellId, mark)) {
                // do alert or something on win
                const player = game.turn === TURN.AI ? TURN.AI : TURN.USER;
                const message = 'Player ' + player.toUpperCase() + ' - "' + mark + '" WON !!!';
                setTimeout(() => {
                    alert(message);
                }, 333);

                // set end game
                game.end = true;
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
        determineWinLoose: (cellId, mark) => {
            // get win pattern
            const winPattern = winLose[cellId] !== undefined ? winLose[cellId] : [];
            if (winPattern.length === 0) return;

            let win = false;
            winPattern.forEach((parttern) => {
                const status = parttern.every((cellPos) => element('.cell[cellPos="' + cellPos + '"]')[0].innerHTML === mark);
                if (!win && status) win = status;
            });

            return win;
        },

        calculateBestMove: (mark) => {
            const winPatterns = [];
            const markCells = element('.cell.checked.' + mark);
            markCells.forEach((cell) => {
                const markedCellPos = parseInt(cell.getAttribute('cellpos'));
                const patterns = winLose[markedCellPos];
                patterns.forEach((pattern) => {
                    const win = pattern.every((cellPos) => {
                        const checkCell = element('.cell[cellPos="' + cellPos + '"]')[0];
                        return checkCell.innerHTML === mark || checkCell.innerHTML === '';
                    });
                    if (win) winPatterns.push([...pattern, markedCellPos].sort());
                });
            });

            // match 2 to determin best move
            const nextMoves = [];
            const otherMoves = [];
            winPatterns.forEach((pattern) => {
                const innerPattern = [...pattern];
                markCells.forEach((cell) => {
                    const markedCellPos = parseInt(cell.getAttribute('cellpos'));
                    const indexMove = innerPattern.indexOf(markedCellPos);
                    if (indexMove > -1) {
                        innerPattern.splice(indexMove, 1);
                    }
                });

                if (innerPattern.length === 1 && nextMoves.indexOf(innerPattern[0]) === -1) {
                    nextMoves.push(innerPattern[0]);
                    return;
                }
                innerPattern.forEach((pos) => {
                    if (otherMoves.indexOf(pos) === -1) otherMoves.push(pos);
                });
            });

            return { other: otherMoves, next: nextMoves };
        },

        // turn (player vs pc - random)
        AITurn: () => {
            const blockUser = Math.random() > 0.5;
            // const blockUser = false;

            const hardAi = Math.random() > 0.5;
            // const hardAi = false;

            const randomTurn = () => {
                // free cells
                const freeCells = element('.cell:not(.checked)');
                // get random cell
                const randomNr = Math.floor(Math.random() * freeCells.length);
                const randomCell = freeCells[randomNr];

                // trigger click event
                randomCell.click();
            };

            const smartTurn = () => {
                const markCells = element('.cell.checked.' + MARK[TURN.AI]);
                if (markCells.length === 0) {
                    // do a random move
                    randomTurn();
                    return;
                }

                // determine to block the user
                const userWinPatterns = game.calculateBestMove(MARK[TURN.USER]);
                console.log('userWinPatterns', userWinPatterns);

                // calculate the win pattern
                const aiWinPatterns = game.calculateBestMove(MARK[TURN.AI]);
                console.log('aiWinPatterns', aiWinPatterns);

                // check if AI can win
                if (aiWinPatterns.next.length === 1 && hardAi) {
                    console.log('AI -> Go for WIN');
                    const aiWinCell = element('.cell[cellPos="' + aiWinPatterns.next[0] + '"]')[0];
                    aiWinCell.click();
                    return;
                }

                // check if USER can win on next turn
                if (userWinPatterns.next.length === 1 && blockUser) {
                    console.log('AI -> Block User');
                    const aiWinCell = element('.cell[cellPos="' + userWinPatterns.next[0] + '"]')[0];
                    aiWinCell.click();
                    return;
                }

                if (aiWinPatterns.other.length === 0) {
                    randomTurn();
                    return;
                }
                // click win patter random cell
                console.log('AI -> Random WIN');
                const randomWinCellPos = aiWinPatterns.other[Math.floor(Math.random() * aiWinPatterns.other.length)];
                console.log(randomWinCellPos);
                const aiWinCell = element('.cell[cellPos="' + randomWinCellPos + '"]')[0];
                aiWinCell.click();
            };

            smartTurn();
        },

        // alert - winning

        // game reset
    };

    game.init();
})();
