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
  const [getOddsClicked, setGetOddsClicked] = React.useState(false);

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
        setGetOddsClicked(true);

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

  // loading if button clicked, but not all ants have odds yet
  const oddsLoading = getOddsClicked && ants.find(ant => !ant.winProbability);

  let getOddsContent;
  if (!getOddsClicked) {
    getOddsContent = (
      <button onClick={loadAntsOdds}>
        {'Get odds!'}
      </button>
    );
  } else if (oddsLoading) {
    getOddsContent = (
      <span>
        {'Odds Loading ...'}
      </span>
    );
  }

  return (
    <div className="App">
      <div className="App-header">{'Ants Odds Sheet'}</div>
      <div className="get-odds-content">
        {getOddsContent}
      </div>
      {antsSortedByWinProbability.map(ant => (
        <Ant ant={ant} key={ant.name} />
      ))}
    </div>
  );
}

export default App;
