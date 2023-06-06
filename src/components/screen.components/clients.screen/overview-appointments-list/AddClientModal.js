/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** Third Party Packages
import * as Yup from 'yup'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import FormIconField from '@FormIconField'
import { FormikProvider, useFormik, FieldArray } from 'formik'
import { Briefcase, Edit2, Plus, UserPlus, X } from 'react-feather'
import {
  Col,
  Row,
  Form,
  Modal,
  Button,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Custom Components
import CustomSpinner from '@spinner'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { billingTypeOptions } from '../../calendar.screen/AppointmentForm/constants'
import { getCalendarClientServicesAction } from '../../../../redux/calendar/calendarActions'
import { AddClientsToAppointmentAction } from '../../../../redux/client/client-detail/clientDetailAction'

// ** Store && Actions

function ClientModal({
  open,
  clientId,
  addClient,
  handleOpen,
  onModalOpen,
  onModalClose,
  clientsList
}) {
  // ** Media Query
  const isMobile = useMediaQuery('(max-width: 600px)')

  // ** Selectors
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.client)
  const { addClientToAppointmentPending } = useSelector(
    (state) => state.clientDetails
  )
  const {
    getClientServices,
    getClientServicesPending,
    getCalendarClientsPending
  } = useSelector((state) => state.calendar)

  // ** mock data
  const cancelled = true // 2 from appointment status
  const fieldDisabled = true // 3 from appointment status

  // ** States
  const [updateFeeData, setUpdateFeeData] = useState({})
  const [searchClient, setSearchClient] = useState('')
  const [openClientsList, setOpenClientsList] = useState(null)
  const [searchServices, setSearchServices] = useState('')
  const [serviceClientId, setServiceClientId] = useState('')
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const [openServicesList, setOpenServicesList] = useState(false)

  const CloseUpdateFeeBtn = (
    <X className="pointer" size={15} onClick={() => setUpdateFeeModal(false)} />
  )

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

  const schema = Yup.object().shape({
    appointment_services: Yup.array().of(
      Yup.object().shape({
        id: Yup.object(),
        services: Yup.array().of(Yup.object())
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      appointment_services: [
        {
          id: {},
          services: []
        }
      ]
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const appointmentServices = values.appointment_services.map((item) => ({
          id: item?.id?.id,
          services: item?.services?.flatMap(
            (service) =>
              ({
                service: service?.service?.id,
                fees: parseInt(service?.fees)
              } ?? [])
          )
        }))

        dispatch(
          AddClientsToAppointmentAction({
            clientId,
            id: addClient?.appointmentId,
            data: { appointment_services: appointmentServices },
            callback: () => {
              resetForm()
              onModalClose()
            }
          })
        )
      }
    }
  })

  // ** Close BTN
  const CloseBtn = (
    <X
      className="pointer"
      size={15}
      onClick={() => {
        handleOpen()
        formik.resetForm()
      }}
    />
  )

  // ** Clients Filtered List
  const clientsListData =
    clientsList?.length > 0 &&
    clientsList.filter(({ first_name, last_name }) => {
      const name = `${first_name} ${last_name}`
      return (
        name.toLowerCase().includes(searchClient.toString().toLowerCase()) ?? []
      )
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

  // ** Client Services Filtered List
  const clientServicesList =
    getClientServices?.length > 0 &&
    getClientServices.filter(({ service }) => {
      const name = `${service?.service} ${service?.code}`
      return name
        .toLowerCase()
        .includes(searchServices.toString().toLowerCase())
    })

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

  const hasEmpty = formik.values.appointment_services.some((client) =>
    isObjEmpty(client.id)
  )

  const hasEmptyService = formik.values.appointment_services.some(
    (client) => client.services.length === 0
  )

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleOpen()
        formik.resetForm()
      }}
      onOpened={onModalOpen}
      onClosed={onModalClose}
      contentClassName="p-0 "
      className="modal-dialog-centered calendarModal"
    >
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
          close={CloseUpdateFeeBtn}
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

      <ModalHeader
        className="ethera-modal-top-background"
        toggle={() => {
          handleOpen()
          formik.resetForm()
        }}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark">Add Client</h5>
      </ModalHeader>

      <ModalBody
        className="flex-grow-1 pb-sm-0 pb-3"
        style={{ height: '-webkit-fill-available' }}
      >
        {loading ? (
          <CustomSpinner />
        ) : (
          <FormikProvider value={formik}>
            <Form className={'pb-2'} onSubmit={formik.handleSubmit}>
              <FieldArray
                name="appointment_services"
                render={(arrayHelpers) => {
                  return (
                    <div className="Appointment_Form--modal_padding ">
                      {formik.values.appointment_services.map((item, i) => (
                        <div
                          key={i}
                          className="Appointment_Form--clientsDetails__selectors"
                        >
                          <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                            <UserPlus size={15} />
                            <span>Clients</span>
                          </div>
                          {formik.values.appointment_services[i]?.id?.id && (
                            <>
                              <div
                                className={classNames({
                                  'mt-1': formik.values?.appointment_services[i]
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
                                    <span>{`${item?.id?.first_name || '--'} ${
                                      item?.id?.last_name || ''
                                    }`}</span>

                                    <span>
                                      {
                                        billingTypeOptions[
                                          parseInt(item?.billing_type)
                                        ]?.label
                                      }
                                    </span>

                                    {formik.values.appointment_services
                                      ?.length !== 1 && (
                                      <Icon
                                        icon="bi:trash"
                                        width="15"
                                        height="15"
                                        className={classNames({
                                          pointer: true
                                          // 'd-none': disabledField
                                        })}
                                        onClick={() => {
                                          arrayHelpers.remove(i)
                                        }}
                                      />
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </>
                          )}

                          {/* Client Field */}
                          {/*{(!fieldDisabled || !cancelled) && (*/}
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
                                  formik.values.appointment_services.length - 1
                              })}
                              inputClassName="input-control skin-change padding-y-search-md"
                              iconClassName="icon-control skin-change"
                              placeholder={
                                getCalendarClientsPending
                                  ? 'Loading...'
                                  : 'Clients'
                              }
                              onChange={(e) => setSearchClient(e.target.value)}
                              onFocus={() => {
                                setOpenClientsList(i)
                                setOpenServicesList(null)
                              }}
                            />

                            {openClientsList === i && (
                              <ul>
                                {clientsListData?.length > 0 &&
                                  clientsListData.map((data, dataIndex) => (
                                    <li key={dataIndex}>
                                      <p
                                        className={'ellipsis-hover'}
                                        title={`${data?.first_name} ${data?.last_name}`}
                                        onClick={(e) => {
                                          setOpenClientsList(null)
                                          setServiceClientId(data?.id)

                                          addClientToAppointment(data, i)
                                          if (
                                            formik.values?.appointment_services[
                                              i
                                            ].id?.id !== data?.id
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
                                            parseInt(data?.billing_type)
                                          ]?.label
                                        }
                                      </p>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                          {/*)}*/}

                          {formik.values.appointment_services[i]?.services && (
                            <FieldArray
                              name={`appointment.appointment_services[${i}].services`}
                              render={(serviceHelpers) => (
                                <>
                                  {formik.values?.appointment_services[i]
                                    ?.services.length > 0 && (
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
                                                    serviceObj?.service?.code ||
                                                    '--'
                                                  }`}
                                                </b>
                                                &nbsp;
                                                {serviceObj?.service?.service}
                                              </span>

                                              <div>
                                                <span>
                                                  <b>
                                                    ${' '}
                                                    {parseInt(serviceObj?.fees)}
                                                  </b>
                                                </span>
                                                <Icon
                                                  icon="uiw:edit"
                                                  width="15"
                                                  height="15"
                                                  className={classNames({
                                                    pointer: true
                                                    // 'd-none': disabledField
                                                  })}
                                                  onClick={() => {
                                                    handleUpdateFee(
                                                      `appointment_services[${i}].services[${serviceIndex}].fees`,
                                                      serviceObj?.fees,
                                                      serviceObj?.service?.code,
                                                      true
                                                    )
                                                  }}
                                                />
                                                <Icon
                                                  icon="bi:trash"
                                                  width="15"
                                                  height="15"
                                                  className={classNames({
                                                    pointer: true
                                                    // 'd-none': disabledField
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
                          {/*{(!fieldDisabled || !cancelled) && (*/}
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
                                  formik.values.appointment_services.length - 1
                              })}
                              inputClassName="input-control skin-change padding-y-search-md"
                              iconClassName="icon-control skin-change"
                              disabled={
                                getClientServices.length === 0 ||
                                getClientServicesPending
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
                                  clientServicesList.map((data, dataIndex) => (
                                    <li key={dataIndex}>
                                      <p
                                        className={'ellipsis-hover'}
                                        title={`${data.service?.service} | ${data.service?.time} mints`}
                                        onClick={(e) => {
                                          setOpenServicesList(null)
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
                                        <strong>{data.service?.code}</strong>
                                      </p>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                          {/* )} */}
                        </div>
                      ))}

                      {/*{(!fieldDisabled || !cancelled) && (*/}
                      <Button
                        // disabled={fieldDisabled || cancelled}
                        className="add-more-gray mt-1 w-100"
                        onClick={() => {
                          // const hasEmpty =
                          //   formik.values.appointment_services.some((client) =>
                          //     isObjEmpty(client.id)
                          //   )
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
                      {/*)}*/}
                    </div>
                  )
                }}
              />

              <section
                className={
                  'd-flex align-items-center justify-content-end mx-2 mt-2'
                }
              >
                <Button
                  disabled={addClientToAppointmentPending}
                  className={'button-cancel pd-s me-1'}
                  onClick={() => formik.resetForm()}
                >
                  <span className={'px-1'}>Cancel</span>
                </Button>

                <Button
                  disabled={
                    addClientToAppointmentPending || hasEmpty || hasEmptyService
                  }
                  className={'button-success pd-s'}
                  onClick={() => formik.handleSubmit()}
                >
                  {addClientToAppointmentPending ? (
                    <Icon icon="eos-icons:loading" width="15" height="15" />
                  ) : (
                    <Icon
                      icon={'material-symbols:check-small-rounded'}
                      width="15"
                      height="15"
                    />
                  )}
                  <span className={'px-1'}>Save</span>
                </Button>
              </section>
            </Form>
          </FormikProvider>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ClientModal
