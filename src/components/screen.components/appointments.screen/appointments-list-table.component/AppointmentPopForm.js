/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// Utilities
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  isObjEmpty,
  timeFormat,
  endTimeGreaterThanStartTime,
  dateUS,
  dateUnix
} from '@utils'

// hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// Third party components
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { Link } from 'react-router-dom'
import { Button, Form, Row, Col, Badge, Modal, ModalBody, Spinner } from 'reactstrap'
import { Briefcase, Edit2, FileText, UserPlus } from 'react-feather'

// components
import SelectField from '@select'
import FormGroupElement from '@FormGroupElement'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  updateBookingAction,
  updateBookingAppointmentAction
} from '../../../../redux/booking/bookingAction'
import { billingTypeText } from '../../../colors/BadgeColors'
import { updateAppointmentAction } from '../../../../redux/appointments/appointmentsAction'

function AppointmentPopForm() {
  const dispatch = useDispatch()

  const [client, setClient] = useState('client')
  const [locationsList, setLocationsList] = useState([])
  const [location, setLocation] = useState(null)
  const isMobile = useMediaQuery('(max-width: 544px)')
  const arrLocation = []

  const { getAppointment, appointmentPending, updatePending} = useSelector(
    (state) => state.appointments
  )
  const rows = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )
  const getAllLocations = rows


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
  }
  const statusArray = [
    { text: 'Complete', value: 1 },
    { text: 'Incomplete', value: 2 },
    { text: 'Upcoming', value: 3 },
    { text: 'Pending', value: 4 },
    { text: 'Deleted', value: 5 },
    { text: 'Unpaid', value: 6 },
    { text: 'Paid', value: 7 }
  ]

  const appointmentFormSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    // room: Yup.string().required('Room is required'),
    date: Yup.date().required('Date is required'),
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    status: Yup.string().required('Status is a required field')
  })

  const formik = useFormik({
    initialValues: {
      location:
        locationsList?.find(
          (item) => item?.value === getAppointment?.provider_location?.id
        )?.value || '',
      date: getAppointment?.start_date,
      start_time: getAppointment?.start_time || '',
      end_time: getAppointment?.end_time || '',
      status: getAppointment?.status || ''
    },
    enableReinitialize: true,
    validationSchema: appointmentFormSchema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          location: values.location,
          start_date: values.date,
          start_time: values.start_time,
          end_time: values.end_time,
          status: values.status
        }

        dispatch(
          updateAppointmentAction({
            id: getAppointment?.id,
            data,
            callback: () => {
              resetForm()
            }
          })
        )
      }
    }
  })

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
              md={8}
              // className={classNames({
              //   largeScreenPaddings: !isMobile
              // })}
            >
              <FormGroupElement
                inputType="select"
                inputName="venue"
                placeholder="select Location"
                bsSize="sm"
                inputClassName="radius-25 skin-change"
                onChange={(e) => {
                  onChangeHandler('location', e)
                  formik.setFieldValue(`location`, e.target.value)
                }}
                disabled={getAppointment?.status === 1}
                value={formik.values.location}
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

              {/* <SelectField
                label="Icon"
                data={options}
                change={(e) => formik.setFieldValue('venue', e.text)}
              /> */}
            </Col>
            {/* <Col sm={12} md={4}>
              <FormGroupElement
                inputType="select"
                inputName="room"
                bsSize="sm"
                inputClassName="radius-25 skin-change"
                onChange={(e) => {
                  formik.setFieldValue('room', e.target.value)
                }}
                // value={formik.values.room?.id}
                value={{
                  text: BookingData?.room?.name,
                  value: BookingData?.room?.id
                }}
                placeholder={
                  validRoomsPending
                    ? 'Rooms Loading...'
                    : formik.values.location?.value
                    ? 'Rooms'
                    : 'Select Location First'
                }
                disabled={BookingData?.status === 1}
                // disabled={validRoomsPending || !location?.value}
                formikTouched={formik.touched.room}
                formikError={formik.errors.room}
              >
                {location?.target?.value ? (
                  roomsList.length > 0 &&
                  roomsList.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.text}
                    </option>
                  ))
                ) : (
                  <option value={BookingData?.room?.id}>
                    {BookingData?.room?.name}
                  </option>
                )}
              </FormGroupElement>
            </Col> */}
          </Row>
          <Row className="align-items-center justify-content-between time-date-row">
            <Col sm={12} md={8}>
              <Flatpickr
                data-enable-time
                id="date-time-picker"
                bsSize="sm"
                // {...formik.getFieldProps('date')}
                name="date"
                type="date"
                disabled={getAppointment?.status === 1}
                className="radius-25 bg-white flat-picker-sm form-control skin-change mb-1"
                value={dateUS(formik.values.date, 'America/Los_Angeles')}
                onChange={(date) => {
                  formik.setFieldValue(
                    'date',
                    dateUnix(date, 'America/Los_Angeles')
                  )
                }}
                options={{
                  mode: 'single',
                  enableTime: false,
                  dateFormat: 'n/j/Y'
                }}
              />
            </Col>

            {/* <Col sm={12} md={8}>
              <div className="d-flex align-items-center mb-1">
                <Flatpickr
                  data-enable-time
                  id="start_time"
                  name="start_time"
                  type="time"
                  disabled={BookingData?.status === 1}
                  className="radius-25 bg-white flat-picker-sm form-control skin-change "
                  options={{
                    mode: 'single',
                    minuteIncrement: 15,
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'h:i K'
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
                  disabled={BookingData?.status === 1}
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
            </Col> */}
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
                disabled={getAppointment?.status === 1}
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
                      {...formik.getFieldProps('start_time')}
                      options={{
                        mode: 'single',
                        minuteIncrement: 15,
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'h:i K'
                      }}
                      disabled={getAppointment?.status === 1}
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
                      id="date-time-picker"
                      className={classNames({
                        'is-invalid': !!formik.errors.endTimeDetails,
                        'radius-25 bg-white flat-picker-sm form-control skin-change': true
                      })}
                      {...formik.getFieldProps('end_time')}
                      options={{
                        mode: 'single',
                        minuteIncrement: 15,
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'h:i K'
                      }}
                      disabled={getAppointment?.status === 1}
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
                    {getAppointment?.client?.first_name}{' '}
                    {getAppointment?.client?.last_name}
                  </span>
                  <span>
                    {
                      billingTypeText[getAppointment?.client?.billing_type]
                        ?.text
                    }
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
            <Button disabled className="bg-transparent text-dark" size="sm">
              View invoice
            </Button>
          </div>
          <div></div>
        </div>
        <hr />
        <div className="modal-paddings">
          <Button
            className={
              getAppointment?.status === 1
                ? 'w-100 button-close'
                : ' w-100 button-update-color'
            }
            type={getAppointment?.status === 1 ? 'button' : 'submit'}
            onClick={() =>
              getAppointment?.status === 1 && document.body.click()
            }
          >
            {updatePending && <Spinner size="sm" className='mx-1'/>}
            {getAppointment?.status === 1 ? 'Close' : 'Update'}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AppointmentPopForm
