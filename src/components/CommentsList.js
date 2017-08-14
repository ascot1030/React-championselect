import React from 'react';
import changeCase from 'change-case';
import classNames from 'classnames';
import moment from 'moment';

import Comment from './Comment';

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
  addChildComment,
  voteComment
} from '../actions/all';

import {
  setUser
} from '../actions/auth';

import {
  RIOT_CHAMPION_ICONS_URL
} from '../constants/urls';

class CommentsList extends Component {
  static defaultProps = {
    shouldHideMeta: false
  };

  constructor (props) {
    super(props);

    this._scores = {};
    this._replies = {};

    this.state = {
      visibleChildren: {},
      visibleReplies: {}
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

  render () {
    const {
      championsMap,
      comments,
      commentsClass,
      children,
      shouldHideMeta,
      token
    } = this.props;

    const {
      scores
    } = this.state;

    if (!localStorage.getItem('commentVotes')) localStorage.setItem('commentVotes', JSON.stringify({}));
    const votes =  JSON.parse(localStorage.getItem('commentVotes'));

    if (comments.length === 0) {
      return (
        <div className="cs-comments-list">
          <div className="alert alert-warning">Be the first to submit a comment!</div>
        </div>
      );
    }

    return (
      <ul className="cs-comments-list list-unstyled">
        {comments.map(comment => {
          const {
            champKey: championKey,
            commentTree: {
              _id: id,
              createdAt,
              score: {
                total: scoreTotal
              },
              meta: {
                title
              },
              author: {
                name: authorName
              },
              content,
              children
            },
            matchupChampKey: matchupChampionKey,
          } = comment;

          const {
            image: {
              full: fullImageChampion
            }
          } = championsMap[championKey];

          const formattedCreatedAt = moment(parseInt(createdAt)).fromNow();

          const linkTo = (matchupChampionKey === 'general') ?
            `/champions/${championKey}` : `/matchups/${championKey}/${matchupChampionKey}`

          const childrenCount = this.computeChildrenCount(comment.commentTree);
          const commentsText = childrenCount === 1 ? 'comment' : 'comments';

          const downvoteClass = classNames({
            'fa fa-fw fa-caret-down': true,
            'cs-comment-vote': true,
            'cs-comment-vote-non-active': !votes[id],
            'cs-comment-vote-active': votes[id] === 'downvote'
          });

          const upvoteClass = classNames({
            'fa fa-fw fa-caret-up': true,
            'cs-comment-vote': true,
            'cs-comment-vote-non-active': !votes[id],
            'cs-comment-vote-active': votes[id] === 'upvote'
          });

          return (
            <li
              className={commentsClass}
              key={id}
            >
              <div className="cs-comment-score">
                <div
                  className="cs-comment-vote cs-comment-upvote"
                  onClick={this.handleVote.bind(null, id, 'upvote', 'parent')}
                >
                  <i className={upvoteClass}></i>
                </div>
                <p
                  className={`cs-comment-total jq-comment-${id}`}
                  ref={c => this._scores[id] = c}
                >{scoreTotal}</p>
                <div
                  className="cs-comment-vote cs-comment-downvote"
                  onClick={this.handleVote.bind(null, id, 'downvote', 'parent')}
                >
                  <i className={downvoteClass}></i>
                </div>
              </div>
              <div className="cs-comment-content">
                {shouldHideMeta ? null :
                  <Link
                    to={linkTo}
                  >
                    <ul className="cs-comment-icons list-unstyled list-inline">
                      <li className="list-inline-item">
                        <img
                          className="cs-comment-icon"
                          src={`${RIOT_CHAMPION_ICONS_URL}/${fullImageChampion}`}
                        />
                      </li>
                      {matchupChampionKey !== 'general' ?
                        <li className="list-inline-item">
                          <img
                            className="cs-comment-icon"
                            src={`${RIOT_CHAMPION_ICONS_URL}/${championsMap[matchupChampionKey].image.full}`}
                          />
                        </li> : null
                      }
                    </ul>
                  </Link>
                }
                <h6 className="cs-comment-title">{title}</h6>
                <p className="cs-comment-metadata">Submitted {formattedCreatedAt} by <span className="text-primary">{authorName}</span></p>
                <hr />
                <p
                  className="cs-comment-text"
                  dangerouslySetInnerHTML={{
                    __html: content
                  }}
                ></p>
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item">
                    {childrenCount > 0 ?
                      <a
                        href="javascript:;"
                        onClick={this.toggleChildren.bind(null, id)}
                      >
                        <small><u>{childrenCount} {commentsText}</u></small>
                      </a>
                      : <small className="text-muted">{childrenCount} {commentsText}</small>
                    }
                  </li>
                  {token ?
                    <li className="list-inline-item">
                      <a
                        className="cs-muted-link"
                        href="javascript:;"
                        onClick={this.toggleReply.bind(null, id)}
                      >
                        <small>reply</small>
                      </a>
                    </li>
                  : null}
                  <li className="list-inline-item">
                  </li>
                </ul>
                {this.renderReply(comment.commentTree)}
                {this.renderChildren(comment.commentTree, 1)}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  renderChildren = (comment, level, maxLevel = 3) => {
    const {
      comments,
      shouldHideMeta,
      token
    } = this.props;

    const {
      visibleChildren
    } = this.state;

    const {
      _id: parentId,
      children
    } = comment;

    if (visibleChildren[parentId] && children && children.length > 0) {
      return (
        <div className="cs-comment-children">
          {children.map(child => {
            const {
              _id: childId,
              author: {
                name: authorName
              },
              content,
              createdAt,
              score: {
                total: scoreTotal
              }
            } = child;

            const formattedCreatedAt = moment(parseInt(createdAt)).fromNow();
            const nextLevel = level + 1;

            return (
              <Comment
                id={childId}
                comments={comments}
                authorName={authorName}
                computeChildrenCount={this.computeChildrenCount.bind(null, child)}
                content={content}
                formattedCreatedAt={formattedCreatedAt}
                handleVote={this.handleVote.bind(null, childId)}
                level={nextLevel}
                renderChildren={this.renderChildren.bind(null, child, nextLevel)}
                renderReply={this.renderReply.bind(null, child)}
                scoreTotal={scoreTotal}
                shouldHideMeta={shouldHideMeta}
                toggleChildren={this.toggleChildren.bind(null, childId)}
                toggleReply={this.toggleReply.bind(null, childId)}
                token={token}
              />
            );
          })}
        </div>
      );
    }
  };

  computeChildrenCount = (comment, n = 0) => {
    const {
      children
    } = comment;

    if (children && children.length > 0) {
      return children.reduce((acc, child) => {
        return this.computeChildrenCount(child, acc + 1);
      }, n);
    } else {
      return n;
    }
  };

  renderReply = parent => {
    const {
      token
    } = this.props;

    const {
      visibleReplies
    } = this.state;

    const {
      _id: id
    } = parent;

    if (visibleReplies[id] && token) {
      return (
        <form
          className="cs-comment-reply"
          onSubmit={e => {
            e.preventDefault();

            const textarea = this._replies[id];

            if (textarea && textarea.value && token) {
              this.reply(parent, textarea.value);
              textarea.value = '';
              this.toggleReply(id);

              // TODO: temporary until optimistic updates are available
              location.reload();
            }

            return false;
          }}
        >
          <fieldset className="form-group">
            <textarea
              className="form-control"
              ref={c => this._replies[id] = c}
              rows={3}
            >
            </textarea>
          </fieldset>
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <button
                className="btn btn-primary-outline btn-sm"
                type="submit"
              >Reply</button>
            </li>
            <li className="list-inline-item">
              <button
                className="btn btn-secondary btn-sm"
                onClick={this.toggleReply.bind(null, id)}
                type="button"
              >Cancel</button>
            </li>
          </ul>
        </form>
      );
    }

    return null;
  };

  toggleChildren = id => {
    const {
      visibleChildren
    } = this.state;

    if (visibleChildren.hasOwnProperty(id)) {
      const reply = visibleChildren[id];

      this.setState({
        visibleChildren: {
          ...visibleChildren,
          [id]: !reply
        }
      });
    } else {
      this.setState({
        visibleChildren: {
          ...visibleChildren,
          [id]: true
        }
      });
    }
  };

  toggleReply = id => {
    const {
      visibleReplies
    } = this.state;

    if (visibleReplies.hasOwnProperty(id)) {
      const reply = visibleReplies[id];

      this.setState({
        visibleReplies: {
          ...visibleReplies,
          [id]: !reply
        }
      });
    } else {
      this.setState({
        visibleReplies: {
          ...visibleReplies,
          [id]: true
        }
      });
    }
  };

  reply = (parent, content) => {
    const {
      dispatch,
      token,
      username,
      userId
    } = this.props;

    const {
      _id: parentId,
      path,
    } = parent;

    const rootId = path[0];

    let {
      meta: {
        title
      }
    } = parent;

    if (rootId === parentId)
      title = `Re: ${title}`;

    const localUserId = localStorage.getItem('userId');
    const localUsername = localStorage.getItem('username');

    dispatch(addChildComment({
      authorId: localUserId,
      authorName: localUsername,
      content,
      parent: parentId,
      root: rootId,
      title,
      token
    }, path));
  };

  handleVote = (id, downOrUp, parentOrChild) => {
    const {
      dispatch
    } = this.props;

    const votes = JSON.parse(localStorage.getItem('commentVotes'));

    if (!votes[id]) {
      dispatch(voteComment(id, downOrUp));

      const selector = `.jq-comment-${id}`;
      const childSelector = `.jq-comment-child-${id}`;

      let score;
      if (parentOrChild === 'parent') score = parseInt($(selector).text());
      else if (parentOrChild === 'child') score = parseInt($(childSelector).text());

      if (downOrUp === 'downvote') {
        if (parentOrChild === 'parent') $(selector).text(score - 1);
        else if (parentOrChild === 'child') $(childSelector).text(score - 1);

        $(selector).next().find('i').addClass('cs-comment-vote-active');
      } else if (downOrUp === 'upvote') {
        if (parentOrChild === 'parent') $(selector).text(score + 1);
        else if (parentOrChild === 'child') $(childSelector).text(score + 1);

        $(selector).prev().find('i').addClass('cs-comment-vote-active');
      }

      $(selector).prev().find('i').removeClass('cs-comment-vote-non-active');
      $(selector).next().find('i').removeClass('cs-comment-vote-non-active');

      votes[id] = downOrUp;
      localStorage.setItem('commentVotes', JSON.stringify(votes));
    }
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      token,
      username,
      userId
    }
  } = state;

  return {
    token,
    username,
    userId
  };
}

export default connect(mapStateToProps)(CommentsList);
