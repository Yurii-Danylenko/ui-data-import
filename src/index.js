import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { stripesShape } from '@folio/stripes/core';

import {
  Home,
  Results,
  JobProfile,
} from './routes';
import { DataImportSettings } from './settings';
import { UploadingJobsContextProvider } from './components';

class DataImport extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    showSettings: PropTypes.bool,
  };

  static defaultProps = { showSettings: false };

  constructor(props) {
    super(props);

    const { stripes } = this.props;

    this.connectedHome = stripes.connect(Home);
  }

  // wire up home page with stripes
  renderConnectedHome = () => {
    return <this.connectedHome {...this.props} />;
  };

  render() {
    const {
      showSettings,
      match: { path },
    } = this.props;

    if (showSettings) {
      return <DataImportSettings {...this.props} />;
    }

    return (
      <UploadingJobsContextProvider>
        <Switch>
          <Route
            path={path}
            exact
            render={this.renderConnectedHome}
          />
          <Route
            path={`${path}/results`}
            exact
            component={Results}
          />
          <Route
            path={`${path}/job-profile`}
            exact
            component={JobProfile}
          />
        </Switch>
      </UploadingJobsContextProvider>
    );
  }
}

export default DataImport;
