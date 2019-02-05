import React from 'react';

function PuzzleItem(props) {
    return (
        <li>
            <h2><span className="puzzle-title puzzle-title-item" 
                      onClick={props.onClick} 
                      name={props.item.title}>{props.item.title} </span>
                <span className="puzzle-author"> by {props.item.author}</span></h2>
        </li>
    );
}

function PuzzlePicker(props) {
    return (
        <div className="puzzle-picker">
            <h2 className="big-prompt">Recent puzzles</h2>
            <ul className="puzzle-list">
                {props.puzzlelist.map((puzzleItem) => {
                    return (
                        <PuzzleItem key={puzzleItem.title} item={puzzleItem} 
                                    onClick={props.onClick} />);
                })}
            </ul>
        </div>
    );
}

export default PuzzlePicker;
