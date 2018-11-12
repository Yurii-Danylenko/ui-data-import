import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Icon,
} from '@folio/stripes/components';

import compose from '../../utils/compose';
import withJobLogsCellsFormatter from './withJobLogsCellsFormatter';
import withJobLogsSort from './withJobLogsSort';

class JobLogs extends Component {
  static propTypes = {
    sortField: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    formatter: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    contentData: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        jobProfileName: PropTypes.string,
        jobExecutionHrId: PropTypes.string,
        completedDate: PropTypes.string,
        runBy: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      }),
    ),
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    contentData: [],
  };

  constructor(props) {
    super(props);

    this.columnMapping = {
      fileName: <FormattedMessage id="ui-data-import.jobFileName" />,
      jobProfileName: <FormattedMessage id="ui-data-import.jobProfileName" />,
      jobExecutionHrId: <FormattedMessage id="ui-data-import.jobExecutionHrId" />,
      completedDate: <FormattedMessage id="ui-data-import.jobCompletedDate" />,
      runBy: <FormattedMessage id="ui-data-import.jobRunBy" />,
    };

    this.visibleColumns = [
      'fileName',
      'jobProfileName',
      'jobExecutionHrId',
      'completedDate',
      'runBy',
    ];
  }

  render() {
    const {
      formatter,
      contentData,
      isLoading,
      sortDirection,
      sortField,
      onSort,
    } = this.props;

    if (isLoading) {
      return (
        <Icon
          icon="spinner-ellipsis"
          size="small"
        />
      );
    }

    return (
      <MultiColumnList
        contentData={contentData}
        columnMapping={this.columnMapping}
        visibleColumns={this.visibleColumns}
        formatter={formatter}
        sortOrder={this.columnMapping[sortField]}
        sortDirection={sortDirection}
        onHeaderClick={onSort}
      />
    );
  }
}

export default compose(withJobLogsCellsFormatter, withJobLogsSort)(JobLogs);