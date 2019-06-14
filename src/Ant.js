import React from 'react';

import './Ant.css';

export function Ant(props) {
  const { ant, setWinProbability } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const onLoadButtonClick = event => {
    event.preventDefault();
    setIsLoading(true);
    setWinProbability();
  };

  const antDescription = `${ant.length}cm, ${ant.color.toLowerCase()}`;

  let winProbabilityContent;
  if (ant.winProbability) {
    const winPercent = ant.winProbability * 100;
    winProbabilityContent = `${winPercent.toFixed(2)}%`;
  } else if (isLoading) {
    winProbabilityContent = 'Loading odds ...';
  } else {
    winProbabilityContent = (
      <button onClick={onLoadButtonClick}>
        {'Get odds!'}
      </button>
    );
  }

  return (
    <div className="antRow">
      <span className="antName">
        {ant.name}
      </span>
      {' - '}
      <span className="antDescription">
        {antDescription}
      </span>
      <div className="winProbabilityContent">
        {winProbabilityContent}
      </div>
    </div>
  );
}
