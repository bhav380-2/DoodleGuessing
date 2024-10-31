// ScoreCard.js
import React from 'react';
import { Link } from "react-router-dom"
const ScoreCard = ({ setScore,score,totalRounds }) => {
    return (
        <div className="score-card">
            <h2>Score Card</h2>
            <div className="score-stats">
                <p>Score: {score}/{totalRounds}</p>
            </div>
            <Link className="home-page" to="/">
                    <button onClick={()=>setScore(0)}>
                       Continue
                    </button>
                </Link>
        </div>
    );
};

export default ScoreCard;
