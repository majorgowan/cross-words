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
        <div className="clue-text">{props.text}</div>
    );
}

function PuzzleName(props) {
    return (
        <div className="title-block">
            <h2 className="puzzle-title" onClick={props.onClick}>{props.title}</h2>
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

function TitleAuthorSetter(props) {
    return (
        <div className="modal">
            <div className="dialog-wrapper">
                <div className="dialog-row">
                    <span className="dialog-label">Title:</span>
                    <input className="setter-input"
                           value={props.title}
                           onChange={ props.onTitleChange } />
                </div>
                <div className="dialog-row">
                    <span className="dialog-label">Author:</span>
                    <input className="setter-input author-input"
                           value={props.author}
                           onChange={ props.onAuthorChange } />
                </div>
                <div className="exit-button-wrapper">
                    <GeneralButton text="Ok" onClick={props.onExitButtonClick}/>
                </div>
            </div>
        </div>
    )
}

function Alert(props) {
    return (
        <div className="modal">
            <div className="dialog-wrapper">
                <div className="dialog-message">{props.message}</div>
                <div className="exit-button-wrapper">
                    <GeneralButton text="Ok" onClick={props.onExitButtonClick}/>
                </div>
            </div>
        </div>
    )
}

function Confirm(props) {
    return (
        <div className="modal">
            <div className="dialog-wrapper">
                <div className="dialog-message">{props.message}</div>
                <div className="exit-button-wrapper">
                    <GeneralButton text="Ok" onClick={props.onOkButtonClick}/>
                    <GeneralButton text="Cancel" onClick={props.onCancelButtonClick}/>
                </div>
            </div>
        </div>
    )
}

class ClueListViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"puzzle": props.puzzle};
    }

    onClueChange(event, clue) {
        let puzzle = this.state.puzzle;
        clue["clue"] = event.target.value;
        this.setState({"puzzle": puzzle});
    }

    render() {
        let bodyClass = "clue-list-wrapper";
        if (this.state.puzzle.length > 5) {
            bodyClass += " dialog-scrollable";
        }
        return (
            <div className="modal">
                <div className="dialog-wrapper clue-list-dialog">
                    <div className={bodyClass}>
                        {  this.state.puzzle.map((clue, ii) => {
                               if (clue) {
                               return (
                                       <div key={ii} className="dialog-row">
                                            <span className="dialog-label">{clue["answer"]}</span>
                                            <input className="setter-input"
                                                   value={clue["clue"]}
                                                   onChange={(event) => this.onClueChange(event, clue)} />
                                       </div> );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>
                    <div className="exit-button-wrapper">
                        <GeneralButton text="Ok" onClick={this.props.onExitButtonClick}/>
                    </div>
                </div>
            </div>
        )};
}

export { Square, GeneralButton, ExpanderButton,
         Clue, EditableClue, PuzzleName,
         TitleAuthorSetter, ClueListViewer,
         Alert, Confirm };
