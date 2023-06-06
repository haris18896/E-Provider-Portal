/* eslint-disable array-bracket-newline */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'

// ** hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** utilities
import {
  dateUnix,
  dateUS,
  endTimeGreaterThanStartTime,
  getChangedData,
  getSuperModifiedValues,
  isObjEmpty,
  timeFormat
} from '@utils'

// ** third party packages
import * as Yup from 'yup'
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Check, Edit2, Plus, UserPlus, X } from 'react-feather'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'

// ** Components
import SelectField from '@select'
import toast from 'react-hot-toast'
import FullSpinner from '@fullSpinner'
import FormIconField from '@FormIconField'
import FormGroupElement from '@FormGroupElement'
import {
  billingTypeOptions,
  formatGroupLabel,
  numberOfWeeks,
  weeklyRepeats
} from './constants'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  addCalendarAppointmentAction,
  addCalendarBookingAction,
  deleteCalendarAppointmentAction,
  deleteCalendarBookingAction,
  getCalendarClientsAction,
  getCalendarClientServicesAction,
  getCalendarValidRoomsAction,
  updateCalendarAppointmentAction,
  updateCalendarBookingWithAppointmentAction,
  updateCalendarBookingAction
} from '../../../../redux/calendar/calendarActions'

import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import AlertModal from '../../../alert'

const appointmentStatusArray = [
  { text: 'Active', value: 1 },
  { text: 'Cancelled', value: 2 },
  { text: 'Complete', value: 3 },
  { text: 'Late Show', value: 4 },
  { text: 'No Show', value: 5 },
  { text: 'Late Cancelled', value: 6 }
]
function EditAppointment({
  date,
  sidebar,
  cancelled,
  timePicker,
  handleOpen,
  fieldDisabled,
  appointmentSelected
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width: 600px)')
  const provider_id = useSelector((state) => state.auth?.user?.user_id)
  const selectorWidth = isMobile ? '100%' : '70%'

  const disabledField =
    appointmentSelected?.extendedProps?.status === 2 ||
    appointmentSelected?.extendedProps?.status === 3

  const {
    getClientServices,
    addBookingPending,
    getEtheraLocations,
    getCalendarClients,
    getValidRoomsPending,
    getProviderLocations,
    updateBookingPending,
    deleteBookingPending,
    addAppointmentPending,
    getCalendarAppointment,
    getClientServicesPending,
    updateAppointmentPending,
    deleteAppointmentPending,
    getCalendarClientsPending,
    getEtheraLocationsPending,
    getProvidersLocationsPending,
    getCalendarAppointmentPending,
    addAppointmentWithBookingPending,
    updateBookingWithAppointmentPending
  } = useSelector((state) => state.calendar)

  const Empty = isObjEmpty(getCalendarAppointment)
  // ** Date
  const today = new Date()
  const datePrev = new Date()
  datePrev.setDate(datePrev.getDate() - 1) // yesterday

  // ** state
  const [roomsList, setRoomsList] = useState([])
  const [client, setClient] = useState('client')
  const [searchClient, setSearchClient] = useState('')
  const [openClientsList, setOpenClientsList] = useState(null)
  const [roomShow, setRoomShow] = useState('room-list')
  const [searchServices, setSearchServices] = useState('')
  const [serviceClientId, setServiceClientId] = useState('')
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const [openServicesList, setOpenServicesList] = useState(false)
  const [deleteAppointment, setDeleteAppointment] = useState(false)
  const [updateFeeData, setUpdateFeeData] = useState({})
  const CloseBtn = (
    <X className="pointer" size={15} onClick={() => setUpdateFeeModal(false)} />
  )

  // ** Locations Grouped List
  const groupedLocations = [
    {
      label: 'Ethera',
      options:
        (getEtheraLocations &&
          getEtheraLocations.length > 0 &&
          getEtheraLocations.map((item) => {
            return {
              label: item?.name,
              value: item?.id
            }
          })) ||
        []
    },
    {
      label: 'Other',
      options:
        (getProviderLocations &&
          getProviderLocations.length > 0 &&
          getProviderLocations.map((item) => {
            return {
              label: item?.name,
              value: item?.id
            }
          })) ||
        []
    }
  ]

  useEffect(() => {
    if (sidebar) {
      dispatch(getCalendarClientsAction({ offset: 0, limit: 1000 }))
    }
  }, [sidebar])

  useEffect(() => {
    if (serviceClientId) {
      dispatch(
        getCalendarClientServicesAction({
          offset: 0,
          limit: 200,
          clients: JSON.stringify([serviceClientId])
        })
      )
    }
  }, [serviceClientId])

  const initial_appointment_services = useMemo(() => {
    if (
      getCalendarAppointment &&
      getCalendarAppointment?.appointment_services
    ) {
      return getCalendarAppointment?.appointment_services.map((item) => {
        return {
          id: item?.id?.id,
          services:
            item?.services?.flatMap((service) => {
              return {
                service: service?.service?.id,
                fees: service?.fees
              }
            }) ?? []
        }
      })
    } else return []
  }, [getCalendarAppointment, getCalendarAppointment?.appointment_services])

  const initial_clients = useMemo(() => {
    if (
      (getCalendarAppointment, getCalendarAppointment?.appointment_services)
    ) {
      return getCalendarAppointment?.appointment_services.map(
        (item) => item?.id?.id
      )
    } else return []
  }, [getCalendarAppointment, getCalendarAppointment?.appointment_services])

  // ** appointment schema for validation
  const Schema = Yup.object().shape({
    location: Yup.object().shape({
      label: Yup.string(),
      value: Yup.string().required()
    }),
    booking: Yup.object().shape({
      location: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string()
      }),
      start_time: Yup.string().required(),
      end_time: Yup.string().required(),
      // start_time: timeFormat('start_time').required(),
      // end_time: timeFormat('end_time')
      //   .required()
      //   .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
      start_date: Yup.string(),
      room: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string()
      }),
      provider: Yup.string(),
      select_dates: Yup.boolean(),
      selected_dates: Yup.array().of(Yup.string())
    }),
    appointment: Yup.object().shape({
      status: Yup.number(),
      appointment_services: Yup.array().of(
        Yup.object().shape({
          id: Yup.object(),
          services: Yup.array().of(Yup.object())
        })
      ),
      clients: Yup.array().of(Yup.string()),
      start_time: timeFormat('start_time').required(),
      end_time: timeFormat('end_time')
        .required()
        .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
      start_date: Yup.string(),
      weekly_repeat: Yup.boolean(),
      weekly_repeat_gap: Yup.number(),
      number_of_weeks: Yup.number(),
      provider_location: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string()
      }),
      telehealth: Yup.boolean(),
      google: Yup.boolean(),
      zoom: Yup.boolean(),
      description: Yup.string()
    })
  })

  //** Clear */
  function cleanNullKeyPair(obj) {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        obj[propName].length === 0
      ) {
        delete obj[propName]
      }
    }
    return obj
  }
  const CurrentDate = moment()
  const bookingDateIsGreaterThanCurrent = moment
    .unix(getCalendarAppointment?.booking?.start_date)
    .isAfter(CurrentDate)
  // ** formik
  const formik = useFormik({
    initialValues: {
      location: getCalendarAppointment?.booking?.location
        ? {
            label: getCalendarAppointment?.booking?.location?.name,
            value: getCalendarAppointment?.booking?.location?.id
          }
        : getCalendarAppointment?.provider_location
        ? {
            label: getCalendarAppointment?.provider_location?.name,
            value: getCalendarAppointment?.provider_location?.id
          }
        : {
            label: '',
            value: ''
          },
      booking: {
        location: getCalendarAppointment?.booking?.location
          ? {
              label: getCalendarAppointment?.booking?.location?.name,
              value: getCalendarAppointment?.booking?.location?.id
            }
          : {
              label: '',
              value: ''
            },
        start_time:
          timePicker !== null
            ? timePicker?.[0]
            : getCalendarAppointment?.booking?.start_time || '09:00:00',
        end_time:
          timePicker !== null
            ? timePicker?.[1]
            : getCalendarAppointment?.booking?.end_time || '10:00:00',
        start_date:
          !isObjEmpty(getCalendarAppointment) && getCalendarAppointment?.booking
            ? getCalendarAppointment?.booking?.start_date
            : !isObjEmpty(getCalendarAppointment)
            ? getCalendarAppointment?.start_date
            : isObjEmpty(getCalendarAppointment) && date
            ? dateUnix(date)
            : dateUnix(today),
        room: getCalendarAppointment?.booking?.room
          ? {
              label: getCalendarAppointment?.booking?.room?.name,
              value: getCalendarAppointment?.booking?.room?.id
            }
          : {
              label: '',
              value: ''
            },
        select_dates:
          getCalendarAppointment?.select_dates ||
          getCalendarAppointment?.booking?.select_dates ||
          false,
        selected_dates:
          getCalendarAppointment?.selected_dates ||
          getCalendarAppointment?.booking?.selected_dates ||
          []
      },
      appointment: {
        clients: initial_clients || [],
        telehealth: getCalendarAppointment?.telehealth || false,
        appointment_services: getCalendarAppointment?.appointment_services || [
          {
            id: {},
            services: []
          }
        ],
        start_time:
          timePicker !== null
            ? timePicker[0]
            : getCalendarAppointment?.start_time || '09:00:00',
        end_time:
          timePicker !== null
            ? timePicker?.[1]
            : getCalendarAppointment?.end_time || '10:00:00',
        weekly_repeat: getCalendarAppointment?.weekly_repeat || false,
        weekly_repeat_gap: getCalendarAppointment?.weekly_repeat_gap || 1,
        number_of_weeks: parseInt(getCalendarAppointment?.number_of_weeks) || 1,
        provider_location: getCalendarAppointment?.provider_location
          ? {
              label: getCalendarAppointment?.provider_location?.name,
              value: getCalendarAppointment?.provider_location?.id
            }
          : {
              label: '',
              value: ''
            },
        google: !!getCalendarAppointment?.google,
        zoom: !!getCalendarAppointment?.zoom,
        description: getCalendarAppointment?.description || '',
        status: getCalendarAppointment?.status || 1
      }
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: (values) => {
      const { booking, appointment } = values

      if (isObjEmpty(formik.errors)) {
        const selectedDates = booking.selected_dates.map(dateUnix)
        const uniqueSelectedDates = [...new Set(selectedDates)]

        const appointmentServices = appointment.appointment_services.map(
          (item) => ({
            id: item?.id?.id,
            services: item?.services?.flatMap(
              (service) =>
                ({
                  service: service?.service?.id,
                  fees: service?.fees
                } ?? [])
            )
          })
        )

        const clients = appointment?.appointment_services.map(
          (item) => item?.id?.id
        )

        const data = {
          booking: {
            start_date: booking.start_date,
            end_time: booking.end_time,
            start_time: booking.start_time,
            room: booking.room?.value,
            select_dates: booking?.select_dates,
            selected_dates: uniqueSelectedDates
          },
          appointment: {
            start_date: booking.start_date,
            clients: [...new Set(clients)],
            start_time: appointment.start_time,
            select_dates: booking.select_dates,
            selected_dates: uniqueSelectedDates,
            // appointment_services: appointmentServices,
            telehealth: appointment.telehealth,
            end_time: appointment.end_time,
            weekly_repeat: appointment.weekly_repeat,
            weekly_repeat_gap: appointment.weekly_repeat_gap,
            number_of_weeks: appointment.number_of_weeks,
            provider_location: appointment.provider_location?.value,
            google: appointment.google,
            zoom: appointment.zoom,
            status: appointment.status
          }
        }

        const appointment_modified_values =
          getCalendarAppointment &&
          getSuperModifiedValues(data?.appointment, {
            zoom: formik.initialValues.appointment.zoom,
            // appointment_service: initial_appointment_services,
            google: formik.initialValues.appointment.google,
            clients: formik.initialValues.appointment.clients,
            start_date: formik.initialValues.booking.start_date,
            end_time: formik.initialValues.appointment.end_time,
            telehealth: formik.initialValues.appointment.telehealth,
            start_time: formik.initialValues.appointment.start_time,
            weekly_repeat: formik.initialValues.appointment.weekly_repeat,
            number_of_weeks: formik.initialValues.appointment.number_of_weeks,
            select_dates: formik.initialValues.booking.select_dates,
            selected_dates:
              formik.initialValues.booking.selected_dates.map(dateUnix),
            weekly_repeat_gap:
              formik.initialValues.appointment.weekly_repeat_gap,
            provider_location:
              formik.initialValues.appointment.provider_location?.value
          })

        const booking_modified_values = getSuperModifiedValues(data.booking, {
          start_date: formik.initialValues.booking?.start_date,
          start_time: formik.initialValues.booking?.start_time,
          end_time: formik.initialValues.booking?.end_time,
          room: formik.initialValues.booking?.room?.value,
          select_dates: formik.initialValues.booking?.select_dates,
          selected_dates:
            formik.initialValues.booking.selected_dates.map(dateUnix)
        })

        const isNewAppointment =
          !appointmentSelected?.extendedProps?.appointment_id

        // ** Add Appointment
        if (isNewAppointment && data.appointment.provider_location) {
          data.appointment.start_date = booking.start_date
          data.appointment.appointment_services = appointmentServices.filter(
            (item) => Boolean(item.id)
          )
          if (booking?.select_dates) {
            data.appointment.select_dates = booking.select_dates
            data.appointment.selected_dates = uniqueSelectedDates
          }

          dispatch(
            addCalendarAppointmentAction({
              data: data?.appointment,
              callback: () => handleOpen()
            })
          )
        }

        // ** Add  Booking
        if (isNewAppointment && data.booking.room) {
          data.appointment.clients = clients.filter((item) => Boolean(item))

          dispatch(
            addCalendarBookingAction({ data, callback: () => handleOpen() })
          )
        }

        const filteredAppointmentServices = appointmentServices.filter((item) =>
          Boolean(item.id)
        )
        const modifiedAppointment =
          getCalendarAppointment &&
          getChangedData(
            initial_appointment_services,
            filteredAppointmentServices
          )

        // ** update Appointment
        if (
          !isNewAppointment &&
          !appointmentSelected?.extendedProps?.booking_id &&
          (!isObjEmpty(appointment_modified_values) ||
            !isObjEmpty(modifiedAppointment))
        ) {
          appointment_modified_values.appointment_services =
            filteredAppointmentServices

          dispatch(
            updateCalendarAppointmentAction({
              id: appointmentSelected?.extendedProps?.appointment_id,
              data: appointment_modified_values,
              callback: () => handleOpen()
            })
          )
        }

        // update only booking
        if (
          !isNewAppointment &&
          appointmentSelected?.extendedProps?.booking_id &&
          !isObjEmpty(booking_modified_values)
        ) {
          dispatch(
            updateCalendarBookingAction({
              id: appointmentSelected?.extendedProps?.booking_id,
              data: booking_modified_values,
              callback: () => handleOpen()
            })
          )
        }

        if (
          !isObjEmpty(appointment_modified_values) ||
          !isObjEmpty(modifiedAppointment)
        ) {
          appointment_modified_values.start_date = booking?.start_date
          appointment_modified_values.appointment_services =
            appointmentServices.filter((item) => Boolean(item.id))
        }

        // ** only Update appointment in Booking
        if (
          !isNewAppointment &&
          appointmentSelected?.extendedProps?.booking_id &&
          !isObjEmpty(appointment_modified_values) &&
          isObjEmpty(booking_modified_values) &&
          formik.initialValues.appointment.status ===
            formik.values.appointment.status
        ) {
          appointment_modified_values.clients = clients.filter((item) =>
            Boolean(item)
          )

          dispatch(
            updateCalendarAppointmentAction({
              id: appointmentSelected?.extendedProps?.appointment_id,
              data: appointment_modified_values,
              callback: () => handleOpen()
            })
          )
        }

        if (
          !isNewAppointment &&
          appointmentSelected?.extendedProps?.booking_id &&
          !isObjEmpty(appointment_modified_values) &&
          isObjEmpty(booking_modified_values) &&
          formik.initialValues.appointment.status !== values.appointment.status
        ) {
          appointment_modified_values.status = values.appointment.status
          dispatch(
            updateCalendarAppointmentAction({
              id: appointmentSelected?.extendedProps?.appointment_id,
              data: appointment_modified_values,
              callback: () => handleOpen()
            })
          )
        }

        // ** update Booking && Appointment
        if (
          !isNewAppointment &&
          appointmentSelected?.extendedProps?.booking_id &&
          !isObjEmpty(appointment_modified_values) &&
          !isObjEmpty(booking_modified_values)
        ) {
          appointment_modified_values.appointment_services =
            appointmentServices.filter((item) => Boolean(item.id))
          appointment_modified_values.clients = clients.filter((item) =>
            Boolean(item)
          )

          dispatch(
            updateCalendarBookingWithAppointmentAction({
              booking_id: appointmentSelected?.extendedProps?.booking_id,
              appointment_id:
                appointmentSelected?.extendedProps?.appointment_id,
              appointmentData: appointment_modified_values,
              bookingData: booking_modified_values,
              callback: () => handleOpen()
            })
          )
        }
      }
    }
  })
  const handleCancelBooking = () => {
    const data = {
      status: 2
    }
    dispatch(
      updateCalendarBookingAction({
        id: appointmentSelected?.extendedProps?.booking_id,
        data,
        callback: () => handleOpen()
      })
    )
  }
  // ** Fetching Valid Rooms
  useEffect(() => {
    if (formik.values.booking?.location?.value) {
      const initial_date =
        formik.values.booking?.start_date || dateUnix(today) || dateUnix(date)
      const selectedDates = formik.values.booking.selected_dates.map((item) =>
        dateUnix(item)
      )
      const data = {
        start_time: formik.values.booking?.start_time,
        end_time: formik.values.booking?.end_time,
        selected_dates:
          formik.values.booking?.selected_dates.length > 0
            ? [...selectedDates]
            : [initial_date, ...selectedDates],
        provider: provider_id
      }

      dispatch(
        getCalendarValidRoomsAction({
          id: formik.values.booking?.location?.value,
          data,
          callback: (res) => {
            if (res.length > 0) {
              let list = []
              list = res.map((item) => {
                return {
                  label: item?.name,
                  value: item?.id
                }
              })
              setRoomsList(list)
            } else setRoomsList([])
          }
        })
      )
    }
  }, [
    formik.values.booking?.end_time,
    formik.values.booking?.location?.value,
    formik.values.booking?.start_date,
    formik.values.booking?.selected_dates.length
  ])

  // ** Clients Filtered List
  const clientsListData =
    getCalendarClients.length > 0 &&
    getCalendarClients.filter(({ first_name, last_name }) => {
      const name = `${first_name} ${last_name}`
      return name.toLowerCase().includes(searchClient.toString().toLowerCase())
    })

  // ** Client Services Filtered List
  const clientServicesList =
    getClientServices.length > 0 &&
    getClientServices.filter(({ service }) => {
      const name = `${service?.service} ${service?.code}`
      return name
        .toLowerCase()
        .includes(searchServices.toString().toLowerCase())
    })

  // ** handle delete appointment
  const handleDeleteAppointment = (value) => {
    setDeleteAppointment(value)
  }

  // ** Add Client to Appointment
  const addClientToAppointment = (data, i) => {
    const clients = formik.values.appointment.appointment_services.flatMap(
      (item) => item.id?.id
    )

    if (!clients.includes(data?.id)) {
      formik.setFieldValue(`appointment.appointment_services[${i}].id`, data)
    }
  }

  // ** Add services to Client's Appointment
  const addServiceToAppointment = (data, i) => {
    const services =
      formik.values.appointment.appointment_services[i]?.services || []

    if (!services.some((service) => service.service?.id === data?.id)) {
      formik.setFieldValue(`appointment.appointment_services[${i}].services`, [
        ...services,
        {
          service: data,
          fees: data?.fee
        }
      ])
    }
  }

  const handleUpdateFee = (name, fees, code, value) => {
    setUpdateFeeModal(value)
    setUpdateFeeData({
      name,
      fees,
      code
    })
  }
  const currentDate = moment()
  const getDate = moment
    .unix(getCalendarAppointment?.start_date)
    .format('YYYY MM DD')
  const dateIsSmallerThanCurrent = moment(getDate).isBefore(currentDate)

  const updateBtnPending =
    updateBookingWithAppointmentPending ||
    updateBookingPending ||
    updateAppointmentPending

  const addBtnPending =
    addAppointmentPending ||
    addBookingPending ||
    addAppointmentWithBookingPending

  const isDirty = formik.dirty
  const hasValidRooms = !getValidRoomsPending
  const isLocationValueEmpty = !formik.values.location.value
  const hasProviderLocation =
    !!formik.values.appointment?.provider_location?.value
  const isBookingUpdating =
    updateBookingPending || updateBookingWithAppointmentPending
  const isProviderLocationEmpty =
    !!formik.values.appointment?.provider_location?.value
  const hasAppointmentServices =
    formik.values.appointment?.appointment_services?.length > 0
  const isAppointmentUpdating =
    updateAppointmentPending || updateBookingWithAppointmentPending
  const isAppointmentServicesEmpty =
    formik.values.appointment?.appointment_services.length === 0
  const isRoomValueEmpty =
    !!formik.values.booking?.location?.value &&
    !formik.values.booking?.room?.value
  const hasServicesSelected =
    formik.values.appointment?.appointment_services?.some(
      (item) => item?.services?.length === 0 && !isObjEmpty(item.id)
    )
  const isProviderLocationEmptyWithServicesSelected =
    isProviderLocationEmpty &&
    formik.values.appointment?.appointment_services.some(
      (item) => item?.services?.length === 0
    )
  const isAppointmentServicesInvalid =
    formik.values.appointment?.appointment_services.some(
      (item) => item?.services?.length === 0
    ) &&
    formik.values.appointment?.appointment_services.some(
      (item) => !isObjEmpty(item.id)
    )

  const addBtnDisabled =
    !isDirty ||
    addBookingPending ||
    isRoomValueEmpty ||
    getValidRoomsPending ||
    isLocationValueEmpty ||
    addAppointmentPending ||
    !isObjEmpty(formik.errors) ||
    isAppointmentServicesInvalid ||
    addAppointmentWithBookingPending ||
    isProviderLocationEmptyWithServicesSelected ||
    (isAppointmentServicesEmpty && isProviderLocationEmpty)

  const updateBtnDisabled =
    !isDirty ||
    !hasValidRooms ||
    isBookingUpdating ||
    hasServicesSelected ||
    isAppointmentUpdating ||
    // !hasAppointmentServices ||
    (hasProviderLocation && isProviderLocationEmptyWithServicesSelected)

  return (
    <>
      {/* Update Fee Modal*/}
      <Modal
        isOpen={updateFeeModal}
        className="modal-dialog-centered calendarModal"
        toggle={() => handleUpdateFee('', '', '', false)}
        onClosed={() => handleUpdateFee('', '', '', false)}
      >
        <ModalHeader
          className="mb-1 ethera-modal-top-background"
          toggle={() => handleUpdateFee('', '', '', false)}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title ethera-dark">Update Fee</h5>
        </ModalHeader>

        <ModalBody className="px-3 py-2">
          <div className="px-2 py-1 pb-2">
            <h4>Update fee for code {updateFeeData?.code}</h4>
            <FormIconField
              id={updateFeeData?.name}
              name={updateFeeData?.name}
              size={10}
              inputName={'number'}
              iconsName="tabler:currency-dollar"
              className="input-group-merge"
              inputClassName="input-control skin-change padding-y-search-md"
              iconClassName="icon-control skin-change"
              placeholder="fee"
              defaultValue={parseInt(updateFeeData?.fees)}
              onChange={(e) => (updateFeeData.fees = e.target.value)}
            />

            <div className="d-flex justify-content-end align-items-center mt-1">
              <Button
                size="sm"
                className="button-cancel pd mx-1"
                onClick={() => {
                  handleUpdateFee('', '', '', false)
                }}
              >
                <span className="px-1">Cancel</span>
              </Button>

              <Button
                size="sm"
                className="button-success "
                onClick={() => {
                  formik.setFieldValue(
                    `${updateFeeData?.name}`,
                    updateFeeData?.fees
                  )
                  handleUpdateFee('', '', '', false)
                }}
              >
                <Icon icon="ic:baseline-update" />
                <span className="px-1">Update</span>
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Delete Appointment Modal */}
      <AlertModal
        loading={deleteAppointmentPending || deleteBookingPending}
        open={deleteAppointment}
        handleOpen={() => handleDeleteAppointment(true)}
        handleClose={() => handleDeleteAppointment(false)}
        handleAction={() => {
          if (appointmentSelected?.extendedProps?.booking_id) {
            dispatch(
              deleteCalendarBookingAction({
                id: appointmentSelected?.extendedProps?.booking_id,
                callback: () => {
                  handleDeleteAppointment(false)
                  handleOpen()
                }
              })
            )
          }

          if (
            appointmentSelected?.extendedProps?.appointment_id &&
            !appointmentSelected?.extendedProps?.booking_id
          ) {
            dispatch(
              deleteCalendarAppointmentAction({
                id: appointmentSelected?.extendedProps?.appointment_id,
                callback: () => {
                  handleDeleteAppointment(false)
                  handleOpen()
                }
              })
            )
          }
        }}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment ?"
      />

      <FormikProvider value={formik}>
        <>
          {getCalendarAppointmentPending ? (
            <FullSpinner />
          ) : (
            <Form
              onSubmit={formik.handleSubmit}
              className="Appointment_Form Appointment_Form--y-scroll"
            >
              <>
                <h5 className="modal-title modal-heading ethera-dark">
                  Appointment Location
                </h5>
                <div className="Appointment_Form--modal_padding">
                  <SelectField
                    header
                    wd={selectorWidth}
                    menuHeight="20rem"
                    search={false}
                    formatGroupLabel={formatGroupLabel}
                    data={groupedLocations}
                    placeholder={
                      getCalendarAppointmentPending ||
                      getEtheraLocationsPending ||
                      getProvidersLocationsPending
                        ? 'Loading...'
                        : (!formik.values.booking?.location?.value ||
                            !formik.values.appointment?.provider_location
                              ?.value) &&
                          'Locations'
                    }
                    value={
                      formik.values.booking?.location?.value
                        ? formik.values.booking?.location
                        : formik.values.appointment?.provider_location?.value
                        ? formik.values.appointment?.provider_location
                        : null
                    }
                    onChange={(e) => {
                      formik.setFieldValue('location', e)
                      formik.setFieldValue('room', null)
                      formik.setFieldValue('appointment.weekly_repeat', false)
                      if (
                        groupedLocations[0]?.options.find(
                          (item) => item.value === e.value
                        )
                      ) {
                        formik.setFieldValue('booking.location', e)
                        formik.setFieldValue('appointment.provider_location', {
                          label: '',
                          value: ''
                        })
                      }

                      if (
                        groupedLocations[1]?.options.find(
                          (item) => item.value === e.value
                        )
                      ) {
                        formik.setFieldValue('booking.location', {
                          label: '',
                          value: ''
                        })
                        formik.setFieldValue('appointment.provider_location', e)
                      }
                    }}
                    disabled={
                      cancelled ||
                      fieldDisabled ||
                      getCalendarAppointmentPending ||
                      getEtheraLocationsPending ||
                      getProvidersLocationsPending
                    }
                    isLoading={
                      getCalendarAppointmentPending ||
                      getEtheraLocationsPending ||
                      getProvidersLocationsPending
                    }
                  />

                  <Flatpickr
                    disabled={fieldDisabled || cancelled}
                    data-enable-time
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    className="mt-1 radius-25 bg-white flat-picker-sm form-control select-w-70 skin-change"
                    value={dateUS(parseInt(formik.values.booking.start_date))}
                    onChange={(date) => {
                      formik.setFieldValue(
                        'booking.start_date',
                        dateUnix(date[0])
                      )
                    }}
                    options={{
                      enableTime: false,
                      dateFormat: 'n/j/Y',
                      minDate: Empty ? 'today' : '',
                      mode: 'single',
                      maxDate: moment().add(1, 'months').format('MM/DD/YYYY')
                    }}
                  />

                  {formik.values.booking?.location?.value && (
                    <div className="time-div select-w-70 mt-1">
                      <Flatpickr
                        disabled={fieldDisabled || cancelled}
                        data-enable-time
                        id="startTime"
                        name="startTime"
                        type="time"
                        className="radius-25 bg-white flat-picker-sm form-control select-w-70 skin-change"
                        value={formik.values.booking.start_time}
                        // onChange={(time) => handleBookingStartTime(time)}
                        onChange={(time) => {
                          formik.setFieldValue(
                            'booking.start_time',
                            moment(time[0]).format('HH:mm:ss')
                          )
                          formik.setFieldValue(
                            'booking.end_time',
                            moment(time[0]).add(1, 'hour').format('HH:mm:ss')
                          )
                          formik.setFieldValue(
                            'appointment.start_time',
                            moment(time[0]).format('HH:mm:ss')
                          )
                          formik.setFieldValue(
                            'appointment.end_time',
                            moment(time[0]).add(1, 'hour').format('HH:mm:ss')
                          )
                        }}
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          minuteIncrement: 15,
                          dateFormat: 'h:i K'
                        }}
                      />

                      <span className="sub-heading-1">to</span>

                      <Flatpickr
                        disabled={fieldDisabled || cancelled}
                        data-enable-time
                        id="endTime"
                        name="endTime"
                        type="time"
                        className={classNames({
                          'radius-25 bg-white flat-picker-sm form-control select-w-70 skin-change': true,
                          invalid: !!formik.errors.booking?.end_time
                        })}
                        value={formik.values.booking.end_time}
                        // onChange={(time) => handleBookingEndTime(time)}
                        onChange={(time) => {
                          formik.setFieldValue(
                            'booking.end_time',
                            moment(time[0]).format('HH:mm:ss')
                          )
                        }}
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          minuteIncrement: 15,
                          dateFormat: 'h:i K'
                        }}
                      />
                    </div>
                  )}
                </div>

                <hr />
                <div className="Appointment_Form--reports Appointment_Form--modal_padding Appointment_Form--repeats">
                  <FormGroupElement
                    disabled={
                      fieldDisabled ||
                      cancelled ||
                      formik.values.booking?.location?.value
                    }
                    inputType="checkbox"
                    inputName="weeklyRepeat"
                    label="Weekly Repeat"
                    labelClassName="pl-10px"
                    formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 m-0"
                    inputClassName="skin-change"
                    checked={formik.values.appointment.weekly_repeat}
                    value={formik.values.appointment.weekly_repeat}
                    onChange={(e) => {
                      formik.setFieldValue(
                        'appointment.weekly_repeat',
                        e.target.checked
                      )
                      formik.setFieldValue('booking.select_dates', false)
                    }}
                  />

                  <FormGroupElement
                    disabled={fieldDisabled || cancelled}
                    inputType={'checkbox'}
                    inputName="selectDates"
                    label="Select Dates"
                    labelClassName="pl-10px"
                    formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 m-0"
                    inputClassName="skin-change"
                    checked={formik.values.booking.select_dates}
                    value={formik.values.booking.select_dates}
                    onChange={(e) => {
                      formik.setFieldValue('appointment.weekly_repeat', false)
                      formik.setFieldValue('booking.selected_dates', [])
                      formik.setFieldValue(
                        'booking.select_dates',
                        e.target.checked
                      )
                    }}
                  />
                </div>

                {formik.values.booking?.select_dates && (
                  <>
                    <div className="Appointment_Form--dateSelect Appointment_Form--modal_padding">
                      <span>Repeat On :&nbsp;</span>
                      <Flatpickr
                        disabled={fieldDisabled || cancelled}
                        data-enable-time
                        id="repeatOn"
                        name="repeatOn"
                        className="radius-25 bg-white select-w-70 flat-picker-sm skin-change"
                        placeholder="Select Dates"
                        options={{
                          mode: 'multiple',
                          enableTime: false,
                          dateFormat: 'm/d/Y',
                          minDate: 'today',
                          disable:
                            getCalendarAppointment?.selected_dates ||
                            getCalendarAppointment?.booking?.selected_dates ||
                            [],
                          maxDate: moment()
                            .add(1, 'months')
                            .format('MM/DD/YYYY')
                        }}
                        value={formik.values.booking?.selected_dates}
                        onChange={(date) => {
                          formik.setFieldValue('booking.selected_dates', [
                            ...formik.initialValues.booking?.selected_dates,
                            ...date
                          ])
                        }}
                      />
                    </div>
                  </>
                )}

                {formik.values.appointment.weekly_repeat &&
                  (!fieldDisabled || !cancelled) && (
                    <>
                      <div className="Appointment_Form--weeklyRepeat Appointment_Form--modal_padding">
                        <div className="Appointment_Form--weeklyRepeat__repeats skin-change">
                          <span>Every</span>
                          {weeklyRepeats.map((item, index) => (
                            <p
                              key={index}
                              className={classNames({
                                'Appointment_Form--weeklyRepeat__repeats--weeks pointer': true,
                                'Appointment_Form--weeklyRepeat__repeats__active':
                                  item.value ===
                                  formik.values.appointment.weekly_repeat_gap
                              })}
                              onClick={() =>
                                formik.setFieldValue(
                                  'appointment.weekly_repeat_gap',
                                  item.value
                                )
                              }
                            >
                              {item.value}
                            </p>
                          ))}
                          <span>
                            Weeks(s) <Icon icon="bi:x" width="20" height="20" />
                          </span>
                          <FormGroupElement
                            inputType="select"
                            inputName="select"
                            bsSize="sm"
                            className="select border form-control radius-25 skin-change"
                            {...formik.getFieldProps(
                              'appointment.number_of_weeks'
                            )}
                            formikTouched={
                              formik.touched.appointment?.number_of_weeks
                            }
                            formikError={
                              formik.errors.appointment?.number_of_weeks
                            }
                          >
                            {numberOfWeeks.map((item, index) => (
                              <option key={index} value={`${item.value}`}>
                                {item.value}
                              </option>
                            ))}
                          </FormGroupElement>
                        </div>
                        <div className="Appointment_Form--weeklyRepeat__date skin-change">
                          <Icon
                            icon="akar-icons:clock"
                            width="20"
                            height="20"
                          />
                          <div className="skin-change">
                            <span>Repeat will end on </span>
                            <strong>
                              {moment(today)
                                .add(
                                  parseInt(
                                    formik.values.appointment?.number_of_weeks
                                  ),
                                  'weeks'
                                )
                                .format('MMM D, YYYY')}
                            </strong>
                            <Icon
                              icon="ant-design:calendar-twotone"
                              width="20"
                              height="20"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                <hr />

                {roomShow === 'room-list' &&
                formik.values.booking?.location?.value ? (
                  <>
                    <div
                      className="Appointment_Form--modal_padding"
                      style={{ paddingTop: 0 }}
                    >
                      <h5>Room</h5>
                      <SelectField
                        header
                        wd={selectorWidth}
                        menuHeight="20rem"
                        search={false}
                        data={roomsList}
                        formatGroupLabel={formatGroupLabel}
                        value={
                          formik.values.booking?.room?.value
                            ? formik.values.booking?.room
                            : null
                        }
                        onChange={(e) =>
                          formik.setFieldValue('booking.room', e)
                        }
                        placeholder={
                          getEtheraLocationsPending || getValidRoomsPending
                            ? 'Loading...'
                            : 'Rooms'
                        }
                        disabled={
                          fieldDisabled ||
                          cancelled ||
                          getEtheraLocationsPending ||
                          getValidRoomsPending
                        }
                        isLoading={
                          getEtheraLocationsPending || getValidRoomsPending
                        }
                      />
                    </div>
                    <div className="mt-1 Appointment_Form--roomCost">
                      <h5>Room Cost</h5>
                      <p>$ 50.00</p>
                    </div>
                    <hr />
                  </>
                ) : roomShow === 'room-map' ? (
                  <>
                    <div className="Appointment_Form--modal_padding">
                      Room Maps
                    </div>
                  </>
                ) : null}
              </>
              <>
                <h5 className="modal-title modal-heading ethera-dark">
                  Appointment Details
                </h5>
                <div>
                  <div className="modal-paddings">
                    <Row className="justify-content-between mt-1">
                      <Col
                        sm={6}
                        md={6}
                        className="d-flex appointment_popup_details mb-1"
                      >
                        <span
                          onClick={() => setClient('client')}
                          className={classNames({
                            cursorPointer: true,
                            'activeClient ethera-dark': client === 'client'
                          })}
                        >
                          Client
                        </span>
                        {/*<span*/}
                        {/*  onClick={() => setClient('other')}*/}
                        {/*  className={classNames({*/}
                        {/*    cursorPointer: true,*/}
                        {/*    'activeClient ethera-dark': client === 'other'*/}
                        {/*  })}*/}
                        {/*>*/}
                        {/*  Other*/}
                        {/*</span>*/}
                      </Col>
                      <Col sm={6} md={6}>
                        {dateIsSmallerThanCurrent ? (
                          <div style={{ padding: '0 0.45rem' }}>
                            <FormGroupElement
                              inputType="select"
                              inputName="number"
                              bsSize="sm"
                              value={formik.values.appointment?.status}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  'appointment.status',
                                  e.target.value
                                )
                              }}
                              disabled={disabledField}
                              inputClassName="radius-25 skin-change bg-yellow cursorPointer "
                              formikTouched={formik.touched.appointment?.status}
                              formikError={formik.errors.appointment?.status}
                            >
                              {appointmentStatusArray.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.text}
                                </option>
                              ))}
                            </FormGroupElement>
                          </div>
                        ) : (
                          <Button
                            disabled={fieldDisabled || cancelled}
                            className="btn-transparent"
                            onClick={() => navigate('/clients/add-client')}
                          >
                            Add New Client
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>

                  {client === 'client' ? (
                    <>
                      <div className=" Appointment_Form--clientsDetails">
                        <div className="Appointment_Form--modal_padding Appointment_Form--clientsDetails__date">
                          <Flatpickr
                            disabled={fieldDisabled || cancelled}
                            data-enable-time
                            id="start_time"
                            name="start_time"
                            type="time"
                            className="mb-1 radius-25 bg-white flat-picker-sm form-control skin-change"
                            value={formik.values.appointment?.start_time}
                            // onChange={(time) => handleAppointmentStartTime(time)}
                            onChange={(time) => {
                              const bookingEndTime =
                                formik.values.booking.end_time
                              const bookingStartTime =
                                formik.values.booking.start_time
                              formik.setFieldValue(
                                'appointment.start_time',
                                moment(time[0]).format('HH:mm:ss')
                              )
                              formik.setFieldValue(
                                'appointment.end_time',
                                moment(time[0])
                                  .add(1, 'hour')
                                  .format('HH:mm:ss')
                              )
                              formik.setFieldValue(
                                'booking.start_time',
                                moment(time[0]).format('HH:mm:ss')
                              )

                              if (
                                moment(bookingEndTime, 'HH:mm:ss').isBefore(
                                  moment(bookingStartTime, 'HH:mm:ss')
                                )
                              ) {
                                formik.setFieldValue(
                                  'booking.end_time',
                                  moment(bookingStartTime, 'HH:mm:ss').add(
                                    1,
                                    'hour'
                                  )
                                )
                              }
                            }}
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              minuteIncrement: 15,
                              dateFormat: 'h:i K'
                            }}
                          />

                          <h5 className="mb-1">to</h5>
                          <Flatpickr
                            disabled={fieldDisabled || cancelled}
                            data-enable-time
                            id="end_time"
                            name="end_time"
                            type="time"
                            className={classNames({
                              'mb-1 radius-25 bg-white flat-picker-sm form-control skin-change': true,
                              invalid: !!formik.errors.appointment?.end_time
                            })}
                            value={formik.values.appointment?.end_time}
                            // onChange={(time) => handleAppointmentEndTime(time)}
                            onChange={(time) => {
                              formik.setFieldValue(
                                'appointment.end_time',
                                moment(time[0]).format('HH:mm:ss')
                              )
                            }}
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              minuteIncrement: 15,
                              dateFormat: 'h:i K'
                            }}
                          />

                          <FormGroupElement
                            disabled={fieldDisabled || cancelled}
                            inputType="checkbox"
                            inputName="TeleHealth"
                            label="TeleHealth"
                            labelClassName="pl-10px"
                            formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 Appointment_Form--clientsDetails--checkbox m-0"
                            inputClassName="skin-change"
                            checked={
                              formik.values.appointment?.telehealth === true
                            }
                            onChange={(e) =>
                              formik.setFieldValue(
                                'appointment.telehealth',
                                e.target.checked
                              )
                            }
                          />
                        </div>

                        {formik.values.appointment?.telehealth && (
                          <div className="Appointment_Form--modal_padding Appointment_Form--clientsDetails__teleHealth">
                            <FormGroupElement
                              disabled={fieldDisabled || cancelled}
                              inputType="checkbox"
                              inputName="googleMeet"
                              label="Google Meeting"
                              labelClassName="pl-10px"
                              iconStyle="Appointment_Form--clientsDetails__teleHealth--icons"
                              icon={
                                <Icon
                                  icon="logos:google-meet"
                                  width="20"
                                  height="20"
                                />
                              }
                              formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 Appointment_Form--clientsDetails--checkbox m-0"
                              inputClassName="skin-change"
                              {...formik.getFieldProps('appointment.google')}
                              formikTouched={formik.touched.appointment?.google}
                              formikError={formik.errors.appointment?.google}
                            />
                            <FormGroupElement
                              disabled={fieldDisabled || cancelled}
                              inputType="checkbox"
                              inputName="zoomMeet"
                              label="Zoom Meeting"
                              icon={
                                <Icon
                                  icon="akar-icons:zoom-fill"
                                  color="#4286FB"
                                  width="20"
                                  height="20"
                                />
                              }
                              iconStyle="Appointment_Form--clientsDetails__teleHealth--icons"
                              labelClassName="pl-10px"
                              formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 Appointment_Form--clientsDetails--checkbox m-0"
                              inputClassName="skin-change"
                              {...formik.getFieldProps('appointment.zoom')}
                              formikTouched={formik.touched.appointment?.zoom}
                              formikError={formik.errors.appointment?.zoom}
                            />
                          </div>
                        )}
                        <hr className="mb-0" />

                        {/* Clients && Services Goes here */}
                        <FieldArray
                          name="appointment.appointment_services"
                          render={(arrayHelpers) => {
                            return (
                              <div className="Appointment_Form--modal_padding ">
                                {formik.values.appointment?.appointment_services.map(
                                  (item, i) => (
                                    <div
                                      key={i}
                                      className="Appointment_Form--clientsDetails__selectors"
                                    >
                                      <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                                        <UserPlus size={15} />
                                        <span>Clients</span>
                                      </div>
                                      {formik.values.appointment
                                        ?.appointment_services[i]?.id?.id && (
                                        <>
                                          <div
                                            className={classNames({
                                              'mt-1':
                                                formik.values.appointment
                                                  ?.appointment_services[i]
                                            })}
                                          >
                                            <Row className="clients__row">
                                              <Col
                                                sm={12}
                                                className={classNames({
                                                  'clients__row--div': true,
                                                  smallScreenPopup: !isMobile
                                                })}
                                              >
                                                <span>{`${
                                                  item?.id?.first_name || '--'
                                                } ${
                                                  item?.id?.last_name || ''
                                                }`}</span>

                                                <span>
                                                  {
                                                    billingTypeOptions[
                                                      parseInt(
                                                        item?.billing_type
                                                      )
                                                    ]?.label
                                                  }
                                                </span>

                                                <Icon
                                                  icon="bi:trash"
                                                  width="15"
                                                  height="15"
                                                  className={classNames({
                                                    pointer: true,
                                                    'd-none': disabledField
                                                  })}
                                                  onClick={() => {
                                                    arrayHelpers.remove(i)
                                                  }}
                                                />
                                              </Col>
                                              {getCalendarAppointment?.booking
                                                ?.status === 3 && (
                                                <Col
                                                  sm={12}
                                                  className="px-0 clients__row--edit"
                                                  onClick={() =>
                                                    navigate(
                                                      `/clients/client/${item?.id?.id}`
                                                    )
                                                  }
                                                >
                                                  <Edit2 size={15} />
                                                  <span>Edit Notes</span>
                                                </Col>
                                              )}
                                            </Row>
                                          </div>
                                        </>
                                      )}

                                      {/* Client Field */}
                                      {(!fieldDisabled || !cancelled) && (
                                        <div className="formIconSearch">
                                          <FormIconField
                                            id="Search"
                                            name={`searchKeyword-add-[${i}]`}
                                            size={10}
                                            iconsName="entypo:select-arrows"
                                            className={classNames({
                                              'input-group-merge d-none': true,
                                              'd-flex':
                                                i ===
                                                formik.values.appointment
                                                  ?.appointment_services
                                                  .length -
                                                  1
                                            })}
                                            inputClassName="input-control skin-change padding-y-search-md"
                                            iconClassName="icon-control skin-change"
                                            placeholder={
                                              getCalendarClientsPending
                                                ? 'Loading...'
                                                : 'Clients'
                                            }
                                            onChange={(e) =>
                                              setSearchClient(e.target.value)
                                            }
                                            onFocus={() => {
                                              if (!cancelled) {
                                                setOpenClientsList(i)
                                              }
                                              setOpenServicesList(null)
                                            }}
                                          />

                                          {openClientsList === i && (
                                            <ul>
                                              {clientsListData.length > 0 &&
                                                clientsListData.map(
                                                  (data, dataIndex) => (
                                                    <li key={dataIndex}>
                                                      <p
                                                        className={
                                                          'ellipsis-hover'
                                                        }
                                                        title={`${data?.first_name} ${data?.last_name}`}
                                                        onClick={(e) => {
                                                          setOpenClientsList(
                                                            null
                                                          )
                                                          setServiceClientId(
                                                            data?.id
                                                          )

                                                          addClientToAppointment(
                                                            data,
                                                            i
                                                          )
                                                          if (
                                                            formik.values
                                                              .appointment
                                                              ?.appointment_services[
                                                              i
                                                            ].id?.id !==
                                                            data?.id
                                                          ) {
                                                            formik.setFieldValue(
                                                              `appointment.appointment_services[${i}].services`,
                                                              []
                                                            )
                                                          }
                                                        }}
                                                      >
                                                        <span>+</span>
                                                        {`${data?.first_name} ${data?.last_name}`}
                                                      </p>
                                                      <p>
                                                        {
                                                          billingTypeOptions[
                                                            parseInt(
                                                              data?.billing_type
                                                            )
                                                          ]?.label
                                                        }
                                                      </p>
                                                    </li>
                                                  )
                                                )}
                                            </ul>
                                          )}
                                        </div>
                                      )}

                                      {formik.values.appointment
                                        .appointment_services[i]?.services && (
                                        <FieldArray
                                          name={`appointment.appointment_services[${i}].services`}
                                          render={(serviceHelpers) => (
                                            <>
                                              {formik.values.appointment
                                                ?.appointment_services[i]
                                                ?.services.length > 0 && (
                                                <>
                                                  <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                                                    <Briefcase size={15} />
                                                    <span>Services</span>
                                                  </div>

                                                  {item?.services.map(
                                                    (
                                                      serviceObj,
                                                      serviceIndex
                                                    ) => (
                                                      <Row
                                                        className="clients__row"
                                                        key={serviceIndex}
                                                      >
                                                        <Col
                                                          sm={12}
                                                          className={classNames(
                                                            {
                                                              'clients__row--div': true,
                                                              smallScreenPopup:
                                                                !isMobile
                                                            }
                                                          )}
                                                          // className={classNames(
                                                          //   {
                                                          //     'clients__row--div': true
                                                          //   }
                                                          // )}
                                                        >
                                                          <span className="service-name">
                                                            <b>
                                                              {`${
                                                                serviceObj
                                                                  ?.service
                                                                  ?.code || '--'
                                                              }`}
                                                            </b>
                                                            &nbsp;
                                                            {
                                                              serviceObj
                                                                ?.service
                                                                ?.service
                                                            }
                                                          </span>

                                                          <div className="d-flex align-items-center">
                                                            <span className="d-flex align-items-center">
                                                              <b>$ </b>
                                                              <b>
                                                                {' '}
                                                                {parseInt(
                                                                  serviceObj?.fees
                                                                )}
                                                              </b>
                                                            </span>
                                                            <Icon
                                                              icon="uiw:edit"
                                                              width="15"
                                                              height="15"
                                                              className={classNames(
                                                                {
                                                                  pointer: true,
                                                                  'd-none':
                                                                    disabledField
                                                                }
                                                              )}
                                                              onClick={() => {
                                                                handleUpdateFee(
                                                                  `appointment.appointment_services[${i}].services[${serviceIndex}].fees`,
                                                                  serviceObj?.fees,
                                                                  serviceObj
                                                                    ?.service
                                                                    ?.code,
                                                                  true
                                                                )
                                                              }}
                                                            />
                                                            <Icon
                                                              icon="bi:trash"
                                                              width="15"
                                                              height="15"
                                                              className={classNames(
                                                                {
                                                                  pointer: true,
                                                                  'd-none':
                                                                    disabledField
                                                                }
                                                              )}
                                                              onClick={() => {
                                                                serviceHelpers.remove(
                                                                  serviceIndex
                                                                )
                                                              }}
                                                            />
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    )
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        />
                                      )}

                                      {/* Service Field */}
                                      {(!fieldDisabled || !cancelled) && (
                                        <div className="formIconSearch">
                                          <FormIconField
                                            id="Search-services"
                                            name={`search-services-[${i}]`}
                                            size={10}
                                            iconsName="entypo:select-arrows"
                                            className={classNames({
                                              'input-group-merge d-none': true,
                                              'd-flex':
                                                i ===
                                                formik.values.appointment
                                                  ?.appointment_services
                                                  .length -
                                                  1
                                            })}
                                            inputClassName="input-control skin-change padding-y-search-md"
                                            iconClassName="icon-control skin-change"
                                            disabled={
                                              getClientServices.length === 0
                                            }
                                            placeholder={
                                              getClientServicesPending
                                                ? 'Loading...'
                                                : 'Services'
                                            }
                                            onChange={(e) => {
                                              setSearchServices(e.target.value)
                                            }}
                                            onFocus={() => {
                                              setOpenServicesList(i)
                                              setOpenClientsList(null)
                                            }}
                                          />

                                          {openServicesList === i && (
                                            <ul>
                                              {clientServicesList.length > 0 &&
                                                clientServicesList.map(
                                                  (data, dataIndex) => (
                                                    <li key={dataIndex}>
                                                      <p
                                                        className={
                                                          'ellipsis-hover'
                                                        }
                                                        title={`${data.service?.service} | ${data.service?.time} mints`}
                                                        onClick={(e) => {
                                                          setOpenServicesList(
                                                            null
                                                          )
                                                          addServiceToAppointment(
                                                            data?.service,
                                                            i
                                                          )
                                                        }}
                                                      >
                                                        <span>+</span>
                                                        {`${data.service?.service} | ${data.service?.time} mints`}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          {data.service?.code}
                                                        </strong>
                                                      </p>
                                                    </li>
                                                  )
                                                )}
                                            </ul>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}

                                {(!fieldDisabled || !cancelled) && (
                                  <Button
                                    disabled={fieldDisabled || cancelled}
                                    className="add-more-gray mt-1 w-100"
                                    onClick={() => {
                                      const hasEmpty =
                                        formik.values.appointment?.appointment_services.some(
                                          (client) => isObjEmpty(client.id)
                                        )
                                      if (!hasEmpty) {
                                        arrayHelpers.push({
                                          id: {},
                                          services: []
                                        })
                                      }
                                    }}
                                  >
                                    <Plus size={15} /> <span>Add Client</span>
                                  </Button>
                                )}
                              </div>
                            )
                          }}
                        />
                      </div>

                      <hr />
                    </>
                  ) : client === 'other' ? (
                    <>
                      <div className="Appointment_Form--modal_padding">
                        <FormGroupElement
                          disabled={fieldDisabled || cancelled}
                          inputType="textarea"
                          label="Meeting Description"
                          labelClassName="Appointment_Form--description"
                          inputName="description"
                          placeholder="Write a description here..."
                          rows="5"
                          inputClassName="form-fields  radius-25 resize-none skin-change"
                          {...formik.getFieldProps('description')}
                          formikTouched={formik.touched.description}
                          formikError={formik.errors.description}
                        />
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </>
              <>
                {fieldDisabled || cancelled ? (
                  <div className="d-flex flex-column Appointment_Form--modal_padding">
                    <Button
                      className="mb-1"
                      color="danger"
                      onClick={() => handleOpen()}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex flex-column Appointment_Form--modal_padding">
                    {isObjEmpty(appointmentSelected) ||
                    (!isObjEmpty(appointmentSelected) &&
                      !appointmentSelected.title) ? (
                      <>
                        <Button
                          className="btn-complete"
                          onClick={() => formik.handleSubmit()}
                          disabled={addBtnDisabled}
                        >
                          {addBtnPending ? (
                            <Spinner size="sm" className="spinner-size" />
                          ) : (
                            <Check
                              size={13}
                              className="ethera-check-button-color "
                            />
                          )}

                          <span className="mx-1">Complete</span>
                        </Button>
                        <Button
                          outline
                          type="reset"
                          className="my-1"
                          color="secondary"
                          onClick={() => handleOpen()}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="btn-complete mb-1"
                          onClick={formik.handleSubmit}
                          disabled={updateBtnDisabled}
                        >
                          {updateBtnPending ? (
                            <Spinner size="sm" className="spinner-size" />
                          ) : (
                            <Check
                              size={13}
                              className="ethera-check-button-color"
                            />
                          )}
                          <span className="mx-1 mr-01">Update</span>
                        </Button>
                        {getCalendarAppointment?.booking?.status === 1 ||
                        getCalendarAppointment?.status === 1 ? (
                          <Button
                            className="mb-1 w-100"
                            color="danger"
                            disabled={
                              !bookingDateIsGreaterThanCurrent ||
                              updateBookingPending
                            }
                            onClick={() => handleCancelBooking()}
                            //  outline
                          >
                            Cancel booking
                          </Button>
                        ) : null}
                        <Button
                          className="mb-1 pd"
                          color="danger"
                          disabled={getValidRoomsPending}
                          onClick={() => handleDeleteAppointment(true)}
                          outline
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                )}
                {/* <div className=" Appointment_Form--modal_padding"></div> */}
              </>
            </Form>
          )}
        </>
      </FormikProvider>
    </>
  )
}

export default EditAppointment
