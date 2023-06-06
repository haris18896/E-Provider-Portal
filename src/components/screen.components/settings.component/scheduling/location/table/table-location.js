/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { columns } from '../../../../../../views/settings/scheduling/location/location-table.data'

// third party
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'

import CustomPagination from '../../../../../pagination/ReactPagination'
import Spinner from '../../../../../spinner/Spinner'
import {
  getAllLocationAction,
  handleLimitChange,
  handlePageChange
} from '../../../../../../redux/setting/scheduling/location/locationAction'

export const SettingsLocationTable = ({ id, setPage, currentPage }) => {
  const dispatch = useDispatch()

  const { getAllLoading, getAllLocations } = useSelector(
    (state) => state.locations
  )
  const limit = getAllLocations.limit
  const count = getAllLocations.count
  const offset = getAllLocations.offset
  const rows = getAllLocations?.locationsList
  useEffect(() => {
    dispatch(getAllLocationAction({ offset, limit: 5, id }))
  }, [])

  // **   Handle Pagination

  const handleLimit = (newLimit) => {
    dispatch(handleLimitChange({ oldLimit: limit, newLimit, id }))
    setPage(0)
  }

  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({ offset: newOffset === 0 ? 0 : newOffset, limit, id })
    )
    setPage(() => page.selected)
  }

  return (
    <div  className='height-setting'>
      {getAllLoading ? (
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
            fixedHeader
            fixedHeaderScrollHeight="310px"
            theme="solarized"
            columns={columns}
            paginationDefaultPage={currentPage}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={() =>
              CustomPagination({
                limit,
                handleLimit,
                currentPage,
                count,
                handlePagination,
                position: false
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
    </div>
  )
}
