import { useState, useEffect,useRef} from 'react';
import { predictDoodle } from '../utils/mlModel';

export const useDoodleGame = () => {
    const [selectedDoodle, setSelectedDoodle] = useState(null);
    const [showScoreCard, setShowScoreCard] = useState(false);
    const [score,setScore] = useState(0);
    const [totalRounds,setTotalRounds] = useState(5);
    const [round,setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(40);
    const [isPlaying, setIsPlaying] = useState(false);
    let voice1 = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google US English');
    let voice2 = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male');
    let voice3 = window.speechSynthesis.getVoices().find(voice => voice.name.includes('Google') && voice.lang === 'hi-IN');
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
    return {voice3, isSpeaking,selectedDoodle,setSelectedDoodle,showScoreCard,setShowScoreCard,setTotalRounds, score, timeLeft, totalRounds,round,setRound,setScore, setIsPlaying, setTimeLeft,speak,voice1,voice2 };
};
