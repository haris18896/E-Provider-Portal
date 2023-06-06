/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'

// Utilities
import * as Yup from 'yup'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  dateUS,
  dateUnix,
  isObjEmpty,
  timeFormat,
  getSuperModifiedValues,
  endTimeGreaterThanStartTime
} from '@utils'

// hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// Third party components
import {
  Row,
  Col,
  Form,
  Modal,
  Badge,
  Button,
  Spinner,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import FormIconField from '@FormIconField'
import { useNavigate } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Briefcase, Edit2, FileText, Plus, UserPlus, X } from 'react-feather'

// components
import SelectField from '@select'
import CustomSpinner from '@spinner'
import { calendarStatusObj } from '../../constants'
import FormGroupElement from '@FormGroupElement'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import { billingTypeText } from '../../../colors/BadgeColors'
import { updateAppointmentAction } from '../../../../redux/appointments/appointmentsAction'
import { billingTypeOptions } from '../../calendar.screen/AppointmentForm/constants'
import {
  getCalendarClientsAction,
  getCalendarClientServicesAction
} from '../../../../redux/calendar/calendarActions'

const UpdateAppointmentModal = ({
  open,
  status,
  endDate,
  startDate,
  handleOpen,
  onModalOpen,
  onModalClose
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ** Modal Close
  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        handleOpen()
        onModalClose()
      }}
    />
  )

  // ** Selectors
  const { getAppointment, appointmentPending, updatePending } = useSelector(
    (state) => state.appointments
  )
  const rows = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const {
    getClientServices,
    getCalendarClients,
    getClientServicesPending,
    getCalendarClientsPending
  } = useSelector((state) => state.calendar)

  // ** Constants
  const arrLocation = []
  const isMobile = useMediaQuery('(max-width: 544px)')
  const disabledField =
    getAppointment?.status === 2 || getAppointment?.status === 3

  // ** States
  const [client, setClient] = useState('client')
  const [updateFeeData, setUpdateFeeData] = useState({})
  const [searchClient, setSearchClient] = useState('')
  const [openClientsList, setOpenClientsList] = useState(null)
  const [locationsList, setLocationsList] = useState([])
  const [searchServices, setSearchServices] = useState('')
  const [serviceClientId, setServiceClientId] = useState('')
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const [openServicesList, setOpenServicesList] = useState(false)

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

  const initial_clients = useMemo(() => {
    if ((getAppointment, getAppointment?.appointment_services)) {
      return getAppointment?.appointment_services.map((item) => item?.id?.id)
    } else return []
  }, [getAppointment, getAppointment?.appointment_services])

  const Schema = Yup.object().shape({
    location: Yup.object().required('Location is required'),
    start_date: Yup.string(),
    clients: Yup.array().of(Yup.string()),
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    status: Yup.string().required('Status is a required field'),
    appointment_services: Yup.array().of(
      Yup.object().shape({
        id: Yup.object(),
        services: Yup.array().of(Yup.object())
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      location: getAppointment?.provider_location && {
        label: getAppointment?.provider_location?.name,
        value: getAppointment?.provider_location?.id
      },
      clients: initial_clients || [],
      start_date: getAppointment?.start_date || '',
      start_time: getAppointment?.start_time || '',
      end_time: getAppointment?.end_time || '',
      status: getAppointment?.status || '',
      appointment_services: getAppointment?.appointment_services || [
        {
          id: {},
          services: []
        }
      ]
    },
    enableReinitialize: true,
    validationSchema: Schema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const appointmentServices =
          values?.appointment_services.map((item) => ({
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
          values?.appointment_services.map((item) => item?.id?.id) ?? []

        const data = {
          status: values.status,
          end_time: values.end_time,
          start_date: values.start_date,
          start_time: values.start_time,
          clients: [...new Set(clients)].filter((item) => Boolean(item)),
          provider_location: values.location?.value
        }

        const appointment_modified_values =
          getAppointment &&
          getSuperModifiedValues(data, {
            status: formik.initialValues.status,
            end_time: formik.initialValues.end_time,
            start_time: formik.initialValues.start_time,
            start_date: formik.initialValues.start_date,
            clients: formik.initialValues.clients,
            provider_location: formik.initialValues.location?.value
          })

        appointment_modified_values.appointment_services = appointmentServices.filter(item => Boolean(item.id))

        dispatch(
          updateAppointmentAction({
            id: getAppointment?.id,
            data: appointment_modified_values,
            startDate,
            endDate,
            callback: () => {
              resetForm()
              handleOpen()
              onModalClose()
            }
          })
        )
      }
    }
  })

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
    const clients = formik.values.appointment_services.flatMap(
      (item) => item.id?.id
    )

    if (!clients.includes(data?.id)) {
      formik.setFieldValue(`appointment_services[${i}].id`, data)
    }
  }

  // ** Add services to Client's Appointment
  const addServiceToAppointment = (data, i) => {
    const services = formik.values.appointment_services[i]?.services || []

    if (!services.some((service) => service.service?.id === data?.id)) {
      formik.setFieldValue(`appointment_services[${i}].services`, [
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
              defaultValue={updateFeeData?.fees}
              onChange={(e) => (updateFeeData.fees = e.target.value)}
            />

            <div className="d-flex justify-content-end align-items-center mt-1">
              <Button
                size="sm"
                className=" button-cancel pd mx-1"
                // color="light-secondary mx-1"
                onClick={() => {
                  handleUpdateFee('', '', '', false)
                }}
              >
                <span className="px-1">Cancel</span>
              </Button>

              <Button
                size="sm"
                // color="light-success"
                className="  button-success"
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

      <Modal
        isOpen={open}
        toggle={handleOpen}
        onOpened={onModalOpen}
        onClosed={onModalClose}
        className="modal-dialog-centered calendarModal"
      >
        <ModalHeader
          className="mb-1 ethera-modal-top-background"
          toggle={handleOpen}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title ethera-dark fw-600">
            {`${
              status === 1
                ? 'Edit'
                : status === 2
                ? 'Cancelled'
                : status === 3
                ? 'Completed'
                : ''
            }`}{' '}
            Appointment
          </h5>
        </ModalHeader>
        <PerfectScrollbar options={{ wheelPropagation: true }}>
          <ModalBody>
            {appointmentPending ? (
              <div className="padding-top-bottom">
                <CustomSpinner />
              </div>
            ) : (
              <FormikProvider value={formik}>
                <Form
                  onSubmit={formik.handleSubmit}
                  style={{ minWidth: '250px' }}
                >
                  <h5 className="modal-title modal-heading ethera-dark">
                    Appointment Location
                  </h5>

                  <div className="modal-paddings">
                    <Row className="mt-1">
                      <Col sm={12} md={8}>
                        <SelectField
                          className="plr-0 position-relative mb-1 mx-0"
                          wd="100%"
                          header
                          disabled={disabledField}
                          menuHeight="9rem"
                          search={false}
                          value={formik.values.location}
                          data={locationsList}
                          onChange={(e) => {
                            formik.setFieldValue('location', e)
                          }}
                          formikError={!!formik.errors.location}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center justify-content-between time-date-row">
                      <Col sm={12} md={8}>
                        <Flatpickr
                          disabled={disabledField}
                          data-enable-time
                          id="appointmentDate"
                          name="appointmentDate"
                          type="date"
                          className="radius-25 bg-white flat-picker-sm form-control skin-change"
                          value={dateUS(formik.values.start_date)}
                          onChange={(date) => {
                            formik.setFieldValue(
                              'start_date',
                              dateUnix(date[0])
                            )
                          }}
                          options={{
                            enableTime: false,
                            dateFormat: 'n/j/Y',
                            minDate: 'today',
                            mode: 'single',
                            maxDate: moment()
                              .add(1, 'months')
                              .format('MM/DD/YYYY')
                          }}
                        />
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
                          value={formik.values.status}
                          onChange={(e) => {
                            formik.setFieldValue('status', e.target.value)
                          }}
                          disabled={disabledField}
                          inputClassName="radius-25 skin-change bg-yellow cursorPointer"
                          formikTouched={formik.touched.status}
                          formikError={formik.errors.status}
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
                                disabled={disabledField}
                                data-enable-time
                                id="startTime"
                                name="startTime"
                                type="time"
                                className={classNames({
                                  'radius-25 bg-white flat-picker-sm form-control select-w-70 skin-change': true,
                                  invalid: !!formik.errors.start_time
                                })}
                                value={formik.values.start_time}
                                onChange={(time) => {
                                  formik.setFieldValue(
                                    'start_time',
                                    moment(time[0]).format('HH:mm:ss')
                                  )
                                  formik.setFieldValue(
                                    'end_time',
                                    moment(time[0])
                                      .add(1, 'hour')
                                      .format('HH:mm:ss')
                                  )
                                }}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  minuteIncrement: 15,
                                  dateFormat: 'h:i K'
                                }}
                              />

                              <span>to</span>
                              <Flatpickr
                                disabled={disabledField}
                                data-enable-time
                                id="startTime"
                                name="startTime"
                                type="time"
                                className={classNames({
                                  'radius-25 bg-white flat-picker-sm form-control select-w-70 skin-change': true,
                                  invalid: !!formik.errors.end_time
                                })}
                                value={formik.values.end_time}
                                onChange={(time) => {
                                  formik.setFieldValue(
                                    'end_time',
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
                          </Col>
                        </Row>

                        <FieldArray
                          name="appointment_services"
                          validateOnChange={true}
                          render={(arrayHelpers) => {
                            return (
                              <div>
                                {formik.values.appointment_services.map(
                                  (item, i) => (
                                    <div
                                      key={i}
                                      className="Appointment_Form--clientsDetails__selectors"
                                    >
                                      <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                                        <UserPlus size={15} />
                                        <span>Clients</span>
                                      </div>
                                      {formik.values.appointment_services[i]?.id
                                        ?.id && (
                                        <>
                                          <div
                                            className={classNames({
                                              'mt-1':
                                                formik.values
                                                  .appointment_services[i]
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
                                              {getAppointment?.status === 3 && (
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
                                                              .appointment_services[
                                                              i
                                                            ].id?.id !==
                                                            data?.id
                                                          ) {
                                                            formik.setFieldValue(
                                                              `appointment_services[${i}].services`,
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

                                      {formik.values.appointment_services[i]
                                        ?.services && (
                                        <FieldArray
                                          name={`appointment_services[${i}].services`}
                                          render={(serviceHelpers) => (
                                            <>
                                              {formik.values
                                                .appointment_services[i]
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
                                                              smallScreenPopup: !isMobile
                                                            }
                                                          )}
                                                        >
                                                          <span className="service-name" title={serviceObj
                                                              ?.service
                                                              ?.service}>
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

                                                          <div>
                                                            <span>
                                                              <b>
                                                                ${' '}
                                                                {
                                                                  serviceObj?.fees
                                                                }
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
                                                                  `appointment_services[${i}].services[${serviceIndex}].fees`,
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
                                            disabled={
                                              getClientServices.length === 0
                                            }
                                            placeholder={
                                              getClientServicesPending
                                                ? 'Loading...'
                                                : 'Services'
                                            }
                                            onChange={(e) => {}}
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

                                {!disabledField && (
                                  <Button
                                    className="add-more-gray mt-1 w-100"
                                    onClick={() => {
                                      const hasEmpty =
                                        formik.values.appointment_services.some(
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
                  <hr />

                  <div className="modal-paddings mb-2">
                    {disabledField ? (
                      <Button
                        type={'button'}
                        className={'w-100 button-close'}
                        onClick={() => handleOpen(false)}
                      >
                        Close
                      </Button>
                    ) : (
                      <Button
                        disabled={
                          !formik.dirty ||
                          updatePending ||
                          formik.values?.appointment_services?.some(
                            (item) =>
                              item?.services?.length === 0 &&
                              !isObjEmpty(item.id)
                          )
                        }
                        className={'w-100 button-update-color'}
                        type={'submit'}
                      >
                        {updatePending && (
                          <Spinner size="sm" className="mx-1" />
                        )}
                        <span className="px-1">Update</span>
                      </Button>
                    )}

                  </div>
                </Form>
              </FormikProvider>
            )}
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default UpdateAppointmentModal
