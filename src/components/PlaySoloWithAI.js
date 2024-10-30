import React, { useState } from 'react';
import DoodleSelector from './DoodleSelector';
import DrawingCanvas from './DrawingCanvas';
import ScoreCard from './ScoreCard';
import Timer from './Timer';
import { useDoodleGame } from '../hooks/useDoodleGame.js';
import '../css/PlaySolo.css';

const PlaySoloWithAI = () => {

    const nefw = 3;


    const [selectedDoodle, setSelectedDoodle] = useState(null);
    const [showScoreCard, setShowScoreCard] = useState(false);
    const {
        score,
        correctAttempts,
        incorrectAttempts,
        timeLeft,
        setTimeLeft,
        checkPrediction,
        setIsPlaying,
        resetGame
    } = useDoodleGame(selectedDoodle);

    const handleDoodleSelect = (doodle) => {
        setSelectedDoodle(doodle);
        setIsPlaying(true);
    };
    const nextRound = () => {
        setSelectedDoodle(null);
        setTimeLeft(40);
        setIsPlaying(false);
    }

    return (
        <div className="container">
            {showScoreCard ? (
                <ScoreCard
                    score={score}
                    correctAttempts={correctAttempts}
                    incorrectAttempts={incorrectAttempts}
                    resetGame={() => setShowScoreCard(false)}
                />
            ) : (
                <>
                    {!selectedDoodle ? (
                        <DoodleSelector onSelect={handleDoodleSelect} />
                    ) : (
                        <div className="box1">
                            <h2>Draw: {selectedDoodle}</h2>
                            <Timer timeLeft={timeLeft} nextRound={nextRound} />
                            <div className = "new">
                                <DrawingCanvas nextRound ={nextRound} doodle={selectedDoodle} setShowScoreCard={setShowScoreCard} timer={timeLeft} onDrawComplete={checkPrediction} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

};

export default PlaySoloWithAI;
