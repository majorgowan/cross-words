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

function ExpanderButton(props) {
    let cn = "general-button"
    if (props.orient === "horiz") {
        cn = cn + " horiz-button";
    } else {
        cn = cn + " vert-button";
    }
        
    return (
        <button className={cn}
                onClick={ props.onClick } >
            {props.text}
        </button>
    );
}

function Clue(props) {
    return (
        <h3 className="clue-text">{props.text}</h3>
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

function EditableClue(props) {
    if (props.clue) {
        let number = props.clue["number"];
        let direction = props.clue["across"] ? "A" : "D";
        let text = props.clue["clue"];
        return (
            <div className="clue-wrapper">
                <span className="clue-text clue-label">{"" + number + direction + "."}</span>
                &nbsp;
                <input className="clue-text editable-clue"
                       value={text}
                       onChange={ props.onChange }/>
            </div>
        );
    } else {
        return (
            <div className="clue-wrapper">
                <Clue text="&#8195;"/>
            </div>
        );
    }
}

export { Square, GeneralButton, ExpanderButton,
         Clue, EditableClue, PuzzleName };
