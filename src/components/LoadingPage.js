import React from 'react';
import '../css/loadingPage.css'
import { useState, useEffect } from 'react';

const LoadingPage = () => {

    const [loadingMessage, setLoadingMessage] = useState('  Loading Game ... wait 50 seconds');
    useEffect(() => {
        const messages = [
            'Loading Game ... wait 50 seconds',
            'Get ready to guess some doodles...',
            'Hold tight, we’re gathering your game!',
            'Almost there! Your doodle challenge is coming...',
            'Starting in 10 sec...'
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length; 
            setLoadingMessage(messages[messageIndex]);
        }, 12000); 

        const loadingTimeout = setTimeout(() => {
            clearInterval(messageInterval); 
        }, 58000);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(loadingTimeout);
        };
    }, []);

    return (
        <div className='loader-container'>
            <span className="loading-msg"> {loadingMessage}</span>
            <div className='loader'></div>
        </div>
    )
};
export default LoadingPage;