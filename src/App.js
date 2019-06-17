import React from 'react';
import { Ant, ODDS_LOADED, ODDS_LOADING } from './Ant';

import './App.css';

//actions
const SET_ANTS = 'SET_ANTS';
const UPDATE_ANT = 'SET_ANT_WIN_PROBABILITY';

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
    case UPDATE_ANT:
      return state.map(ant => {
        if (action.antName === ant.name) {
          return {
            ...ant,
            ...action.updateFields,
          };
        } else {
          return ant;
        }
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

  const loadAntsOdds = () => {
    ants.forEach(ant => {
        // mark each ant as loading
        dispatchAntUpdate({
            type: UPDATE_ANT,
            antName: ant.name,
            updateFields: { status: ODDS_LOADING }
        });

        // generate odds for each ants, update when odds generated
        generateAntWinLikelihoodCalculator()(winProbability => {
            dispatchAntUpdate({
                type: UPDATE_ANT,
                antName: ant.name,
                updateFields: {
                  status: ODDS_LOADED,
                  winProbability
                }
            });
        });
    });
  };

  return (
    <div className="App">
      <div className="App-header">{'Ants Odds Sheet'}</div>
      <button className="get-odds-button" onClick={loadAntsOdds}>
        {'Get odds!'}
      </button>
      {antsSortedByWinProbability.map(ant => (
        <Ant ant={ant} key={ant.name} />
      ))}
    </div>
  );
}

export default App;
