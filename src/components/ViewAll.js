import React from 'react';
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
  setUser
} from '../actions/auth';

class ViewAll extends Component {
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
      className,
      dataLength,
      handleClickSubmit,
      showForm,
      submitText,
      token,
      viewAllPath
    } = this.props;

    const viewAllClass = classNames({
      'cs-champion-view-all': true,
      'hidden-md-up': typeof className !== 'undefined'
    });

    return (
      <div className={viewAllClass}>
        {handleClickSubmit && submitText && token && !showForm ?
          <button
            className="btn btn-primary-outline btn-sm btn-block"
            onClick={handleClickSubmit}
            type="button"
          >{submitText}</button>
        : null}
        {!token ?
          <div className="alert alert-warning">{`Sign in to ${submitText.toLowerCase()}!`}</div>
        : null}
        {dataLength > 0 ?
          <Link
            className="btn btn-secondary btn-sm btn-block"
            to={viewAllPath}
          >View more</Link>
        : null}
      </div>
    );
  }
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

export default connect(mapStateToProps)(ViewAll);
