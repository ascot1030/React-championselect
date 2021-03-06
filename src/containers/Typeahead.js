// TODO: comment and document

import Fuse from 'fuse.js';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import values from 'lodash/values';

import {
  RIOT_SPRITES_URL
} from '../constants/urls';

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
  push
} from 'react-router-redux';

class Typeahead extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   champions: PropTypes.object.isRequired,
  //   isFetchingChampions: PropTypes.bool.isRequired,
  // };

  static defaultProps = {
    // ref attribute for typeahead's input
    ref: 'input'
  };

  constructor (props) {
    super(props);

    this.state = {
      areSuggestionsVisible: false,
      didClickSuggestions: false,
      query: '',
      suggestions: null,
      selection: 0
    };
  }

  componentDidMount () {
    // Focus the search input on render.
    // ReactDOM.findDOMNode(this.refs[this.props.ref]).focus()
  }

  render () {
    const {
      inputGroupClass,
      placeholder,
      ref
    } = this.props;

    return (
      <div
        className="cs-typeahead"
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      >
        <div className={inputGroupClass}>
          <input
            className="form-control"
            onChange={this.handleChange}
            onKeyDown={this.handleInputKeyDown}
            placeholder={placeholder}
            ref={this.props.ref}
            type="text"
            value={this.state.query}
          />
          {this.renderSuggestions()}
          <span className="input-group-btn">
            <button
              className="btn btn-primary-outline"
              type="button"
            >
              <i className="fa fa-fw fa-search"></i>
            </button>
          </span>
        </div>
      </div>
    );
  }

  renderSuggestions = () => {
    const {
      constructLink
    } = this.props;

    const {
      selection,
      suggestions
    } = this.state;

    if (suggestions) {
      return (
        <div
          className="list-group"
          onClick={this.handleSuggestionsClick}
          onMouseDown={this.handleSuggestionsMouseDown}
          onMouseUp={this.handleSuggestionsMouseUp}
        >
          {suggestions.map(champion => {
            if (this.state.areSuggestionsVisible) {
              const listGroupItemClass = classNames({
                'list-group-item': true,
                'media': true,
                'active': suggestions[selection] == champion
              });

              const image = champion.image;

              const spriteStyle = {
                backgroundImage: `url(${RIOT_SPRITES_URL}/${image.sprite})`,

                // TODO: abstract
                // icons will be shrunk to 2/3 of their original size
                backgroundPosition: `-${image.x / 1.5}px -${image.y / 1.5}px`
              };

              return (
                <Link
                  className={listGroupItemClass}
                  key={champion.id.toLowerCase()}
                  to={constructLink(champion.id)}
                >
                  <div className="media-left media-middle">
                    <div
                      className="media-object"
                      style={spriteStyle}
                    >
                    </div>
                  </div>
                  <div className="media-body">
                    <h6 className="media-heading">{champion.name}</h6>
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>
      );
    }
  }

  handleBlur = e => {
    this.setState({
      areSuggestionsVisible: this.state.didClickSuggestions
    });
  };

  handleChange = e => {
    const {
      champions,
      isFetchingChampions
    } = this.props;

    if (!isFetchingChampions && champions) {
      const query = e.target.value;
      const areSuggestionsVisible = query.length > 0 ? true : false;

      const options = {
        keys: ['name'],
        threshold: 0.1
      };

      const championsData = values(champions.data);
      const fuse = new Fuse(championsData, options);
      const suggestions = fuse.search(query);

      this.setState({
        areSuggestionsVisible,
        // TODO: cleanup
        selection: 0,
        suggestions,
        query
      });
    }

  };

  handleFocus = e => {
    this.setState({
      areSuggestionsVisible: true
    });
  };

  handleInputKeyDown = e => {
    const {
      constructLink,
      dispatch
    } = this.props;

    const {
      query,
      suggestions,
      selection
    } = this.state;

    if (e.key === 'Tab' && query.length > 0) {
      e.preventDefault();
    }

    if (suggestions && suggestions.length > 0) {
      const selected = suggestions[selection];

      if (e.key === 'Tab') {
        this.setState({
          query: selected.name
        });
      }

      if (e.key == 'Enter') {
        browserHistory.push(constructLink(selected.id));

        this.setState({
          query: '',
          areSuggestionsVisible: false,
          suggestions: []
        });
      }
    }
  };

  handleSuggestionsClick = e => {
    this.setState({
      areSuggestionsVisible: false,
      selection: 0,
      query: ''
    });
  };

  handleSuggestionsMouseDown = e => {
    this.setState({
      didClickSuggestions: true
    });
  };

  handleSuggestionsMouseUp = e => {
    this.setState({
      didClickSuggestions: false
    });
  };
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

export default connect(mapStateToProps)(Typeahead);
