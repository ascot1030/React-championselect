import React from 'react';

import CounterTipsList from '../components/CounterTipsList';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import Typeahead from '../containers/Typeahead';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  fetchCounterTipsIfNeeded,
} from '../actions/matchup';

import {
  cleanChampionKey,
  prepareAds
} from '../utils/index';

const COUNTER_TIPS_LIMIT = 25;

class MatchupCounterTips extends Component {
  static defaultProps = {
    ads: [
      // 300x250
      'div-gpt-ad-1470816122486-2',

      // 300x250
      'div-gpt-ad-1470816122486-3',

      // 336x768 (left)
      'div-gpt-ad-1470816122486-6',

      // 336x768 (right)
      'div-gpt-ad-1470816122486-7',

      // 728x90
      'div-gpt-ad-1470816122486-10',

      // 728x90
      'div-gpt-ad-1470816122486-11'
    ]
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    counterTips: PropTypes.object.isRequired,
    isFetchingCounterTips: PropTypes.bool.isRequired
  };

  componentDidMount () {
    const {
      ads
    } = this.props;

    prepareAds(ads);
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
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    dispatch(fetchCounterTipsIfNeeded(championKey, matchupChampionKey, {
      limit: COUNTER_TIPS_LIMIT,
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
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const {
      location: {
        query: {
          page: nextPage
        }
      },
      params: {
        championKey: _nextChampionKey,
        matchupChampionKey: _nextMatchupChampionKey
      }
    } = nextProps;

    const championKey = cleanChampionKey(_championKey);
    const nextChampionKey = cleanChampionKey(_nextChampionKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);
    const nextMatchupChampionKey = cleanChampionKey(_nextMatchupChampionKey);

    if (championKey !== nextChampionKey || page !== nextPage) {
      dispatch(fetchMatchupsIfNeeded(nextChampionKey, nextMatchupChampionKey, {
        limit: MATCHUPS_LIMIT,
        orderBy: 'score',
        order: -1,
        page: nextPage || 1
      }));
    }
  }

  render () {
    const {
      ads,
      champions,
      counterTips,
      isFetchingChampions,
      isFetchingCounterTips,
      location: {
        query: {
          page = 1
        }
      },
      params: {
        championKey,
        matchupChampionKey,
      }
    } = this.props;

    return (
      <div>
        {!isFetchingChampions && champions && !isFetchingCounterTips && counterTips ?
          <div>
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/matchups/${championKey}/${matchupChampionKey}/countertips`}
              limit={COUNTER_TIPS_LIMIT}
              itemCount={counterTips.itemCount}
            />
            <CounterTipsList
              championsMap={champions.data}
              counterTips={counterTips.data}
              shouldHideMeta={true}
            />
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/matchups/${championKey}/${matchupChampionKey}/countertips`}
              limit={COUNTER_TIPS_LIMIT}
              itemCount={counterTips.itemCount}
            />
          </div>
          : <Loader />
        }
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    matchup: {
      counterTips: {
        data: counterTipsData,
        isFetching: isFetchingCounterTips
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
    counterTips: counterTipsData,
    isFetchingChampions,
    isFetchingCounterTips
  };
}

export default connect(mapStateToProps)(MatchupCounterTips);
