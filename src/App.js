import React from 'react';
import { Ant } from './Ant';

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

  // fetch ants, set ant state
  React.useEffect(() => {
    fetch(antsUrl)
      .then(response => response.json())
      .then(responseObj => {
        const ants = responseObj.data.ants;

        dispatchAntUpdate({
          type: SET_ANTS,
          ants
        });
      });
  }, []);

  const antsSortedByWinProbability = ants.sort((ant1, ant2) => {
    return Number(ant1.winProbability) <= Number(ant2.winProbability) ? 1 : -1;
  });

  const setWinProbability = ant => () => {
    generateAntWinLikelihoodCalculator()(winProbability => {
      dispatchAntUpdate({
        type: SET_ANT_WIN_PROBABILITY,
        antName: ant.name,
        winProbability
      })
    });
  };

  return (
    <div className="App">
      <div className="App-header">{'Ants Odds Sheet'}</div>
      {antsSortedByWinProbability.map(ant => (
        <Ant ant={ant} key={ant.name} setWinProbability={setWinProbability(ant)} />
      ))}
    </div>
  );
}

export default App;
