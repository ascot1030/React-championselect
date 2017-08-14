import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import fetch from 'isomorphic-fetch';

import Loader from '../components/Loader';
import Typeahead from '../containers/Typeahead';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  Link
} from 'react-router';

import {
  adDimensions
} from '../constants/ads';

import {
  RIOT_CHAMPION_ICONS_URL
} from '../constants/urls';

import {
  cleanChampionKey,
  prepareAds
} from '../utils/index';

class Champion extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1470816122486-6',
      'div-gpt-ad-1470816122486-7'
    ]
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    champions: PropTypes.object.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired
  };

  componentDidMount () {
    const {
      ads
    } = this.props;

    prepareAds(ads);
  }

  componentWillUnmount () {
    $('.cs-ad-side').remove();
  }

  render () {
    const {
      ads,
      children,
      champions,
      isFetchingChampions,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);

    if (!isFetchingChampions && champions) {
      const championsMap = champions.data;

      const {
        image: {
          full
        }
      } = championsMap[championKey];

      return (
        <div>
          <div
            className="cs-ad cs-ad-side cs-ad-side-left"
            id={ads[0]}
          ></div>
          <div
            className="cs-ad cs-ad-side cs-ad-side-right"
            id={ads[1]}
          ></div>
          {/* <Ad */}
          {/*   className="cs-ad cs-ad-side cs-ad-side-left" */}
          {/*   dimensions={adDimensions.LEFT_SIDEBAR} */}
          {/*   path={'/22280732/ChampionSelect_336x768_ROS_Skin_Left'} */}
          {/* /> */}
          {/* <Ad */}
          {/*   className="cs-ad cs-ad-side cs-ad-side-right" */}
          {/*   dimensions={adDimensions.RIGHT_SIDEBAR} */}
          {/*   path={'/22280732/ChampionSelect_336x768_ROS_Skin_Right'} */}
          {/* /> */}
          <Ad
            className="cs-ad cs-ad-top"
            dimensions={adDimensions.BEFORE_RECT}
            path={'/22280732/ChampionSelect_728x90_Champions_BTF1'}
          />
          <div className="cs-champion row">
            <div className="col-xs-12">
              <div className="cs-champion-header row">
                <div className="col-xs-12">
                  <div className="cs-champion-profile row">
                    <Link to={`/champions/${championKey}`}>
                      <div
                        className="cs-champion-profile-icon"
                        style={{
                          backgroundImage: `url("${RIOT_CHAMPION_ICONS_URL}/${full}")`
                        }}
                      >
                      </div>
                    </Link>
                    <h5 className="cs-champion-profile-name">{championsMap[championKey].name}</h5>
                  </div>
                </div>
                <div className="col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4">
                  <div className="row">
                    <Typeahead
                      constructLink={(id) => `/matchups/${championKey}/${id.toLowerCase()}`}
                      inputGroupClass="input-group input-group-sm"
                      placeholder="Search for a matchup"
                    />
                  </div>
                </div>
              </div>
              <hr />
              {children}
              <Ad
                className="cs-ad cs-ad-bottom"
                dimensions={adDimensions.AFTER_SQUARE}
                path={'/22280732/ChampionSelect_300x250_Champions_ATF1'}
              />
            </div>
          </div>
        </div>
      );
    }

    return <Loader />;
  }
}

function mapStateToProps (state) {
  const {
    riot: {
      champions: {
        data: championsData,
        isFetching: isFetchingChampions
      }
    }
  } = state;

  return {
    champions: championsData,
    isFetchingChampions
  };
}

export default connect(mapStateToProps)(Champion);
