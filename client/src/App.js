import React, { Component } from 'react';
import CrossWord from './CrossWord.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div class="header">
            {/* ref: https://css-tricks.com/snippets/svg/curved-text-along-path/ */}
            <svg viewBox="0 0 800 80">
                <path id="curve" d="M 150 100 C 250 30, 550 30, 650 100" />
                <text id="header-text">
                    <textPath id="#curve" text-anchor="middle" alignment-baseline="central" startOffset="50%">
                    Cross Words!
                    </textPath>
                </text>
            </svg>
        </div>
        <CrossWord />
      </div>
    );
  }
}

export default App;
