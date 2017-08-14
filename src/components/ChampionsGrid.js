import React from 'react';

import Loader from '../components/Loader';

import {
  Component
} from 'react';

import {
  Link
} from 'react-router';

import {
  RIOT_CHAMPION_ICONS_URL,
  RIOT_SPRITES_URL
} from '../constants/urls';

import {
  cleanChampionKey
} from '../utils/index';

import {
  generateSpriteStyle
} from '../utils/sprites';

class ChampionsGrid extends Component {
  static defaultProps = {
    colClass: 'col-xs-3 col-sm-2'
  };

  render () {
    const {
      champions,
      championsMap,
      colClass
    } = this.props;

    return (
      <div className="cs-champions-grid row">
        {champions.map(champion => {
          const {
            key
          } = champion;

          const cleanedKey = cleanChampionKey(key);

          const {
            image: {
              full
            },
            name
          } = championsMap[cleanedKey];

          const thumbnailStyle = {
            backgroundImage: `url("${RIOT_CHAMPION_ICONS_URL}/${full}")`
          };

          return (
            <div
              className={colClass}
              key={champion.id}
            >
              <div className="cs-champions-grid-cell cs-thumbnail-container">
                <Link to={`/champions/${cleanedKey}`}>
                  {/* TODO: extract CSS  */}
                  {/* use transparent PNG as a placeholder */}
                  <img
                    className="cs-thumbnail"
                    style={thumbnailStyle}
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"
                  />
                  <span className="cs-champions-grid-overlay">{name}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ChampionsGrid;
