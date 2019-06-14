import React from 'react';

export function Ant(props) {
  const { ant, setWinProbability } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const onLoadButtonClick = event => {
    event.preventDefault();
    setIsLoading(true);
    setWinProbability();
  };

  let winProbabilityContent;
  if (ant.winProbability) {
    winProbabilityContent = `${ant.winProbability.toFixed(2) * 100}%`;
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
    <div>
      {ant.name}
      {winProbabilityContent}
    </div>
  );
}
