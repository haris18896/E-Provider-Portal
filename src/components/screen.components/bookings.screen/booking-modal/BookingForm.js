/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'

// ** hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** Utils
import {
  dateUS,
  dateUnix,
  timeFormat,
  isObjEmpty,
  getChangedData,
  getSuperModifiedValues,
  endTimeGreaterThanStartTime
} from '@utils'

// ** Third party packages
import {
  Button,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import * as Yup from 'yup'
import moment from 'moment'
import SelectField from '@select'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import FormIconField from '@FormIconField'
import { useNavigate } from 'react-router-dom'
import FormGroupElement from '@FormGroupElement'
import { FieldArray, useFormik, FormikProvider } from 'formik'
import { Briefcase, Edit2, FileText, Plus, UserPlus, X } from 'react-feather'

// ** components
import { calendarStatusObj } from '../../constants'
import { StatusObj, invoiceStatus } from '../../../colors/BadgeColors'
import { billingTypeOptions } from '../../calendar.screen/AppointmentForm/constants'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getBookingInvoice,
  updateBookingAction,
  updateAppointmentAction,
  updateAppointmentWithBookingAction
} from '../../../../redux/booking/bookingAction'
import {
  getCalendarClientsAction,
  getCalendarClientServicesAction,
  getCalendarValidRoomsAction,
  updateCalendarBookingWithAppointmentAction
} from '../../../../redux/calendar/calendarActions'

import '@styles/react/libs/react-select/_react-select.scss'

const BookingForm = ({ endDate, handleOpen, startDate, locationsList }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width: 544px)')
  const provider_id = useSelector((state) => state.auth?.user?.user_id)

  // ** Date
  const today = new Date()
  const datePrev = new Date()
  datePrev.setDate(datePrev.getDate() - 1) // yesterday

  const {
    getBooking,
    updatePending,
    appointmentPending,
    bookingInvoice,
    bookingInvoicePending
  } = useSelector((state) => state.booking)
  const {
    getClientServices,
    getCalendarClients,
    getValidRoomsPending,
    updateBookingPending,
    updateAppointmentPending,
    getClientServicesPending,
    getCalendarClientsPending,
    updateBookingWithAppointmentPending
  } = useSelector((state) => state.calendar)

  const BookingData = getBooking?.booking
  const disabledField =
    getBooking?.status === 2 ||
    BookingData?.status === 2 ||
    getBooking?.status === 3 ||
    BookingData?.status === 3
  const [client, setClient] = useState('client')
  const [roomsList, setRoomsList] = useState([])
  const [updateFeeData, setUpdateFeeData] = useState({})
  const [searchClient, setSearchClient] = useState('')
  const [openClientsList, setOpenClientsList] = useState(null)
  const [searchServices, setSearchServices] = useState('')
  const [serviceClientId, setServiceClientId] = useState('')
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const [openServicesList, setOpenServicesList] = useState(false)

  const CloseBtn = (
    <X className="pointer" size={15} onClick={() => setUpdateFeeModal(false)} />
  )
  const CurrentDate = moment()
  const bookingDateIsGreaterThanCurrent = moment
    .unix(getBooking?.booking?.start_date)
    .isAfter(CurrentDate)
  // ** Booking Invoice
  useEffect(() => {
    if (open && BookingData?.id) {
      dispatch(getBookingInvoice(getBooking?.id))
    }
  }, [open, BookingData])

  // ** Clients
  useEffect(() => {
    if (open) {
      dispatch(getCalendarClientsAction({ offset: 0, limit: 1000 }))
    }
  }, [open])

  // ** Client Services
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
    if (getBooking && getBooking?.appointment_services) {
      return getBooking?.appointment_services.map((item) => {
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
  }, [getBooking, getBooking?.appointment_services])

  const initial_clients = useMemo(() => {
    if ((getBooking, getBooking?.appointment_services)) {
      return getBooking?.appointment_services.map((item) => item?.id?.id)
    } else return []
  }, [getBooking, getBooking?.appointment_services])

  const Schema = Yup.object().shape({
    booking: Yup.object().shape({
      location: Yup.object().shape({
        label: Yup.string(),
        value: Yup.string()
      }),
      start_time: timeFormat('start_time').required(),
      end_time: timeFormat('end_time')
        .required()
        .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
      start_date: Yup.string(),
      room: Yup.object()
        .shape({
          label: Yup.string(),
          value: Yup.string()
        })
        .required('Room is a required field')
    }),
    appointment: Yup.object().shape({
      appointment_services: Yup.array().of(
        Yup.object().shape({
          id: Yup.object(),
          services: Yup.array().of(Yup.object())
        })
      ),
      status: Yup.number(),
      clients: Yup.array().of(Yup.string()),
      start_time: timeFormat('start_time').required(),
      end_time: timeFormat('end_time')
        .required()
        .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
      start_date: Yup.string()
    })
  })

  const formik = useFormik({
    initialValues: {
      booking: {
        location: getBooking?.booking?.location
          ? {
              label: getBooking?.booking?.location?.name,
              value: getBooking?.booking?.location?.id
            }
          : {
              label: '',
              value: ''
            },
        start_time: getBooking?.booking?.start_time || '09:00:00',
        end_time: getBooking?.booking?.end_time || '10:00:00',
        start_date: getBooking?.booking?.start_date || dateUnix(today),
        room: getBooking?.booking?.room
          ? {
              label: getBooking?.booking?.room?.name,
              value: getBooking?.booking?.room?.id
            }
          : {
              label: '',
              value: ''
            }
      },
      appointment: {
        clients: initial_clients || [],
        appointment_services: getBooking?.appointment_services || [
          {
            id: {},
            services: []
          }
        ],
        status: parseInt(getBooking?.status),

        start_time: getBooking?.start_time || '09:00:00',
        end_time: getBooking?.end_time || '10:00:00'
      }
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const appointmentServices =
          values?.appointment?.appointment_services.map((item) => ({
            id: item?.id?.id,
            services: item?.services?.flatMap(
              (service) =>
                ({
                  service: service?.service?.id,
                  fees: service?.fees
                } ?? [])
            )
          })) ?? []

        const clients =
          values?.appointment?.appointment_services.map(
            (item) => item?.id?.id
          ) ?? []

        const booking = {
          location: values.booking?.location?.value,
          room: values.booking?.room?.value,
          start_date: values.booking?.start_date,
          start_time: values.booking?.start_time,
          end_time: values.booking?.end_time
        }

        const appointment = {
          clients: [...new Set(clients)],
          start_time: values?.appointment?.start_time,
          end_time: values?.appointment?.end_time,
          status: values.appointment?.status
        }

        const appointment_modified_values = getSuperModifiedValues(
          appointment,
          {
            clients: formik.initialValues.appointment?.clients,
            start_time: formik.initialValues.appointment.start_time,
            end_time: formik.initialValues.appointment.end_time,
            status: formik.initialValues.appointment?.status
          }
        )

        const booking_modified_values = getSuperModifiedValues(booking, {
          location: formik.initialValues.booking?.location?.value,
          start_date: formik.initialValues.booking?.start_date,
          start_time: formik.initialValues.booking.start_time,
          end_time: formik.initialValues.booking.end_time,
          room: formik.initialValues.booking.room?.value
        })

        const filteredAppointmentServices = appointmentServices.filter((item) =>
          Boolean(item.id)
        )
        const modifiedAppointment =
          getBooking &&
          getChangedData(
            initial_appointment_services,
            filteredAppointmentServices
          )

        if (
          !isObjEmpty(appointment_modified_values) ||
          !isObjEmpty(modifiedAppointment)
        ) {
          appointment_modified_values.start_date = booking?.start_date
          appointment_modified_values.appointment_services = appointmentServices
        }

        // ** Update Booking
        if (
          !isObjEmpty(booking_modified_values) &&
          isObjEmpty(appointment_modified_values)
        ) {
          dispatch(
            updateBookingAction({
              id: getBooking?.booking?.id,
              data: booking_modified_values,
              startDate,
              endDate,
              callback: () => {
                // resetForm()
                handleOpen()
              }
            })
          )
        }

        // ** Update Appointment
        if (
          !isObjEmpty(appointment_modified_values) &&
          isObjEmpty(booking_modified_values)
        ) {
          dispatch(
            updateAppointmentAction({
              id: getBooking?.id,
              data: appointment_modified_values,
              callback: () => {
                resetForm()
                handleOpen()
              }
            })
          )
        }

        // ** Update Appointment and Booking
        if (
          !isObjEmpty(booking_modified_values) &&
          !isObjEmpty(appointment_modified_values)
        ) {
          dispatch(
            updateCalendarBookingWithAppointmentAction({
              booking_id: getBooking?.booking?.id,
              appointment_id: getBooking?.id,
              appointmentData: appointment_modified_values,
              bookingData: booking_modified_values,
              callback: () => {
                resetForm()
                handleOpen()
              }
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
      updateBookingAction({
        id: getBooking?.booking?.id,
        data,
        startDate,
        endDate,
        callback: () => {
          handleOpen()
        }
      })
    )
  }
  // ** Fetching Valid Rooms
  useEffect(() => {
    if (formik.values.booking?.location?.value) {
      const data = {
        start_time: formik.values.booking?.start_time,
        end_time: formik.values.booking?.end_time,
        selected_dates: [formik.values.booking?.start_date],
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
    formik.values.booking?.start_date,
    formik.values.booking?.start_time,
    formik.values.booking?.location?.value
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
                className="button-cancel mx-1 pd"
                size="sm"
                onClick={() => {
                  handleUpdateFee('', '', '', false)
                }}
              >
                <span className="px-1">Cancel</span>
              </Button>

              <Button
                className="button-success"
                size="sm"
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
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} style={{ minWidth: '250px' }}>
          <h5 className="modal-title modal-heading ethera-dark">
            Appointment Location
          </h5>

          <div className="modal-paddings">
            <Row className="mt-1">
              <Col sm={12} md={6}>
                <SelectField
                  className="plr-0 position-relative p-0"
                  header
                  disabled={disabledField}
                  menuHeight="9rem"
                  search={false}
                  value={formik.values.booking.location}
                  data={locationsList}
                  onChange={(e) => {
                    formik.setFieldValue('booking.location', e)
                    formik.setFieldValue('booking.room', null)
                  }}
                  formikError={!!formik.errors.booking?.location}
                />
              </Col>
              <Col sm={12} md={4}>
                <SelectField
                  className={classNames({
                    'is-invalid': !roomsList?.length,
                    'plr-0 position-relative': true
                  })}
                  header
                  search={false}
                  menuHeight="9rem"
                  value={formik.values?.booking.room}
                  formikError={!!formik.errors?.booking?.room}
                  data={formik.values.booking?.location?.value ? roomsList : []}
                  placeholder={getValidRoomsPending ? '--' : 'Rooms'}
                  onChange={(e) => {
                    formik.setFieldValue('booking.room', e)
                  }}
                  disabled={
                    disabledField ||
                    getValidRoomsPending ||
                    !formik.values.booking?.location?.value
                  }
                  isLoading={getValidRoomsPending}
                />
              </Col>
            </Row>
            <Row className="align-items-center justify-content-between time-date-row mt-1">
              <Col sm={12} md={5}>
                <Flatpickr
                  data-enable-time
                  id="date-time-picker"
                  bsSize="sm"
                  // {...formik.getFieldProps('date')}
                  name="start_date"
                  type="date"
                  disabled={disabledField}
                  className="radius-25 bg-white flat-picker-sm form-control skin-change mb-1"
                  value={dateUS(formik.values.booking.start_date)}
                  onChange={(date) => {
                    formik.setFieldValue(
                      'booking.start_date',
                      dateUnix(date[0])
                    )
                  }}
                  options={{
                    mode: 'single',
                    enableTime: false,
                    dateFormat: 'n/j/Y',
                    maxDate: moment().add(1, 'months').format('MM/DD/YYYY')
                  }}
                />
              </Col>
              <Col sm={12} md={7}>
                <div className="d-flex align-items-center mb-1">
                  <Flatpickr
                    data-enable-time
                    id="start_time"
                    name="start_time"
                    type="time"
                    disabled={disabledField}
                    className="radius-25 bg-white flat-picker-sm form-control skin-change"
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                    value={formik.values.booking.start_time}
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
                  />

                  <span>to</span>
                  <Flatpickr
                    data-enable-time
                    id="end_time"
                    name="end_time"
                    type="time"
                    disabled={disabledField}
                    className={classNames({
                      'is-invalid': !!formik.errors.booking?.end_time,
                      'radius-25 bg-white flat-picker-sm form-control skin-change': true
                    })}
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                    value={formik.values.booking?.end_time}
                    onChange={(time) => {
                      formik.setFieldValue(
                        'booking.end_time',
                        moment(time[0]).format('HH:mm:ss')
                      )
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <hr />
          <h5 className="modal-title modal-heading ethera-dark">
            Appointment Details
          </h5>

          <div className="modal-paddings">
            <Row className="justify-content-between mt-1">
              <Col
                sm={12}
                md={7}
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
              <Col sm={12} md={5}>
                <FormGroupElement
                  inputType="select"
                  inputName="number"
                  bsSize="sm"
                  value={formik.values.appointment?.status}
                  onChange={(e) => {
                    formik.setFieldValue('appointment.status', e.target.value)
                  }}
                  disabled={disabledField}
                  inputClassName="radius-25 skin-change bg-yellow cursorPointer"
                  formikTouched={formik.touched.appointment?.status}
                  formikError={formik.errors.appointment?.status}
                >
                  {Object.entries(calendarStatusObj).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.text}
                    </option>
                  ))}
                </FormGroupElement>
              </Col>
            </Row>
          </div>

          {client === 'client' ? (
            <>
              <hr className="m-0" />
              <div className="modal-paddings">
                <Row className="justify-content-between time-date-row mt-1">
                  <Col sm={12} md={8}>
                    <div className="d-flex align-items-center">
                      <Flatpickr
                        data-enable-time
                        id="date-time-picker"
                        className="radius-25 bg-white flat-picker-sm form-control skin-change"
                        {...formik.getFieldProps('startTimeDetails')}
                        options={{
                          mode: 'single',
                          minuteIncrement: 15,
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: 'h:i K'
                        }}
                        disabled={disabledField}
                        value={formik.values.appointment?.start_time}
                        onChange={(time) => {
                          const bookingEndTime = formik.values.booking.end_time
                          const bookingStartTime =
                            formik.values.booking.start_time
                          formik.setFieldValue(
                            'appointment.start_time',
                            moment(time[0]).format('HH:mm:ss')
                          )
                          formik.setFieldValue(
                            'appointment.end_time',
                            moment(time[0]).add(1, 'hour').format('HH:mm:ss')
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
                      />

                      <span>to</span>
                      <Flatpickr
                        data-enable-time
                        id="date-time-picker"
                        className={classNames({
                          'is-invalid': !!formik.errors.appointment?.end_time,
                          'radius-25 bg-white flat-picker-sm form-control skin-change': true
                        })}
                        {...formik.getFieldProps('endTimeDetails')}
                        options={{
                          mode: 'single',
                          minuteIncrement: 15,
                          enableTime: true,
                          noCalendar: true,
                          dateFormat: 'h:i K'
                        }}
                        disabled={disabledField}
                        value={formik.values.appointment?.end_time}
                        onChange={(time) => {
                          formik.setFieldValue(
                            'appointment.end_time',
                            moment(time[0]).format('HH:mm:ss')
                          )
                        }}
                      />
                    </div>
                  </Col>
                </Row>

                <FieldArray
                  name="appointment.appointment_services"
                  render={(arrayHelpers) => {
                    return (
                      <div className="Appointment_Form--modal_padding px-0">
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
                              {formik.values.appointment?.appointment_services[
                                i
                              ]?.id?.id && (
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
                                        } ${item?.id?.last_name || ''}`}</span>

                                        <span>
                                          {
                                            billingTypeOptions[
                                              parseInt(item?.billing_type)
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
                                      {BookingData?.status === 3 && (
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
                              {!disabledField && (
                                <div className="formIconSearch">
                                  <FormIconField
                                    id="Search"
                                    name={`searchKeyword-add-[${i}]`}
                                    size={10}
                                    iconsName="entypo:select-arrows"
                                    className="input-group-merge"
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
                                      setOpenClientsList(i)
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
                                                className={'ellipsis-hover'}
                                                title={`${data?.first_name} ${data?.last_name}`}
                                                onClick={(e) => {
                                                  setOpenClientsList(null)
                                                  setServiceClientId(data?.id)

                                                  addClientToAppointment(
                                                    data,
                                                    i
                                                  )
                                                  if (
                                                    formik.values.appointment
                                                      ?.appointment_services[i]
                                                      .id?.id !== data?.id
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
                                                    parseInt(data?.billing_type)
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

                              {formik.values.appointment.appointment_services[i]
                                ?.services && (
                                <FieldArray
                                  name={`appointment.appointment_services[${i}].services`}
                                  render={(serviceHelpers) => (
                                    <>
                                      {formik.values.appointment
                                        ?.appointment_services[i]?.services
                                        .length > 0 && (
                                        <>
                                          <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                                            <Briefcase size={15} />
                                            <span>Services</span>
                                          </div>

                                          {item?.services.map(
                                            (serviceObj, serviceIndex) => (
                                              <Row
                                                className="clients__row"
                                                key={serviceIndex}
                                              >
                                                <Col
                                                  sm={12}
                                                  className={classNames({
                                                    'clients__row--div': true,
                                                    smallScreenPopup: !isMobile
                                                  })}
                                                >
                                                  <span className="service-name">
                                                    <b>
                                                      {`${
                                                        serviceObj?.service
                                                          ?.code || '--'
                                                      }`}
                                                    </b>
                                                    &nbsp;
                                                    {
                                                      serviceObj?.service
                                                        ?.service
                                                    }
                                                  </span>

                                                  <div>
                                                    <span>
                                                      <b>
                                                        ${' '}
                                                        {parseInt(
                                                          serviceObj?.fees
                                                        )}
                                                      </b>
                                                    </span>
                                                    <Icon
                                                      icon="uiw:edit"
                                                      width="15"
                                                      height="15"
                                                      className={classNames({
                                                        pointer: true,
                                                        'd-none': disabledField
                                                      })}
                                                      onClick={() => {
                                                        if (!disabledField) {
                                                          handleUpdateFee(
                                                            `appointment.appointment_services[${i}].services[${serviceIndex}].fees`,
                                                            serviceObj?.fees,
                                                            serviceObj?.service
                                                              ?.code,
                                                            true
                                                          )
                                                        }
                                                      }}
                                                    />

                                                    <Icon
                                                      icon="bi:trash"
                                                      width="15"
                                                      height="15"
                                                      className={classNames({
                                                        pointer: true,
                                                        'd-none': disabledField
                                                      })}
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
                              {!disabledField && (
                                <div className="formIconSearch">
                                  <FormIconField
                                    id="Search-services"
                                    name={`search-services-[${i}]`}
                                    size={10}
                                    iconsName="entypo:select-arrows"
                                    className="input-group-merge"
                                    inputClassName="input-control skin-change padding-y-search-md"
                                    iconClassName="icon-control skin-change"
                                    disabled={getClientServices.length === 0}
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
                                                className={'ellipsis-hover'}
                                                onClick={(e) => {
                                                  setOpenServicesList(null)
                                                  addServiceToAppointment(
                                                    data?.service,
                                                    i
                                                  )
                                                }}
                                                title={`${data?.service?.service} | ${data.service?.time} mints`}
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

                        {!disabledField && (
                          <Button
                            disabled={disabledField}
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
            </>
          ) : null}

          {BookingData?.status === 3 && (
            <>
              <hr />

              <div className="d-flex justify-content-between align-items-center appointment-popup-invoice skin-change">
                <div className="appointment-popup-invoice__left">
                  <FileText size={20} />
                  <span>
                    invoice
                    <strong>
                      &nbsp;#{bookingInvoice?.invoice_number || 'Loading...'}
                    </strong>
                  </span>
                  {!bookingInvoicePending && (
                    <Badge
                      color={
                        invoiceStatus[parseInt(bookingInvoice?.status)]?.color
                      }
                    >
                      {invoiceStatus[parseInt(bookingInvoice?.status)]?.text ||
                        '--'}
                    </Badge>
                  )}
                </div>
                <div className="appointment-popup-invoice__right">
                  <Button
                    onClick={() =>
                      navigate(
                        `/clients/client/edit-invoice/${getBooking?.appointment_services[0]?.id?.id}/${bookingInvoice?.id}`
                      )
                    }
                    size="sm"
                    className="bg-transparent text-dark border-none"
                  >
                    View invoice
                  </Button>
                </div>
                <div></div>
              </div>
            </>
          )}
          <hr />

          <div className="modal-paddings my-2">
            {disabledField && (
              <Button
                type={'button'}
                className={'w-100 pd button-close'}
                onClick={() => handleOpen(false)}
              >
                Close
              </Button>
            )}

            {getBooking?.booking?.status === 1 && (
              <>
                <Button
                  disabled={
                    !formik.dirty ||
                    updatePending ||
                    appointmentPending ||
                    updateAppointmentPending ||
                    updateBookingWithAppointmentPending ||
                    formik.values.appointment?.appointment_services?.some(
                      (item) =>
                        item?.services?.length === 0 && !isObjEmpty(item.id)
                    )
                  }
                  className={'w-100 button-update-color'}
                  type={'submit'}
                >
                  {(appointmentPending ||
                    updatePending ||
                    updateAppointmentPending ||
                    updateBookingWithAppointmentPending) && (
                    <Spinner size="sm" />
                  )}
                  <span className="px-1">Update</span>
                </Button>
              </>
            )}
            {/* {getBooking?.booking?.status === 1 ||
            getBooking?.status === 1 ? ( */}
              <Button
                disabled={!bookingDateIsGreaterThanCurrent || updatePending}
                type={'button'}
                color="danger"
                className={'w-100 pd mt-1 m-b-5'}
                onClick={() => handleCancelBooking()}
              >
                Cancel booking
              </Button>
            {/* ) : null} */}
          </div>
        </Form>
      </FormikProvider>
    </>
  )
}

export default BookingForm
