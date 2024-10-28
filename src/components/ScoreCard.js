// ScoreCard.js
import React from 'react';

const ScoreCard = ({ score, correctAttempts, incorrectAttempts, resetGame }) => {
    return (
        <div className="score-card">
            <h2>Score Card</h2>
            <div className="score-stats">
                <p>Score: {score}</p>
                <p>Correct Attempts: {correctAttempts}</p>
                <p>Incorrect Attempts: {incorrectAttempts}</p>
            </div>
            <button onClick={resetGame}>Play Again</button>
        </div>
    );
};

export default ScoreCard;
