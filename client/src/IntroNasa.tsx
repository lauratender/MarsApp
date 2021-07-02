import React from 'react';
import './IntroNasa.css';

function IntroNasa() {
    return (
        <div className="IntroNasa">
            <h2>
                Mars App NASA
            </h2>
            <p>
                NASA shows different images taken on Mars and provides an excellent set of APIs which allow developers
                to get live data about many things and use them in their applications. 
            </p>
            <p>
                This application, given rover and a camera type, shows images taken by the rover with that camera type.
            </p>
        </div>
    );
}

export default IntroNasa;