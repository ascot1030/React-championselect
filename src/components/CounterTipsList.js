import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import moment from 'moment';

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
  invalidateCounterTips,
  voteCounterTip
} from '../actions/all';

import {
  RIOT_CHAMPION_ICONS_URL
} from '../constants/urls';

class CounterTipsList extends Component {
  static defaultProps: {
    isOnHomePage: false,
    shouldHideMeta: false
  }

  render () {
    const {
      championsMap,
      counterTips,
      shouldHideMeta,
      isOnHomePage
    } = this.props;

    if (!localStorage.getItem('counterTipVotes')) localStorage.setItem('counterTipVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('counterTipVotes'));

    if (counterTips.length === 0) {
      return (
        <div className="cs-counter-tips-list">
          <div className="alert alert-warning">Be the first to submit a counter tip!</div>
        </div>
      );
    }

    return (
      <div className="cs-counter-tips-list">
        {counterTips.map(counterTip => {
          const {
            champKey: championKey,
            commentTree: {
              _id: id,
              author: {
                name: authorName
              },
              content,
              createdAt,
              score: {
                upvotes,
                downvotes,
                total: scoreTotal
              },
            },
            matchupChampKey: matchupChampionKey
          } = counterTip;

          const {
            image: {
              full: fullImageChampion
            }
          } = championsMap[championKey];

          const name = authorName ? authorName : 'anonymous';
          const formattedCreatedAt = moment(parseInt(createdAt)).fromNow();

          const matchupChampionIcon = matchupChampionKey !== 'general' ?
            <img
              className="cs-counter-tip-icon"
              src={`${RIOT_CHAMPION_ICONS_URL}/${championsMap[matchupChampionKey].image.full}`}
            /> : null;

          const linkTo = matchupChampionKey !== 'general' ?
            `/matchups/${championKey}/${matchupChampionKey}` : `/champions/${championKey}`

          const downvoteClass = classNames({
            'fa fa-fw fa-caret-down': true,
            'cs-counter-tip-caret': true,
            'cs-counter-tip-caret-non-active': !votes[id],
            'cs-counter-tip-caret-active': votes[id] === 'downvote',
            'cs-counter-tip-vote-alt': true,
            'cs-counter-tip-vote-non-active-alt': !votes[id],
            'cs-counter-tip-vote-active-alt': votes[id] === 'downvote'
          });

          const upvoteClass = classNames({
            'fa fa-fw fa-caret-up': true,
            'cs-counter-tip-caret': true,
            'cs-counter-tip-caret-non-active': !votes[id],
            'cs-counter-tip-caret-active': votes[id] === 'upvote',
            'cs-counter-tip-vote-alt': true,
            'cs-counter-tip-vote-non-active-alt': !votes[id],
            'cs-counter-tip-vote-active-alt': votes[id] === 'downvote'
          });

          const contentElement = (
            <div>
              <p
                className="cs-counter-tip-text"
                dangerouslySetInnerHTML={{
                  __html: content
                }}
              ></p>
              <div className="cs-counter-tip-footer clearfix">
                {/* <span className="cs-counter-tip-metadata">{formattedCreatedAt} by <a href="javascript:;">{name}</a></span> */}
                <span className="cs-counter-tip-metadata">by <span className="text-primary">{name}</span></span>
                {shouldHideMeta ? null
                  : <span className="cs-counter-tip-score">
                    <i
                      className={upvoteClass}
                      onClick={this.handleVote.bind(null, id, 'upvote')}
                    ></i><span className={`jq-counter-tip-${id}`}>{scoreTotal}</span><i
                      className={downvoteClass}
                      onClick={this.handleVote.bind(null, id, 'downvote')}
                    ></i>
                  </span>
                }
              </div>
            </div>
          );

          return (
            <div
              className="cs-counter-tip"
              key={id}
            >
              {shouldHideMeta ? null :
                <Link
                  to={linkTo}
                >
                    <ul className="list-unstyled list-inline">
                      <li className="list-inline-item">
                        <img
                          className="cs-counter-tip-icon img-rounded"
                          src={`${RIOT_CHAMPION_ICONS_URL}/${fullImageChampion}`}
                        />
                      </li>
                      <li className="list-inline-item">
                        {matchupChampionIcon}
                      </li>
                    </ul>
                </Link>
              }
              {shouldHideMeta ?
                <div className="cs-counter-tip-score-alt">
                  <div className="cs-counter-tip-vote-alt cs-counter-tip-upvote-alt">
                    <i
                      className={upvoteClass}
                      onClick={this.handleVote.bind(null, id, 'upvote')}
                    ></i>
                  </div>
                  {/* <span className={`jq-counter-tip-${id} hidden-xs-up`}></span> */}
                  <p className={`cs-counter-tip-total-alt jq-counter-tip-${id}`}>{scoreTotal}</p>
                  <div className="cs-counter-tip-vote-alt cs-counter-tip-downvote-alt">
                    <i
                      className={downvoteClass}
                      onClick={this.handleVote.bind(null, id, 'downvote')}
                    ></i>
                  </div>
                </div>
              : null}
              {shouldHideMeta ?
                <div className="cs-counter-tip-content">
                  {contentElement}
                </div>
              : contentElement}
            </div>
          );
        })}
      </div>
    );
  }

  handleVote = (id, downOrUp) => {
    const {
      dispatch,
      shouldHideMeta
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('counterTipVotes'));

    if (!votes[id]) {
      dispatch(voteCounterTip(id, downOrUp));

      const selector = `.jq-counter-tip-${id}`;
      const score = parseInt($(selector).text());

      if (shouldHideMeta) {
        if (downOrUp === 'downvote') {
          $(selector).text(score - 1)

          $(selector).next().find('i').addClass('cs-counter-tip-vote-active-alt');
        } else if (downOrUp === 'upvote') {
          $(selector).text(score + 1)

          $(selector).prev().find('i').addClass('cs-counter-tip-vote-active-alt');
        }

        $(selector).prev().find('i').removeClass('cs-counter-tip-vote-non-active-alt');
        $(selector).next().find('i').removeClass('cs-counter-tip-vote-non-active-alt');
      } else {
        if (downOrUp === 'downvote') {
          $(selector).text(score - 1);
          $(selector).next().addClass('cs-counter-tip-caret-active');
        } else if (downOrUp === 'upvote') {
          $(selector).text(score + 1);
          $(selector).prev().addClass('cs-counter-tip-caret-active');
        }

        $(selector).prev().removeClass('cs-counter-tip-caret-non-active');
        $(selector).next().removeClass('cs-counter-tip-caret-non-active');
      }

      votes[id] = downOrUp;
      localStorage.setItem('counterTipVotes', JSON.stringify(votes));
    }
  };
}

export default connect()(CounterTipsList);
