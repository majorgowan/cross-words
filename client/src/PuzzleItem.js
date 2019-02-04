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

export default PuzzleItem;

