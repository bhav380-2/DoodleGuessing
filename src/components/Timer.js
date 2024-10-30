import React, { useEffect } from 'react';

const Timer = ({ timeLeft,doodleSelected, setTimeLeft, setIsPlaying}) => {
    
    useEffect(()=>{
        if(timeLeft==0){
            console.log("hi");
            alert('Failed to Guesss, Better luck next Time!!! ...,')
            doodleSelected(null);
            setTimeLeft(40);
            setIsPlaying(false);

        }
    },[timeLeft])

    return <h3>Time Left: {timeLeft}s</h3>;
};

export default Timer;
