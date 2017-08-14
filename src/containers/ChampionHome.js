import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';

import every from 'lodash/every';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';

import CounterTipsList from '../components/CounterTipsList';
import Loader from '../components/Loader';
import MatchupsList from '../components/MatchupsList';
import TabsContainer from '../containers/TabsContainer';
import TabsNav from '../components/TabsNav';
import ViewAll from '../components/ViewAll';

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
  addCounterTip,
  addRootComment
} from '../actions/all';

import {
  fetchCounterTipsForChampion,
  fetchMatchupsForChampion
} from '../actions/api';

import {
  adDimensions
} from '../constants/ads';

import {
  LANES,
  TYPES
} from '../constants/matchups';

import {
  cleanChampionKey
} from '../utils/index';

import {
  getTitle
} from '../utils/matchups';

class ChampionHome extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    champions: PropTypes.object.isRequired,
    counterTips: PropTypes.array.isRequired,
    matchups: PropTypes.array.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired,
    isFetchingCounterTips: PropTypes.bool.isRequired,
    isFetchingMatchups: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      showCounterTipsForm: false
    };
  }

  componentDidMount () {
    const {
      dispatch,
      token,
      username,
      userId
    } = this.props;

    if (!token && !username && !userId) {
      const localToken = localStorage.getItem('token');
      const localUsername = localStorage.getItem('username');
      const localUserId = localStorage.getItem('userId');

      if (localToken && localUsername && localUserId) {
        dispatch(setUser(localToken, localUsername, localUserId));
      }
    }
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);

    dispatch(fetchCounterTipsForChampion(championKey));
    dispatch(fetchMatchupsForChampion(championKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const {
      params: {
        championKey: _nextChampionKey
      }
    } = nextProps;

    const championKey = cleanChampionKey(_championKey);
    const nextChampionKey = cleanChampionKey(_nextChampionKey);

    if (championKey !== nextChampionKey) {
      dispatch(fetchCounterTipsForChampion(nextChampionKey));
      dispatch(fetchMatchupsForChampion(nextChampionKey));
    }
  }

  render () {
    const {
      children,
      champions,
      counterTips,
      matchups,
      isFetchingCounterTips,
      isFetchingMatchups,
      params: {
        championKey: _championKey
      },
      token
    } = this.props;

    const {
      showCounterTipsForm
    } = this.state;

    const championKey = cleanChampionKey(_championKey);

    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            <h5>Counter Tips</h5>
            {!isFetchingCounterTips && counterTips ?
              <CounterTipsList
                championsMap={champions.data}
                counterTips={take(counterTips.data, 3)}
                shouldHideMeta={true}
              />
            : <Loader />}
          </div>
          <div className="col-lg-6">
            <Ad
              className="cs-ad cs-ad-right"
              dimensions={adDimensions.BEFORE_SQUARE}
              path={'/22280732/ChampionSelect_300x250_Champions_BTF1'}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            {token && showCounterTipsForm ?
              <form
                onSubmit={e => {
                  e.preventDefault()

                  const {
                    dispatch,
                    username,
                    userId
                  } = this.props;

                  const textarea = this._counterTipsBox;

                  if (textarea && textarea.value && token) {
                    const localUserId = localStorage.getItem('userId');
                    const localUsername = localStorage.getItem('username');

                    dispatch(addCounterTip({
                      authorId: localUserId,
                      authorName: localUsername,
                      champKey: championKey,
                      content: textarea.value,
                      token
                    }));

                    location.reload();
                  }
                }}
              >
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    ref={c => this._counterTipsBox = c}
                    rows={3}
                  >
                  </textarea>
                </fieldset>
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item">
                    <button
                      className="btn btn-primary-outline btn-sm"
                      type="submit"
                    >Submit</button>
                  </li>
                  <li className="list-inline-item">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => this.setState({showCounterTipsForm: false})}
                      type="button"
                    >Cancel</button>
                  </li>
                </ul>
              </form>
            : null}
            {!isFetchingCounterTips && counterTips ?
              <ViewAll
                dataLength={counterTips.data.length}
                handleClickSubmit={() => this.setState({showCounterTipsForm: true})}
                showForm={showCounterTipsForm}
                submitText="Submit a new counter tip"
                viewAllPath={`/champions/${championKey}/countertips`}
              />
            : null}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {this.renderMatchups()}
          </div>
        </div>
      </div>
    );
  }

  renderMatchups = () => {
    const {
      champions,
      matchups,
      isFetchingMatchups,
      isFetchingChampions,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);

    const {
      data: {
        [championKey]: {
          name
        }
      }
    } = champions;

    if (!isFetchingMatchups && every(matchups, (v, k) => v) && !isFetchingChampions && champions) {
      const tabs = LANES.map(lane => {
        return {
          id: lane,
          label: changeCase.upperCaseFirst(lane)
        };
      });

      const data = LANES.map(lane => {
        return {
          id: lane,
          data: matchups[lane]
        };
      });

      const markups = LANES.map(lane => {

        // Counter picks and strong picks are listed above synergies and ties
        // for matchups.
        const topTypes = take(TYPES, 2);
        const botTypes = takeRight(TYPES, 2);

        const renderMatchupsList = type => (
          <div
            className="col-lg-6"
            key={type}
          >
            <h5 className="cs-matchup-title">{getTitle(name, type)}</h5>
            <MatchupsList
              championsMap={champions.data}
              matchups={take(matchups[lane][type].data, 5)}
              type={type}
            />
            <div className="cs-champion-view-all">
              <Link
                className="btn btn-secondary btn-sm btn-block"
                to={`/champions/${championKey}/matchups/${lane}/${type}`}
              >
                View more
              </Link>
            </div>
          </div>
        );

        const markup = (
          <div>
            <div className="row">
              {topTypes.map(type => renderMatchupsList(type))}
            </div>
            <Ad
              className="cs-ad cs-ad-middle"
              dimensions={adDimensions.AFTER_RECT}
              path={'/22280732/ChampionSelect_728x90_Champions_ATF1'}
            />
            <div className="row">
              {botTypes.map(type => renderMatchupsList(type))}
            </div>
          </div>
        );

        return {
          id: lane,
          markup
        };
      });

      // Return dummy tabs
      return (
        <TabsContainer
          tabs={tabs}
          data={data}
          markups={markups}
        />
      );
    }

    return (
      <div>
        <TabsNav
          activeTabId={'all'}
          handleClick={activeTabId => activeTabId}
          tabs={LANES.map(lane => {
            return {
              id: lane,
              label: changeCase.upperCaseFirst(lane)
            };
          })}
        />
        <Loader />
      </div>
    );
  };
}


function mapStateToProps (state) {
  const {
    api: {
      counterTips: {
        data: counterTipsData,
        isFetching: isFetchingCounterTips
      },
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
    },
    auth: {
      token,
      username,
      userId
    },
    riot: {
      champions: {
        data: championsData,
        isFetching: isFetchingChampions
      }
    }
  } = state;

  return {
    champions: championsData,
    counterTips: counterTipsData,
    matchups: matchupsData,
    isFetchingChampions,
    isFetchingCounterTips,
    isFetchingMatchups,
    token,
    username,
    userId
  };
}

export default connect(mapStateToProps)(ChampionHome);
