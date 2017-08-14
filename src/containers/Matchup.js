import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

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

class Matchup extends Component {
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
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    if (!isFetchingChampions && champions) {
      const championsMap = champions.data;

      const {
        image: {
          full: fullImageChampion
        }
      } = championsMap[championKey];

      const {
        image: {
          full: fullImageMatchup
        }
      } = championsMap[matchupChampionKey];

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
            path={'/22280732/ChampionSelect_728x90_Matchups_BTF1'}
          />
          <div className="cs-matchup row">
            <div className="col-xs-12">
              <div className="cs-matchup-header row">
                <div className="cs-matchup-versus">
                  {/* <p className="cs-matchup-versus-text">vs</p> */}
                  <Link
                    className="cs-matchup-exchange btn btn-primary-outline btn-sm"
                    to={`/matchups/${matchupChampionKey}/${championKey}`}
                  >
                    <i className="fa fa-fw fa-exchange"></i>
                  </Link>
                </div>
                <div className="col-xs-6 col-sm-5 col-sm-offset-1 col-lg-5 col-lg-offset-1">
                  <div className="row">
                    <div className="col-sm-6 hidden-xs-down">
                      <Typeahead
                        constructLink={(id) => `/matchups/${id.toLowerCase()}/${matchupChampionKey}`}
                        inputGroupClass="cs-matchup-search input-group input-group-sm"
                        placeholder="Change champion"
                      />
                    </div>
                    <div className="col-sm-6">
                      <div className="cs-champion-profile">
                        <Link to={`/champions/${championKey}`}>
                          <div
                            className="cs-champion-profile-icon"
                            style={{
                              backgroundImage: `url("${RIOT_CHAMPION_ICONS_URL}/${fullImageChampion}")`
                            }}
                          >
                          </div>
                        </Link>
                        <h5 className="cs-champion-profile-name"><span className="cs-matchup-tag label label-primary">You</span>{championsMap[championKey].name}</h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-sm-5 col-lg-5">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="cs-champion-profile">
                        <Link to={`/champions/${matchupChampionKey}`}>
                          <div
                            className="cs-champion-profile-icon"
                            style={{
                              backgroundImage: `url("${RIOT_CHAMPION_ICONS_URL}/${fullImageMatchup}")`
                            }}
                          >
                          </div>
                        </Link>
                        <h5 className="cs-champion-profile-name">{championsMap[matchupChampionKey].name}</h5>
                      </div>
                    </div>
                    <div className="col-sm-6 hidden-xs-down">
                      <Typeahead
                        constructLink={(id) => `/matchups/${championKey}/${id.toLowerCase()}`}
                        inputGroupClass="cs-matchup-search input-group input-group-sm"
                        placeholder="Change matchup"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {children}
              <Ad
                className="cs-ad cs-ad-bottom"
                dimensions={adDimensions.AFTER_SQUARE}
                path={'/22280732/ChampionSelect_300x250_Matchups_ATF1'}
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

export default connect(mapStateToProps)(Matchup);
