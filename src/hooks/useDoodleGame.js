import { useState, useEffect,useRef} from 'react';
import { predictDoodle } from '../utils/mlModel';

export const useDoodleGame = () => {
    const [selectedDoodle, setSelectedDoodle] = useState(null);
    const [showScoreCard, setShowScoreCard] = useState(false);
    const [score,setScore] = useState(0);
    const [totalRounds,setTotalRounds] = useState(4);
    const [round,setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(32);
    const [isPlaying, setIsPlaying] = useState(false);

    const loadVoices = () => {
        return new Promise((resolve) => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve(voices);
            } else {
                window.speechSynthesis.onvoiceschanged = () => {
                    resolve(window.speechSynthesis.getVoices());
                };
            }
        });
    };
    
    let voice1,voice2,voice3;
    loadVoices().then((voices) => {
        voice1 = voices.find(voice => voice.name === 'Google US English') || voices[0]; // Fallback if not found
        voice2 = voices.find(voice => voice.name === 'Google UK English Male') || voices[0];
        voice3 = voices.find(voice => voice.name.includes('Google') && voice.lang === 'hi-IN') || voices[0];
    })

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
