import React from 'react';
import { Square, GeneralButton, Clue,
         PuzzleName } from './Elements.js';

class Puzzle extends React.Component {
    constructor(props) {
        super(props);

        let puzzle = props.puzzle["puzzle"];

        // sort puzzle
        puzzle.sort((clue1, clue2) => {
            if (clue1["start"][0] === clue2["start"][0]) {
                return clue1["start"][1] - clue2["start"][1];
            } else {
                return clue1["start"][0] - clue2["start"][0];
            }                
        });

        // add clue numbers and construct objects 
        // of downclues and acrossclues
        let downclues = {};
        let acrossclues = {};
        let cluenum = 0;
        for (let ii=0; ii<puzzle.length; ii++) {
            let lastclue = (ii === 0 ? null : puzzle[ii-1]);
            let clue = puzzle[ii];
            if ((lastclue)
                    && (clue["start"][0] === lastclue["start"][0])
                    && (clue["start"][1] === lastclue["start"][1])) {
                clue["number"] = cluenum;
            } else {
                cluenum++;
                clue["number"] = cluenum;
            }
            if (clue["across"]) {
                acrossclues[cluenum] = clue;
            } else {
                downclues[cluenum] = clue;
            }
        }

        var squares = this.buildPuzzle(puzzle);

        // set focus to first non-off square
        let focus;
        let activeClue;
        let across;
        for (let ii=0; ii < squares.length * squares[0].length; ii++) {
            let row = Math.floor(ii / squares[0].length);
            let col = ii - row * squares[0].length;
            if (!squares[row][col]["off"]) {
                focus = [row, col];
                if (squares[row][col]["acrossclue"]) {
                    activeClue = squares[row][col]["acrossclue"];
                    across = true;
                } else {
                    activeClue = squares[row][col]["downclue"];
                    across = false;
                }
                break;
            }
        }

        this.state = {
            "squares": squares,
            "downclues": downclues,
            "acrossclues": acrossclues,
            "focus": focus,
            "activeClue": activeClue,
            "across": across 
        };
    }

    buildPuzzle(puzzle) {
        let ncols = 0;
        let nrows = 0;

        // determine minimal dimensions
        for (let ii=0; ii<puzzle.length; ii++) {
            let clue = puzzle[ii];
            ncols = (Math.max(ncols, clue["start"][1] 
                                     + Number(clue["across"]) 
                                       * clue["answer"].length));
            nrows = (Math.max(nrows, clue["start"][0] 
                                     + Number(!clue["across"]) 
                                       * clue["answer"].length));
        }

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
                    "wrong": null
                };
            }
        }

        // fill in clues
        for (let ii=0; ii < puzzle.length; ii++) {
            let clue = puzzle[ii];
            squares[clue["start"][0]][clue["start"][1]]["cluenumber"] = "" + clue["number"];
            if (clue["across"]) {
                let row = clue["start"][0];
                for (let col = clue["start"][1]; 
                     col < clue["start"][1] + clue["answer"].length;
                     col++) {
                    squares[row][col]["off"] = false;
                    squares[row][col]["acrossclue"] = clue["number"];
                    squares[row][col]["correct"] = clue["answer"][col - clue["start"][1]];
                }              
            } else {
                let col = clue["start"][1];
                for (let row = clue["start"][0]; 
                     row < clue["start"][0] + clue["answer"].length;
                     row++) {
                    squares[row][col]["off"] = false;
                    squares[row][col]["downclue"] = clue["number"];
                    squares[row][col]["correct"] = clue["answer"][row - clue["start"][0]];
                }  
            }
        }

        return squares;
    }

    flipAD(square, across) {
        if ((square["acrossclue"] && !across)
                || (square["downclue"] && across)) {
            return !across;
        }
        return across;
    }

    handleClick(j, i) {
        let squares = this.state.squares;
        let focus = this.state.focus;
        let across = this.state.across;
        let activeClue = this.state.activeClue;

        if (!squares[j][i]["off"]) {
            if ((focus[0] === j) && (focus[1] === i)) {
                across = this.flipAD(squares[j][i], across);
            } else if (!squares[j][i]["acrossclue"]) {
                across = false;
            } else if (!squares[j][i]["downclue"]) {
                across = true;
            }
        }

        let clue = this.getCurrentClue(j, i, across);
        activeClue =  (clue ? clue["number"] : activeClue);

        this.setState({"focus": [j, i],
                       "activeClue": activeClue,
                       "across": across,
        });
    }

    handleKeyPress(event) {
        let keyPressed = event.key.toUpperCase();
        let squares = this.state.squares;
        let focus = this.state.focus;
        let nrows = this.state.squares.length;
        let ncols = this.state.squares[0].length;
        let across = this.state.across;
        let activeClue = this.state.activeClue;

        let nextfocus = [focus[0], focus[1]];
        let nextacross = across;

        if ((keyPressed.length === 1) && (keyPressed >= "A") && (keyPressed <= "z")) {
            if (!squares[focus[0]][focus[1]]["off"]) {

                squares[focus[0]][focus[1]]["value"] = keyPressed;
                squares[focus[0]][focus[1]]["wrong"] = null;

                if (this.state.across) {
                    nextfocus[1] = Math.min(ncols - 1, focus[1] + 1);
                } else {
                    nextfocus[0] = Math.min(nrows - 1, focus[0] + 1);
                }
            }
        } else if (keyPressed === "ARROWLEFT") {
            event.preventDefault();
            if (across) {
                nextfocus[1] = Math.max(0, focus[1] - 1);
            }
            nextacross = true;
        } else if (keyPressed === "ARROWRIGHT") {
            event.preventDefault();
            if (across) {
                nextfocus[1] = Math.min(ncols - 1, focus[1] + 1);
            }
            nextacross = true;
        } else if (keyPressed === "ARROWUP") {
            event.preventDefault();
            if (!across) {
                nextfocus[0] = Math.max(0, focus[0] - 1);
            }
            nextacross = false;
        } else if (keyPressed === "ARROWDOWN") {
            event.preventDefault();
            if (!across) {
                nextfocus[0] = Math.min(nrows - 1, focus[0] + 1);
            }
            nextacross = false;
        } else if (keyPressed === "DELETE") {
            if (!squares[focus[0]][focus[1]]["off"]) {
                squares[focus[0]][focus[1]]["value"] = "";
            }
        } else if (keyPressed === "BACKSPACE") {
            event.preventDefault();
            if (this.state.across) {
                nextfocus[1] = Math.max(0, focus[1] - 1);
            } else {
                nextfocus[0] = Math.max(0, focus[0] - 1);
            }
            squares[nextfocus[0]][nextfocus[1]]["value"] = "";
        }

        let nextsquare = squares[nextfocus[0]][nextfocus[1]];
        if (!nextsquare["off"]) {
            focus = nextfocus;
        }
        nextsquare = squares[focus[0]][focus[1]];
        if (nextacross && nextsquare["acrossclue"]) {
            across = true;
        } else if (!nextacross && nextsquare["downclue"]) {
            across = false;
        }

        let clue = this.getCurrentClue(focus[0], focus[1], across);
        activeClue = (clue ? clue["number"] : activeClue);

        this.setState({"focus": focus,
                       "across": across,
                       "squares": squares,
                       "activeClue": activeClue
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

    getCurrentClue(j, i, across) {
        let square = this.state["squares"][j][i];
        let clue;

        if (!square["off"]) {
            if (across && square["acrossclue"]) {
                clue = this.state.acrossclues[square["acrossclue"]];
            } else if (square["downclue"]) {
                clue = this.state.downclues[square["downclue"]];
            } else {
                clue = this.state.acrossclues[square["acrossclue"]];
            }
        }
        return clue;
    }

    resetWrongs() {
        let squares = this.state.squares;
        squares.forEach((row) => {
            row.forEach((square) => {
                square["wrong"] = null;
            });
        });
    }

    renderClue() {
        let focus = this.state["focus"];
        let across = this.state["across"];
        let clue = this.getCurrentClue(focus[0], focus[1], across);
        let cluenumber = "";
        let cluetext = "";

        if (clue) {
            let direction = (clue["across"] ? "A" : "D");
            cluetext = clue["clue"];
            cluenumber = clue["number"] + direction + ". ";
        }

        return (<div className="clue-wrapper">
                    <Clue text={cluenumber + cluetext} />
                </div>)
    }

    checkAnswers() {
        // loop over squares: if not off and if value != correct, set value=""
        let squares = this.state.squares;
        squares.forEach((row) => {
            row.forEach((square) => {
                if (!square["off"]) {
                    if (square["value"] && (square["value"] !== square["correct"])) {
                        square["wrong"] = true;
                    }
                }
            });
        });
        this.setState({"squares": squares});
    }

    render() {
        let board_width_style = {"width": 40*this.state.squares[0].length + 150};
        
        return (
            <div className="main-block">
                <div className="side-panel"></div>
                <div className="game-board" style={board_width_style}>
                    <div>
                        <PuzzleName title={this.props.puzzle.title}
                                    author={this.props.puzzle.author}/>
                    </div>
                    <div onKeyDown={(event) => this.handleKeyPress(event)}>
                    {this.state.squares.map((row, j) => {
                        return <div key={"row_" + j} className="board-row">{row.map((sq, i) => {
                            return this.renderSquare(j, i);
                        })}</div>;
                    })}
                    </div>
                    <div>
                        {this.renderClue()}
                    </div>
                </div>
                <div className="side-panel"></div>
                <div className="horiz-button-panel">
                    <GeneralButton text="Main Menu"
                                   onClick={this.props.onMainMenuButtonClick} />
                    <GeneralButton text="Check Answers!"
                                   onClick={() => this.checkAnswers()} />
                </div>
            </div>
        );
    }
}

class CrossWord extends React.Component {
    render() {
        return (
            <Puzzle puzzle={this.props.puzzle}
                    onMainMenuButtonClick={this.props.onMainMenuButtonClick} />
        );
    }
}

export default CrossWord;
