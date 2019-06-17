import React from 'react';

import './Ant.css';

export const ODDS_LOADING = 'LOADING';
export const ODDS_LOADED = 'LOADED';

export function Ant(props) {
  const { ant } = props;
  const antDescription = `${ant.length}cm, ${ant.color.toLowerCase()}`;

  let winProbabilityContent = null;
  if (ant.status === ODDS_LOADED && ant.winProbability) {
    const winPercent = ant.winProbability * 100;
    winProbabilityContent = `${winPercent.toFixed(2)}%`;
  } else if (ant.status === ODDS_LOADING) {
    winProbabilityContent = 'Loading odds ...';
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
