import React from 'react';
import find from 'lodash/find';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

import Loader from '../components/Loader';
import TabsNav from '../components/TabsNav';

// TODO: save UI state through Redux
class TabsContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);

    const {
      tabs
    } = props;

    // Set the first tab as the active tab during initialization.
    const activeTabId = tabs[0] ? tabs[0].id : null;

    this.state = {
      activeTabId
    };
  }

  render () {
    const {
      activeTabId
    } = this.state;

    const {
      markups,
      tabs
    } = this.props;

    return (
      <div className="cs-tabs-container">
        <TabsNav
          activeTabId={activeTabId}
          handleClick={activeTabId => this.setState({activeTabId})}
          tabs={tabs}
        />
        {find(markups, markup => activeTabId === markup.id).markup}
      </div>
    );
  }
}


export default TabsContainer;
