/* eslint-disable no-unused-vars */
import React, {
  memo,
  lazy,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react'

// ** Utility
import { dateFormatted, isObjEmpty } from '../../utility/Utils'

// ** Third Party Packages
import moment from 'moment'
import * as Icon from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { Button, Card, CardBody, Label } from 'reactstrap'

// ** Calendar Plugins
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import ScrollGridPlugin from '@fullcalendar/scrollgrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** Components
import Sidebar from './sidebar'
import SelectField from '@select'
import Avatar from '@components/avatar'
import logo from '../../assets/images/ethera_logo.png'
import AbsoluteSpinner from '../../components/spinner/AbsoluteSpinner'
import { calendarStatusObj } from '../../components/screen.components/constants'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  resetValidRooms,
  resetAddBooking,
  resetAddNewClient,
  resetUpdateBooking,
  resetClientServices,
  resetAddAppointment,
  resetCalendarEvents,
  resetEtheraLocations,
  resetCalendarClients,
  resetUpdateAppointment,
  resetProviderLocations,
  resetGetCalendarAppointment,
  resetAddAppointmentWithBooking
} from '../../redux/calendar/calendarSlice'
import {
  getCalendarOtherLocationsAction,
  getCalendarAppointmentByIdAction,
  getCalendarEtheraLocationsAction,
  getAllCalendarAppointmentsAction
} from '../../redux/calendar/calendarActions'
import { getProviderCalendarAction } from '@store/setting/scheduling/calendar/providerCalendarAction'
import { getAllStripeCardAction } from '../../redux/setting/billing/stripe/stripeAction'

const RolesList = [
  { text: 'Test 1', value: 1 },
  { text: 'Test 2', value: 2 },
  { text: 'Text 3', value: 3 }
]

function Calendar() {
  const now = moment()
  const dispatch = useDispatch()
  const calendarRef = useRef(null)

  const isMobile = useMediaQuery('(max-width: 600px)')
  const smallScreen = useMediaQuery('(min-width: 900px)')
  const largeScreen = useMediaQuery('(min-width: 1350px)')
  const extraLargeScreen = useMediaQuery('(min-width: 1500px)')

  const { success, loading } = useSelector((state) => state.calendar)
  const provider_id = useSelector((state) => state?.auth?.user?.user_id)
  const { getProviderCalendar } = useSelector((state) => state.providerCalendar)
  // ** States
  const [endDate, setEndDate] = useState(null)
  const [view, setView] = useState('timeGridWeek')
  const [startDate, setStartDate] = useState(null)
  const [eventsList, setEventsList] = useState([])
  const [timePicker, setTimePicker] = useState(null)
  const [calendarApi, setCalendarApi] = useState(null)
  const [dateClicked, setDateClicked] = useState(null)
  const [appointmentObj, setAppointmentObj] = useState({})
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)

  const handleAddAppointmentSidebar = () => {
    setAddSidebarOpen(!addSidebarOpen)
  }

  // ** Referencing Calendar
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** Locations
  useEffect(() => {
    if (provider_id) {
      async function calendarApis() {
        await dispatch(getProviderCalendarAction())
        await dispatch(
          getCalendarEtheraLocationsAction({ offset: 0, limit: 1000 })
        )

        await dispatch(
          getCalendarOtherLocationsAction({
            id: provider_id,
            offset: 0,
            limit: 100000
          })
        )
      }
      calendarApis()
    }
  }, [provider_id])

  // ** Appointments Action
  useEffect(() => {
    if (endDate) {
      // setEventsList([])
      dispatch(
        getAllCalendarAppointmentsAction({
          offset: 0,
          limit: 100,
          startDate,
          endDate,
          providerId: provider_id,
          callback: (res) => {
            let list = []
            list = res.map((row) => {
              const startTime = row?.booking
                ? `${dateFormatted(row?.booking?.start_date, 'YYYY-MM-DD')}T${
                    row?.booking?.start_time
                  }`
                : `${dateFormatted(row?.start_date, 'YYYY-MM-DD')}T${
                    row?.start_time
                  }`

              const endTime = row?.booking
                ? `${dateFormatted(row?.booking?.start_date, 'YYYY-MM-DD')}T${
                    row?.booking?.end_time
                  }`
                : `${dateFormatted(row?.start_date, 'YYYY-MM-DD')}T${
                    row?.end_time
                  }`

              const eventDate = moment(dateFormatted(row?.start_date))
              const today = moment().startOf('day')
              const isEventToday = eventDate.isSame(today, 'day')

              return {
                allDay: false,
                url: '',
                start: startTime,
                end: endTime,
                title: `${row?.clients[0]?.first_name || '--'} ${
                  row?.clients[0]?.last_name || '--'
                }`,
                extendedProps: {
                  isEventToday,
                  booking_id: row?.booking?.id,
                  appointment_id: row?.id,
                  start_time: `${row?.start_time}`,
                  end_time: `${row?.end_time}`,
                  date: `${dateFormatted(row?.start_date, 'YYYY-MM-DD')}`,
                  img: row?.booking,
                  startDateTime: startTime,
                  endDateTime: endTime,
                  status: row?.bookings
                    ? parseInt(row?.booking?.status)
                    : parseInt(row?.status)
                }
              }
            })
            setEventsList(list)
          }
        })
      )
    }
  }, [endDate, success])

  // ** Date Picker
  const onDateChangeHandler = (dates) => {
    calendarRef.current.getApi().gotoDate(new Date(dates[0]))
  }

  const calendarOptions = {
    navLinks: true,
    dayMaxEvents: 1,
    editable: false,
    ref: calendarRef,
    selectable: true,
    nowIndicator: true,
    eventOverlap: false,
    slotMinTime: getProviderCalendar?.start_time || '06:00:00',
    slotMaxTime: getProviderCalendar?.end_time || '23:30:00',
    // slotDuration: '01:00:00',
    stickyHeaderDates: true,
    initialView: 'timeGridWeek',
    stickyFooterScrollbar: true,
    schedulerLicenseKey: '0599384492-fcs-1678752810',
    events: eventsList,
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00',
    snapDuration: '01:00:00',
    // slotHeight: 150,
    plugins: [
      interactionPlugin,
      ScrollGridPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    headerToolbar: {
      left: (() => {
        if (isMobile) {
          return 'title,prev,next'
        } else {
          return 'title,prev,next,timeGridDay,timeGridWeek,dayGridMonth'
        }
      })(),
      center: (() => {
        if (isMobile) {
          return 'timeGridDay,timeGridWeek,dayGridMonth'
        } else return ''
      })(),
      right: ''
    },
    eventClassNames({ event }) {
      const status = event?._def?.extendedProps?.status
      const isEventToday = event?._def?.extendedProps?.isEventToday
      const startDateTime = event?._def?.extendedProps?.startDateTime
      const endDateTime = event?._def?.extendedProps?.endDateTime

      const startMoment = moment(startDateTime, 'HH:mm:ss')
      const endMoment = moment(endDateTime, 'HH:mm:ss')
      const currentMoment = moment()

      const isCurrentTimeInRange =
        currentMoment.isSameOrAfter(startMoment) &&
        currentMoment.isBefore(endMoment)

      const colorName = status
        ? calendarStatusObj[parseInt(status)].className
        : null

      return [`bg-${colorName}`]
    },
    datesSet: (dateInfo) => {
      const start = dateInfo.startStr.split('T')[0]
      const end = dateInfo.endStr.split('T')[0]
      setStartDate(start)
      setEndDate(end)
    },
    select(info) {
      const { start, startStr } = info ?? {}
      const timePickerOnView = view === 'timeGridWeek' || view === 'timeGridDay'
      const formattedDate = moment(startStr).format('YYYY-MM-DD')
      const currentDate = moment().format('YYYY-MM-DD')
      const isFutureDate = startStr >= currentDate
      const timePicked = timePickerOnView
        ? [
            moment(start).format('HH:mm:ss'),
            moment(info.end).format('HH:mm:ss')
          ]
        : null

      if (isFutureDate) {
        setTimePicker(timePicked)
        setDateClicked(formattedDate)
        handleAddAppointmentSidebar()
      }
    },
    eventClick({ event: clickedAppointment }) {
      setAppointmentObj(clickedAppointment?._def)
      handleAddAppointmentSidebar()
    },
    views: {
      timeGridDay: {
        type: 'timeGridDay',
        buttonText: 'Day',
        dayMinWidth: 270,
        allDaySlot: false,
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit'
        },
        viewDidMount: (args) => {
          setView(`${args?.view?.type}`)
        }
      },
      timeGridWeek: {
        type: 'timeGridWeek',
        buttonText: 'Week',
        allDaySlot: false,
        duration: { weeks: 1 },
        dayMinWidth: 170,
        dayHeaderFormat: {
          weekday: 'long',
          omitCommas: true,
          day: 'numeric'
        },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hourCycle: 'h12',
          timeZone: 'America/Los_Angeles'
        },
        viewDidMount: (args) => {
          setView(`${args?.view?.type}`)
        }
      },
      dayGridMonth: {
        type: 'dayGridMonth',
        duration: { months: 1 },
        dayMinWidth: 165,
        buttonText: 'Month',
        viewDidMount: (args) => {
          setView(`${args?.view?.type}`)
        }
      }
    },
    eventContent({ event }) {
      const hasImage = event?.extendedProps?.img
      return {
        html: `
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="fc-event-title">
          <div class="fc-event-time">
            <span class="f-400 text-ellipsis">
              ${moment(event?.extendedProps?.start_time, 'hh:mm:ss').format(
                'h:mm A'
              )} - ${moment(event?.extendedProps?.end_time, 'hh:mm:ss').format(
          'h:mm A'
        )}
            </span>
          </div>
          <div class="fc-event-title-text">
            <span class="f-700 text-ellipsis">${event?.title}</span>
          </div>
        </div>
        ${
          hasImage
            ? `
          <div>
            <img
              class="avatar"
              src="${logo}"
              alt="image"
              style="width: ${smallScreen ? '30px' : '25px'};
                     height: ${smallScreen ? '30px' : '25px'};
                     margin-left: 5px;
                     background: transparent;"
            />
          </div>
        `
            : ''
        }
      </div>
    `
      }
    }
  }

  useEffect(() => {
    return () => {
      dispatch(resetCalendarEvents())
      dispatch(resetEtheraLocations())
      dispatch(resetProviderLocations())
    }
  }, [])

  const handleResetCalendarModal = () => {
    setTimePicker(null)
    setDateClicked(null)
    setAppointmentObj({})
    dispatch(resetAddBooking())
    dispatch(resetValidRooms())
    dispatch(resetAddNewClient())
    dispatch(resetUpdateBooking())
    dispatch(resetAddAppointment())
    dispatch(resetClientServices())
    dispatch(resetCalendarClients())
    dispatch(resetUpdateAppointment())
    dispatch(resetGetCalendarAppointment())
    dispatch(resetAddAppointmentWithBooking())
  }

  return (
    <>
      <Sidebar
        open={addSidebarOpen}
        handleOpen={handleAddAppointmentSidebar}
        onModalClose={() => handleResetCalendarModal()}
        appointmentSelected={!isObjEmpty(appointmentObj) && appointmentObj}
        onModalOpen={() => {
          if (appointmentObj?.extendedProps?.appointment_id) {
            dispatch(
              getCalendarAppointmentByIdAction({
                id: appointmentObj?.extendedProps?.appointment_id
              })
            )
          }
        }}
        date={
          !isObjEmpty(appointmentObj)
            ? appointmentObj?.extendedProps?.date
            : dateClicked
            ? dateClicked
            : moment(new Date()).format('YYYY-MM-DD')
        }
        timePicker={timePicker}
      />

      {loading && <AbsoluteSpinner />}

      <Card className="shadow-none bg-yellow">
        <CardBody className="px-0">
          <Label htmlFor="datePicker">
            <Icon.Calendar
              color="white"
              size={30}
              className="absolute datePicker-icon pointer"
            />
          </Label>

          <div className="calendar-selectors absolute-selectors">
            {/*<SelectField*/}
            {/*  header*/}
            {/*  wd="100%"*/}
            {/*  menuHeight="20rem"*/}
            {/*  search={false}*/}
            {/*  value={RolesList[0]}*/}
            {/*  data={RolesList}*/}
            {/*  controlMaxWidth="270px"*/}
            {/*  // onChange={(e) => {*/}
            {/*  // }}*/}
            {/*  disabled*/}
            {/*  // disabled={locationsPending}*/}
            {/*  // isLoading={locationsPending}*/}
            {/*  controlMinWidth={*/}
            {/*    extraLargeScreen ? '230px' : largeScreen ? '180px' : '100%'*/}
            {/*  }*/}
            {/*  placeholder={'Roles ...'}*/}
            {/*/>*/}

            <Button
              disabled={loading}
              className="button-green ml-1"
              onClick={() => handleAddAppointmentSidebar()}
            >
              Add
            </Button>
          </div>

          <FullCalendar {...calendarOptions} />

          <Flatpickr
            id="datePicker"
            name="datePicker"
            onChange={onDateChangeHandler}
            className="form-control absolute datePicker-icon datePicker-non-visible"
            options={{
              mode: 'single',
              enableTime: false,
              dateFormat: 'F j, Y'
            }}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default memo(Calendar)
