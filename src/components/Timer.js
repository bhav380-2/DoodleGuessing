import React, { useEffect } from 'react';

const Timer = ({ nextRound,timeLeft,speak,voice2}) => {
    
    useEffect(()=>{
        if(timeLeft==0){
            console.log("hi");
             speak("Failed to Guess",voice2);
            alert('Failed to Guesss, Better luck next Time!!! ...,')
            nextRound();
        }
    },[timeLeft])

    return <h3>Time Left: {timeLeft}s</h3>;
};

export default Timer;
