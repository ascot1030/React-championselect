import React from 'react';

import CommentsList from '../components/CommentsList';
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
  addChildComment
} from '../actions/all';

import {
  fetchCommentsIfNeeded
} from '../actions/matchup';

import {
  cleanChampionKey
} from '../utils/index';

const COMMENTS_LIMIT = 25;

class MatchupComments extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    comments: PropTypes.object.isRequired,
    isFetchingComments: PropTypes.bool.isRequired
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
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    dispatch(fetchCommentsIfNeeded(championKey, matchupChampionKey, {
      limit: COMMENTS_LIMIT,
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
      dispatch(fetchCommentsIfNeeded(nextChampionKey, nextMatchupChampionKey, {
        limit: COMMENTS_LIMIT,
        orderBy: 'score',
        order: -1,
        page: nextPage || 1
      }));
    }
  }

  render () {
    const {
      champions,
      comments,
      isFetchingChampions,
      isFetchingComments,
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
        {!isFetchingChampions && champions && !isFetchingComments && comments ?
          <div>
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/matchups/${championKey}/${matchupChampionKey}/comments`}
              limit={COMMENTS_LIMIT}
              itemCount={comments.itemCount}
            />
            <CommentsList
              addChildComment={addChildComment}
              championsMap={champions.data}
              comments={comments.data}
              commentsClass="cs-comment cs-comment-lg"
              shouldHideMeta={true}
            />
            <Pagination
              activePage={parseInt(page)}
              baseUrl={`/matchups/${championKey}/${matchupChampionKey}/comments`}
              limit={COMMENTS_LIMIT}
              itemCount={comments.itemCount}
            />
          </div>
        : <Loader />}
      </div>
    );
  }
}


function mapStateToProps (state) {
  const {
    matchup: {
      comments: {
        data: commentsData,
        isFetching: isFetchingComments
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
    comments: commentsData,
    isFetchingChampions,
    isFetchingComments
  };
}

export default connect(mapStateToProps)(MatchupComments);
