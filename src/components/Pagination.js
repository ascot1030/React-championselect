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

const PAGINATION_LINK_COUNT = 5;

class Pagination extends Component {
  render () {
    const {
      activePage,
      baseUrl,
      limit,
      itemCount
    } = this.props;

    let pages = [];
    let basePageCount = activePage > Math.floor(PAGINATION_LINK_COUNT / 2) ? activePage - Math.floor(PAGINATION_LINK_COUNT / 2) : 1;

    for (let i = 0; i < PAGINATION_LINK_COUNT; i++) {
      const isDisabled = !!(pageCount >= Math.floor(itemCount / limit));
      const pageCount = basePageCount + i;
      const pageItemClass = classNames({
        'page-item': true,
        'active': pageCount === activePage,
        'disabled': isDisabled
      });

      const pageItemElement = isDisabled ?
        null
      : (
        <Link
          className="page-link"
          to={{
            pathname: baseUrl,
            query: {
              page: pageCount
            }
          }}
          key={pageCount}
        >{pageCount}</Link>
      );

      const page = (
        <li className={pageItemClass}>
          {pageItemElement}
        </li>
      );

      pages.push(page);
    }

    const previousPageCount = activePage > 1 ? activePage - 1 : 1;
    const nextPageCount = activePage >= Math.floor(itemCount / limit) ? activePage : activePage + 1;

    return (
      <nav
        className="text-xs-center"
        aria-label="Page navigation"
      >
        <ul className="pagination">
          <li className="page-item">
            <Link
              className="page-link"
              aria-label="Previous"
              to={{
                pathname: baseUrl,
                query: {
                  page: previousPageCount
                }
              }}
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </Link>
          </li>
          {pages}
          <li className="page-item">
            <Link
              className="page-link"
              aria-label="Next"
              to={{
                pathname: baseUrl,
                query: {
                  page: nextPageCount
                }
              }}
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

function mapStateToProps (state) {
}

export default connect(mapStateToProps)(Pagination);
