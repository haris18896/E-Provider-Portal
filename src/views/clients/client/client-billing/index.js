/* eslint-disable prefer-const */
import React, { useState, useEffect } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'

import { columns } from './table.data'
import {
  getAllClientBillingAction,
  handleLimitChange,
  handlePageChange
} from '../../../../redux/client/clientAction'
import { useDispatch, useSelector } from 'react-redux'
import DataTable, { createTheme } from 'react-data-table-component'
import Spinner from '../../../../components/spinner/Spinner'
import { ChevronDown } from 'react-feather'
import CustomPagination from '../../../../components/pagination/ReactPagination'
import { Icon } from '@iconify/react'
import { useParams } from 'react-router-dom'

createTheme(
  'solarized',
  {
    text: {
      primary: '#',
      secondary: '#2aa198'
    },
    background: {
      default: 'transparent'
    },
    context: {
      background: '#e3f2fd',
      text: '#000'
    },
    divider: {
      default: 'rgba(216, 214, 222, 0.1)'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)
const ClientBillingList = ({ status }) => {
  const params = useParams()
  const { id } = params
  const dispatch = useDispatch()

  const { getAllClientBillingData, getAllClientBillingLoading } = useSelector(
    (state) => state.client
  )
  const rows = getAllClientBillingData?.clientBillingList
  const offset = getAllClientBillingData?.offset
  const count = getAllClientBillingData?.count
  const limit = getAllClientBillingData?.limit

  const [currentPage, setPage] = useState(0)
  useEffect(() => {
    dispatch(
      getAllClientBillingAction({
        offset: status ? 0 : offset,
        limit,
        status: status?.value,
        client: id
      })
    )
  }, [status])

  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        client: id,
        clients: false,
        status: status?.value
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
        client: id,
        clients: false,
        status: status?.value
      })
    )
    setPage(() => page.selected)
  }

  return (
    <div>
      <Card style={{ marginBottom: 0 }}>
        <CardBody
          style={{
            padding: !getAllClientBillingLoading ? '1.5rem 0 0 0' : '0'
          }}
        >
          <Row>
            <Col lg="12" className="tableSetting">
              {getAllClientBillingLoading ? (
                <Spinner />
              ) : !!rows?.length ? (
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
                    <h5>No result found </h5>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default ClientBillingList
