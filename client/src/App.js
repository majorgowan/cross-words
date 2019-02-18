import React, { Component } from 'react';
import CrossWord from './CrossWord.js';
import Creator from './Creator.js';
import { GeneralButton } from './Elements.js';
import PuzzlePicker from './PuzzlePicker.js';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "puzzlelist": [],
            "puzzle": null,
            "createMode": false
        };
    }

    fetchPuzzleList() {
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

    fetchPuzzle(puzzleName) {
        fetch("api/puzzle/" + puzzleName)
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

    componentDidMount() {
        // TODO: check if server has a puzzleId in its config object
        // (if it does send back the corresponding puzzle name!)
        fetch("api/defaultPuzzle")
            .then(res => res.json())
            .then(
                (result) => {
                    if (Object.keys(result).length > 0) {
                        this.setState({"puzzle": result});
                    }
                },
                (error) => {
                    console.log("no puzzle loaded")
                }
            );
        this.fetchPuzzleList();
    }

    onPuzzleItemClick(event) {
        // if user clicks on puzzle in list, load it!
        let target_name = event.target.getAttribute("name");
        this.fetchPuzzle(target_name);
    }

    onMainMenuClick() {
        // listener for back-to-main-menu button
        this.fetchPuzzleList();
        this.setState({ "puzzle": null,
                        "createMode": false });
    }

    render() {
        if (this.state.createMode) {
            return (
                    <Creator onMainMenuButtonClick={() => this.onMainMenuClick()} />
                   );
        } else if (this.state.puzzle) {
            return (
                    <CrossWord puzzle={this.state.puzzle}
                               onMainMenuButtonClick={() => this.onMainMenuClick()} />
                   );
        } else if (this.state.puzzlelist) {
            return (<div>
                        <PuzzlePicker puzzlelist={this.state.puzzlelist}
                                      onClick={event => this.onPuzzleItemClick(event)} />
                        <div className="horiz-button-panel">
                            <GeneralButton text="Create A Puzzle!"
                                           onClick={event => this.setState({"createMode": true})} />                                
                        </div>
                    </div>
                   );
        } else {
            return ( <div></div> );
        }
    }
}

export default App;
