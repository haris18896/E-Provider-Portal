/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  isObjEmpty,
  dateUS,
  dateUnix,
  timeFormat,
  endTimeGreaterThanStartTime
} from '@utils'
import classNames from 'classnames'
import SelectField from '@select'
import CustomSpinner from '@spinner'

import useMediaQuery from '@src/utility/hooks/useMediaQuery'

import Flatpickr from 'react-flatpickr'
import { Link } from 'react-router-dom'
import { Button, Form, Row, Col, Badge, Spinner } from 'reactstrap'
import { Briefcase, Edit2, FileText, UserPlus } from 'react-feather'

import FormGroupElement from '@FormGroupElement'

import '@styles/react/libs/react-select/_react-select.scss'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  updateBookingAction,
  updateBookingAndAppointmentAction,
  updateBookingAppointmentAction,
  ValidateRoomAction
} from '../../../../redux/booking/bookingAction'
import { billingTypeText } from '../../../colors/BadgeColors'
import _ from 'lodash'
import { getModifiedValues } from '../../../../utility/Utils'
function BookingPopForm() {
  const dispatch = useDispatch()

  const {
    getBooking,
    bookingPending,
    validRoomsData,
    validRoomsPending,
    updatePending
  } = useSelector((state) => state.booking)
  const BookingData = getBooking?.booking
  const getAllLocations = useSelector(
    (state) => state.ELocation.getAllLocations?.locationsList
  )
  const roomObj = {
    text: BookingData?.room?.name,
    value: BookingData?.room?.id
  }

  const getAllRooms = validRoomsData?.rooms

  const [client, setClient] = useState('client')
  const [locationsList, setLocationsList] = useState([])
  const [roomsList, setRoomsList] = useState([])
  const [location, setLocation] = useState(null)
  const isMobile = useMediaQuery('(max-width: 544px)')
  const arrLocation = []
  const arrRooms = []

  const removeDuplicateObj = _.unionBy(roomsList, 'value')

  // ** Creating  Rooms lists
  useEffect(() => {
    if (getAllRooms) {
      getAllRooms.forEach((item) => {
        arrRooms.push({
          text: item?.name,
          value: item.id
        })
      })
      setRoomsList([...arrRooms, roomObj])
    }
  }, [getAllLocations, getAllRooms])

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

  // ** Function to handle filters
  const onChangeHandler = (name, value) => {
    if (name === 'location') setLocation(value)
    if (name === 'room') setRoom(value)
  }

  const statusArray = [
    { text: 'Active', value: 1 },
    { text: 'Cancelled', value: 2 },
    { text: 'Complete', value: 3 }
  ]

  const bookingFormSchema = Yup.object().shape({
    // location: Yup.object().nullable(),
    location: Yup.string().required('Location is required'),
    room: Yup.string().required('Room is required'),
    start_date: Yup.date().required('Date is required'),
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    status: Yup.string().required('Status is a required field'),
    startTimeDetails: timeFormat('startTimeDetails').required(),
    endTimeDetails: timeFormat('endTimeDetails')
      .required()
      .concat(endTimeGreaterThanStartTime('startTimeDetails', 'endTimeDetails'))
  })

  const formik = useFormik({
    initialValues: {
      location:
        locationsList?.find((item) => item?.value === BookingData?.location?.id)
          ?.value || '',
      room:
        roomsList?.find((item) => item?.value === BookingData?.room?.id)
          ?.value || '',
      start_date: BookingData?.start_date || null,
      start_time: BookingData?.start_time || '',
      end_time: BookingData?.end_time || '',
      status: BookingData?.status || '',
      startTimeDetails: getBooking?.start_time || '',
      endTimeDetails: getBooking?.end_time || ''
    },
    enableReinitialize: true,
    validationSchema: bookingFormSchema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          location: values.location,
          room: values.room,
          start_date: values.start_date,
          start_time: values.start_time,
          end_time: values.end_time,
          status: values.status,
          startTimeDetails: values.startTimeDetails,
          endTimeDetails: values.endTimeDetails
        }

        const bookingData = {
          location: values.location,
          room: values.room,
          start_date: values.start_date,
          start_time: values.start_time,
          end_time: values.end_time,
          status: values.status
        }

        const appointmentData = {
          startTimeDetails: values.startTimeDetails,
          endTimeDetails: values.endTimeDetails
        }

        const bookingModifiedData = getModifiedValues(
          bookingData,
          formik?.initialValues
        )
        const appointmentModifiedData = getModifiedValues(
          appointmentData,
          formik?.initialValues
        )

        if (
          !isObjEmpty(bookingModifiedData) &&
          !isObjEmpty(appointmentModifiedData)
        ) {
          dispatch(
            updateBookingAndAppointmentAction({
              id: BookingData?.id,
              appointment_id: getBooking?.id,
              data: bookingData,
              appointmentData: {
                start_time: values.startTimeDetails,
                end_time: values.endTimeDetails
              },
              callback: () => {
                resetForm()
              }
            })
          )
        }

        if (
          !isObjEmpty(bookingModifiedData) &&
          isObjEmpty(appointmentModifiedData)
        ) {
          dispatch(
            updateBookingAction({
              id: BookingData?.id,
              data: bookingData,
              callback: () => {
                resetForm()
              }
            })
          )
        }

        if (
          !isObjEmpty(appointmentModifiedData) &&
          isObjEmpty(bookingModifiedData)
        ) {
          dispatch(
            updateBookingAppointmentAction({
              id: BookingData?.id,
              appointment_id: getBooking?.id,
              data: {
                start_time: values.startTimeDetails,
                end_time: values.endTimeDetails
              },
              callback: () => {
                resetForm()
              }
            })
          )
        }
      }
    }
  })

  // ** Fetching Valid Rooms
  useEffect(() => {
    if (formik.values.location || location) {
      dispatch(
        ValidateRoomAction({
          id: formik.values.location || location.target?.value,
          data: {
            start_date: formik.values.start_date,
            start_time: formik.values.start_time,
            end_time: formik.values.end_time,
            provider: BookingData?.provider?.id,
            booking: BookingData?.id
          }
        })
      )
    }
  }, [
    location,
    formik.values.location,
    formik.values.start_date,
    formik.values.start_time,
    formik.values.end_time
  ])

  return (
    <>
      <Form onSubmit={formik.handleSubmit} style={{ minWidth: '250px' }}>
        <h5 className="modal-title modal-heading ethera-dark">
          Appointment Location
        </h5>

        <div className="modal-paddings">
          <Row className="mt-1">
            <Col
              sm={12}
              md={6}
              // className={classNames({
              //   largeScreenPaddings: !isMobile
              // })}
            >
              <FormGroupElement
                inputType="select"
                inputName="location"
                placeholder="select location"
                bsSize="sm"
                onChange={(e) => {
                  onChangeHandler('location', e)
                  formik.setFieldValue(`location`, e.target.value)
                }}
                disabled={BookingData?.status === 3}
                value={formik.values.location}
                inputClassName="radius-25 skin-change"
                formikTouched={formik.touched.location}
                formikError={!!formik.errors.location}
              >
                {locationsList.length > 0 &&
                  locationsList.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
              </FormGroupElement>
            </Col>
            <Col sm={12} md={4}>
              <FormGroupElement
                inputType="select"
                inputName="room"
                bsSize="sm"
                inputClassName="radius-25 skin-change"
                onChange={(e) => {
                  formik.setFieldValue('room', e.target.value)
                }}
                // value={formik.values.room?.id}
                value={formik.values.room}
                placeholder={
                  validRoomsPending
                    ? 'Rooms Loading...'
                    : formik.values.location?.value
                    ? 'Rooms'
                    : 'Select Location First'
                }
                disabled={BookingData?.status === 3}
                // disabled={validRoomsPending || !location?.value}
                formikTouched={formik.touched.room}
                formikError={formik.errors.room}
              >
                {removeDuplicateObj.length > 0 &&
                  removeDuplicateObj.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.text}
                    </option>
                  ))}
              </FormGroupElement>
            </Col>
          </Row>
          <Row className="align-items-center justify-content-between time-date-row">
            <Col sm={12} md={5}>
              <Flatpickr
                data-enable-time
                id="date-time-picker"
                bsSize="sm"
                // {...formik.getFieldProps('date')}
                name="start_date"
                type="date"
                disabled={BookingData?.status === 3}
                className="radius-25 bg-white flat-picker-sm form-control skin-change mb-1"
                value={dateUS(formik.values.start_date, 'America/Los_Angeles')}
                onChange={(date) => {
                  formik.setFieldValue(
                    'start_date',
                    dateUnix(date, 'America/Los_Angeles')
                  )
                }}
                options={{
                  closeOnSelect: false,
                  mode: 'single',
                  enableTime: false,
                  dateFormat: 'n/j/Y'
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
                  disabled={BookingData?.status === 3}
                  className="radius-25 bg-white flat-picker-sm form-control skin-change"
                  options={{
                    mode: 'single',
                    minuteIncrement: 15,
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'h:i K',
                    closeOnSelect: false
                  }}
                  value={formik.values.start_time}
                  onChange={(time) => {
                    formik.setFieldValue(
                      'start_time',
                      moment(`${time}`).format('HH:mm:ss')
                    )
                  }}
                />

                <span>to</span>
                <Flatpickr
                  data-enable-time
                  id="end_time"
                  name="end_time"
                  type="time"
                  disabled={BookingData?.status === 3}
                  className={classNames({
                    'is-invalid': !!formik.errors.end_time,
                    'radius-25 bg-white flat-picker-sm form-control skin-change': true
                  })}
                  options={{
                    mode: 'single',
                    minuteIncrement: 15,
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'h:i K'
                  }}
                  value={formik.values.end_time}
                  onChange={(time) => {
                    formik.setFieldValue(
                      'end_time',
                      moment(`${time}`).format('HH:mm:ss')
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
              <span
                onClick={() => setClient('other')}
                className={classNames({
                  cursorPointer: true,
                  'activeClient ethera-dark': client === 'other'
                })}
              >
                Other
              </span>
            </Col>
            <Col sm={12} md={5}>
              <FormGroupElement
                inputType="select"
                inputName="status"
                bsSize="sm"
                value={formik.values.status}
                onChange={(e) => {
                  formik.setFieldValue('status', e.target.value)
                }}
                disabled={BookingData?.status === 3}
                inputClassName="radius-25 skin-change bg-yellow cursorPointer"
                formikTouched={formik.touched.status}
                formikError={formik.errors.status}
              >
                {statusArray.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.text}
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
                      disabled={BookingData?.status === 3}
                      value={formik.values.startTimeDetails}
                      onChange={(time) => {
                        formik.setFieldValue(
                          'startTimeDetails',
                          moment(`${time}`).format('HH:mm:ss')
                        )
                      }}
                    />

                    <span>to</span>
                    <Flatpickr
                      data-enable-time
                      id="date-time-picker"
                      className={classNames({
                        'is-invalid': !!formik.errors.endTimeDetails,
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
                      disabled={BookingData?.status === 3}
                      value={formik.values.endTimeDetails}
                      onChange={(time) => {
                        formik.setFieldValue(
                          'endTimeDetails',
                          moment(`${time}`).format('HH:mm:ss')
                        )
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                <UserPlus size={15} />
                <span>Clients</span>
              </div>
              <Row className="clients__row">
                <Col
                  sm={12}
                  className={classNames({
                    'clients__row--div': true,
                    smallScreenPopup: !isMobile
                  })}
                >
                  <span>
                    {getBooking?.client?.first_name}{' '}
                    {getBooking?.client?.last_name}
                  </span>
                  <span>
                    {billingTypeText[getBooking?.client?.billing_type]?.text}
                  </span>
                  <strong>$ 150.00</strong>
                </Col>
                <Col
                  sm={12}
                  className="px-0 clients__row--edit"
                >
                  <Edit2 size={15} />
                  <span>Edit Notes</span>
                </Col>
              </Row>

              <Row className="services__row">
                <div className="mb-1 mt-1 appointments-detail-tag white">
                  <Briefcase size={15} />
                  <span>Services</span>
                </div>
                <div
                  className={classNames({
                    'services__row--div': true,
                    smallScreenPopup: !isMobile
                  })}
                >
                  <span>Psychotherapy | 60 min</span>
                  <strong>90873</strong>
                </div>
                <div
                  className={classNames({
                    'services__row--div': true,
                    smallScreenPopup: !isMobile
                  })}
                >
                  <span>consultation | 60 min</span>
                  <strong>900068</strong>
                </div>
              </Row>
            </div>
          </>
        ) : null}
        <hr />

        <div className="d-flex justify-content-between align-items-center appointment-popup-invoice skin-change">
          <div className="appointment-popup-invoice__left">
            <FileText size={20} />
            <span>
              invoice<strong>#00000001</strong>
            </span>
            <Badge color="light-success">Paid</Badge>
          </div>
          <div className="appointment-popup-invoice__right">
            <Button
              disabled
              size="sm"
              className="bg-transparent text-dark border-none"
            >
              View invoice
            </Button>
          </div>
          <div></div>
        </div>
        <hr />
        <div className="modal-paddings">
          <Button
            className={
              BookingData?.status === 3
                ? 'w-100 button-close'
                : ' w-100 button-update-color'
            }
            type={BookingData?.status === 3 ? 'button' : 'submit'}
            onClick={() => {
              BookingData?.status === 3 && document.body.click()
            }}
          >
            {updatePending && <Spinner size="sm" className="mx-1" />}
            {BookingData?.status === 3 ? 'Close' : 'Update'}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default BookingPopForm
