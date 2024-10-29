import React from 'react';

const Timer = ({ timeLeft,doodleSelected, setTimeLeft, setIsPlaying}) => {

    if(timeLeft==0){
        console.log("hi");
        doodleSelected(null);
        setTimeLeft(30);
        setIsPlaying(false);
    }
    
    return <h3>Time Left: {timeLeft}s</h3>;
};

export default Timer;
