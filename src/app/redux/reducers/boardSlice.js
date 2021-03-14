import {createSlice} from "@reduxjs/toolkit";
import rowLetters from '../../constants/letters';
const savedState = localStorage.getItem('game');
const generateInitialBoard = () => {
    const calculateCellColor = (i, j) => {
        if (i % 2) {
            return j % 2? 'black' : 'white';
        }
        return j % 2? 'white' : 'black';
    }
    const board = [];

    for (let i = 0; i < 8; i += 1) {
        const rowLetter = rowLetters[i];
        const row = [];
        for (let j = 0; j < 8; j += 1) {
            const cell = {};
            row.push(cell);
            cell.color = calculateCellColor(i, j);
            cell.coordinates = `${rowLetter}${j + 1}`;
            cell.indices = [i, j];
            if (cell.color === 'white') continue;
            if (j <= 2) cell.piece = 'white';
            if (j >= 5) cell.piece = 'black';

        }
        board.push(row);
    }
    return board;
}
const boardSlice = createSlice({
    name: 'board',
    initialState: savedState? JSON.parse(savedState) : { data: generateInitialBoard(), nextCaptureChainMoves: [], moves: [], movingSide: 'white', reversed: false  },
    reducers: {
        reverse: (board) => ({...board, reversed: !board.reversed}),
        selectCell: (board, action) => {
            const {indices} = action.payload;
            const [row, column] = indices;
            const targetCell = board.data[row][column];
            if (!targetCell) return board;
            if (targetCell.color === 'white') return board;
            for (let i = 0; i < 8; i += 1) {
                for (let j = 0; j < 8; j += 1) {
                    const cell = board.data[i][j];
                    if (i === row && j === column) {
                        cell.selected = true;
                        if (cell.piece) board.selectedPiece = {indices: cell.indices, color: cell.piece, isKing: cell.hostingKingPiece };
                        continue;
                    }
                    if (!cell.selected) continue;
                    cell.selected = false;
                }
            }
        },
        move: (board, action) => {
            const movePiece = (previousPositionCell, targetPositionCell) => {
                previousPositionCell.piece = null;
                targetPositionCell.piece = board.selectedPiece.color;
                if (targetPositionCell.coordinates[1] === '8' && board.selectedPiece.color === 'white') {
                    targetPositionCell.hostingKingPiece = true;
                }
                if (targetPositionCell.coordinates[1] === '1' && board.selectedPiece.color === 'black') {
                    targetPositionCell.hostingKingPiece = true;
                }
                if (previousPositionCell.hostingKingPiece) {
                    targetPositionCell.hostingKingPiece = true;
                    previousPositionCell.hostingKingPiece = false;
                }
            }
            const finishMove = (previousPositionCell, targetPositionCell) => {
                const moveString = `${previousPositionCell.coordinates} -> ${targetPositionCell.coordinates}`
                if (board.movingSide === 'white') {
                    let move = `${moveString} | `;
                    board.moves.push(move);
                } else {
                    board.moves[board.moves.length - 1] += moveString;
                }
                board.selectedPiece = null;
                board.movingSide = board.movingSide === 'white' ? 'black' : 'white';
                localStorage.setItem('game', JSON.stringify(board));
            }
            const checkPieceCaptures = (i, j) => {
                const checkDiagonal = (rowIncrement, columnIncrement) => {
                    const possibleCaptureMoves = [];
                    let enemyCell;
                    let cellRow = i;
                    let cellColumn = j;
                    while((cellRow >= 0 && cellRow <= 7) && (cellColumn >= 0 && cellColumn <= 7) ) {
                       const nextCell = board.data[cellRow][cellColumn];
                       if (nextCell.piece === cell.piece) {
                           cellRow += rowIncrement;
                           cellColumn += columnIncrement;
                           continue;
                       }
                       if (!nextCell.piece) {
                           cellRow += rowIncrement;
                           cellColumn += columnIncrement;
                           if (enemyCell && !nextCell.piece) {
                               possibleCaptureMoves.push({
                                   targetCoords: nextCell.coordinates,
                                   targetCell: nextCell,
                                   targetPieceCellIndices: enemyCell.indices
                               });
                           }
                           continue;
                       }
                       enemyCell = nextCell;
                        cellRow += rowIncrement;
                        cellColumn += columnIncrement;
                        console.log(nextCell.coordinates, enemyCell?.coordinates)
                    }
                    return possibleCaptureMoves;
                }
                let possibleCaptures = [];
                const cell = board.data[i][j];
                if (cell.hostingKingPiece) {
                     possibleCaptures = [
                        ...possibleCaptures,
                        ...checkDiagonal(1,1),
                        ...checkDiagonal(-1, -1),
                        ...checkDiagonal(-1, +1),
                        ...checkDiagonal(-1, -1),
                        ...checkDiagonal(1, -1)
                    ];
                    board.possibleCapture = possibleCaptureMoves;
                }
                if (i + 1 < 8 && j - 1 > -1) {
                    const rightNeighbourCell = board.data[i + 1][j - 1];
                    if (rightNeighbourCell.piece && rightNeighbourCell.piece !== cell.piece) {
                        if (i + 2 < 8 && j - 2 > -1) {
                            const nextRightCell = board.data[i + 2][j - 2];
                            if (nextRightCell && !nextRightCell.piece) {
                                possibleCaptures.push({
                                    targetCoords: nextRightCell.coordinates,
                                    targetCell: nextRightCell,
                                    targetPieceCellIndices: rightNeighbourCell.indices
                                });
                            }
                        }
                    }
                }
                if (i - 1 > -1 && j - 1 > -1) {
                    const leftNeighbourCell = board.data[i - 1][j - 1];
                    if (leftNeighbourCell.piece && leftNeighbourCell.piece !== cell.piece) {
                        if (i - 2 > -1 && j - 2 > -1) {
                            const nextLeftCell = board.data[i - 2][j - 2];
                            if (nextLeftCell && !nextLeftCell.piece) {
                                possibleCaptures.push ({
                                    targetCoords: nextLeftCell.coordinates,
                                    targetCell: nextLeftCell,
                                    targetPieceCellIndices: leftNeighbourCell.indices
                                });
                            }
                        }
                    }

                }
                if (i + 1 < 8 && j + 1 < 8) {
                    const rightNeighbourCell = board.data[i + 1][j + 1];
                    if (rightNeighbourCell.piece && rightNeighbourCell.piece !== cell.piece) {
                        if (i + 2 < 8 && j + 2 < 8) {
                            const nextRightCell = board.data[i + 2][j + 2];
                            if (nextRightCell && !nextRightCell.piece) {
                                possibleCaptures.push({
                                    targetCoords: nextRightCell.coordinates,
                                    targetCell: nextRightCell,
                                    targetPieceCellIndices: rightNeighbourCell.indices
                                });
                            }
                        }
                    }
                }
                if (i - 1 > -1 && j + 1 < 8) {
                    const leftNeighbourCell = board.data[i - 1][j + 1];
                    if (leftNeighbourCell.piece && leftNeighbourCell.piece !== cell.piece) {
                        if (i - 2 > -1 && j + 2 < 8) {
                            const nextLeftCell = board.data[i - 2][j + 2];
                            if (nextLeftCell && !nextLeftCell.piece) {
                                possibleCaptures.push({
                                    targetCoords: nextLeftCell.coordinates,
                                    targetCell: nextLeftCell,
                                    targetPieceCellIndices: leftNeighbourCell.indices
                                });
                            }
                        }
                    }
                }
                return possibleCaptures;
            }
                const checkForCaptures = () => {
                    let possibleCaptureMoves = [];
                    for (let i = 0; i < 8; i += 1) {
                        for (let j = 0; j < 8; j += 1) {
                            const cell = board.data[i][j];
                            if (cell.color === 'white' || !cell.piece || cell.piece !== board.movingSide) {
                                continue;
                            }
                            const pieceCaptureMoves = checkPieceCaptures(i, j);
                            if (!pieceCaptureMoves.length) continue;
                            possibleCaptureMoves = [...possibleCaptureMoves, ...pieceCaptureMoves];
                        }
                    }
                    return possibleCaptureMoves;
                }
                const capturePiece = (capture, previousPositionCell, targetPositionCell) => {
                    movePiece(previousPositionCell, targetPositionCell);
                    board.data[capture.targetPieceCellIndices[0]][capture.targetPieceCellIndices[1]].piece = null;
                    const nextCaptureChainMoves = checkPieceCaptures(...targetPositionCell.indices);
                    board.nextCaptureChainMoves = nextCaptureChainMoves;
                    if (!nextCaptureChainMoves.length) {
                        finishMove(previousPositionCell, targetPositionCell);
                        return board;
                    }
                    if (board.selectedPiece) {
                        board.selectedPiece.indices = targetPositionCell.indices;
                    }
                    return board;
                }
                let possibleCaptureMoves = [...board.nextCaptureChainMoves];
                if (!board.nextCaptureChainMoves.length) {
                    possibleCaptureMoves = checkForCaptures();
                }
                const {indices} = action.payload;
                const [previousPositionCellRow, previousPositionCellColumn] = board.selectedPiece.indices;
                const [targetPositionCellRow, targetPositionCellColumn] = indices;
                const previousPositionCell = board.data[previousPositionCellRow][previousPositionCellColumn];
                const targetPositionCell = board.data[targetPositionCellRow][targetPositionCellColumn];
                const capture = possibleCaptureMoves.find(capture => capture.targetCoords === targetPositionCell.coordinates);
                if (possibleCaptureMoves.length && capture) {
                    capturePiece(capture, previousPositionCell, targetPositionCell);
                }
                if (possibleCaptureMoves.length && !capture)  {
                    return board;
                }
                if (targetPositionCell.piece) return board;
                if (targetPositionCell.color === 'white') return board;
                if (board.movingSide !== board.selectedPiece.color) {
                    return board;
                }
                if (!board.selectedPiece.isKing && previousPositionCell.piece === 'black' && previousPositionCellColumn < targetPositionCellColumn) return board;
                if (!board.selectedPiece.isKing && previousPositionCell.piece === 'white' && previousPositionCellColumn > targetPositionCellColumn) return board;
                if (previousPositionCell.indices[0] === targetPositionCell.indices[0] || previousPositionCell.indices[1] === targetPositionCell.indices[1]) return board;
                if (board.movingSide === 'white' && targetPositionCellColumn - previousPositionCellColumn > 1) return board;
                if (board.movingSide === 'black' && previousPositionCellColumn - targetPositionCellColumn > 1) return board;
                if (board.selectedPiece.isKing) {
                    const firstIndexChange = targetPositionCell.indices[0] - previousPositionCell.indices[0];
                    const secondIndexChange = targetPositionCell.indices[1] - previousPositionCell.indices[1];
                    const overJumpedCellsCount = Math.abs(firstIndexChange) - 1;
                    for (let i = 1; i <= overJumpedCellsCount; i += 1) {
                        const [ prevCellRow, prevCellColumn] = previousPositionCell.indices;
                        let targetCellRow = firstIndexChange? prevCellRow - i : prevCellRow + i;
                        let targetCellColumn = secondIndexChange? prevCellColumn + i : prevCellColumn - i;
                        if ((targetCellRow < 0 || targetCellRow > 7) || (targetCellColumn < 0 || targetCellColumn > 7)) break;
                        let targetCell = board.data[targetCellRow][targetCellColumn];
                        if (targetCell.piece) return board;
                    }
                }
                movePiece(previousPositionCell, targetPositionCell);
                finishMove(previousPositionCell, targetPositionCell);
        }
    }
});

export const { reverse, selectCell, move } = boardSlice.actions;

export default boardSlice.reducer;