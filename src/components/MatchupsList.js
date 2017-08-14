import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';

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
  voteMatchup
} from '../actions/all';

import {
  RIOT_CHAMPION_ICONS_URL,
  RIOT_SPRITES_URL
} from '../constants/urls';

import {
  generateSpriteStyle
} from '../utils/sprites';

class MatchupsList extends Component {
  render () {
    const {
      championsMap,
      matchups,
      type
    } = this.props;

    if (!localStorage.getItem('matchupVotes')) localStorage.setItem('matchupVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('matchupVotes'));

    return (
      <div className="cs-matchups-list">
        {matchups.map(matchup => {
          const {
            champKey,
            downvotes,
            upvotes,
            score,
            lane,
            matchupChampKey,
          } = matchup;

          const {
            image: {
              full
            },
            name
          } = championsMap[matchupChampKey];

          const key = matchupChampKey + lane + type;

          const thumbnailStyle = {
            backgroundImage: `url("${RIOT_CHAMPION_ICONS_URL}/${full}")`
          };

          const downvoteClass = classNames({
            'fa fa-fw': true,
            'fa-caret-down': true,
            'invisible': votes[key] === 'upvote'
          });

          const upvoteClass = classNames({
            'fa fa-fw': true,
            'fa-caret-up': true,
            'invisible': votes[key] === 'downvote'
          });

          const downvotesClass = classNames({
            'label label-danger': true,
            'cs-matchup-item-votes-active': votes[key],
            'cs-matchup-item-votes-non-active': !votes[key]
          });

          const upvotesClass = classNames({
            'label label-success': true,
            'cs-matchup-item-votes-active': votes[key],
            'cs-matchup-item-votes-non-active': !votes[key]
          });

          return (
            <div
              className="cs-matchup-item media"
              key={key}
            >
              <Link
                className="media-left"
                to={`/matchups/${champKey}/${matchupChampKey}`}
              >
                <div className="cs-thumbnail-container media-object">
                  <img
                    className="cs-thumbnail"
                    style={thumbnailStyle}
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"
                  />
                </div>
              </Link>
              <div className="media-body">
                <Link
                  className="cs-matchup-link"
                  to={`/matchups/${champKey}/${matchupChampKey}`}
                >
                  <h5 className="cs-matchup-item-name media-heading">{name}</h5>
                </Link>
                <div className="m-t-0">
                  <span className={`label cs-bg-${lane}`}>{changeCase.upperCaseFirst(lane)}</span>
                  <ul className="cs-matchup-item-score list-unstyled list-inline">
                    <li className="list-inline-item">
                      <span
                        className={upvotesClass}
                        onClick={this.handleVote.bind(null, key, champKey, matchupChampKey, lane, type, 'upvote')}
                      >
                        <i className={upvoteClass}></i>
                        <span className={`jq-matchup-upvote-${key}`}>{upvotes}</span>
                      </span>
                    </li>
                    <li className="list-inline-item">
                      <span
                        className={downvotesClass}
                        onClick={this.handleVote.bind(null, key, champKey, matchupChampKey, lane, type, 'downvote')}
                      >
                        <i className={downvoteClass}></i>
                        <span className={`jq-matchup-downvote-${key}`}>{downvotes}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  handleVote = (key, champKey, matchupChampKey, lane, type, downOrUp) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('matchupVotes'));

    if (!votes[key]) {
      dispatch(voteMatchup(champKey, matchupChampKey, lane, type, downOrUp));

      const selector = `.jq-matchup-${downOrUp}-${key}`;
      const score = parseInt($(selector).text());
      $(selector).text(score + 1);

      const otherDownOrUp = downOrUp === 'downvote' ? 'upvote' : 'downvote';
      const otherSelector = `.jq-matchup-${otherDownOrUp}-${key}`;
      $(otherSelector).prev().addClass(`invisible`);

      $(selector).parent().addClass('cs-matchup-item-votes-active');
      $(otherSelector).parent().addClass('cs-matchup-item-votes-active');
      $(selector).parent().removeClass('cs-matchup-item-votes-non-active');
      $(otherSelector).parent().removeClass('cs-matchup-item-votes-non-active');

      votes[key] = downOrUp;
      localStorage.setItem('matchupVotes', JSON.stringify(votes));
    }
  };
}

export default connect()(MatchupsList);
