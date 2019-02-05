import React, { Component } from 'react';
import CrossWord from './CrossWord.js';
import PuzzlePicker from './PuzzlePicker.js';
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

    onMainMenuClick() {
        // listener for back-to-main-menu button
        this.setState({"puzzle": null});
    }

    render() {
        if (this.state.puzzle) {
            return (
                    <CrossWord puzzle={this.state.puzzle}
                               onMainMenuButtonClick={() => this.onMainMenuClick()} />
                   );
        } else if (this.state.puzzlelist) {
            return (
                    <PuzzlePicker puzzlelist={this.state.puzzlelist}
                                  onClick={event => this.onPuzzleItemClick(event)} />
                   );
        } else {
            return ( <div></div> );
        }
    }
}

export default App;
