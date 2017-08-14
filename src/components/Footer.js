import React from 'react';

import {
  Component
} from 'react';

import {
  connect
} from 'react-redux';

class Footer extends Component {
  render () {
    return (
      <div className="cs-footer">
        <hr />
        <div className="row">
          <div className="col-md-3">
            <h4>solomid.net</h4>
            <p><small>Copyright © 2011-2016 SoloMid Network</small></p>
          </div>
          <div className="col-md-3">
            <ul className="cs-footer-links list-unstyled">
              <li>
                <a
                  href="http://solomid.net/info/tos"
                  target="_blank"
                >Terms of Service</a>
              </li>
              <li>
                <a
                  href="http://solomid.net/info/privacy"
                  target="_blank"
                >Privacy Policy</a>
              </li>
              <li>
                <a
                  href="http://solomid.net/info/contact"
                  target="_blank"
                >Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <ul className="cs-footer-social list-unstyled list-inline">
              <li className="list-inline-item">
                <a
                  href="http://facebook.com/SoloMidDotNet"
                  target="_blank"
                >
                  <i className="fa fa-2x fa-facebook"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="http://youtube.com/user/SolomidDOTNet"
                  target="_blank"
                >
                  <i className="fa fa-2x fa-youtube-play"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="http://twitter.com/teamsolomid"
                  target="_blank"
                >
                  <i className="fa fa-2x fa-twitter"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state, ownProps) {
  const {
    params
  } = ownProps;

  return {
    router: ownProps
  };
}

export default connect(mapStateToProps)(Footer);
