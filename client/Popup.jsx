const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const Popup = ({ showPopup, closePopup, children }) => {
    if (!showPopup) { return null }
    return (
        <div id="postOverlay" >
            <button onClick={closePopup}>close</button>
            {children}
        </div>
    );
}

export default Popup;