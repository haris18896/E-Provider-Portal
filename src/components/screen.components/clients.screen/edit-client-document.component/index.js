/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Check, ChevronDown, FileText, UploadCloud } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Col, ListGroup, ListGroupItem } from 'reactstrap'
import {
  getAllClientDocumentsAction,
  registerClientDocumentsAction
} from '../../../../redux/client/clientAction'
import CustomSpinner from '../../../spinner/Spinner'
import DataTable from 'react-data-table-component'
import { columns } from './table.data'
import { useParams } from 'react-router-dom'
import FileUploaderMultiple from '../../../../components/fileUploader/FileUploaderMultiple'

function EditClientDocument() {
  const params = useParams()
  const { id } = params
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const {
    getAllClientDocumentsData,
    getAllClientDocumentsLoading,
    registerDocumentLoading
  } = useSelector((state) => state.client)
  const rows = getAllClientDocumentsData?.result

  useEffect(() => {
    dispatch(getAllClientDocumentsAction({ id }))
  }, [])
  const handleSubmit = () => {
    const document = new FormData()
    {
      files.map((file) => document.append('file', file))
    }
    //  const data = new FormData()
    document.append('client', id)
    //  data.append('document', document)
    // const data = {
    //   client: id,
    //   document
    // }
    dispatch(
      registerClientDocumentsAction({
        data: document,
        id,
        callback: () => setFiles([])
      })
    )
  }
  return (
    <>
      {getAllClientDocumentsLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <div className="react-dataTable">
            <DataTable
              data={rows}
              pointerOnHover
              highlightOnHover
              theme="solarized"
              columns={columns}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
            />
          </div>
          <Col lg="8">
            <div className="completed-document mt-4 fw-800 black">
              Other Files
            </div>
            <div className=" uploader-margin">
              <FileUploaderMultiple
                client={true}
                files={files}
                setFiles={setFiles}
                loading={registerDocumentLoading}
                submit={handleSubmit}
              />
            </div>
          </Col>
        </>
      )}
    </>
  )
}

export default EditClientDocument
