import React from 'react';
import '../css/homePage.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const url = 'https://doodlebackend-fast-api.onrender.com'
        // const url = 'http://127.0.0.1:8000';
        fetch(url)
            .then((response) => response.json())
            .then(({ success }) => {

                if(success){
                    setLoading(false)
                }else{
                    setTimeout(()=>{
                        setLoading(false)
    
                    },51000)
                }
            })
    })

    return (
        <>
            {loading ? (
                <LoadingPage/>
               
            ) : (
                <div className="home-container">
                    <div className="b1">
                        <header className="homepage-header">
                            <h1>Guess Doodles     </h1>
                            <div className="icons-1">
                                <span className="ic1">ᯓᡣ𐭩</span>
                                <span className="ic2">ᝰ.ᐟ</span>
                                <span className="ic3">꩜</span>
                            </div>
                        </header>

                        <nav className="buttons-container">
                            <Link className="play-solo-btn" to="/play">
                                <button>Play Solo</button>
                            </Link>
                            <Link className="play-solo-btn" to="#">
                                <button><span>Multiplayer</span></button>
                            </Link>
                        </nav>
                    </div>
                    <div className="box">
                    </div>
                </div>
            )}
        </>
    );
};
export default HomePage;
