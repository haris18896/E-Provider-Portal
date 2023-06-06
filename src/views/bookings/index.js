/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
// Third Party packages
import moment from 'moment'
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import { Card, CardBody, Row, Col } from 'reactstrap'
import DataTable, { createTheme } from 'react-data-table-component'

// Components
import { columns } from './table.data'
import Spinner from '../../components/spinner/Spinner'
import CustomPagination from '../../components/pagination/ReactPagination'
import { BookingsSelector } from '@ScreenComponent/bookings.screen/headers/bookings-second-row'
import { BookingsHeader } from '@ScreenComponent/bookings.screen/headers/bookingsList.header'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllBookingsAction,
  getBookingByIdAction,
  handleLimitChange,
  handlePageChange
} from '../../redux/booking/bookingAction'
import {
  resetBookingInvoice,
  resetGetAllBookings,
  resetGetBooking,
  resetUpdateBooking,
  resetValidateRoom
} from '../../redux/booking/bookingSlice'
import { getAllLocationsAction } from '../../redux/location/locationActions'
import { getProviderDetailsActions } from '../../redux/provider/providerAction'
import UpdateBookingModal from '../../components/screen.components/bookings.screen/booking-modal/UpdateBookingModal'
import {
  resetCalendarClients,
  resetClientServices,
  resetValidRooms
} from '../../redux/calendar/calendarSlice'

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

const Bookings = () => {
  const dispatch = useDispatch()

  // ** Selectors
  const provider_id = useSelector((state) => state?.auth?.user?.user_id)
  const { getAllBookings, loading } = useSelector((state) => state.booking)
  const getAllLocations = useSelector(
    (state) => state.ELocation.getAllLocations?.locationsList
  )

  // ** Constants
  const today = new Date()
  const _30days = new Date()
  _30days.setDate(today.getDate() + 30)
  const rows = getAllBookings?.data
  const offset = getAllBookings?.offset
  const count = getAllBookings?.total
  const limit = getAllBookings?.limit

  const [user, setUser] = useState(null)
  const [currentPage, setPage] = useState(0)
  const [status, setStatus] = useState(null)
  const [location, setLocation] = useState(null)
  const [endDate, setEndDate] = useState(_30days)
  const [startDate, setStartDate] = useState(today)
  const [locationsList, setLocationsList] = useState([])
  const [open, setOpen] = useState(false)
  const [getStatus, setGetStatus] = useState(null)
  const [getId, setId] = useState(null)
  const handleAppointmentModal = (value, status, id) => {
    setId(id)
    setGetStatus(status)
    setOpen(value)
  }

  const handleResetAppointmentModal = () => {
    dispatch(resetGetBooking())
    dispatch(resetValidRooms())
    dispatch(resetValidateRoom())
    dispatch(resetUpdateBooking())
    dispatch(resetClientServices())
    dispatch(resetBookingInvoice())
    dispatch(resetCalendarClients())
  }
  const BookingData = rows.map((item) => {
    return {
      booking: item?.booking
    }
  })

  const currentMonthBookings = BookingData.filter((booking) => {
    const startDate = moment.unix(booking.booking.start_date)
    return startDate.isSame(moment(), 'month')
  })
  const priceArray = currentMonthBookings.map((item, i) => {
    let price = 0
    price += parseInt(item.booking.room_cost)
    return price
  })
  const TotalPriceOfMonth = priceArray.reduce((acc, curr) => acc + curr, 0)

  const arrLocation = []

  useEffect(() => {
    dispatch(
      getAllBookingsAction({
        offset: startDate || endDate || status ? 0 : offset,
        limit,
        startDate,
        endDate,
        status: status?.value,
        location: location?.value,
        user: user?.value
      })
    )
  }, [status, location, endDate, user])

  // ** Getting Locations
  useEffect(() => {
    if (rows) {
      dispatch(getAllLocationsAction())
      dispatch(getProviderDetailsActions({ id: provider_id }))
    }
  }, [])

  // ** Creating Locations
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

  // ** Filters
  const onChangeHandler = (name, value) => {
    if (name === 'status') setStatus(value)
    if (name === 'location') setLocation(value)
    if (name === 'user') setUser(value)
    setPage(0)
  }

  const onDateChangeHandler = (dates) => {
    if (dates.length === 1) {
      setStartDate(dates[0])
    }
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
      dispatch(resetGetAllBookings())
    }
  }, [])

  return (
    <div>
      <Card>
        <div className="bg-yellow">
          <BookingsHeader rows={rows} TotalPriceOfMonth={TotalPriceOfMonth} />
          <BookingsSelector
            user={user}
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
                      handleAppointmentModal(
                        !open,
                        row?.booking?.status,
                        row?.id
                      )
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
      <UpdateBookingModal
        open={open}
        limit={limit}
        offset={offset}
        endDate={endDate}
        startDate={startDate}
        locationsList={locationsList}
        status={parseInt(getStatus)}
        handleOpen={() => handleAppointmentModal(!open)}
        onModalClose={() => handleResetAppointmentModal()}
        onModalOpen={() => {
          if (getId) dispatch(getBookingByIdAction(getId))
        }}
      />
    </div>
  )
}

export default Bookings
