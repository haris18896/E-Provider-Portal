/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
// third party
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import CustomPagination from '../../../../../pagination/ReactPagination'
import Spinner from '../../../../../spinner/Spinner'
import {
  getAllBillingAddressAction,
  handleLimitChange,
  handlePageChange
} from '../../../../../../redux/setting/scheduling/billing-address/billingAddressAction'

export const SettingsBillingLocation = ({ columns, id }) => {
  const dispatch = useDispatch()
  const [currentPage, setPage] = useState(0)

  const { getAllLoading, getAllBillingAddress } = useSelector(
    (state) => state.billingAddress
  )
  const limit = getAllBillingAddress.limit
  const count = getAllBillingAddress.count
  const offset = getAllBillingAddress.offset
  const rows = getAllBillingAddress?.billingAddressList
  useEffect(() => {
    dispatch(getAllBillingAddressAction({ offset, limit: 5, id }))
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
    <div >
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
            className="react-dataTable "
            columns={columns(setPage)}
            paginationDefaultPage={currentPage}
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
            <h5>No Result Found </h5>
          </div>
        </div>
      )}
    </div>
  )
}
