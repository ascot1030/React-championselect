import React from 'react';
import qs from 'querystring';

import Modal from './Modal';
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
  setUser,
  signIn,
  signOut,
  signUp
} from '../actions/auth';

const MAX_LENGTH = 20;
const MIN_LENGTH = 3;
const MIN_LENGTH_PASSWORD = 6;

class Header extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    token: PropTypes.string,
    username: PropTypes.string
  }
  static defaultProps = {
    signInId: 'sign-in',
    signUpId: 'sign-up'
  };

  componentDidUpdate (prevProps) {
    const {
      token,
      signInId,
      signUpId
    } = this.props;

    const {
      token: oldToken
    } = prevProps;

    // Logged in
    if (!oldToken && token) {
      $(`#${signInId}`).modal('hide');
      $(`#${signUpId}`).modal('hide');

      this.setState({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
      });
    }
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

      if (localToken && localUsername && localUserId) dispatch(setUser(localToken, localUsername, localUserId));
    }
  }

  constructor (props) {
    super(props);

    const {
      token,
      username
    } = props;

    this.state = {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
      passwordMessage: null
    };
  }

  render () {
    const {
      signInId,
      signUpId,
    } = this.props;

    return (
      <header className="cs-header">
        {this.renderModals()}
        <nav className="cs-nav navbar navbar-full navbar-light bg-faded">
          <div className="row">
            <div className="col-lg-6 col-xs-12">
              <Link
                className="navbar-brand"
                to="/"
              >
                <h4>
                  <img src="https://s3.amazonaws.com/solomid-resources/championselect/CS.png" />
                  ChampionSelect
                </h4>
              </Link>
              <ul className="cs-nav-links nav navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/champions"
                  >All Champions</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 col-xs-12">
              <div className="row">
                <div className="col-xs-4">
                  {this.renderLinks()}
                </div>
                <div className="col-lg-8 col-xs-12">
                  <Typeahead
                    constructLink={(id) => `/champions/${id.toLowerCase()}`}
                    inputGroupClass="input-group"
                    placeholder={"Search for a Champion"}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <nav
          className="cs-nav-lg-down navbar navbar-full navbar-light bg-faded hidden-lg-up"
        >
          {this.renderLinks('nav navbar-nav')}
        </nav>
      </header>
    );
  }

  renderModals = () => {
    const {
      signInId,
      signUpId,
      errorSignIn,
      errorSignUp
    } = this.props;

    const {
      email,
      password,
      username,
      confirmPassword,
      passwordMessage
    } = this.state;

    return (
      <div>
        <form onSubmit={this.signIn}>
          <Modal
            id={signInId}
            text="Log in with your SoloMid account"
          >
            {errorSignIn ? <div className="alert alert-warning">{errorSignIn.message}</div> : null}
            <fieldset className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                onChange={this.handleEmailChange}
                placeholder="Email"
                required
                type="email"
                value={email}
              />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                onChange={this.handlePasswordChange}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </fieldset>
            <Link
              className="pull-xs-right"
              onClick={e => {
                $(`#${signInId}`).modal('hide');
              }}
              to="/forgot"
            ><small>Forgot password?</small></Link>
          </Modal>
        </form>
        <form onSubmit={this.signUp}>
          <Modal
            id={signUpId}
            text="Sign up for a SoloMid account"
          >
            {errorSignUp ? <div className="alert alert-warning">{errorSignUp.message}</div> : null}
            <fieldset className="form-group">
              <label htmlFor="email">Username</label>
              <input
                className="form-control"
                id="username"
                onChange={this.handleUsernameChange}
                pattern={`.{${MIN_LENGTH},${MAX_LENGTH}}`}
                placeholder="Username"
                required
                title={`Username length must be ${MIN_LENGTH} to ${MAX_LENGTH} characters`}
                type="text"
                value={username}
              />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                placeholder="Email"
                onChange={this.handleEmailChange}
                required
                type="email"
                value={email}
              />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                onChange={this.handlePasswordChange}
                pattern={`.{${MIN_LENGTH_PASSWORD},${MAX_LENGTH}}`}
                placeholder="Password"
                required
                title={`Password length must be ${MIN_LENGTH_PASSWORD} to ${MAX_LENGTH} characters`}
                type="password"
                value={password}
              />
            </fieldset>
            <fieldset className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                className="form-control"
                id="confirmPassword"
                pattern="*"
                onChange={this.handleConfirmPasswordChange}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />
              {passwordMessage ?<small className="text-warning">{passwordMessage}</small> : null}
            </fieldset>
          </Modal>
        </form>
      </div>
    );
  };

  renderLinks = (classes = 'cs-nav-links nav navbar-nav') => {
    const {
      signInId,
      signUpId,
      token,
      username
    } = this.props;

    if (token && username) {
      return (
        <ul className={`${classes}`}>
          <li className="nav-item">
            <a
              className="nav-link active"
              href="javascript:;"
            >{username}</a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="javascript:;"
              onClick={this.signOut}
            >Log out</a>
          </li>
        </ul>
      );
    }

    return (
      <ul className={`${classes}`}>
        <li className="nav-item hidden-lg-up">
          <Link
            className="nav-link"
            to="/champions"
          >
            All Champions
          </Link>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="modal"
            data-target={`#${signUpId}`}
            href="javascript:;"
          >
            Sign up
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="modal"
            data-target={`#${signInId}`}
            href="javascript:;"
          >
            Log in
          </a>
        </li>
      </ul>
    );
  };

  signUp = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      email,
      password,
      username,
      confirmPassword,
    } = this.state;

    if (password === confirmPassword) {
      dispatch(signUp(email, password, username));
      this.setState({passwordMessage: null})
    } else {
      this.setState({passwordMessage: 'Passwords must match.'})
    }

    return false;
  };

  signIn = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      email,
      password
    } = this.state;

    dispatch(signIn(email, password));

    return false;
  };

  signOut = e => {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    dispatch(signOut());
  };

  handleEmailChange = e => {
    const email = e.target.value;

    this.setState({
      email
    });
  };

  handlePasswordChange = e => {
    const password = e.target.value;

    this.setState({
      password
    });
  };

  handleUsernameChange = e => {
    const username = e.target.value;

    this.setState({
      username
    });
  };

  handleConfirmPasswordChange = e => {
    const confirmPassword = e.target.value;

    this.setState({
      confirmPassword
    });
  };
}

function mapStateToProps (state) {
  const {
    auth: {
      isPendingSignIn,
      isPendingSignUp,
      token,
      username,
      userId,
      errorSignIn,
      errorSignUp
    }
  } = state;

  return {
    isPendingSignIn,
    isPendingSignUp,
    token,
    username,
    userId,
    errorSignIn,
    errorSignUp
  };
}

export default connect(mapStateToProps)(Header);
