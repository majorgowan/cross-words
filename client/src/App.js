import React, { Component } from 'react';
import CrossWord from './CrossWord.js';
import PuzzleItem from './PuzzleItem.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "puzzlelist": [],
            "puzzle": null
        };
    }

    componentDidMount() {
        // get list of puzzles in database
        fetch("api/puzzlelist")
            .then(res => res.json())
            .then(
                (result) => { 
                    this.setState({"puzzlelist": result});
                },
                (error) => {
                    console.log("error loading puzzlelist");
                }
            );
    }

    onPuzzleItemClick(event) {
        // if user clicks on puzzle in list, load it!
        let target_name = event.target.getAttribute("name");

        fetch("api/puzzle/" + target_name)
            .then(res => res.json())
            .then(
                (result) => { 
                    this.setState({"puzzle": result});
                },
                (error) => {
                    console.log(`error loading puzzle $title`);
                }
            );
    }

    render() {
        if (this.state.puzzle) {
            return (
                    <div>
                         <CrossWord puzzle={this.state.puzzle}/>
                    </div>
                   );
        } else if (this.state.puzzlelist) {
            return (
                    <div className="puzzle-picker">
                        <h2 className="big-prompt">Please pick a puzzle!</h2>
                        <ul className="puzzle-list">
                            {this.state.puzzlelist.map((puzzleItem) => {
                                return (
                                    <PuzzleItem key={puzzleItem.title} item={puzzleItem} 
                                                onClick={event => this.onPuzzleItemClick(event)} />);
                            })}
                        </ul>
                    </div>
                    );
        } else {
            return ( <div></div> );
        }
    }
}

export default App;
