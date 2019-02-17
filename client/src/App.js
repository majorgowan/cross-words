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


    componentDidMount() {
        this.fetchPuzzleList();
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
