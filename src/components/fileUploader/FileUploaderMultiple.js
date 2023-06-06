/* eslint-disable no-unused-vars */
// ** React Imports
import React, { Fragment } from 'react'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import { Icon } from '@iconify/react'

const FileUploaderMultiple = ({
  client,
  loading,
  submit,
  files,
  setFiles,
  ...rest
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))])
    }
  })

  const renderFilePreview = (file) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      )
    } else {
      return <FileText size="28" />
    }
  }

  const handleRemoveFile = (file) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i) => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        disabled={loading}
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Card>
      <CardHeader>
        {!client && <CardTitle tag="h4">Upload Files</CardTitle>}
      </CardHeader>
      <CardBody className="imageUploader white-border mb-2 mx-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className="d-flex align-items-center justify-content-center flex-column">
            <DownloadCloud size={64} />
            <>
              {client ? (
                <p className="text-secondary text-center">
                  <span className="text-success">
                    <strong>Drag and drop your files here</strong>
                  </span>
                  <br />
                  or <span className="team-link">browse</span> for a file to
                  upload
                  <p>
                    only PDF, JPG, PNG, MP3, M4A, DOC & CSV files | max file
                    size of 10mb
                  </p>
                </p>
              ) : (
                <>
                  <h5>Drop Files here or click to upload</h5>
                  <p className="text-secondary text-center">
                    Drop files here or click{' '}
                    <a
                      href="/"
                      className={'link'}
                      onClick={(e) => e.preventDefault()}
                    >
                      browse
                    </a>{' '}
                    thorough your machine
                  </p>
                </>
              )}
            </>
          </div>
        </div>
        {files.length ? (
          <Fragment>
            <ListGroup className="my-2">{fileList}</ListGroup>
            <div className="d-flex justify-content-end align-items-center">
              <Button
                disabled={loading}
                className="pd-s remove-uploader-images"
                color="danger"
                onClick={handleRemoveAllFiles}
              >
                Remove All
              </Button>
              <Button
                disabled={loading}
                className="pd-s ml-1 button-success"
                // color={'success'}
                onClick={() => submit()}
              >
                {loading ? (
                  <Icon icon="eos-icons:loading" width="16" height="16" />
                ) : (
                  <Icon
                    icon={'material-symbols:check-small-rounded'}
                    width="16"
                    height="16"
                  />
                )}
                <span className={'px-1'}>Save</span>
              </Button>
            </div>
          </Fragment>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default FileUploaderMultiple
