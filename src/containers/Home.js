import Ad from 'react-google-publisher-tag';
import React from 'react';

import take from 'lodash/take';
import uniqBy from 'lodash/uniqBy';

import ChampionsGrid from '../components/ChampionsGrid';
import CommentsList from '../components/CommentsList';
import CounterTipsList from '../components/CounterTipsList';
import Loader from '../components/Loader';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import {
  addChildComment,
  fetchCommentsIfNeeded,
  fetchMostPopularChampionsIfNeeded
} from '../actions/all';

import {
  fetchHomeCounterTipsIfNeeded
} from '../actions/api';

import {
  adDimensions
} from '../constants/ads';

import {
  prepareAds
} from '../utils/index';

class Home extends Component {
  static defaultProps = {
    ads: [
      'div-gpt-ad-1468534690919-8',
      'div-gpt-ad-1468534690919-9'
    ]
  };

  static propTypes = {
    champions: PropTypes.object.isRequired,
    comments: PropTypes.object.isRequired,
    counterTips: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    isFetchingChampions: PropTypes.bool.isRequired,
    isFetchingComments: PropTypes.bool.isRequired,
    isFetchingCounterTips: PropTypes.bool.isRequired
  };

  componentWillMount () {
    const {
      ads,
      dispatch
    } = this.props;

    prepareAds(ads);

    dispatch(fetchCommentsIfNeeded({
      orderBy: 'date',
      order: -1
    }));

    dispatch(fetchHomeCounterTipsIfNeeded({
      orderBy: 'date',
      order: -1
    }));

    dispatch(fetchMostPopularChampionsIfNeeded());
  };

  componentWillUnmount () {
    $('.cs-ad-side').remove();
  }

  render () {
    const {
      ads,
      comments,
      champions,
      counterTips,
      mostPopularChampions,
      isFetchingChampions,
      isFetchingComments,
      isFetchingCounterTips,
      isFetchingMostPopularChampions
    } = this.props;

    return (
      // NOTE: testing
      // <div onScroll={this.onScroll} style={{overflowY: 'scroll', outline: '1px solid red', height: '90%'}}>
      <div>
        <div
          className="cs-ad cs-ad-side cs-ad-side-left"
          id={ads[0]}
        ></div>
        <div
          className="cs-ad cs-ad-side cs-ad-side-right"
          id={ads[1]}
        ></div>
        {/* <Ad */}
        {/*   className="cs-ad-outline" */}
        {/*   dimensions={adDimensions.LEFT_SIDEBAR} */}
        {/*   path={'/22280732/ChampionSelect_336x768_ROS_Skin_Left'} */}
        {/* /> */}
        {/* <Ad */}
        {/*   className="cs-ad cs-ad-side-right cs-ad-outline" */}
        {/*   dimensions={adDimensions.RIGHT_SIDEBAR} */}
        {/*   path={'/22280732/ChampionSelect_336x768_ROS_Skin_Right'} */}
        {/* /> */}
        <Ad
          className="cs-ad cs-ad-top"
          dimensions={adDimensions.BEFORE_RECT}
          path={'/22280732/ChampionSelect_728x90_HP_BTF1'}
        />
        <div className="cs-home row">
          <div className="col-lg-8">
            <h3>Popular Champions</h3>
            <p className="hidden-xs-down">Find counterpicks, general counters, lane synergy and more! Here are a few of the most popular picks:</p>
            <hr className="m-b-2" />
            {!isFetchingChampions && champions && !isFetchingMostPopularChampions && mostPopularChampions ?
              <ChampionsGrid
                championsMap={champions.data}
                champions={take(uniqBy(mostPopularChampions.data, 'key'), 36)}
              /> : <Loader /> } </div>
          <div className="cs-home-counter-tips col-lg-4">
            <hr className="hidden-lg-up m-b-2" />
            <Ad
              className="cs-ad cs-ad-right"
              dimensions={adDimensions.BEFORE_SQUARE}
              path={'/22280732/ChampionSelect_300x250_HP_BTF1'}
            />
            <h4>Recent Counter Tips</h4>
            {!isFetchingChampions && champions && !isFetchingCounterTips && counterTips ?
              <CounterTipsList
                championsMap={champions.data}
                counterTips={take(counterTips.data, 5)}
              /> : <Loader />
            }
          </div>
          <div className="col-xs-12">
            <Ad
              className="cs-ad cs-ad-middle"
              dimensions={adDimensions.AFTER_RECT}
              path={'/22280732/ChampionSelect_728x90_HP_ATF1'}
            />
            <hr className="m-b-2" />
            <h4>Recent Comments</h4>
            {!isFetchingChampions && champions && !isFetchingComments && comments ?
              <CommentsList
                championsMap={champions.data}
                comments={take(comments.data, 10)}
                commentsClass="cs-comment cs-comment-lg"
              /> : <Loader />
            }
          </div>
        </div>
        <Ad
          className="cs-ad cs-ad-bottom"
          dimensions={adDimensions.AFTER_SQUARE}
          path={'/22280732/ChampionSelect_300x250_HP_ATF1'}
        />
      </div>
    );
  }

  onScroll = () => {
    // fetchNextComments();
  };
}

function mapStateToProps (state) {
  const {
    all: {
      comments: {
        data: commentsData,
        isFetching: isFetchingComments
      },
      mostPopularChampions: {
        data: mostPopularChampionsData,
        isFetching: isFetchingMostPopularChampions
      }
    },
    api: {
      homeCounterTips: {
        data: counterTipsData,
        isFetching: isFetchingCounterTips
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
    comments: commentsData,
    counterTips: counterTipsData,
    champions: championsData,
    mostPopularChampions: mostPopularChampionsData,
    isFetchingChampions,
    isFetchingComments,
    isFetchingCounterTips,
    isFetchingMostPopularChampions
  };
}

export default connect(mapStateToProps)(Home);
