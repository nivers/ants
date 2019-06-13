import React from 'react';

export function Ant(props) {
  const { ant, setWinProbability } = props;

  return (
    <div onClick={setWinProbability}>
      {ant.name}
      {ant.winProbability ? `${ant.winProbability * 100}%` : null}
    </div>
  );
}
