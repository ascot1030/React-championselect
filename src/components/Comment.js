import React from 'react';
import classNames from 'classnames';

const Comment = props => {
  const {
    id,
    authorName,
    content,
    computeChildrenCount,
    formattedCreatedAt,
    level,
    handleVote,
    renderChildren,
    renderReply,
    scoreTotal,
    shouldHideMeta,
    toggleChildren,
    toggleReply,
    token
  } = props;

  if (!localStorage.getItem('commentVotes')) localStorage.setItem('commentVotes', JSON.stringify({}));
  const votes =  JSON.parse(localStorage.getItem('commentVotes'));

  const points = scoreTotal === 1 ? 'point' : 'points';
  const childrenCount = computeChildrenCount();
  const comments = childrenCount === 1 ? 'comment' : 'comments';

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
    <div
      className="cs-comment cs-comment-child"
    >
      <div className="cs-comment-score">
        <div className="cs-comment-vote cs-comment-upvote">
          <i
            className={upvoteClass}
            onClick={handleVote.bind(null, 'upvote', 'child')}
          ></i>
        </div>
        <span className={`jq-comment-${id} hidden-xs-up`}></span>
        {/* <p className="cs-comment-total">{scoreTotal}</p> */}
        <div className="cs-comment-vote cs-comment-downvote">
          <i
            className={downvoteClass}
            onClick={handleVote.bind(null, 'downvote', 'child')}
          ></i>
        </div>
      </div>
      <div className="cs-comment-content">
        <p className="cs-comment-metadata">
          <span
            className="cs-comment-author text-primary"
          >{authorName}</span><strong><span className={`jq-comment-child-${id}`}>{scoreTotal}</span> {points}</strong> {formattedCreatedAt}
        </p>
        <p
          className="cs-comment-text"
          dangerouslySetInnerHTML={{
            __html: content
          }}
        ></p>
        <ul className="list-unstyled list-inline">
          {level < 3 ?
            <li className="list-inline-item">
              {childrenCount > 0 ?
                <a
                  href="javascript:;"
                  onClick={toggleChildren.bind(null, id)}
                >
                  <small><u>{childrenCount} {comments}</u></small>
                </a>
                : <small className="text-muted">{childrenCount} {comments}</small>
              }
            </li>
          : null}
          {level < 3 && token ?
            <li className="list-inline-item">
              <a
                className="cs-muted-link"
                href="javascript:;"
                onClick={toggleReply}
              >
                <small>reply</small>
              </a>
            </li>
          : null}
          <li className="list-inline-item">
          </li>
        </ul>
        {renderReply()}
        {renderChildren()}
      </div>
    </div>
  );
};

export default Comment;
