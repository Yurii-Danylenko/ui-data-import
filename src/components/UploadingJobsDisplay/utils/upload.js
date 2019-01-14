import { addHeaders } from '../../../utils/api';

const onFileReadError = (error) => {
  console.error(error); // eslint-disable-line no-console
};

export const prepareFilesToUpload = (files, fileDefinitions) => {
  const preparedFiles = Object.assign({}, files);

  fileDefinitions.forEach(definition => {
    const {
      name,
      id,
      uploadDefinitionId,
    } = definition;

    preparedFiles[name].id = id;
    preparedFiles[name].uploadDefinitionId = uploadDefinitionId;
  });

  return preparedFiles;
};

const prepareFilesDefinition = (filesToUpload) => {
  const resultFiles = Object
    .keys(filesToUpload)
    .reduce((files, currentKey) => files.concat({ name: currentKey }), []);

  return { fileDefinitions: resultFiles };
};

export const createFileDefinition = (files, url, headers) => {
  const filesDefinition = prepareFilesDefinition(files);
  const config = {
    method: 'POST',
    headers,
    body: JSON.stringify(filesDefinition),
  };

  return fetch(url, config)
    .then(res => res.json());
};

export const uploadFile = (file, url, headers, onprogress) => {
  return new Promise(async (resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr = addHeaders(
      xhr,
      headers,
    );

    try {
      xhr.upload.onprogress = onprogress.bind(null, file);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        const response = {
          status: xhr.status,
          statusText: xhr.statusText,
          body: xhr.response,
          file,
        };

        if (xhr.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.send(file);
    } catch (e) {
      onFileReadError(e);
    }
  });
};

export const uploadFiles = (
  files,
  url,
  headers,
  onXHRprogress,
  onXHRload,
  onXHRerror,
) => {
  const filesArr = Object.values(files);
  let promise = Promise.resolve();

  filesArr.forEach(file => {
    const queryParams = `?fileId=${file.id}&uploadDefinitionId=${file.uploadDefinitionId}`;
    const urlWithQueryParams = url + queryParams;

    promise = promise
      .then(() => uploadFile(file, urlWithQueryParams, headers, onXHRprogress))
      .then(onXHRload)
      .catch(onXHRerror);
  });
};

const processDeleteResponse = response => {
  const {
    status,
    statusText,
  } = response;

  if (status !== 204) {
    const error = {
      status,
      statusText,
    };

    throw new Error(error);
  }
};

export const deleteFile = (url, headers) => {
  const config = {
    method: 'DELETE',
    headers,
  };

  return fetch(url, config)
    .then(processDeleteResponse);
};
