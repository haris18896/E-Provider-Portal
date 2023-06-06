/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { columns, rows } from './table.data'
import { Card, CardBody, Row, Col } from 'reactstrap'
import ClientDetailsHeader from '../../../components/screen.components/reports.screen/headers/client-details-header.component'
import CustomPagination from '../../../components/pagination/ReactPagination'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import CustomSpinner from '@spinner'
import { getAllMonthlyClientsDetailsAction, handleLimitChange, handlePageChange } from '../../../redux/reports/reportsAction'

function ClientDetailsReportList() {

  const dispatch = useDispatch()
  const today = new Date()
  const _30days = new Date()
  _30days.setDate(today.getDate() + 30)

  const [endDate, setEndDate] = useState(_30days)
  const [startDate, setStartDate] = useState(today)
  const [currentPage, setCurrentPage] = useState(0)
  const [PageSize, setPagesize] = useState(10)
  const [status, setStatus] = useState(null)
  const { clientDetailsReportsPending, clientDetailsReportList } = useSelector((state) => state.reports)
  const limit = clientDetailsReportList?.limit
  const count = clientDetailsReportList?.total
  const offset = clientDetailsReportList?.offset
  const rows = clientDetailsReportList?.data

  // ** Filters
  const onChangeHandler = (name, value) => {
    if (name === 'status') {
      setStatus(value)
    }
    setCurrentPage(0)
  }


  useEffect(() => {
    dispatch(
      getAllMonthlyClientsDetailsAction({
        offset: startDate || endDate || status ? 0 : offset,
        limit,
        startDate,
        endDate,
        status: status?.value
      })
    )
  }, [status, endDate])

  // ** Date Filter
  const onDateChangeHandler = (dates) => {
    if (dates.length === 1) {
      setStartDate(dates[0])
    }
    if (dates.length === 2) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }

  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        startDate,
        endDate,
        status: status?.value,
        clients: true
      })
    )
    setCurrentPage(0)
  }

  // **   Handle Pagination
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({
        offset: newOffset === 0 ? 0 : newOffset,
        limit,
        startDate,
        endDate,
        status: status?.value,
        clients: true
      })
    )
    setCurrentPage(() => page.selected)
  }

  return (
    <div>
      <Card>
        <ClientDetailsHeader
          rows={rows}
          status={status}
          endDate={endDate}
          startDate={startDate}
          onChangeHandler={onChangeHandler}
          dateHandler={onDateChangeHandler}
        />
        <CardBody style={{ padding: 0 }}>
          <Row>
            <Col lg="12" className="tableSetting">
              <div className="react-dataTable">
                {clientDetailsReportsPending ? (
                  <CustomSpinner />
                ) : rows?.length > 0 ? (
                  <DataTable
                    pagination
                    paginationServer
                    rowsPerPage={PageSize}
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

export default ClientDetailsReportList
