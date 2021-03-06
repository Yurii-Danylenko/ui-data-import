import PropTypes from 'prop-types';

export const jobLogPropTypes = PropTypes.shape({
  fileName: PropTypes.string.isRequired,
  jobProfileName: PropTypes.string.isRequired,
  jobExecutionHrId: PropTypes.string.isRequired,
  completedDate: PropTypes.string.isRequired,
  runBy: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
  }).isRequired,
});
