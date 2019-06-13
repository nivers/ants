import React from 'react';
import logo from './logo.svg';

import './App.css';

const SET_ANTS = 'SET_ANTS';
const SET_ANT_WIN_PROBABILITY = 'SET_ANT_WIN_PROBABILITY';


const antsQuery = `
  query {
    ants {
      name
      length
      color
      weight
    }
  }
`;
const antsUrl = `https://antserver-blocjgjbpw.now.sh/graphql?query=${antsQuery}`;

function generateAntWinLikelihoodCalculator() {
  var delay = 7000 + Math.random() * 7000;
  var likelihoodOfAntWinning = Math.random();

  return function(callback) {
    setTimeout(function() {
      callback(likelihoodOfAntWinning);
    }, delay);
  };
}

const antReducer = (state, action) => {
  switch (action.type) {
    case SET_ANTS:
      return action.ants.map(ant => ({ ...ant, winProbability: null }));
    case SET_ANT_WIN_PROBABILITY:
      return state.map(ant => {
        const updatedAnt = { ...ant };
        if (ant.name === action.antName) {
          updatedAnt.winProbability = action.winProbability;
        }
        return updatedAnt;
      });
    default:
      return state;
  }
};

function App() {
  const [ants, dispatchAntUpdate] = React.useReducer(antReducer, []);

  // fetch the ants once
  React.useEffect(() => {
    fetch(antsUrl)
      .then(response => response.json())
      .then(responseObj => {
        const ants = responseObj.data.ants;

        // set initial ants
        dispatchAntUpdate({
          type: SET_ANTS,
          ants
        });

        // get win probablility once for each ant
        ants.forEach((ant, index) => {
          generateAntWinLikelihoodCalculator()(winProbability => {
            dispatchAntUpdate({
              type: SET_ANT_WIN_PROBABILITY,
              antName: ant.name,
              winProbability,
            })
          });
        });
      });
  }, []);

  const antsSortedByWinProbability = ants.sort((ant1, ant2) => {
    return Number(ant1.winProbability) < Number(ant2.winProbability) ? 1 : -1;
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
