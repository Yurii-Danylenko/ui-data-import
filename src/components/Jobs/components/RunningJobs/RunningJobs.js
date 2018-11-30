import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import JobsList from '../JobsList';
import sortRunningJobs from './sortRunningJobs';
import { PARSING_IN_PROGRESS } from '../../jobStatuses';
import { DataFetcherContext } from '../../../DataFetcher/DataFetcherContext';

class RunningJobs extends PureComponent {
  static contextType = DataFetcherContext;

  prepareJobsData() {
    const jobStatuses = [PARSING_IN_PROGRESS]; // TODO: could be changed on backend
    const jobs = get(this.context, ['jobs', 'itemsObject', 'jobExecutionDtos'], [])
      .filter(({ status }) => jobStatuses.includes(status));

    return sortRunningJobs(jobs);
  }

  render() {
    const hasLoaded = get(this.context, ['jobs', 'hasLoaded'], false);
    const jobs = this.prepareJobsData();

    return (
      <JobsList
        jobs={jobs}
        hasLoaded={hasLoaded}
        noJobsMessage={<FormattedMessage id="ui-data-import.noRunningJobsMessage" />}
      />
    );
  }
}

export default RunningJobs;