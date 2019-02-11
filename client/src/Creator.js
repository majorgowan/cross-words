import React from 'react';
import { Square, GeneralButton, ExpanderButton, 
         EditableClue, PuzzleName } from './Elements.js';
import { Modal } from './Modals.js';


class PuzzleBuilder extends React.Component {
    constructor(props) {
        super(props);

        var squares = this.initPuzzle(4, 4);

        this.state = {
            "puzzle": this.createEmptyPuzzleObject(),
            "squares": squares,
            "focus": [0, 0],
            "activeClue": null,
            "across": true,
            "showDialog": false,
        };
    }

    createEmptyPuzzleObject() {
        return {
            "title": "Untitled",
            "author": "Anon E. Mouse",
            "puzzle": [] 
        }
    }

    createClueObject(across, start, answer) {
        return {
            "clue": "",
            "answer": answer,
            "across": across,
            "start": start,
            "number": null
        }
    }

    initPuzzle(nrows, ncols) {
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
                };
            }
        }
        return squares;
    }

    expandPuzzle(side) {
        let oldsquares = this.state.squares;
        let nrows = oldsquares.length;
        let ncols = oldsquares[0].length;
        let squares;

        if (side === "top") {
            squares = this.initPuzzle(nrows + 1, ncols);
            for (let row = 1; row < nrows + 1; row++) {
                for (let col = 0; col < ncols; col++) {
                    squares[row][col] = oldsquares[row-1][col];
                }
            }
        } else if (side === "left") {
            squares = this.initPuzzle(nrows, ncols + 1);
            for (let row = 0; row < nrows; row++) {
                for (let col = 1; col < ncols + 1; col++) {
                    squares[row][col] = oldsquares[row][col-1];
                }
            }
        } else {

            if (side === "bottom")
                squares = this.initPuzzle(nrows + 1, ncols);
            else if (side === "right")
                squares = this.initPuzzle(nrows, ncols + 1);

            for (let row = 0; row < nrows; row++) {
                for (let col = 0; col < ncols; col++) {
                    squares[row][col] = oldsquares[row][col];
                }
            }
        }

        this.setState({"squares": squares});
    }

    vote(word) {
        // get mode of array "word", ties going to earlier values
        let uniques = word.filter((val, ind, self) => { return self.indexOf(val) === ind; });
        let winner = uniques[0];
        let wcount = 0;
        if (winner) {
            wcount = word.map(a => {return a === winner}).reduce((a, b) => {return a+b});
        }
        for (let ii = 0; ii < uniques.length; ii++) {
            let val = uniques[ii];

            if (val) {
                let ccount = word.map(a => {return a === val}).reduce((a, b) => {return a+b});
                if (ccount > wcount) {
                    winner = val;
                    wcount = ccount;
                }
            }
        }
        return winner;
    }

    setClues() {
        // assign squares to clues
        //
        // if multiple squares in the same word have been assigned
        // to different clues (e.g. if an "off" square between them
        // has just been filled, assign them all the clue of the
        // earliest assigned square
      
        let puzzle = this.state.puzzle;
        let clues = puzzle.puzzle;
        let squares = this.state.squares;

        // iterate over rows finding contiguous words
        let nrows = squares.length;
        let ncols = squares[0].length;

        for (let row = 0; row < nrows; row++) {
            let col = 0;
            while (col < ncols - 1) {
                if (!squares[row][col]["off"] && !squares[row][col+1]["off"]) {
                    let word = [];
                    let characters = [];
                    word.push(squares[row][col]["acrossclue"]);
                    word.push(squares[row][col+1]["acrossclue"]);
                    characters.push(squares[row][col]["value"]);
                    characters.push(squares[row][col+1]["value"]);

                    for (let letter = 2; letter < ncols-col; letter++) {
                        if (!squares[row][col+letter]["off"]) {
                            word.push(squares[row][col+letter]["acrossclue"]);
                            characters.push(squares[row][col+letter]["value"]);
                        } else {
                            break;
                        }
                    }
                    
                    // vote on the acrossclue for this word
                    let winner = this.vote(word);

                    // set all of them to the winning clue
                    if (winner !== null) {
                        for (let letter = 0; letter < word.length; letter++) {
                            squares[row][col + letter]["acrossclue"] = winner;
                        }
                        clues[winner]["answer"] = characters.join("");
                    } else {
                        // create new clue and assign it
                        let answer = characters.join("");
                        let newClue = this.createClueObject(true, [row, col], answer);
                        clues.push(newClue);
                        for (let letter = 0; letter < word.length; letter++) {
                            squares[row][col + letter]["acrossclue"] = clues.length - 1;
                        }
                    }
                    col += word.length;

                    // clear acrossclue for squares on same row with winner
                    for (let letter=col; letter < ncols; letter++) {
                        if (squares[row][letter]["acrossclue"] === winner) {
                            squares[row][letter]["acrossclue"] = null;
                        }
                    }
                } else if (!squares[row][col]["off"]) {
                    squares[row][col]["acrossclue"] = null;
                }
                col++;
            }
        }

        // repeat for columns (YOU'RE JOKING!!!)
        for (let col = 0; col < ncols; col++) {
            let row = 0;
            while (row < nrows - 1) {
                if (!squares[row][col]["off"] && !squares[row+1][col]["off"]) {
                    let word = [];
                    let characters = [];
                    word.push(squares[row][col]["downclue"]);
                    word.push(squares[row+1][col]["downclue"]);
                    characters.push(squares[row][col]["value"]);
                    characters.push(squares[row+1][col]["value"]);

                    for (let letter = 2; letter < nrows-row; letter++) {
                        if (!squares[row+letter][col]["off"]) {
                            word.push(squares[row+letter][col]["downclue"]);
                            characters.push(squares[row+letter][col]["value"]);
                        } else {
                            break;
                        }
                    }
                    
                    // vote on the acrossclue for this word
                    let winner = this.vote(word);

                    // set all of them to the winning clue
                    if (winner !== null) {
                        for (let letter = 0; letter < word.length; letter++) {
                            squares[row+letter][col]["downclue"] = winner;
                        }
                        clues[winner]["answer"] = characters.join("");
                    } else {
                        // create new clue and assign it
                        let answer = characters.join("");
                        let newClue = this.createClueObject(false, [row, col], answer);
                        clues.push(newClue);
                        for (let letter = 0; letter < word.length; letter++) {
                            squares[row+letter][col]["downclue"] = clues.length - 1;
                        }
                    }
                    row += word.length;
                    
                    // clear acrossclue for squares on same row with winner
                    for (let letter=row; letter < nrows; letter++) {
                        if (squares[letter][col]["downclue"] === winner) {
                            squares[letter][col]["downclue"] = null;
                        }
                    }
                } else if (!squares[row][col]["off"]) {
                    squares[row][col]["downclue"] = null;
                }

                row++;
            }
        }

        // PRUNE ANY CLUES WITH NO SQUARES!!!
        for (let iclue=0; iclue < clues.length; iclue++) {
            let remove = true;
            let found = 0;
            for (let jj=0; jj<nrows*ncols; jj++) {
                let row = Math.floor(jj / ncols);
                let col = jj - row * ncols;
                if ((squares[row][col]["acrossclue"] === iclue)
                        || (squares[row][col]["downclue"] === iclue)) {
                    found += 1;
                    if (found > 1) {
                        remove = false;
                        break;
                    }
                }
            }
            if (remove) {
                clues[iclue] = null;
            }
        }

        puzzle.puzzle = clues;
        this.setState({"puzzle": puzzle});
    }

    setClueNumbers() {
        // find squares that are the beginnings of words
        // and number them correctly
        // also number the Clue objects
        let clues = this.state.puzzle.puzzle;
        let squares = this.state.squares;
        let clue_counter = 1;
        
        for (let row=0; row < squares.length; row++) {
            for (let col=0; col < squares[0].length; col++) {
                let square = squares[row][col];
                square["cluenumber"] = "";
                if (!square["off"]) {
                    let increment = false;
                    // if square above is off and below is on
                    if ((row === 0 || squares[row-1][col]["off"])
                            && (row < squares.length - 1)
                            && !squares[row+1][col]["off"]) {
                        square["cluenumber"] = clue_counter;
                        increment = true;
                        // assign clue number
                        clues[square["downclue"]]["number"] = clue_counter;
                    }

                    // if square to left is off and right is on
                    if ((col === 0 || squares[row][col-1]["off"])
                            && (col < squares[0].length - 1)
                            && !squares[row][col+1]["off"]) {
                        square["cluenumber"] = clue_counter;
                        increment = true;
                        // assign clue number
                        clues[square["acrossclue"]]["number"] = clue_counter;
                    }

                    if (increment) {
                        clue_counter += 1;
                    }
                }
            }
        }
        this.setState({"squares": squares});
    }

    getCurrentClue(j, i, across) {
        let square = this.state["squares"][j][i];

        if (!square["off"]) {
            if (across && (square["acrossclue"] != null)) {
                return this.state.puzzle.puzzle[square["acrossclue"]];
            } else if (!across && (square["downclue"] != null)) {
                return this.state.puzzle.puzzle[square["downclue"]];
            }
        }

        return null;
    }

    handleClick(j, i) {
        let across = this.state.across;
        let focus = this.state.focus;

        if ((focus[0] === j) && (focus[1] === i)) {
            across = !across;
        }        

        let activeClue = this.getCurrentClue(j, i, across);

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

        let nextfocus = [focus[0], focus[1]];
        let nextacross = across;

        if ((keyPressed.length === 1) && (keyPressed >= "A") && (keyPressed <= "z")) {
            squares[focus[0]][focus[1]]["value"] = keyPressed;
            squares[focus[0]][focus[1]]["off"] = false;
            if (this.state.across) {
                nextfocus[1] = Math.min(ncols - 1, focus[1] + 1);
            } else {
                nextfocus[0] = Math.min(nrows - 1, focus[0] + 1);
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

        let activeClue = this.getCurrentClue(nextfocus[0], nextfocus[1], nextacross);

        this.setState({"focus": nextfocus,
                       "across": nextacross,
                       "squares": squares,
                       "activeClue": activeClue});
        this.setClues();
        this.setClueNumbers();
    }

    hasfocus(j, i) {
        return (this.state.focus[0] === j) && (this.state.focus[1] === i);
    }

    renderSquare(j, i) {
        let square = this.state.squares[j][i];
        let across = this.state.across;
        let activeClue = this.state.activeClue;
        let currentClue = this.getCurrentClue(j, i, across);        

        let cn = (square["off"] ? "square off" : "square");
        if (this.hasfocus(j, i)) {
            cn = (this.hasfocus(j, i) ? cn + " hasfocus" : cn);
        } else if (activeClue && (activeClue === currentClue)) {
            cn = cn + " active-clue";
        }        
        return <Square key={"sq " + this.state.squares[0].length * j + i}
                       value={square["value"]}
                       cn={cn}
                       cluenumber={square["cluenumber"]}
                       onClick={() => this.handleClick(j, i)}
               />;
    }

    onClueChange(event) {
        event.preventDefault();

        let puzzle = this.state.puzzle;
        let activeClue = this.state.activeClue;
        
        activeClue["clue"] = event.target.value;
        
        this.setState({"puzzle": puzzle,
                       "activeClue": activeClue});
    }

    validatePuzzle(puzzle) {
        // TODO: check for blank squares and missing clues
        return true;
    }

    sendPuzzle() {
        // TODO: validate before sending
        // TODO: bring up dialog to confirm
        console.log("Going to send puzzle!");
        
        // generate current date string
        let today = new Date();
        let yyyy = ("" + today.getFullYear());
        let mm = ("" + 1 + today.getMonth()).padStart(2, "0");
        let dd = ("" + today.getDate()).padStart(2, "0");
        let date = yyyy + "-" + mm + "-" + dd;

        // build puzzle object
        let puzzleObj = {"title": this.state.puzzle.title,
                         "author": this.state.puzzle.author,
                         "date": date}
        let statepuzzle = this.state.puzzle.puzzle;
        // check for empty first row(s) or columns(s)
        let minrow = Math.min(...statepuzzle.map(clue => {return clue.start[0];}));
        let mincol = Math.min(...statepuzzle.map(clue => {return clue.start[1];}));
        console.log(minrow, mincol);

        let puzzle = [];
        for (let ii = 0; ii < statepuzzle.length; ii++) {
            if (statepuzzle[ii]) {
                // shift starts if applicable
                let start = [statepuzzle[ii]["start"][0] - minrow,
                             statepuzzle[ii]["start"][1] - mincol];

                puzzle.push({"clue": statepuzzle[ii].clue,
                             "answer": statepuzzle[ii].answer,
                             "across": statepuzzle[ii].across,
                             "start": start});
            }
        }

        puzzleObj["puzzle"] = puzzle;
        
        fetch("api/sendpuzzle",
                {
                    method: "POST",
                    mode: "cors",
                    body: JSON.stringify(puzzleObj),
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

    showDialog() {
        this.setState({"showDialog": true});
    }

    hideDialog() {
        this.setState({"showDialog": false});
    }

    render() {

        const modal = this.state.showDialog ? (
                <Modal>
                    <div className="modal">
                        <div>
                            <p>Hello!  This is a Dialog!!!</p>
                        </div>
                        <GeneralButton text="Hide Me :-("
                                       onClick={() => this.hideDialog()} />
                    </div>
                </Modal>
            ) : null;

        let board_width_style = {"width": 40*this.state.squares[0].length + 110};

        return (
            <div className="main-block">

                <div className="side-panel"></div>

                <div className="game-board" style={board_width_style}>
                    <div>
                        <PuzzleName title={this.state.puzzle.title}
                                    author={this.state.puzzle.author}/>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"></div>
                        <div className="table-cell">
                            <ExpanderButton text="&#8679;" onClick={(event) => {this.expandPuzzle("top")}} orient="horiz" />
                        </div>
                        <div className="table-cell"></div>
                    </div>

                    <div className={"table-row"}>
                        <div className="table-cell">
                            <ExpanderButton text="&#8678;" onClick={(event) => {this.expandPuzzle("left")}} orient="vert" />
                        </div>
                        <div className="table-cell">
                            <div onKeyDown={(event) => this.handleKeyPress(event)}>
                                {this.state.squares.map((row, j) => {
                                    return <div key={"row_" + j} className="board-row">{row.map((sq, i) => {
                                        return this.renderSquare(j, i);
                                    })}</div>;
                                })}
                            </div>
                        </div>
                        <div className="table-cell">
                            <ExpanderButton text="&#8680;" onClick={(event) => {this.expandPuzzle("right")}} orient="vert" />
                        </div>
                    </div>

                    <div className="table-row">
                        <div className="table-cell"></div>
                        <div className="table-cell">
                            <ExpanderButton text="&#8681;" onClick={(event) => {this.expandPuzzle("bottom")}} orient="horiz" />
                        </div>
                        <div className="table-cell"></div>
                    </div>
                    <div>
                        <EditableClue clue={this.state.activeClue} onChange={ (event) => this.onClueChange(event) } />
                    </div>

                </div>

                <div className="side-panel"></div>

                <div className="horiz-button-panel">
                    <GeneralButton text="Main Menu"
                                   onClick={this.props.onMainMenuButtonClick} />
                    <GeneralButton text="Send Puzzle"
                                   onClick={() => this.sendPuzzle()} />
                    <GeneralButton text="Show Dialog!"
                                   onClick={() => this.showDialog()} />
                </div>

                {modal}
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
