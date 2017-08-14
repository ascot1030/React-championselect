import React from 'react';
import changeCase from 'change-case';
import filter from 'lodash/filter';

import Loader from '../components/Loader';
import MatchupsList from '../components/MatchupsList';
import Pagination from '../components/Pagination';
import TabsContainer from '../containers/TabsContainer';
import TabsNav from '../components/TabsNav';
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
  fetchMatchupsIfNeeded
} from '../actions/api';

import {
  LANES,
  TYPES,
  MATCHUPS_COUNT
} from '../constants/matchups';

import {
  RIOT_CHAMPION_ICONS_URL,
  RIOT_SPRITES_URL
} from '../constants/urls';

import {
  cleanChampionKey
} from '../utils/index';

import {
  getTitle
} from '../utils/matchups';

const MATCHUPS_LIMIT = 25;

class ChampionMatchups extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    champions: PropTypes.object.isRequired,
    matchups: PropTypes.array.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired,
    isFetchingMatchups: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      hideMatchupsWithoutVotes: true,
    };
  }

  componentWillMount () {
    const {
      dispatch,
      location: {
        query: {
          page = 1
        }
      },
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);

    dispatch(fetchMatchupsIfNeeded(championKey, {
      limit: MATCHUPS_LIMIT,
      orderBy: 'score',
      order: -1,
      page: page || 1
    }));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      location: {
        query: {
          page: page
        }
      },
      params: {
        championKey: _championKey
      }
    } = this.props;

    const {
      location: {
        query: {
          page: nextPage
        }
      },
      params: {
        championKey: _nextChampionKey
      }
    } = nextProps;

    const championKey = cleanChampionKey(_championKey);
    const nextChampionKey = cleanChampionKey(_nextChampionKey);

    if (championKey !== nextChampionKey || page !== nextPage) {
      dispatch(fetchMatchupsIfNeeded(nextChampionKey, {
        limit: MATCHUPS_LIMIT,
        orderBy: 'score',
        order: -1,
        page: nextPage || 1
      }));
    }
  }

  render () {
    const {
      location: {
        query: {
          page = 1
        }
      },
      params: {
        championKey: _championKey,
        lane,
        type
      }
    } = this.props;

    const {
      hideMatchupsWithoutVotes
    } = this.state;

    const championKey = cleanChampionKey(_championKey);
    return (
      <div>
        <div className="row m-b-1">
          <div className="col-xs-12">
            <TabsNav
              activeTabId={lane}
              handleClick={activeTabId => this.setState(activeTabId)}
              tabs={LANES.map(_lane => {
                return {
                  id: _lane,
                  label: changeCase.upperCaseFirst(_lane),
                  location: `/champions/${championKey}/matchups/${_lane}/${type}`
                };
              })}
            />
            <div className="cs-filter navbar navbar-light bg-faded">
              <div className="cs-filter-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    checked={hideMatchupsWithoutVotes}
                    onChange={this.handleHideMatchupsWithoutVotes}
                    type="checkbox"
                  />Hide matchups without votes
                </label>
              </div>
            </div>
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/champions/${championKey}/matchups/${lane}/${type}`}
              limit={MATCHUPS_LIMIT}
              itemCount={MATCHUPS_COUNT}
            />
            {this.renderMatchupsList()}
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/champions/${championKey}/matchups/${lane}/${type}`}
              limit={MATCHUPS_LIMIT}
              itemCount={MATCHUPS_COUNT}
            />
          </div>
        </div>
      </div>
    );
  }

  renderMatchupsList = () => {
    const {
      champions,
      matchups,
      isFetchingChampions,
      isFetchingMatchups,
      params: {
        championKey: _championKey,
        lane,
        type
      }
    } = this.props;

    const {
      hideMatchupsWithoutVotes
    } = this.state;

    const championKey = cleanChampionKey(_championKey);

    const {
      data: {
        [championKey]: {
          name
        }
      }
    } = champions;

    if (!isFetchingMatchups && matchups[lane] && !isFetchingChampions && champions) {
      let filteredMatchups = matchups[lane][type].data;

      if (hideMatchupsWithoutVotes) {
        filteredMatchups = filter(matchups[lane][type].data, matchup => matchup.downvotes > 0 || matchup.upvotes > 0)
      }

      return (
        <div>
          <h5 className="cs-matchup-title">{getTitle(name, type)}</h5>
          <MatchupsList
            championsMap={champions.data}
            matchups={filteredMatchups}
            type={type}
          />
        </div>
      );
    }

    return <Loader />;
  };

  handleHideMatchupsWithoutVotes = () => {
    const {
      hideMatchupsWithoutVotes
    } = this.state;


    this.setState({
      hideMatchupsWithoutVotes: !hideMatchupsWithoutVotes
    });
  };
}


function mapStateToProps (state) {
  const {
    api: {
      matchups: {
        matchups: matchupsData,
        isFetching: isFetchingMatchups
      }
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
    matchups: matchupsData,
    isFetchingChampions,
    isFetchingMatchups
  };
}

export default connect(mapStateToProps)(ChampionMatchups);
