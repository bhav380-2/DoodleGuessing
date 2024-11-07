import React from 'react';
import '../css/loadingPage.css'
import { useState, useEffect } from 'react';

const LoadingPage = () => {

    const [loadingMessage, setLoadingMessage] = useState('  Loading Game ... wait 50 seconds');

    let note = ""



    if (window.innerWidth <= 480) {
        note = "Use desktop for best experience"
    }

    useEffect(() => {
        const messages = [
            'Loading Game ... wait 50 seconds',
            'Get ready to guess some doodles...',
            'Hold tight, we’re gathering your game!',
            'Almost there! Your doodle challenge is coming...',
            'Starting ...'
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            note=""
            messageIndex = (messageIndex + 1) % messages.length; 
            setLoadingMessage(messages[messageIndex]);
        }, 12000); 

        const loadingTimeout = setTimeout(() => {
            clearInterval(messageInterval); 
        }, 51000);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(loadingTimeout);
        };
    }, []);

    return (
        <div className='loader-container'>
            <span className="loading-msg"> {loadingMessage}</span>
            <span className="note">{note}</span>
            <div className='loader'></div>
        </div>
    )
};
export default LoadingPage;