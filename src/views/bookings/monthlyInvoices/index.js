import React, { useState, useEffect, useMemo } from 'react'
// Third Party
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Card, CardBody, Col, Row, Button } from 'reactstrap'
// Components
import { columns } from './table.data'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import CustomPagination from '../../../components/pagination/ReactPagination'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllBillingAction,
  handleLimitChange,
  handlePageChange
} from '../../../redux/booking/bookingAction'
import Spinner from '../../../components/spinner/Spinner'
// ** CSV Export
import { CSVLink } from 'react-csv'
import { billingObjText } from '../../../components/colors/BadgeColors'
import moment from 'moment'

const MonthlyInvoices = () => {
  const today = new Date()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentPage, setPage] = useState(0)
  // const [limit, setLimit] = useState(10)
  const { loading, getAllBillings } = useSelector((state) => state.booking)

  const rows = getAllBillings?.billingsList
  const offset = getAllBillings?.offset
  const limit = getAllBillings?.limit
  const count = getAllBillings?.total

  useEffect(() => {
    dispatch(getAllBillingAction({ offset, limit }))
  }, [])

  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        invoice: true
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
        limit,
        invoice: true
      })
    )
    setPage(() => page.selected)
  }

  // Export Data

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Invoice Number', key: 'invoice_number' },
    { label: 'Status', key: 'status' },
    { label: 'Total', key: 'total_amount' }
  ]
  const data = useMemo(() => {
    return rows.map((row) => {
      return {
        date: moment.unix(row?.created_at).format('MMMM, YYYY'),
        invoice_number: row?.invoice_number,
        status: billingObjText[row.status]?.text,
        total_amount: `$ ${row?.total_amount.toFixed(2)}`
      }
    })
  }, [rows])
  return (
    <div>
      <Card>
        <div className="pt-3 p-2 bg-yellow">
          <div className="page-header xSmall-up-between">
            <div className="page-header--title d-f-center">
              <Icon
                className="page-header--title__leftArrow"
                icon="bx:chevron-left"
                width="40"
                height="40"
                onClick={() => navigate(-1)}
              />
              <span className="heading-1">Monthly Invoices</span>
            </div>
            {data && data.length > 0 && (
              <div className="page-header--export">
                <CSVLink
                  data={data}
                  headers={headers}
                  filename={`monthly-Invoices_${moment(today).format(
                    'MMMYY'
                  )}.csv`}
                  className="text-decoration-none"
                >
                  <Button size="sm " className="fs-x-small button-white pd">
                    <Icon icon="dashicons:upload" width="15" height="15" />
                    <span className="ml-5px">Export</span>
                  </Button>
                </CSVLink>
              </div>
            )}
          </div>
        </div>

        <CardBody style={{ padding: 0 }}>
          <Row>
            <Col lg="12" className="tableSetting">
              <div className="react-dataTable">
                {loading ? (
                  <Spinner />
                ) : rows?.length > 0 ? (
                  <DataTable
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
                  />
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
                      <h4>Search for result</h4>
                      <h5>No result found </h5>
                      {/* {error?.statusCode === 404 || error?.statusCode === 500 ? <p className='text-danger'>{error.msg}</p> : ''} */}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default MonthlyInvoices
