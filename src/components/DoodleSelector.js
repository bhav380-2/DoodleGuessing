// DoodleSelector.js
import React from 'react';
import '../css/doodleSelector.css'
import data from '../files/data.json'

const DoodleSelector = ({ round, totalRounds, onSelect }) => {
    function getRandom(arr, num) {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    const doodles = getRandom(data.categories, 3);

    return (
        <>
            <div className='doodle-selector-container'>

                <div>
                    <h3>Round : {round}/{totalRounds}</h3>
                    <h1 className='msg'>Select Doodle</h1>
                    <div className="doodle-selector">

                        {doodles.map((doodle) => (
                            <div
                                key={doodle}
                                className="doodle-option"
                                onClick={() => onSelect(doodle)}
                            >
                                {doodle}
                            </div>
                        ))}

                    </div>

                    <div className='icons'>
                        <span className='pencil'>✏️</span>
                        <span className='duck'>𓅭</span>
                        <span className='i3'>𓍯𓂃𓏧♡</span>
                        <span className='i4'>〰</span>
                        <span className='i5'>𝔁𝓸𝔁𝓸</span>
                        <span className='i6'>•ᴗ•</span>
                    </div>


                </div>



            </div>

        </>
    );
};
export default DoodleSelector;