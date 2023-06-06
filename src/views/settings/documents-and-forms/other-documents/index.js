/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react'
// third party
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Icon } from '@iconify/react'
import { ChevronDown, FileText } from 'react-feather'
import { Button, Card, CardBody, Col } from 'reactstrap'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'
import CustomSpinner from '../../../../components/spinner/Spinner'
// components
import Head from '@customComponents/head'
import { columns } from './table.data'
import FormGroupElement from '@FormGroupElement'
// import Pagination from '@src/components/pagination/Pagination'
// import FileUploaderSingle from '@src/components/fileUploader/FileUploaderSingle'
// import { DocumentTable } from '@ScreenComponent/settings.component/document/table/table-other-documents'
import FileUploaderMultiple from '../../../../components/fileUploader/FileUploaderMultiple'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllOtherDocumentsAction,
  handleLimitChange,
  handlePageChange,
  registerOtherDocumentsAction
} from '../../../../redux/setting/documents-and-forms/other-documents/otherDocumentsAction'
import CustomPagination from '../../../../components/pagination/ReactPagination'

const CustomCol = ({ children, md = 6, sm = 12, lg = 3 }) => {
  return (
    <Col sm={sm} md={md} lg={lg}>
      {children}
    </Col>
  )
}
const demoData = [
  {
    title: 'Hello World'
  },
  {
    title: 'Hello World'
  },
  {
    title: 'Hello World'
  },
  {
    title: 'Hello World'
  }
]

const SettingOtherDocuments = () => {
  const SUPPORTED_FORMATS = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  const dispatch = useDispatch()

  const { loading, getAllOtherDocuments, getLoading } = useSelector(
    (state) => state.otherDocuments
  )

  // const [PageSize, setPagesize] = useState(10)
  const [currentPage, setPage] = useState(0)

  // const [currentPage, setCurrentPage] = useState(1)
  const [files, setFiles] = useState([])
  const rows = getAllOtherDocuments?.data
  const offset = getAllOtherDocuments?.offset
  const limit = getAllOtherDocuments?.limit
  const count = getAllOtherDocuments?.total

  useEffect(() => {
    dispatch(getAllOtherDocumentsAction({ offset, limit }))
  }, [])

  const documentSchema = Yup.object().shape({
    image: Yup.mixed()
      .test('fileSize', 'File size is too large!', (value) => {
        if (value) {
          return value.size < 2 * 1024 * 1024
        }
        return true
      })
      .test('fileFormat', 'File format is not supported!', (value) => {
        if (value) {
          return SUPPORTED_FORMATS.includes(value.type)
        }
        return true
      })
  })

  const formik = useFormik({
    initialValues: {
      image: null
    },
    enableReinitialize: true,
    validationSchema: documentSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          image: values.image
        }
        // dispatch(handleOtherForm(data))
      }
    }
  })

  const handleSubmit = () => {
    const documents = new FormData()
    files.map((item) => documents.append('document', item))

    dispatch(
      registerOtherDocumentsAction({
        offset,
        limit,
        data: documents,
        callback: () => setFiles([])
      })
    )
  }
  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit
      })
    )
    setPage(0)
  }

  // ** Changing page
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({
        offset: newOffset === 0 ? 0 : newOffset,
        limit
      })
    )
    setPage(() => page.selected)
  }
  const ExpandableRowComponent = () => {
    return (
      <>
        <div className="py-1">
          {demoData.map((doc, i) => (
            <div key={i} className="documentFiles px-5 ">
              <div>
                <span className="me-1">
                  <FileText size={16} />
                </span>
                <span className="link me-1">{doc.title}</span>
                <span>
                  <Icon icon="fa6-solid:pen" width="15" height="15" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
  return (
    <div>
      <Card className="other-document">
        <Head>
          <div className="d-flex align-items-center justify-content-between bg-yellow px-3">
            <span className="heading-1">Other Documents</span>
            {/* <Col sm={1}>
              <FormGroupElement
                inputType="select"
                inputName="users"
                inputClassName="radius-25 skin-change pointer"
              >
                <option value="">All</option>
                <option value="Ethera">Ethera</option>
                <option value="Ethera-irvine">Ethera Irvine</option>
              </FormGroupElement>
            </Col> */}
          </div>
        </Head>
        <CardBody>
          <CustomCol md={6} lg={6}>
            <FileUploaderMultiple
              files={files}
              setFiles={setFiles}
              loading={loading}
              submit={handleSubmit}
            />
            {/* <div className="other-document--requiredText">
              <span>
                Max file size is 5MB, Total max size for all file is 200MB
              </span>
            </div>
            <Button className="button-white other-document--addFolder">
              <Icon
                className="me-1"
                icon="ant-design:plus-outlined"
                width="20"
                height="20"
              />
              <span>Add Folder</span>
            </Button> */}
          </CustomCol>
        </CardBody>

        <Col lg="12" className="tableSetting">
          {getLoading ? (
            <CustomSpinner />
          ) : !!rows?.length ? (
            <div className="react-dataTable">
              <DataTable
                // expandableRows
                // expandableRowsComponent={ExpandableRowComponent}
                pagination
                paginationServer
                rowsPerPage={limit}
                data={rows}
                pointerOnHover
                highlightOnHover
                theme="solarized"
                columns={columns}
                className="react-dataTable"
                paginationDefaultPage={currentPage}
                sortIcon={<ChevronDown size={10} />}
                paginationComponent={() =>
                  CustomPagination({
                    limit,
                    handleLimit,
                    currentPage,
                    count,
                    handlePagination,
                    position: true
                  })
                }
                // onRowClicked={(row) =>
                //   handleAppointmentModal(!open, row?.status, row?.id)
                // }
              />
            </div>
          ) : (
            <div
              className="react-dataTable d-flex align-items-center justify-content-center"
              style={{ minHeight: '20vh' }}
            >
              <div className="mb-1 d-flex flex-column align-items-center justify-content-center">
                <Icon
                  className="mb-1"
                  icon="material-symbols:search-rounded"
                  width="50"
                  height="50"
                />
                <h5>No result found </h5>
              </div>
            </div>
          )}
          {/* <DocumentTable
            columns={columns}
            rows={rows}
            PageSize={PageSize}
          />

          {rows.length > 10 && (
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={rows.length}
              pageSize={PageSize}
              setPagesize={setPagesize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )} */}
        </Col>
      </Card>
    </div>
  )
}

export default SettingOtherDocuments
