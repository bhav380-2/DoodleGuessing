import { useState, useEffect,useRef} from 'react';
import { predictDoodle } from '../utils/mlModel';

export const useDoodleGame = (drawingData) => {
    const [score, setScore] = useState(0);
    const [correctAttempts, setCorrectAttempts] = useState(0);
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(40);
    const [isPlaying, setIsPlaying] = useState(false);
    let voice1 = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google US English');
    let voice2 = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male');
    const isSpeaking = useRef(false);  
    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    const checkPrediction = async () => {
        const guesses = await predictDoodle(drawingData);
        // Compare guesses with the correct answer and update score
        // This is just an example, you'll need to implement actual scoring logic.
        if (guesses[0].label === drawingData) {
            setScore((prev) => prev + 1);
            setCorrectAttempts((prev) => prev + 1);
        } else {
            setIncorrectAttempts((prev) => prev + 1);
        }
    };

    const resetGame = () => {
        setScore(0);
        setCorrectAttempts(0);
        setIncorrectAttempts(0);
        setTimeLeft(30);
        setIsPlaying(false);
    };

    const speak = (text, voice) => {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.onend = () => {
                isSpeaking.current = false;
                resolve();
            };
            window.speechSynthesis.speak(utterance);
            isSpeaking.current = true;
        });
    };

   

    return { score, correctAttempts, incorrectAttempts, timeLeft, checkPrediction, setIsPlaying, resetGame, setTimeLeft,speak,voice1,voice2 };
};
