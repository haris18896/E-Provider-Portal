import React, { Fragment, useState, useEffect } from 'react'

// third party pkg
import { Col, Row } from 'reactstrap'
// components
import { columns } from './table.data'
import CustomPagination from '../../../../components/pagination/ReactPagination'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { getAllServiceAction, handleLimitChange, handlePageChange } from '../../../../redux/setting/billing/service/serviceAction'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../../../components/spinner/Spinner'
import { Icon } from '@iconify/react'

export const Services = () => {
  //**  get Provider ID */
  const id = useSelector((state) => state?.auth?.user?.user_id)


  const dispatch = useDispatch()
  const [currentPage, setPage] = useState(0)
  const { getAllServices, getAllServiceLoading } = useSelector((state) => state.service)

  const rows = getAllServices?.serviceLists
  const offset = getAllServices?.offset
  const count = getAllServices?.total
  const limit = getAllServices?.limit

  useEffect(() => {
    dispatch(getAllServiceAction({ id, offset, limit }))
  }, [])

  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        id,
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
        id,
        offset: newOffset === 0 ? 0 : newOffset,
        limit
      })
    )
    setPage(() => page.selected)
  }

  return (
    <Fragment>
      <Row>
        <Col lg="12" className="tableSetting">
          {getAllServiceLoading ? (
            <Spinner />
          ) : rows?.length > 0 ? (
            <div className="react-dataTable">
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
                <h5>No data has found in the Location </h5>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Fragment>
  )
}
