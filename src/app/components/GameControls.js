import React from "react";

import { connect } from "react-redux";
import { reverse } from "../redux/reducers/boardSlice";


const GameControls = ({ reverse }) => (
    <div className='GameControls'>
        <button onClick={reverse}>Flip</button>
    </div>
);
export default connect(null, { reverse })(GameControls);