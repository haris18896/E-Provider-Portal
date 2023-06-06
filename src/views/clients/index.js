/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'

// third party component
import debounce from 'lodash/debounce'
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { Card, CardBody, Col, Row } from 'reactstrap'

// ** Custom Components
import CustomSpinner from '@spinner'
import { columns } from './table.data'
import CustomPagination from '../../components/pagination/ReactPagination'
import ClientsHeader from '@ScreenComponent/clients.screen/headers/client-header.component'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { resetGetAllClients } from '@store/client/clientSlice'
import {
  getAllClientsAction,
  handleLimitChange,
  handlePageChange
} from '../../redux/client/clientAction'

const Clients = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [PageSize, setPagesize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(null)
  const { loading, getAllClientsData } = useSelector((state) => state.client)

  const limit = getAllClientsData.limit
  const count = getAllClientsData.count
  const offset = getAllClientsData.offset
  const rows = getAllClientsData.clientsList

  useEffect(() => {
    dispatch(
      getAllClientsAction({
        offset: status ? 0 : offset,
        limit: 10,
        status: status?.value,
        search
      })
    )
  }, [status])

  // ** Filters
  const onChangeHandler = (name, value) => {
    if (name === 'status') {
      setStatus(value)
    }
    setCurrentPage(0)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    dispatch(
      getAllClientsAction({
        offset: search ? 0 : offset,
        limit,
        status: status?.value,
        search: e.target.value
      })
    )
  }

  const onChange = useCallback(
    debounce((value) => handleSearch(value), 600),
    [handleSearch]
  )

  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        search,
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
        search,
        status: status?.value,
        clients: true
      })
    )
    setCurrentPage(() => page.selected)
  }

  useEffect(() => {
    return () => {
      dispatch(resetGetAllClients())
    }
  }, [])

  return (
    <div>
      <Card>
        <ClientsHeader
          onSearchChange={onChange}
          onChangeHandler={onChangeHandler}
        />
        <CardBody className="p-0 ">
          <Row>
            <Col lg="12" className="tableSetting">
              <div className="react-dataTable">
                {loading ? (
                  <CustomSpinner />
                ) : rows?.length > 0 ? (
                  <DataTable
                    pagination
                    paginationServer
                    rowsPerPage={PageSize}
                    paginationDefaultPage={currentPage}
                    data={rows}
                    pointerOnHover
                    highlightOnHover
                    theme="solarized"
                    columns={columns}
                    className="react-dataTable"
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
                    onRowClicked={(row) =>
                      navigate(`/clients/client/${row?.id}`)
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

export default Clients
