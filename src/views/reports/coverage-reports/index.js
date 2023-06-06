/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { columns } from './table.data'
import { Card, CardBody, Row, Col } from 'reactstrap'
import ClientDemographicsHeader from '../../../components/screen.components/reports.screen/headers/client-demographics-header.component'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import CustomPagination from '../../../components/pagination/ReactPagination'
import {
  getAllMonthlyClientsDetailsAction,
  handleLimitChange,
  handlePageChange
} from '../../../redux/reports/reportsAction'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import CustomSpinner from '@spinner'

function ClientDemographics() {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(0)
  const [PageSize, setPagesize] = useState(10)
  const { clientDetailsReportsPending, clientDetailsReportList } = useSelector(
    (state) => state.reports
  )

  const limit = clientDetailsReportList?.limit
  const count = clientDetailsReportList?.total
  const offset = clientDetailsReportList?.offset
  const rows = clientDetailsReportList?.data

  useEffect(() => {
    dispatch(
      getAllMonthlyClientsDetailsAction({
        offset,
        limit
      })
    )
  }, [])

  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit
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
        limit
      })
    )
    setCurrentPage(() => page.selected)
  }

  return (
    <div>
      <Card>
        <ClientDemographicsHeader rows={rows} />
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

export default ClientDemographics
