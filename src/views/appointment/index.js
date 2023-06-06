/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'

// Third Party Packages
import classNames from 'classnames'
import { Card, CardBody, Row, Col } from 'reactstrap'

// Components
import { Icon } from '@iconify/react'
import { columns } from './table.data'
import { ChevronDown } from 'react-feather'
import Spinner from '../../components/spinner/Spinner'
import DataTable, { createTheme } from 'react-data-table-component'
import CustomPagination from '../../components/pagination/ReactPagination'
import AppointmentsSelectors from '@ScreenComponent/appointments.screen/headers/appointmentsHeader'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllAppointmentsAction,
  getAppointmentByIdAction,
  handleLimitChange,
  handlePageChange
} from '../../redux/appointments/appointmentsAction'
import {
  resetAppointmentsList,
  resetGetAppointmentById,
  resetUpdateAppointment
} from '../../redux/appointments/appointmentsSlice'
import { getAllLocationAction } from '../../redux/setting/scheduling/location/locationAction'
import UpdateAppointmentModal from '../../components/screen.components/appointments.screen/appointment-modal/UpdateAppointmentModal'

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

const Appointments = () => {
  // ** Selectors
  const provider_id = useSelector((state) => state?.auth?.user?.user_id)
  const { getAllAppointments, loading } = useSelector(
    (state) => state.appointments
  )
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const today = new Date()
  const _30days = new Date()
  _30days.setDate(today.getDate() + 30)

  const dispatch = useDispatch()
  const [currentPage, setPage] = useState(0)
  // const [user, setUser] = useState(usersList[0])
  const [endDate, setEndDate] = useState(_30days)
  const [startDate, setStartDate] = useState(today)
  const [status, setStatus] = useState(null)
  const [locationsList, setLocationsList] = useState([])
  const [location, setLocation] = useState(null)
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const [getStatus, setGetStatus] = useState(null)
  const [getId, setId] = useState(null)
  const handleAppointmentModal = (value, status, id) => {
    setId(id)
    setGetStatus(status)
    setOpen(value)
  }

  const handleResetAppointmentModal = () => {
    setId(null)
    setGetStatus(null)
    dispatch(resetGetAppointmentById())
  }
  const arrLocation = []

  const rows = getAllAppointments?.data
  const offset = getAllAppointments?.offset
  const count = getAllAppointments?.total
  const limit = getAllAppointments?.limit

  // // ** Getting Bookings
  useEffect(() => {
    dispatch(
      getAllAppointmentsAction({
        offset: startDate || endDate || status ? 0 : offset,
        limit,
        startDate,
        endDate,
        // search,
        status: status?.value,
        location: location?.value,
        user: user?.value
        // callback: () => {}
      })
    )
  }, [status, location, endDate, user])

  // ** Getting Locations
  useEffect(() => {
    if (rows) {
      dispatch(getAllLocationAction({ offset, limit, id: provider_id }))
    }
  }, [])

  // ** Creating Locations and Rooms lists
  useEffect(() => {
    if (getAllLocations) {
      getAllLocations.forEach((item) => {
        arrLocation.push({
          text: item?.name,
          value: item.id
        })
      })
      setLocationsList(arrLocation)
    }
  }, [getAllLocations])

  // Filters
  const onChangeHandler = (name, value) => {
    if (name === 'status') setStatus(value)
    if (name === 'location') setLocation(value)
    if (name === 'user') setUser(value)
    setPage(0)
  }

  // ** Date Filter
  const onDateChangeHandler = (dates) => {
    if (dates.length === 1) setStartDate(dates[0])
    if (dates.length === 2) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }

  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        startDate,
        endDate,
        status: status?.value,
        location: location?.value,
        user: user?.value
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
        startDate,
        endDate,
        status: status?.value,
        location: location?.value,
        user: user?.value
      })
    )
    setPage(() => page.selected)
  }

  useEffect(() => {
    return () => {
      dispatch(resetAppointmentsList())
      dispatch(resetUpdateAppointment())
    }
  }, [])

  return (
    <div>
      <Card>
        <div
          className={classNames({
            'bg-yellow': true
          })}
        >
          <AppointmentsSelectors
            user={user}
            rows={rows}
            status={status}
            location={location}
            locationsList={locationsList}
            endDate={endDate}
            startDate={startDate}
            onChangeHandler={onChangeHandler}
            dateHandler={onDateChangeHandler}
          />
        </div>
        <CardBody style={{ padding: 0 }}>
          <Row>
            <Col lg="12" className="tableSetting">
              {loading ? (
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
                    columns={columns()}
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
                    onRowClicked={(row) =>
                      handleAppointmentModal(!open, row?.status, row?.id)
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
      <UpdateAppointmentModal
        open={open}
        endDate={endDate}
        status={parseInt(getStatus)}
        startDate={startDate}
        handleOpen={() => handleAppointmentModal(!open)}
        onModalClose={() => handleResetAppointmentModal()}
        onModalOpen={() => {
          if (getId) dispatch(getAppointmentByIdAction(getId))
        }}
      />
    </div>
  )
}

export default Appointments
