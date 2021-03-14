import React, { Component } from 'react';
import { connect } from 'react-redux';
import GameControls from "./GameControls";

class MoveHistory extends Component {
    render() {
        const { moves } = this.props;
        return (
            <div className='MoveHistory'>
                <div className='Circle' style={{ background: 'blue', width: '32px', height: '32px', borderRadius: '50%' }}/>
                <h3>Move History:</h3>
                <div className='MoveLog'>
                {
                    moves.length?
                    moves.map((move, i) => <p key={move} className='MoveString'><span>{`${i + 1}.`}</span>{move}</p>)
                     :
                     <p>Go ahead and make the first move!</p>
                }
                </div>
                <GameControls />
            </div>
        )
    }
}

export default connect((state) => ({ moves: state.board.moves }), null)(MoveHistory);