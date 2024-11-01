import React, { useState } from 'react';
import DoodleSelector from './DoodleSelector';
import DrawingCanvas from './DrawingCanvas';
import ScoreCard from './ScoreCard';
import Timer from './Timer';
import { useDoodleGame } from '../hooks/useDoodleGame.js';
import '../css/PlaySolo.css';

const PlaySoloWithAI = () => {
    const nefw = 3;
    const {
        selectedDoodle,
        setSelectedDoodle,
        score,
        setScore,
        totalRounds,
        round,
        setRound,
        timeLeft,
        setTimeLeft,
        checkPrediction,
        setIsPlaying,
        speak,
        showScoreCard,
        setShowScoreCard,
        voice1,
        voice2,
        voice3,
        isSpeaking,
        setTotalRounds
    } = useDoodleGame();

    const handleDoodleSelect = (doodle) => {
        setSelectedDoodle(doodle);
        setIsPlaying(true);
    };
    const nextRound = () => {
        if(round==totalRounds){
            setShowScoreCard(true);
            setRound(1);
        }else 
            setRound((prev)=>prev+1);
        setSelectedDoodle(null);
        setTimeLeft(40);
        setIsPlaying(false);
    }

    return (
        <div className="container">
            {showScoreCard ? (
                <ScoreCard
                    isSpeaking ={isSpeaking}
                    voice1 = {voice1}
                    voice2 = {voice2}
                    voice3 = {voice3}
                    score={score}
                    totalRounds = {totalRounds}
                    setScore = {setScore}
                />
            ) : (
                <>
                    {!selectedDoodle ? (
                        <DoodleSelector round = {round} totalRounds={totalRounds} onSelect={handleDoodleSelect} />
                    ) : (
                        <div className="box1">
                            <h2>Draw: {selectedDoodle}</h2>
                            <Timer  isSpeaking ={isSpeaking}
                                voice1 = {voice1}
                                voice2 = {voice2}
                                voice3 = {voice3}
                                score={score}
                                totalRounds = {totalRounds}
                                setScore = {setScore} speak={speak} timeLeft={timeLeft} nextRound={nextRound} />
                            <div className = "new">
                                <DrawingCanvas round= {round} setTotalRounds= {setTotalRounds} setScore={setScore} speak={speak} voice1={voice1} voice2={voice2} nextRound ={nextRound} doodle={selectedDoodle} setShowScoreCard={setShowScoreCard} timer={timeLeft} onDrawComplete={checkPrediction} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default PlaySoloWithAI;
