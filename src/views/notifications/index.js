/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
// components
import { columns } from './table.data'
import FormIconField from '@FormIconField'
import CustomSpinner from '../../components/spinner/Spinner'
import CustomPagination from '../../components/pagination/ReactPagination'

// third party pkg
import { debounce } from 'lodash'
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Button, Row, Col, Spinner } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'

// Action and store
import {
  getAllNotificationAction,
  handleLimitChange,
  handlePageChange,
  markAllNotificationAction,
  updateReadNotificationAction
} from '../../redux/notification/notificationAction'
import { useNavigate } from 'react-router-dom'
const Notifications = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [currentPage, setPage] = useState(0)

  const { getAllNotification, loading, markAllLoading } = useSelector(
    (state) => state.notification
  )
  const rows = getAllNotification?.data
  const limit = getAllNotification?.limit
  const count = getAllNotification?.count
  const offset = getAllNotification?.offset
  useEffect(() => {
    dispatch(getAllNotificationAction({ offset, limit, search }))
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    dispatch(
      getAllNotificationAction({
        offset: search ? 0 : offset,
        limit,
        search: e.target.value
      })
    )
  }

  const onChange = useCallback(
    debounce((value) => handleSearch(value), 600),
    [handleSearch]
  )

  const handleNotification = (id) => {
    const data = {
      read: true
    }
    dispatch(
      updateReadNotificationAction({
        id,
        data,
        offset,
        limit
      })
    )
  }

  const handleMarkAll = () => {
    dispatch(markAllNotificationAction())
  }
  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        search
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
        search
      })
    )
    setPage(() => page.selected)
  }

  return (
    <div>
      <Card className="notifications">
        <section className="px-2 pb-3 pt-3 notifications--header bg-yellow">
          <div className="notifications--header__search">
            <FormIconField
              id="Search"
              name="searchKeyword"
              size={10}
              iconsName="ant-design:search-outlined"
              onChange={(e) => onChange(e)}
              className="input-group-merge"
              inputClassName="input-control skin-change"
              iconClassName="icon-control skin-change"
            />
          </div>

          <div className="notifications--header__buttons">
            {/*<Button className="button-success">*/}
            {/*  <Icon*/}
            {/*    icon="ant-design:plus-circle-filled"*/}
            {/*    color="white"*/}
            {/*    width="20"*/}
            {/*    height="20"*/}
            {/*  />*/}
            {/*  <span>Reminder</span>*/}
            {/*</Button>*/}

            <Button
              className="button-white"
              onClick={() => navigate('/settings/notifications')}
            >
              <Icon icon="ci:settings-filled" width="20" height="20" />
              <span>Settings</span>
            </Button>

            <Button className="button-white" onClick={handleMarkAll}>
              {markAllLoading ? (
                <Spinner size="sm" className="set-circle-size" />
              ) : (
                <Icon icon="bi:check-lg" width="20" height="20" />
              )}
              <span>Mark All</span>
            </Button>
          </div>
        </section>

        <section>
          <Row>
            <Col lg="12" className="tableSetting">
              {/* {loading ? (
                <CustomSpinner />
              ) : */}
               {!!rows?.length ? (
                <div className="react-dataTable">
                  <DataTable
                    pagination
                    paginationServer
                    rowsPerPage={limit}
                    data={rows}
                    pointerOnHover
                    highlightOnHover
                    theme="solarized"
                    columns={columns(offset, limit)}
                    className="react-dataTable react-table-2"
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
                    onRowClicked={(row) => handleNotification(row?.id)}
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
        </section>
      </Card>
    </div>
  )
}

export default Notifications
