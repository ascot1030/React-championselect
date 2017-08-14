import Ad from 'react-google-publisher-tag';
import Fuse from 'fuse.js';
import React from 'react';
import changeCase from 'change-case';

import map from 'lodash/map';
import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';
import values from 'lodash/values';

import ChampionsGrid from '../components/ChampionsGrid';
import Loader from '../components/Loader';

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
  adDimensions
} from '../constants/ads';

import {
  cleanChampionKey
} from '../utils/index';

class ChampionHome extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    champions: PropTypes.object.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);

    this.state = {
      query: '',
      suggestions: []
    };
  }

  componentWillMount () {
    const {
      dispatch,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const championKey = cleanChampionKey(_championKey);
  }

  componentWillReceiveProps (nextProps) {
    const {
      dispatch,
      params: {
        championKey: _championKey
      }
    } = this.props;

    const {
      params: {
        championKey: _nextChampionKey
      }
    } = nextProps;

    const championKey = cleanChampionKey(_championKey);
    const nextChampionKey = cleanChampionKey(_nextChampionKey);
  }

  render () {
    const {
      children,
      champions,
      isFetchingChampions,
      params: {
        championKey: _championKey
      },
    } = this.props;

    const {
      query,
      suggestions
    } = this.state;

    const championKey = cleanChampionKey(_championKey);

    let championsData = null;

    if (!isFetchingChampions && champions)
      championsData = champions.data;

    if (suggestions.length > 0)
      championsData = suggestions;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3>All Champions</h3>
            <input
              className="form-control"
              onChange={this.handleChange}
              placeholder="Search for a Champion"
              type="text"
              value={query}
            />
            <hr />
            {!isFetchingChampions && champions ?
              <ChampionsGrid
                championsMap={champions.data}
                champions={map(championsData, (v, k) => {
                  v.key = v.id;
                  return v;
                })}
                colClass="col-xs-3 col-sm-2 col-lg-1"
              /> : <Loader />
            }
          </div>
        </div>
      </div>
    );
  }

  handleChange = e => {
    const {
      champions,
      isFetchingChampions
    } = this.props;

    if (!isFetchingChampions && champions) {
      const query = e.target.value;

      const options = {
        keys: ['name'],
        threshold: 0.1
      };

      const championsData = values(champions.data);
      const fuse = new Fuse(championsData, options);
      const suggestions = fuse.search(query);

      this.setState({
        query,
        suggestions
      });
  };
}


    }

function mapStateToProps (state) {
  const {
    riot: {
      champions: {
        data: championsData,
        isFetching: isFetchingChampions
      }
    }
  } = state;

  return {
    champions: championsData,
    isFetchingChampions
  };
}

export default connect(mapStateToProps)(ChampionHome);
