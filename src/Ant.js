import React from 'react';

import './Ant.css';

export const ODDS_LOADING = 'LOADING';
export const ODDS_LOADED = 'LOADED';

export function Ant(props) {
  const { ant } = props;
  const antDescription = `${ant.length}cm, ${ant.color.toLowerCase()}`;

  let winProbabilityDisplay = null;
  if (ant.winProbability) {
    const winPercent = ant.winProbability * 100;
    winProbabilityDisplay = `${winPercent.toFixed(2)}%`;
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
        {winProbabilityDisplay}
      </div>
    </div>
  );
}
