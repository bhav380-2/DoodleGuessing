// ScoreCard.js
import React from 'react';
import { Link } from "react-router-dom";
import '../css/scoreCard.css'
import img from '../img/g6.webp'
const ScoreCard = ({ setScore, score, totalRounds }) => {


    return (
        <div className="score-card-container">
            {/* <div className="score-card">
                <h2>Score Card</h2>
                <div className="score-stats">
                    <p>Score: {score}/{totalRounds}</p>
                </div>
                <Link className="home-page" to="/">
                    <button onClick={() => setScore(0)}>
                        Continue
                    </button>
                </Link>
            </div> */}

            <a href="#">
                <section className="score-card">
                    <img className="image" src={img} alt="" />
                    <div className="design"></div>
                    <span className="score">
                        <span>
                            Score: {score}/{totalRounds}
                        </span>
                        <Link className="home-page" to="/">
                            <button className="cont-btn" onClick={() => setScore(0)}>
                                Continue
                            </button>
                        </Link>
                    </span>
                </section>
            </a>
        </div>
    );
};
export default ScoreCard;
