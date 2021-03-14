import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import Board from "./app/components/Board";
import MoveHistory from "./app/components/MoveHistory";

function App({ theme }) {
  return (
    <div className="App" style={{ background: theme.background }}>
        <main>
            <Board />
            <MoveHistory />
        </main>
    </div>
  );
}

export default connect(state => ({ theme: state.theme }), null)(App);
