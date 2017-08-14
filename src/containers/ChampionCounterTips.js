import React from 'react';

import CounterTipsList from '../components/CounterTipsList';
import Loader from '../components/Loader';
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
  fetchCounterTipsIfNeeded,
} from '../actions/api';

import {
  cleanChampionKey
} from '../utils/index';

const COUNTER_TIPS_LIMIT = 25;

class ChampionCounterTips extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    counterTips: PropTypes.object.isRequired,
    isFetchingCounterTips: PropTypes.bool.isRequired
  };

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

    dispatch(fetchCounterTipsIfNeeded(championKey, {
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
      dispatch(fetchCounterTipsIfNeeded(nextChampionKey, {
        limit: COUNTER_TIPS_LIMIT,
        orderBy: 'score',
        order: -1,
        page: nextPage || 1
      }));
    }
  }

  render () {
    const {
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
        championKey
      }
    } = this.props;

    return (
      <div>
        {!isFetchingChampions && champions && !isFetchingCounterTips && counterTips ?
          <div>
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/champions/${championKey}/countertips`}
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
              baseUrl={`/champions/${championKey}/countertips`}
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
    api: {
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

export default connect(mapStateToProps)(ChampionCounterTips);
