import React from 'react';
import logo from './logo.svg';
import './App.css';

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

function App() {
  const [ants, setAnts] = React.useState([]);
  const [winProbabilities, setWinProbabilities] = React.useState({});

  // fetch the ants
  React.useEffect(() => {
    fetch(antsUrl)
      .then(response => response.json())
      .then(responseObj => {
        const ants = responseObj.data.ants;

        // set initial ants
        setAnts(ants);
      });
  }, [setAnts]);

  // get win probablility once for each ant
  React.useEffect(() => {
    ants.forEach((ant, index) => {
      generateAntWinLikelihoodCalculator()(winProbability => {
        setWinProbabilities({
          ...winProbabilities,
          [ant]: winProbability
        });
      });
    });
  }, [ants, setWinProbabilities]);

  const antsWithWinProbabilities = ants.map(ant => ({
    ...ant,
    winProbability: winProbabilities[ant]
  }));

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
