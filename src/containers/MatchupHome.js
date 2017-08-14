import Ad from 'react-google-publisher-tag';
import React from 'react';
import changeCase from 'change-case';
import take from 'lodash/take';

import CommentsList from '../components/CommentsList';
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
  Link,
  browserHistory
} from 'react-router';

import {
  addChildComment,
  addCounterTip,
  addRootComment
} from '../actions/all';

import {
  setUser
} from '../actions/auth';

import {
  fetchCommentsIfNeeded,
  fetchCounterTipsIfNeeded,
  fetchMatchupsIfNeeded
} from '../actions/matchup';

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

class MatchupHome extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    champions: PropTypes.object.isRequired,
    comments: PropTypes.object.isRequired,
    counterTips: PropTypes.object.isRequired,
    matchups: PropTypes.object.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired,
    isFetchingComments: PropTypes.bool.isRequired,
    isFetchingCounterTips: PropTypes.bool.isRequired,
    isFetchingMatchups: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      showCommentsForm: false,
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
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    dispatch(fetchCommentsIfNeeded(championKey, matchupChampionKey));
    dispatch(fetchCounterTipsIfNeeded(championKey, matchupChampionKey));
    dispatch(fetchMatchupsIfNeeded(championKey, matchupChampionKey));
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    const {
      params: {
        championKey: _nextChampionKey,
        matchupChampionKey: _nextMatchupChampionKey
      }
    } = nextProps;

    const nextChampionKey = cleanChampionKey(_nextChampionKey);
    const nextMatchupChampionKey = cleanChampionKey(_nextMatchupChampionKey);

    if (championKey !== nextChampionKey || matchupChampionKey !== nextMatchupChampionKey) {
      dispatch(fetchCommentsIfNeeded(nextChampionKey, nextMatchupChampionKey));
      dispatch(fetchCounterTipsIfNeeded(nextChampionKey, nextMatchupChampionKey));
      dispatch(fetchMatchupsIfNeeded(nextChampionKey, nextMatchupChampionKey));
    }
  }

  render () {
    const {
      champions,
      comments,
      counterTips,
      matchups,
      isFetchingComments,
      isFetchingCounterTips,
      isFetchingMatchups,
      params: {
        championKey: _championKey,
        matchupChampionKey: _matchupChampionKey
      },
      token
    } = this.props;

    const {
      showCommentsForm,
      showCounterTipsForm
    } = this.state;

    const championKey = cleanChampionKey(_championKey);
    const matchupChampionKey = cleanChampionKey(_matchupChampionKey);

    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            <h5>Counter Tips</h5>
            {!isFetchingCounterTips && counterTips ?
              <div>
                <CounterTipsList
                  championsMap={champions.data}
                  counterTips={take(counterTips.data, 3)}
                  shouldHideMeta={true}
                />
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
                          matchupChampKey: matchupChampionKey,
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
                <ViewAll
                  dataLength={counterTips.data.length}
                  handleClickSubmit={() => this.setState({showCounterTipsForm: true})}
                  showForm={showCounterTipsForm}
                  submitText="Submit a new counter tip"
                  viewAllPath={`/matchups/${championKey}/${matchupChampionKey}/countertips`}
                />
              </div>
            : <Loader />}
          </div>
          <div className="col-lg-6">
            <h5>Comments</h5>
            {!isFetchingComments && comments ?
              <div>
                <CommentsList
                  addChildComment={addChildComment}
                  championsMap={champions.data}
                  comments={take(comments.data, 3)}
                  commentsClass="cs-comment cs-comment-sm"
                  shouldHideMeta={true}
                />
                {token && showCommentsForm ?
                  <form
                    onSubmit={e => {
                      e.preventDefault()

                      const {
                        dispatch,
                        username,
                        userId
                      } = this.props;

                      const textarea = this._commentsBox;
                      const titleInput = this._commentsTitleInput;

                      if (textarea && textarea.value && token) {
                        const localUserId = localStorage.getItem('userId');
                        const localUsername = localStorage.getItem('username');

                        dispatch(addRootComment({
                          authorId: localUserId,
                          authorName: localUsername,
                          champKey: championKey,
                          content: textarea.value,
                          matchupChampKey: matchupChampionKey,
                          title: titleInput.value,
                          token
                        }));

                        location.reload();
                      }
                    }}
                  >
                    <div className="form-group">
                      <input
                        className="form-control"
                        ref={c => this._commentsTitleInput = c}
                        type="text"
                        placeholder="Title"
                      />
                    </div>
                    <fieldset className="form-group">
                      <textarea
                        className="form-control"
                        ref={c => this._commentsBox = c}
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
                          onClick={() => this.setState({showCommentsForm: false})}
                          type="button"
                        >Cancel</button>
                      </li>
                    </ul>
                  </form>
                : null}
                <ViewAll
                  dataLength={comments.data.length}
                  handleClickSubmit={() => this.setState({showCommentsForm: true})}
                  showForm={showCommentsForm}
                  submitText="Submit a new comment"
                  viewAllPath={`/matchups/${championKey}/${matchupChampionKey}/comments`}
                />
              </div>
            : <Loader />}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <hr className="m-t-0 m-b-2" />
            <Ad
              className="cs-ad cs-ad-middle"
              dimensions={adDimensions.AFTER_RECT}
              path={'/22280732/ChampionSelect_728x90_Matchups_ATF1'}
            />
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
      isFetchingChampions,
      isFetchingMatchups,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);

    if (!isFetchingMatchups && matchups && !isFetchingChampions && champions) {
      const {
        data: {
          [championKey]: {
            name
          }
        }
      } = champions;

      const type = 'counter';

      return (
        <div>
          <h5 className="cs-matchup-title">{getTitle(name, type)}</h5>
          <MatchupsList
            championsMap={champions.data}
            matchups={take(matchups[type].data, 5)}
            type={type}
          />
        </div>
      );
    }

    return <Loader />;
  };
}


function mapStateToProps (state) {
  const {
    auth: {
      token,
      username,
      userId
    },
    matchup: {
      comments: {
        data: commentsData,
        isFetching: isFetchingComments
      },
      counterTips: {
        data: counterTipsData,
        isFetching: isFetchingCounterTips
      },
      matchups: {
        data: matchupsData,
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
    comments: commentsData,
    counterTips: counterTipsData,
    matchups: matchupsData,
    isFetchingChampions,
    isFetchingComments,
    isFetchingCounterTips,
    isFetchingMatchups,
    token,
    username,
    userId
  };
}

export default connect(mapStateToProps)(MatchupHome);
