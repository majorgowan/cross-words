import React from 'react';

function Square(props) {
    return (
        <button className={props.cn}
                onClick={() => props.onClick()} >
            {props.value}
            <span className="cluenumber">{props.cluenumber}</span>
        </button>
    );
}

function GeneralButton(props) {
    return (
        <button className="general-button"
                onClick={ props.onClick } >
            {props.text}
        </button>
    );
}

function Clue(props) {
    return (
        <h3 id="clue-text">{props.text}</h3>
    );
}

function PuzzleName(props) {
    return (
        <div className="title-block">
            <h2 className="puzzle-title">{props.title}</h2>
            <h4 className="puzzle-author">by {props.author}</h4>
        </div>
    );
}

export { Square, GeneralButton, Clue, PuzzleName };
