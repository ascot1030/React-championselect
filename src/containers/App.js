import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  fetchChampionsIfNeeded
} from '../actions/riot';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount () {
    const {
      dispatch
    } = this.props;

    dispatch(fetchChampionsIfNeeded());
  }

  render () {
    const {
      children
    } = this.props;

    return (
      <div className="container">
        <Header />
          {children}
        <Footer />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
  };
}

export default connect(mapStateToProps)(App);
