// DoodleSelector.js
import React from 'react';

const DoodleSelector = ({ onSelect }) => {
    const doodles = ['Cat', 'Dog', 'House'];

    return (

        <>
            <h1>Select Doodle you Want to draw</h1>
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
        </>

    );
};

export default DoodleSelector;
