/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react'

import { columns, rows } from './table.data'
import { Card, CardBody, Row, Col } from 'reactstrap'
import ClientAttendanceHeader from '../../../components/screen.components/reports.screen/headers/client-attendance-header.component'
import CustomPagination from '../../../components/pagination/ReactPagination'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllSessionAttendanceAction,
  handleLimitChange,
  handlePageChange
} from '../../../redux/reports/reportsAction'
import CustomSpinner from '@spinner'
import { Icon } from '@iconify/react'

const customStyles = {
  cells: {
    style: {
      '&:nth-child(1)': {
        justifyContent: 'left !important'
      },
      justifyContent: 'center !important'
    }
  },
  headCells: {
    style: {
      '&:nth-child(1)': {
        justifyContent: 'left !important'
      },
      justifyContent: 'center !important'
    }
  }
}

function SessionAttendanceReports() {
  const dispatch = useDispatch()
  const today = new Date()
  const _30days = new Date()
  _30days.setDate(today.getDate() + 30)

  const [endDate, setEndDate] = useState(_30days)
  const [startDate, setStartDate] = useState(today)
  const [currentPage, setCurrentPage] = useState(0)
  const [PageSize, setPagesize] = useState(10)
  const { sessionAttendanceReport, sessionReportList } = useSelector(
    (state) => state.reports
  )
  const limit = sessionReportList?.limit
  const count = sessionReportList?.total
  const offset = sessionReportList?.offset
  const rows = sessionReportList?.data

  const newList = rows.reduce((acc, item) => {
    return {
      ...acc,
      [item.client.id]: [...(acc[item.client.id] || []), item]
    }
  }, {})
  
  const finalResult = Object.entries(newList).map(([id, value]) => {
    const obj = {}
    value.forEach((item) => {
      obj[item?.status] = (obj[item?.status] || 0) + 1
    })
    return { ...value[0], status: obj }
  })

  useEffect(() => {
    dispatch(
      getAllSessionAttendanceAction({
        offset: startDate || endDate ? 0 : offset,
        limit,
        startDate,
        endDate
      })
    )
  }, [endDate])

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
        attendance: true
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
        attendance: true
      })
    )
    setCurrentPage(() => page.selected)
  }

  return (
    <div>
      <Card>
        <ClientAttendanceHeader
          endDate={endDate}
          rows={finalResult}
          startDate={startDate}
          onDateChangeHandler={onDateChangeHandler}
        />
        <CardBody style={{ padding: 0 }}>
          <Row>
            <Col lg="12" className="tableSetting">
              <div className="react-dataTable">
                {sessionAttendanceReport ? (
                  <CustomSpinner />
                ) : rows?.length > 0 ? (
                  <DataTable
                    pagination
                    paginationServer
                    rowsPerPage={PageSize}
                    data={finalResult}
                    pointerOnHover
                    highlightOnHover
                    theme="solarized"
                    columns={columns}
                    customStyles={customStyles}
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

export default SessionAttendanceReports
