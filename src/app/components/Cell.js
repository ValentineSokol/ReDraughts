import React from "react";


class Cell extends  React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.selected !== this.props.selected || nextProps.piece !== this.props.piece;
    }

    render() {
        const { theme, coordinates, onClick, color, selected, piece, hostingKingPiece } = this.props;
        const {boardColors, pieceColors} = theme;
        return (
            <div className='CellWrapper'>
                {coordinates[0] === 'A' && <p className='RowNumber'>{coordinates[1]}</p>}
                <div onClick={onClick} style={{background: boardColors[color]}}
                     className={selected ? 'SelectedCell' : 'Cell'}>
                    {
                        color === 'black' &&
                        piece &&
                        <div onClick={onClick} style={{background: pieceColors[piece]}}
                             className={hostingKingPiece ? 'KingPiece' : 'Piece'}/>
                    }
                </div>
            </div>
        );
    }
}
export default Cell;
