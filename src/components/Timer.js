import React, { useEffect, useState } from 'react';
import trollComments from '../files/trollComments.json';
import '../css/timer.css'
import img from '../img/a2.jpg'

const Timer = ({ nextRound, timeLeft, speak, voice1, voice2, voice3, score, isSpeaking, totalRounds }) => {
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState("");

    const trollSpeak = async (text) => {
        const voices = [[voice1, 1.1, 0.6], [voice2, 1, 0.7]];
        const [selectedVoice, rate, pitch] = voices[Math.floor(Math.random() * voices.length)];
        setBubbleText(text);      // Display the text in the bubble
        setShowBubble(true);      // Show the bubble overlay
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.pitch = pitch;
            utterance.rate = rate;
            utterance.onend = () => {
                isSpeaking.current = false;
                window.speechSynthesis.cancel();
                setTimeout(() => {
                    setShowBubble(false);  // Hide the bubble when speaking ends
                    nextRound();
                }, 1600)
                resolve();
            };
            window.speechSynthesis.speak(utterance);
            isSpeaking.current = true;
        });
    };

    const trollUser = async () => {
        const comment = trollComments.random[Math.floor(Math.random() * trollComments.random.length)];
        await trollSpeak(comment);
    }

    useEffect(() => {
        if (timeLeft == 0) {
            if (Math.floor(Math.random() * 3) >=1) {
                trollUser();
            } else {
                speak("Times up!!!", voice2).then(() => {
                    window.speechSynthesis.cancel();
                    setTimeout(() => {
                        alert('Failed to Guess!!!');
                        nextRound();
                    }, 300)
                });
            }
        }
    }, [timeLeft]);

    return (
        <>
            <div className='timerContainer'>
                <div className="time">
                    <h4>Time: {timeLeft}s</h4>
                </div>
                {showBubble && (
                    <div className="overlay">
                        <div>
                            <div className="circular-sb">
                                {bubbleText}
                                <div className="circle1"></div>
                                <div className="circle2"></div>
                            </div>
                            <div className="botimg" ><img src={img} /></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default Timer;