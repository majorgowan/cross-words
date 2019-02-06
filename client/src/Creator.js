import React from 'react';
import { Square, GeneralButton, Clue,
         PuzzleName } from './Elements.js';

class PuzzleBuilder extends React.Component {
    constructor(props) {
        super(props);

        var squares = this.initPuzzle();

        let focus = [0, 0];
        let activeClue = null;
        let across = true;

        this.state = {
            "squares": squares,
            "focus": focus,
            "activeClue": activeClue,
            "across": across, 
        };
    }

    initPuzzle() {
        let ncols = 10;
        let nrows = 10;

        // create the array of squares
        var squares = Array(nrows);
        for (let j=0; j < nrows; j++) {
            squares[j] = Array(Number(ncols));
            for (let i=0; i < ncols; i++) {
                squares[j][i] = {
                    "off": true, 
                    "value": "",
                    "cluenumber": "",
                    "acrossclue": null,
                    "downclue": null,
                    "correct": null,
                    "wrong": null,
                };
            }
        }
        console.log(squares);
        return squares;
    }

    handleClick(j, i) {
        let focus = [j, i];
        this.setState({"focus": [j, i]});
    }

    handleKeyPress(event) {
        let keyPressed = event.key.toUpperCase();
        let squares = this.state.squares;
        let focus = this.state.focus;
        let nrows = this.state.squares.length;
        let ncols = this.state.squares[0].length;
        let across = this.state.across;

        let nextfocus = [focus[0], focus[1]];
        let nextacross = this.state.across;

        if ((keyPressed.length === 1) && (keyPressed >= "A") && (keyPressed <= "z")) {
            squares[focus[0]][focus[1]]["value"] = keyPressed;
            if (this.state.across) {
                nextfocus[1] = Math.min(ncols - 1, focus[1] + 1);
            } else {
                nextfocus[0] = Math.min(nrows - 1, focus[0] + 1);
            }
        } else if (keyPressed === "ARROWLEFT") {
            if (across) {
                nextfocus[1] = Math.max(0, focus[1] - 1);
            }
            nextacross = true;
        } else if (keyPressed === "ARROWRIGHT") {
            if (across) {
                nextfocus[1] = Math.min(ncols - 1, focus[1] + 1);
            }
            nextacross = true;
        } else if (keyPressed === "ARROWUP") {
            if (!across) {
                nextfocus[0] = Math.max(0, focus[0] - 1);
            }
            nextacross = false;
        } else if (keyPressed === "ARROWDOWN") {
            if (!across) {
                nextfocus[0] = Math.min(nrows - 1, focus[0] + 1);
            }
            nextacross = false;
        } else if (keyPressed === "DELETE") {
            if (squares[focus[0]][focus[1]]["value"] === "") {
                squares[focus[0]][focus[1]]["off"] = true;
            } else {
                squares[focus[0]][focus[1]]["value"] = "";
            }
        } else if (keyPressed === "BACKSPACE") {
            event.preventDefault();
            if (this.state.across) {
                nextfocus[1] = Math.max(0, focus[1] - 1);
            } else {
                nextfocus[0] = Math.max(0, focus[0] - 1);
            }
            if (squares[nextfocus[0]][nextfocus[1]]["value"] === "") {
                squares[nextfocus[0]][nextfocus[1]]["off"] = true;
            } else {
                squares[nextfocus[0]][nextfocus[1]]["value"] = "";
            }
        }

        focus = nextfocus;

        this.setState({"focus": focus,
                       "across": across,
                       "squares": squares,
        });
    }

    hasfocus(j, i) {
        return (this.state.focus[0] === j) && (this.state.focus[1] === i);
    }

    renderSquare(j, i) {
        let square = this.state.squares[j][i];
        let cn = (square["off"] ? "square off" : "square");
        if (this.hasfocus(j, i)) {
            cn = (this.hasfocus(j, i) ? cn + " hasfocus" : cn);
        } else if (square["wrong"]) {
            cn = cn + " wrong";
        } else if ((this.state.across && (square["acrossclue"] === this.state.activeClue))
                   || (!this.state.across && (square["downclue"] === this.state.activeClue))) {
            cn = cn + " active-clue";
        }        
        return <Square key={"sq " + this.state.squares[0].length * j + i}
                       value={square["value"]}
                       cn={cn}
                       cluenumber={square["cluenumber"]}
                       onClick={() => this.handleClick(j, i)}
               />;
    }

    sendPuzzle() {
        console.log("Going to send puzzle!");
        console.log(this.props.puzzle);
        fetch("api/sendpuzzle",
                {
                    method: "POST",
                    mode: "cors",
                    body: JSON.stringify(this.props.puzzle),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            .then(res => res.json())
            .then(
                (result) => { 
                    console.log(result);
                },
                (error) => {
                    console.log("error sending puzzle");
                }
            );
    }

    render() {
        return (
            <div className="main-block">
                <div className="side-panel"></div>
                <div className="game-board">
                    <div onKeyDown={(event) => this.handleKeyPress(event)}>
                        {this.state.squares.map((row, j) => {
                            return <div key={"row_" + j} className="board-row">{row.map((sq, i) => {
                                return this.renderSquare(j, i);
                            })}</div>;
                        })}
                    </div>
                    <div>
                    </div>
                </div>
                <div className="side-panel">
                    <GeneralButton text="Send Puzzle"
                                   onClick={() => this.sendPuzzle()} />
                    <GeneralButton text="Main Menu"
                                   onClick={this.props.onMainMenuButtonClick} />
                </div>
            </div>
        );
    }
}

class Creator extends React.Component {
    render() {
        return (
            <PuzzleBuilder onMainMenuButtonClick={this.props.onMainMenuButtonClick} />
        );
    }
}

export default Creator;
