import React from 'react';
import '../css/homePage.css'
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
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
                    <Link className="play-solo-btn" to="/x">
                        <button>Multiplayer</button>
                    </Link>
                </nav>

            </div>

            <div className="box">
            </div>
        </div>
    );
};
export default HomePage;
