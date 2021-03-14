import React from "react";
import { connect } from 'react-redux';
import { reverse, selectCell, move } from '../redux/reducers/boardSlice';
import Cell from './Cell';
import rowLetters from '../constants/letters';

class Board extends React.Component {
    render() {
        const { theme, board } = this.props;
        return (
            <div className='Board'>
                {
                    board.data.map(
                        (row, i) => (
                            <div key={rowLetters[i]} className='BoardRow' style={{ flexDirection: board.reversed? 'column' : 'column-reverse'}}>
                                <p>{rowLetters[i]}</p>
                                {row.map(cell => <Cell onClick={() => {
                                    this.props.selectCell({ indices: cell.indices });
                                    if (!this.props.board.selectedPiece) return;
                                    this.props.move({ indices: cell.indices });
                                }} key={cell.coordinates} theme={theme} {...cell} />)}
                            </div>

                        )
                    )
                }
            </div>
        );
    }
}
export default connect(({ theme, board }) => ({ theme, board }), { reverse, move, selectCell })(Board);