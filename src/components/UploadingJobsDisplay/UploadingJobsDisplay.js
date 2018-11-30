import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import FileItem from './components/FileItem';
import {
  createFileDefinition, // eslint-disable-line
  prepareFilesToUpload, // eslint-disable-line
  uploadFiles,
} from './utils/upload';

class UploadingJobsDisplay extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    files: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    const {
      url: host,
    } = props.stripes.okapi;

    this.state = {
      files: this.mapFilesFromProps(),
    };

    this.fileDefinitionUrl = `${host}/data-import/upload/definition`;
    this.fileUploaderUrl = `${host}/data-import/upload/file`;
  }

  componentDidMount() {
    this.uploadJobs();
  }

  async uploadJobs() {
    const { files } = this.state;

    const { fileDefinitions } = await createFileDefinition(
      files,
      this.fileDefinitionUrl,
      this.createJobFilesDefinitionHeaders()
    );

    const preparedFiles = prepareFilesToUpload(files, fileDefinitions);

    this.setState({ files: preparedFiles }, () => {
      uploadFiles(
        this.state.files,
        this.fileUploaderUrl,
        this.createUploadJobFilesHeaders(),
        this.onFileUploadProgress,
        this.onFileUploadSuccess,
        this.onFileUploadFail,
      );
    });
  }

  createJobFilesDefinitionHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'Content-Type': 'application/json',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
  }

  createUploadJobFilesHeaders() {
    const {
      token,
      tenant,
    } = this.props.stripes.okapi;

    return {
      'Content-Type': 'application/octet-stream',
      'X-Okapi-Tenant': tenant,
      'X-Okapi-Token': token,
    };
  }

  mapFilesFromProps() {
    return this.props.files.reduce((result, currentFile) => {
      const keyNameValue = currentFile.name + currentFile.lastModified;

      currentFile.keyName = keyNameValue;
      currentFile.currentUploaded = 0;
      result[keyNameValue] = currentFile;

      return result;
    }, {});
  }

  updateFileState(file, data) {
    this.setState(state => {
      const updatedFile = Object.assign(state.files[file.keyName], data);

      return {
        files: {
          ...state.files,
          [file.keyName]: updatedFile,
        },
      };
    });
  }

  onFileUploadProgress = (file, event) => {
    this.updateFileState(file, { uploadedValue: event.loaded });
  };

  onFileUploadSuccess = ({ file }) => {
    this.updateFileState(file, { uploadStatus: 'success' });
  };

  onFileUploadFail = ({ file }) => {
    this.updateFileState(file, { uploadStatus: 'failed' });
  };

  renderFiles() {
    const { files } = this.state;

    if (!files) {
      return null;
    }

    return Object.keys(files)
      .map(key => {
        const {
          name,
          size,
          uploadedValue,
          uploadStatus,
        } = files[key];

        return (
          <FileItem
            key={key}
            name={name}
            size={size}
            uploadedValue={uploadedValue}
            uploadStatus={uploadStatus}
          />
        );
      });
  }

  render() {
    return (
      <div>
        {this.renderFiles()}
      </div>
    );
  }
}

export default withStripes(UploadingJobsDisplay);