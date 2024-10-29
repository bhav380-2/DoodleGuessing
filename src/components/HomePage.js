import React from 'react';
import '../css/homePage.css'
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">

            <header className="homepage-header">
                <h1>	<span className="e1">&#9889; </span>Guess &#9997; Doodles     </h1>
                <div className="icons">
                    <span className="i1">ᯓᡣ𐭩</span>
                    <span className="i2">ᝰ.ᐟ</span>
                    <span className="i3">꩜</span>
                </div>

            </header>

            <nav className="buttons-container">
                <Link className="play-solo-btn" to="/play">
                    <button>Play Solo</button>
                </Link>
                <Link className="play-solo-btn" to="/x">
                    <button>Multiplayer</button>
                </Link>
            </nav>

            <div className="box">

            </div>


        </div>
    );
};

export default HomePage;
