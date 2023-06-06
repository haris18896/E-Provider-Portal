/* eslint-disable prefer-const */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from 'react'

// custom hooks and utility functions
import { isObjEmpty, PhoneUS, dateUnix, dateUS } from '@utils'
import { useSkin } from '@hooks/useSkin'

//third party packages
import moment from 'moment'
import { nanoid } from 'nanoid'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Badge,
  Button,
  CardText,
  Col,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import CustomSpinner from '../../../spinner/Spinner'
//components
import SelectField from '@select'
import FormGroupElement from '@FormGroupElement'
import FormIconField from '@FormIconField'

import {
  Check,
  DownloadCloud,
  Edit2,
  Mail,
  MapPin,
  Monitor,
  PhoneCall,
  Plus,
  Trash2,
  User,
  X
} from 'react-feather'
import FileUploaderSingle from '../../../fileUploader/FileUploaderSingle'

import {
  guardianStateOptions,
  emailReminderOptions,
  raceAndEthnicityOptions,
  billingTypeOptions,
  autoGenerateBillingDocumentOptions,
  primaryInsuredPersonOptions,
  insuranceTypeOptions,
  ClientFormValidationSchema,
  gender,
  maritalStatus,
  Employment,
  languageList,
  billingNotification,
  insurancePayer,
  sendPaymentTo
} from '@src/components/screen.components/clients.screen/FormConstants'
import { useDispatch, useSelector } from 'react-redux'
import { deleteClientAction } from '../../../../redux/client/clientAction'
import { useNavigate } from 'react-router-dom'
import { getServiceByIdAction } from '../../../../redux/setting/billing/service/serviceAction'
import { State } from '../../../../views/settings/management/constants'
import AlertModal from '../../../alert'
import { clientStatus, clientStatusObj } from '.'
import { Icon } from '@iconify/react'

function ClientForm({
  id,
  save,
  submit,
  imageUrl,
  required,
  getLoading,
  deleteLoading,
  updateLoading,
  registerLoading,
  initialValuesData
}) {
  //**  get Provider ID */
  const providerId = useSelector((state) => state?.auth?.user?.user_id)
  const navigate = useNavigate()

  const { getAllServices, loading, getServiceLoading, getService } =
    useSelector((state) => state.service)
  const serviceRows = getAllServices?.serviceLists

  const { skin } = useSkin()
  // states
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [minor, setMinor] = useState(false)
  const [edit, setEdit] = useState(!required)
  const [editStatus, setEditStatus] = useState(false)
  const [services, setServices] = useState([])
  const [updateFeeData, setUpdateFeeData] = useState({})
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const handleOpen = (providerId, id) => {
    setOpen(!open)
    if (id && open === false) {
      dispatch(getServiceByIdAction({ providerId, id }))
    }
  }
  const handleCloseAlertModal = () => setAlertModalOpen(false)
  const handleOpenAlertModal = () => {
    setAlertModalOpen(true)
  }
  // formik hook
  const formik = useFormik({
    initialValues: {
      ...initialValuesData(),
      services: serviceRows
    },
    validationSchema: ClientFormValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        submit({ values, image })
      }
    }
  })
  const handleUpdateFee = (name, fee, code, value) => {
    setUpdateFeeModal(value)
    setUpdateFeeData({
      name,
      fee,
      code
    })
  }

  const defaultGender = gender.filter(
    (item) => item.value === parseInt(formik.values.gender)
  )[0]
  const defaultRelationship = maritalStatus.filter(
    (item) => item.value === parseInt(formik.values.relationship_status)
  )[0]
  const defaultEmployment = Employment.filter(
    (item) => item.value === parseInt(formik.values.employment_status)
  )[0]
  const defaultLanguage = languageList.filter(
    (item) => item.value === formik.values.preferred_language
  )[0]
  const defaultInsurancePayer = insurancePayer.filter(
    (item) => item.value === `${formik.values?.insurancePayer}`
  )[0]
  const defaultClientStatus = clientStatus.filter(
    (item) => item.value === parseInt(formik.values.status)
  )[0]
  const defaultMessageStatus = clientStatus.filter(
    (item) => item.value === parseInt(formik.values.messaging)
  )[0]

  const CloseBtn = (
    <X className="pointer" size={15} onClick={() => setUpdateFeeModal(false)} />
  )

  return (
    <>
      {getLoading ? (
        <CustomSpinner />
      ) : (
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
            {getServiceLoading ? (
              <CustomSpinner />
            ) : (
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
                    defaultValue={parseInt(updateFeeData?.fee)}
                    onChange={(e) => (updateFeeData.fee = e.target.value)}
                  />

                  <div className="d-flex justify-content-end align-items-center mt-1">
                    <Button
                      size="sm"
                      className=" mx-1 button-cancel pd"
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
                      className="button-success "
                      onClick={() => {
                        formik.setFieldValue(
                          `${updateFeeData?.name}`,
                          updateFeeData?.fee
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
            )}
          </Modal>
          <AlertModal
            loading={deleteLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(
                deleteClientAction({
                  id,
                  navigate,
                  callback: () => handleCloseAlertModal()
                })
              )
            }}
            title="Delete client"
            message="Are you sure you want to delete this Client ?"
          />

          <div className="add_client_header px-3">
            <div className="add_client_header--status d-flex align-items-center position-sticky ">
              <span>Client Status:</span>
              {!save || editStatus ? (
                <SelectField
                  disabled={!edit}
                  header
                  search={false}
                  placeholder="Status"
                  className="plr-0  ml-1 w-100"
                  value={defaultClientStatus}
                  data={clientStatus}
                  onChange={(e) => formik.setFieldValue('status', e.value)}
                />
              ) : (
                <Badge
                  color={formik.values.status === '1' ? 'success' : 'danger'}
                >
                  {clientStatusObj[parseInt(formik.values.status)]?.text ||
                    'Active'}
                </Badge>
              )}
            </div>

            <div className="add_client_header--status msg d-flex align-items-center position-sticky">
              <span>Messaging: </span>
              {!save || editStatus ? (
                <SelectField
                  disabled={!edit}
                  header
                  search={false}
                  placeholder="Message"
                  className="plr-0  ml-1  w-100"
                  value={defaultMessageStatus}
                  data={clientStatus}
                  onChange={(e) => formik.setFieldValue('messaging', e.value)}
                />
              ) : (
                <Badge
                  color={formik.values.messaging === '1' ? 'success' : 'danger'}
                >
                  {clientStatusObj[parseInt(formik.values.messaging)]?.text ||
                    'Active'}
                </Badge>
              )}
            </div>

            {save && !editStatus && !required ? (
              <div>
                <Button
                  className="button-white pd-s skin-change white-space mx-1 justify-content-end"
                  onClick={() => setEditStatus(true)}
                >
                  <Edit2 size={15} />
                  <span>Edit Status</span>
                </Button>
              </div>
            ) : null}

            {!edit && required ? (
              <div>
                <Button
                  className="button-white pd-s skin-change white-space mx-1 justify-content-end"
                  onClick={() => {
                    setEdit(true)
                    setEditStatus(true)
                  }}
                >
                  <Edit2 size={15} />
                  <span>Edit Profile</span>
                </Button>
              </div>
            ) : null}
          </div>

          <hr />

          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <div className="client_profile">
                <Row>
                  <Col sm={12} md={6}>
                    <FormGroupElement
                      autoFocus
                      required
                      disabled={!edit}
                      inputType="text"
                      label="First Name"
                      placeholder="Enter your first name"
                      labelClassName="pl-10px"
                      inputName="first_name"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('first_name')}
                      formikTouched={formik.touched.first_name}
                      formikError={formik.errors.first_name}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled={!edit}
                      inputType="text"
                      label="Middle Name"
                      labelClassName="pl-10px"
                      inputName="middle_name"
                      placeholder="Enter your middle name"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('middle_name')}
                      formikTouched={formik.touched.middle_name}
                      formikError={formik.errors.middle_name}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled={!edit}
                      required
                      inputType="text"
                      label="Last Name"
                      labelClassName="pl-10px"
                      inputName="last_name"
                      placeholder="Enter your last name"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('last_name')}
                      formikTouched={formik.touched.last_name}
                      formikError={formik.errors.last_name}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled={!edit}
                      inputType="text"
                      label="Suffix"
                      labelClassName="pl-10px"
                      inputName="suffix"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('suffix')}
                      formikTouched={formik.touched.suffix}
                      formikError={formik.errors.suffix}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled={!edit}
                      inputType="text"
                      label="Preferred Name"
                      labelClassName="pl-10px"
                      inputName="preferred_name"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('preferred_name')}
                      formikTouched={formik.touched.preferred_name}
                      formikError={formik.errors.preferred_name}
                    />
                  </Col>

                  <Label>
                    Used in place of first name across ethera, as well as in
                    client communication (reminders, billing, documents etc)
                  </Label>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled={!edit}
                      inputType="checkbox"
                      // checked={minor}
                      label="Client is a minor"
                      labelClassName="pl-10px"
                      inputName="is_minor"
                      // onChange={() => setMinor(!minor)}
                      inputClassName="form-fields radius-25 skin-change"
                      formGroupClassName="client_profile--checkbox mt-2 mb-2"
                      checked={formik.values.is_minor === true}
                      {...formik.getFieldProps('is_minor')}
                      formikTouched={formik.touched.is_minor}
                      formikError={formik.errors.is_minor}
                    />
                  </Col>

                  {formik.values?.is_minor && (
                    <FieldArray
                      name="client_guardian"
                      render={(arrayHelpers) => (
                        <>
                          {formik.values?.client_guardian.map(
                            (client_guardian, itemIndex) => (
                              <Fragment key={itemIndex}>
                                <>
                                  <div className="client_profile--radiosAndChecks mb-1">
                                    <p className="mb-1 f-bold">Status: </p>
                                    {guardianStateOptions.map((item, index) => (
                                      <Fragment key={index}>
                                        <FormGroupElement
                                          disabled={!edit}
                                          inputType="radio"
                                          inputName={`client_guardian[${itemIndex}]-${item.value}`}
                                          label={item.label}
                                          labelClassName="pl-10px"
                                          formGroupClassName="client_profile--checkbox"
                                          inputClassName="skin-change"
                                          value={
                                            formik.values.client_guardian[
                                              itemIndex
                                            ].status
                                          }
                                          checked={
                                            formik.values.client_guardian[
                                              itemIndex
                                            ].status === `${item.value}`
                                          }
                                          onChange={() =>
                                            formik.setFieldValue(
                                              `client_guardian[${itemIndex}].status`,
                                              item.value
                                            )
                                          }
                                        />
                                      </Fragment>
                                    ))}
                                  </div>

                                  <Col sm={12} md={6}>
                                    <FormGroupElement
                                      disabled={!edit}
                                      inputType="text"
                                      label="First Name"
                                      placeholder="Enter your first name"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].first_name`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].first_name`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.first_name
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.first_name
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={6}>
                                    <FormGroupElement
                                      disabled={!edit}
                                      inputType="text"
                                      label="Last Name"
                                      placeholder="Enter your last name"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].last_name`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].last_name`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.last_name
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.last_name
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={6}>
                                    <FormGroupElement
                                      disabled={!edit}
                                      inputType="text"
                                      label="Phone"
                                      placeholder="Enter your phone number"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].phone_number`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      value={
                                        formik.values?.client_guardian?.[
                                          itemIndex
                                        ]?.phone_number
                                      }
                                      onChange={(e) =>
                                        formik.setFieldValue(
                                          `client_guardian[${itemIndex}].phone_number`,
                                          PhoneUS(e.target.value)
                                        )
                                      }
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.phone_number
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.phone_number
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={6}>
                                    <FormGroupElement
                                      disabled={!edit}
                                      inputType="text"
                                      label="Email"
                                      placeholder="Enter your email address"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].email`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].email`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.email
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.email
                                      }
                                    />
                                  </Col>

                                  {/* <Col sm={12} md={6}>
                              <Button
                                disabled={!edit}
                                className="mt-1 btn-green-large"
                              >
                                <Monitor size={15} />
                                <span>Send Client Portal Access</span>
                              </Button>
                            </Col>

                            <Col sm={12} md={6}>
                              <div className="mt-1 btn-large-transparent">
                                Portal Access : <strong>Pending</strong>
                              </div>
                            </Col> */}

                                  <Col sm={12}>
                                    <FormGroupElement
                                      inputType="text"
                                      disabled={!edit}
                                      label="Address"
                                      placeholder="Street address"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].guardian_addresses[${0}].address`}
                                      formGroupClassName="mt-2"
                                      inputClassName="form-fields radius-25 skin-change mb-2"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].guardian_addresses[${0}].address`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.address
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.address
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={4}>
                                    <FormGroupElement
                                      inputType="text"
                                      disabled={!edit}
                                      placeholder="City"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].guardian_addresses[${0}].city`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].guardian_addresses[${0}].city`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.city
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.city
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={4}>
                                    <SelectField
                                      disabled={!edit}
                                      header={false}
                                      search={false}
                                      menuHeight="16rem"
                                      className="plr-0 position-relative"
                                      placeholder="State"
                                      value={{
                                        text:
                                          formik.values?.client_guardian[
                                            itemIndex
                                          ]?.guardian_addresses[0]?.state ||
                                          'State',
                                        value:
                                          formik.values?.client_guardian[
                                            itemIndex
                                          ]?.guardian_addresses[0]?.state
                                      }}
                                      data={State}
                                      onChange={(e) =>
                                        formik.setFieldValue(
                                          `client_guardian[${itemIndex}].guardian_addresses[${0}].state`,
                                          e.value
                                        )
                                      }
                                    />
                                  </Col>

                                  <Col sm={12} md={4}>
                                    <FormGroupElement
                                      inputType="number"
                                      disabled={!edit}
                                      placeholder="zip code"
                                      labelClassName="pl-10px"
                                      inputName={`client_guardian[${itemIndex}].guardian_addresses[${0}].zipcode`}
                                      inputClassName="form-fields radius-25 skin-change"
                                      {...formik.getFieldProps(
                                        `client_guardian[${itemIndex}].guardian_addresses[${0}].zipcode`
                                      )}
                                      formikTouched={
                                        formik.touched.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.zipcode
                                      }
                                      formikError={
                                        formik.errors.client_guardian?.[
                                          itemIndex
                                        ]?.guardian_addresses?.zipcode
                                      }
                                    />
                                  </Col>
                                  {formik.values?.client_guardian.length >
                                    1 && (
                                    <Col sm={12} className="text-align-right">
                                      <Trash2
                                        size={20}
                                        color="red"
                                        onClick={() =>
                                          arrayHelpers.remove(itemIndex)
                                        }
                                      />
                                    </Col>
                                  )}
                                </>
                              </Fragment>
                            )
                          )}
                          <Col sm={12} md={6}>
                            <Button
                              disabled={!edit}
                              className={classNames({
                                'add-more': true,
                                'd-none':
                                  formik.values?.client_guardian.length === 2
                              })}
                              onClick={() => {
                                arrayHelpers.push({
                                  status: '1',
                                  first_name: '',
                                  last_name: '',
                                  phone_number: '',
                                  email: '',
                                  guardian_addresses: [
                                    {
                                      address: '',
                                      city: '',
                                      state: '',
                                      zipcode: ''
                                    }
                                  ]
                                })
                              }}
                            >
                              <Plus size={15} /> <span>Secondary Contact</span>
                            </Button>
                          </Col>
                        </>
                      )}
                    />
                  )}
                </Row>
              </div>
              <hr />

              {/* Phone */}
              <>
                <div className="client_profile--tags">
                  <PhoneCall size={20} color="#000" />
                  <span>Phone</span>
                </div>
                <div className="client_profile">
                  <Row className="mt-1">
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        inputType="text"
                        disabled={!edit}
                        label="Phone"
                        labelClassName="pl-10px"
                        inputName="phone_number"
                        placeholder="(123) 456-7890"
                        inputClassName="form-fields radius-25 skin-change"
                        value={formik.values.phone_number}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'phone_number',
                            PhoneUS(e.target.value)
                          )
                        }
                        formikTouched={formik.touched.phone_number}
                        formikError={formik.errors.phone_number}
                      />
                    </Col>
                  </Row>
                </div>
                <hr />
              </>

              {/* Email */}
              <>
                <div className="client_profile--tags">
                  <Mail size={20} color="#000" />
                  <span>Email</span>
                </div>
                <div className="client_profile">
                  <Row className="align-items-center mt-1">
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        inputType="email"
                        required
                        disabled={!edit}
                        label="Email"
                        labelClassName="pl-10px"
                        inputName="phoneNumber"
                        placeholder="Enter your email "
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('email')}
                        formikTouched={formik.touched.email}
                        formikError={formik.errors.email}
                      />
                    </Col>

                    {/* <Col sm={12} md={6} className="whiteSpace">
                  <Button
                    disabled={!edit}
                    className={classNames({
                      'mt-5px btn-green-large': true,
                      'mb-1': formik.errors.email
                    })}
                  >
                    <Monitor size={15} />
                    <span>Send Client Portal Access</span>
                  </Button>
                </Col> */}

                    <Col sm={12} md={12}>
                      <div className="client_profile--radiosAndChecks mt-5px">
                        <p className=" f-bold whiteSpace">
                          Send email reminders for :
                        </p>
                        {emailReminderOptions.map((item, index) => (
                          <Fragment key={index}>
                            <FormGroupElement
                              inputType="checkbox"
                              disabled={!edit}
                              inputName={item.value}
                              label={item.label}
                              labelClassName="pl-10px mt-1"
                              formGroupClassName="client_profile--checkbox"
                              inputClassName="skin-change mt-1"
                              // defaultChecked={formik.values.emailReminder.includes(
                              //   item.value
                              // )}
                              value={item.value}
                              // onChange={(e) =>
                              //   formik.setFieldValue(
                              //     'emailReminder',
                              //     e.target.checked
                              //       ? [
                              //           ...formik.values.emailReminder,
                              //           item.value
                              //         ]
                              //       : formik.values.emailReminder.filter(
                              //           (value) => value !== item.value
                              //         )
                              //   )
                              // }
                            />
                          </Fragment>
                        ))}

                        {/* <div className="btn-large-transparent whiteSpace mb-1">
                      Portal Access : <strong>Pending</strong>
                    </div> */}
                      </div>
                    </Col>
                  </Row>
                </div>
                <hr />
              </>

              {/* Client Address */}
              <>
                <div className="client_profile--addressTag">
                  <div className="client_profile--tags">
                    <MapPin size={20} color="#000" />
                    <span>Address</span>
                  </div>
                  <p>
                    Required for insurance billing - please use the client's
                    address they have on file with their insurance provider:
                  </p>
                </div>

                <div className="client_profile">
                  <Row className="align-items-start">
                    <FieldArray
                      name="addresses"
                      render={(arrayHelpers) => (
                        <>
                          {formik.values?.addresses?.map((addresses, index) => (
                            <Fragment key={index}>
                              <Col sm={12}>
                                <FormGroupElement
                                  disabled={!edit}
                                  inputType="text"
                                  label="Address"
                                  placeholder="Street Address"
                                  labelClassName="pl-10px"
                                  formGroupClassName="mt-1"
                                  inputName={`addresses[${index}].address`}
                                  inputClassName="form-fields radius-25 skin-change mb-2"
                                  {...formik.getFieldProps(
                                    `addresses[${index}].address`
                                  )}
                                  formikTouched={
                                    formik.touched.addresses?.[index]?.address
                                  }
                                  formikError={
                                    formik.errors.addresses?.[index]?.address
                                  }
                                />
                              </Col>
                              <Col sm={12} md={4}>
                                <FormGroupElement
                                  inputType="text"
                                  disabled={!edit}
                                  placeholder="City"
                                  labelClassName="pl-10px"
                                  inputName={`addresses[${index}].city`}
                                  inputClassName="form-fields radius-25 skin-change"
                                  {...formik.getFieldProps(
                                    `addresses[${index}].city`
                                  )}
                                  formikTouched={
                                    formik.touched.addresses?.[index]?.city
                                  }
                                  formikError={
                                    formik.errors.addresses?.[index]?.city
                                  }
                                />
                              </Col>
                              <Col sm={12} md={4}>
                                <SelectField
                                  disabled={!edit}
                                  header={false}
                                  search={false}
                                  menuHeight="18rem"
                                  className="plr-0 position-relative"
                                  placeholder="Select State"
                                  value={{
                                    text:
                                      formik.values?.addresses[index]?.state ||
                                      'State',
                                    value:
                                      formik.values?.addresses[index]?.state
                                  }}
                                  data={State}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      `addresses[${index}].state`,
                                      e.value
                                    )
                                  }
                                />
                              </Col>
                              <Col sm={12} md={4}>
                                <FormGroupElement
                                  inputType="number"
                                  disabled={!edit}
                                  placeholder="zip code"
                                  labelClassName="pl-10px"
                                  inputName={`addresses[${index}].zipcode`}
                                  inputClassName="form-fields  radius-25 skin-change"
                                  {...formik.getFieldProps(
                                    `addresses[${index}].zipcode`
                                  )}
                                  formikTouched={
                                    formik.touched.addresses?.[index]?.zipcode
                                  }
                                  formikError={
                                    formik.errors.addresses?.[index]?.zipcode
                                  }
                                />
                              </Col>
                              {formik.values.addresses.length > 1 && (
                                <Col sm={12} className="text-align-right">
                                  <Trash2
                                    size={20}
                                    color="red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  />
                                </Col>
                              )}
                            </Fragment>
                          ))}
                          <Col sm={12} md={6}>
                            <Button
                              disabled={!edit}
                              className={classNames({
                                'add-more': true,
                                'd-none': formik.values?.addresses?.length === 2
                              })}
                              onClick={() =>
                                arrayHelpers.push({
                                  address: '',
                                  city: '',
                                  state: '',
                                  zipcode: ''
                                })
                              }
                            >
                              <Plus size={15} /> <span>Secondary Contact</span>
                            </Button>
                          </Col>
                        </>
                      )}
                    />
                  </Row>
                </div>
                <hr />
              </>

              {/* Client Details */}

              <>
                <div className="client_profile--tags">
                  <User size={20} color="#000" />
                  <span>Client Details</span>
                </div>
                <div className="client_profile">
                  <Row className="align-items-center mt-1">
                    <Col sm={12} md={7}>
                      <div className="client_profile--datePicker">
                        <div>
                          <Label className="pl-10px">Date of Birth</Label>
                          <Flatpickr
                            disabled={!edit}
                            data-enable-time
                            id="datePicker"
                            name="datePicker"
                            className={classNames({
                              'radius-25 form-control mb-1': true,
                              'time-date-row__dark': skin === 'dark'
                            })}
                            options={{
                              mode: 'single',
                              enableTime: false,
                              maxDate: 'today',
                              dateFormat: 'n/j/Y',
                              timezone: 'America/Los_Angeles'
                            }}
                            value={
                              formik.values?.date_of_birth !== '' &&
                              dateUS(formik.values?.date_of_birth)
                            }
                            onChange={(date) =>
                              formik.setFieldValue(
                                'date_of_birth',
                                dateUnix(date)
                              )
                            }
                          />
                        </div>

                        <div className="client_profile--age dark-layout-with-background whiteSpace">
                          <span>
                            {formik.values?.date_of_birth !== ''
                              ? moment
                                  .unix(formik.values?.date_of_birth)
                                  .fromNow()
                              : 'year ago'}
                          </span>
                        </div>
                      </div>
                    </Col>

                    <Col sm={12} md={5} className="marginLeftAuto">
                      <SelectField
                        disabled={!edit}
                        header={false}
                        label="Sex"
                        search={false}
                        className="plr-0 position-relative"
                        value={defaultGender}
                        data={gender}
                        onChange={(e) =>
                          formik.setFieldValue(`gender`, e.value)
                        }
                      />
                    </Col>
                    <Col sm={12}>
                      <FormGroupElement
                        inputType="text"
                        disabled={!edit}
                        label="Gender Identity"
                        labelClassName="pl-10px"
                        inputName="gender_identity"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('gender_identity')}
                        formikTouched={formik.touched.gender_identity}
                        formikError={formik.errors.gender_identity}
                      />
                    </Col>

                    <Label className="pl-20px mb-1">
                      Add client's gender identity, pronouns etc
                    </Label>
                    <Col sm={12} md={6}>
                      <SelectField
                        disabled={!edit}
                        header={false}
                        search={false}
                        className="plr-0 position-relative"
                        label="Relationship Status"
                        value={defaultRelationship}
                        data={maritalStatus}
                        onChange={(e) =>
                          formik.setFieldValue(`relationship_status`, e.value)
                        }
                      />
                    </Col>

                    <Col sm={12} md={6}>
                      <SelectField
                        disabled={!edit}
                        header={false}
                        search={false}
                        className="plr-0 position-relative"
                        label="Employment Status"
                        value={defaultEmployment}
                        data={Employment}
                        onChange={(e) =>
                          formik.setFieldValue(`employment_status`, e.value)
                        }
                      />
                    </Col>

                    <strong className="pl-20px mt-1 mb-1">
                      Race & Ethnicity
                    </strong>

                    <div className="client_profile--doubleCol">
                      {raceAndEthnicityOptions.map((item, index) => (
                        <Fragment key={index}>
                          <FormGroupElement
                            inputType="checkbox"
                            disabled={!edit}
                            inputName={item.value}
                            label={item.label}
                            labelClassName="pl-10px"
                            formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                            inputClassName="form-fields radius-25 skin-change"
                            value={formik.values.race}
                            checked={formik.values.race === `${item.value}`}
                            onChange={() => {
                              formik.setFieldValue(`race`, `${item.value}`)
                              formik.setFieldValue(`ethnicity`, item.label)
                            }}
                          />
                        </Fragment>
                      ))}
                    </div>

                    <Col sm={12}>
                      <FormGroupElement
                        inputType="text"
                        disabled={!edit}
                        label="Race & Ethnicity Details"
                        labelClassName="pl-10px"
                        inputName="ethnicity"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps(`ethnicity`)}
                        formikTouched={formik.touched.ethnicity}
                        formikError={formik.errors.ethnicity}
                      />
                    </Col>

                    <Label className="pl-20px mb-1">
                      Add any relevant details about the clients's race,
                      ethnicity and origin
                    </Label>

                    <Col sm={12} md={6}>
                      <SelectField
                        disabled={!edit}
                        header={false}
                        search={false}
                        menuHeight="16rem"
                        className="plr-0 position-relative"
                        label="Preferred Language"
                        value={defaultLanguage}
                        data={languageList}
                        onChange={(e) =>
                          formik.setFieldValue(`preferred_language`, e.value)
                        }
                      />
                    </Col>

                    <Col sm={12}>
                      <FormGroupElement
                        inputType="textarea"
                        disabled={!edit}
                        label="Client Notes"
                        labelClassName="pl-10px"
                        inputName="note"
                        placeholder="Add client notes here"
                        rows="5"
                        inputClassName="form-fields radius-25 skin-change resize-none"
                        {...formik.getFieldProps('note')}
                        formikTouched={formik.touched.note}
                        formikError={formik.errors.note}
                      />
                    </Col>

                    <Col sm={12} md={4}>
                      <Label className="pl-10px">Start Date</Label>
                      <Flatpickr
                        data-enable-time
                        id="startDate"
                        disabled={!edit}
                        name="date_started"
                        className={classNames({
                          'radius-25 form-control mb-1': true,
                          'time-date-row__dark': skin === 'dark'
                        })}
                        value={
                          formik.values?.date_started !== '' &&
                          dateUS(formik.values?.date_started)
                        }
                        onChange={(date) => {
                          formik.setFieldValue(`date_started`, dateUnix(date))
                        }}
                        options={{
                          dateFormat: 'n/j/Y',
                          enableTime: false,
                          mode: 'single',
                          timezone: 'America/Los_Angeles'
                        }}
                      />
                    </Col>

                    <Col sm={12}>
                      <FormGroupElement
                        inputType="text"
                        disabled={!edit}
                        label="Referred by"
                        labelClassName="pl-10px"
                        inputName="referred_by"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('referred_by')}
                        formikTouched={formik.touched.referred_by}
                        formikError={formik.errors.referred_by}
                      />
                    </Col>
                  </Row>
                </div>
                <hr />
              </>

              {/* Billing Type */}
              <div className="client_profile">
                <div className="client_profile--billingType">
                  <CardText>Billing Type</CardText>
                  <div className="mb-1">
                    <span>
                      how this client will typically be paying for their
                      services
                    </span>
                  </div>
                  <div className="client_profile--doubleCol">
                    {billingTypeOptions.map((item, index) => (
                      <Fragment key={index}>
                        <FormGroupElement
                          inputType="radio"
                          disabled={!edit}
                          inputName={item.label}
                          label={item.label}
                          labelClassName="pl-10px"
                          formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                          inputClassName="form-fields radius-25 skin-change"
                          value={formik.values?.billing_type}
                          checked={
                            formik.values.billing_type === `${item.value}`
                          }
                          onChange={() =>
                            formik.setFieldValue(`billing_type`, item.value)
                          }
                        />
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <hr />

              {/* credit and Debit card */}
              <div className="client_profile">
                <strong className="black-color">Credit & Debit Cards</strong>
                <div className={classNames({ 'mb-2 mt-1': true })}>
                  <Button
                    disabled={!edit}
                    className="button-green"
                  >
                    Setup Stripe Payment
                  </Button>
                </div>
              </div>
              <hr />

              {/* AutoGenerate Billing Document */}
              <div className="client_profile">
                <div className="mb-1">
                  <strong className="black-color">
                    Autogenerate Billing Documents
                  </strong>
                </div>
                <Col sm={12}>
                  {autoGenerateBillingDocumentOptions.map((item, index) => (
                    <Fragment key={index}>
                      <FormGroupElement
                        inputType="checkbox"
                        disabled={!edit}
                        inputName={item.value}
                        label={item.label}
                        labelClassName="pl-10px"
                        formGroupClassName="client_profile--checkbox"
                        inputClassName="skin-change"
                        // defaultChecked={formik.values.autoBillingDocument.includes(
                        //   item.value
                        // )}
                        value={item.value}
                        // onChange={(e) =>
                        //   formik.setFieldValue(
                        //     'autoBillingDocument',
                        //     e.target.checked
                        //       ? [
                        //           ...formik.values.autoBillingDocument,
                        //           item.value
                        //         ]
                        //       : formik.values.autoBillingDocument.filter(
                        //           (value) => value !== item.value
                        //         )
                        //   )
                        // }
                      />
                    </Fragment>
                  ))}
                </Col>
              </div>
              <hr className="mt-2" />

              {/* Email Billing Notification */}
              <div className="client_profile">
                <Col sm={12} md={6}>
                  <strong className="black-color">
                    Email Billing Notifications
                  </strong>
                  <SelectField
                    disabled={!edit}
                    header={false}
                    className="plr-0 position-relative mt-1"
                    value={billingNotification[0]}
                    data={billingNotification}
                    onChange={(e) =>
                      formik.setFieldValue(`emailBillingNotification`, e.value)
                    }
                  />
                </Col>
              </div>
              <hr className="mt-2" />

              {/* insurance information */}
              <div className="client_profile">
                <strong className="black-color">Insurance Information</strong>

                <div className="client_profile--insuranceInformation mt-1">
                  <Col sm={12} md={6}>
                    <div className="d-flex align-items-center form-label">
                      <div className="required-dot" />
                      <Label className="pl-10px">Insurance Type</Label>
                    </div>
                    {insuranceTypeOptions.map((item, index) => (
                      <Fragment key={index}>
                        <FormGroupElement
                          inputType="radio"
                          disabled={!edit}
                          inputName={item.label}
                          label={item.label}
                          labelClassName="pl-10px"
                          formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                          inputClassName="skin-change"
                          value={formik.values?.insurance_type}
                          checked={formik.values.insurance_type === item.value}
                          onChange={() =>
                            formik.setFieldValue(`insurance_type`, item.value)
                          }
                        />
                      </Fragment>
                    ))}
                  </Col>

                  <Col sm={12} md={6}>
                    <div className="d-flex align-items-center form-label">
                      <div className="required-dot" />
                      <Label className="pl-10px">Primary Insured</Label>
                    </div>
                    {primaryInsuredPersonOptions.map((item, index) => (
                      <Fragment key={index}>
                        <FormGroupElement
                          inputType="radio"
                          disabled={!edit}
                          inputName={`${item.value}-${nanoid()}`}
                          label={item.label}
                          labelClassName="pl-10px"
                          formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                          inputClassName="skin-change"
                          value={formik.values?.primary_insured}
                          checked={formik.values.primary_insured === item.value}
                          onChange={() =>
                            formik.setFieldValue(`primary_insured`, item.value)
                          }
                        />
                      </Fragment>
                    ))}
                  </Col>
                </div>

                {/* Insurance Information */}
                <Row className="align-items-start">
                  <Col sm={12}>
                    <SelectField
                      disabled={!edit}
                      header={false}
                      search={false}
                      className="plr-0 position-relative"
                      label="Insurance Payer"
                      value={defaultInsurancePayer}
                      data={insurancePayer}
                      onChange={(e) =>
                        formik.setFieldValue(`insurance_payer`, e.value)
                      }
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Member ID"
                      labelClassName="pl-10px"
                      inputName="member_id"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('member_id')}
                      formikTouched={formik.touched.member_id}
                      formikError={formik.errors.member_id}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Plan ID"
                      labelClassName="pl-10px"
                      inputName="plan_id"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('plan_id')}
                      formikTouched={formik.touched.plan_id}
                      formikError={formik.errors.plan_id}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Group ID"
                      labelClassName="pl-10px"
                      inputName="group_id"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('group_id')}
                      formikTouched={formik.touched.group_id}
                      formikError={formik.errors.group_id}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Copay/Co-Insurance"
                      labelClassName="pl-10px"
                      placeholder="$ 0"
                      inputName="coinsurance"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('coinsurance')}
                      formikTouched={formik.touched.coinsurance}
                      formikError={formik.errors.coinsurance}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <SelectField
                      disabled={!edit}
                      header={false}
                      search={false}
                      className="plr-0 position-relative"
                      label="For Superbills, send Payment to"
                      value={sendPaymentTo[0]}
                      data={sendPaymentTo}
                      onChange={(e) =>
                        formik.setFieldValue(`superBillsPayment`, e.value)
                      }
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="deductible"
                      labelClassName="pl-10px"
                      placeholder="$ 0"
                      inputName="deductible"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('deductible')}
                      formikTouched={formik.touched.deductible}
                      formikError={formik.errors.deductible}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    {/* <FormGroupElement
                  inputType="number"
                  disabled={!edit}
                  label="Insurance Payer Phone"
                  labelClassName="pl-10px"
                  inputName="insurancePayerPhone"
                  inputClassName="form-fields radius-25 skin-change"
                  // {...formik.getFieldProps('insurancePayerPhone')}
                  value={formik.values.insurancePayerPhone}
                  onChange={(e) => formik.setFieldValue('insurancePayerPhone', PhoneUS(e.target.value))}
                  formikTouched={formik.touched.insurancePayerPhone}
                  formikError={formik.errors.insurancePayerPhone}
                /> */}
                    <FormGroupElement
                      inputType="text"
                      disabled={!edit}
                      label="Insurance Payer Phone"
                      labelClassName="pl-10px"
                      inputName="payer_phone_number"
                      placeholder="(123) 456-7890"
                      inputClassName="form-fields radius-25 skin-change"
                      value={formik.values.payer_phone_number}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'payer_phone_number',
                          PhoneUS(e.target.value)
                        )
                      }
                      formikTouched={formik.touched.payer_phone_number}
                      formikError={formik.errors.payer_phone_number}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Insurance Payer Fax"
                      labelClassName="pl-10px"
                      inputName="payer_fax"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('payer_fax')}
                      formikTouched={formik.touched.payer_fax}
                      formikError={formik.errors.payer_fax}
                    />
                  </Col>

                  <Col sm={12}>
                    <FormGroupElement
                      inputType="text"
                      disabled={!edit}
                      label="Employer/School"
                      labelClassName="pl-10px"
                      inputName="employer"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('employer')}
                      formikTouched={formik.touched.employer}
                      formikError={formik.errors.employer}
                    />
                  </Col>

                  <Col sm={12}>
                    {/* Image uploader */}
                    <FileUploaderSingle
                      label="Insurance Card on File"
                      title={'Front of Insurance Card '}
                      description={'Drag a photo of your insurance card here'}
                      disabled={!edit}
                      file={image}
                      onChange={(file) => {
                        setImage(file)
                      }}
                      url={imageUrl || ''}
                    >
                      <strong>Front of Insurance Card</strong>
                      <DownloadCloud size={64} />
                      <h5 className="text-success">
                        Drag a photo of your insurance card here
                      </h5>
                      <p className="text-secondary">
                        or
                        <a href="/" onClick={(e) => e.preventDefault()}>
                          browse
                        </a>
                        for a file to upload
                      </p>
                    </FileUploaderSingle>
                  </Col>
                </Row>
              </div>
              <hr />

              {/* Authorization Tracking */}
              <div className="client_profile">
                <Row className="align-items-center">
                  <strong className="mb-2 black-color">
                    Authorization Tracking
                  </strong>
                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="text"
                      disabled={!edit}
                      label="Pair Authorization Number"
                      labelClassName="pl-10px"
                      inputName="authorization_number"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('authorization_number')}
                      formikTouched={formik.touched.authorization_number}
                      formikError={formik.errors.authorization_number}
                    />
                  </Col>

                  <Col sm={12} md={6}>
                    <div className="d-flex align-items-center form-label">
                      <Label className="mb-0 pl-10px">Valid From</Label>
                    </div>
                    <Flatpickr
                      disabled={!edit}
                      data-enable-time
                      id="datePicker"
                      name="datePicker"
                      className={classNames({
                        'radius-25 form-control mb-1': true,
                        'time-date-row__dark': skin === 'dark'
                      })}
                      value={
                        formik.values?.validity !== '' &&
                        dateUS(formik.values?.validity)
                      }
                      onChange={(date) => {
                        formik.setFieldValue(`validity`, dateUnix(date))
                      }}
                      options={{
                        dateFormat: 'n/j/Y',
                        enableTime: false,
                        mode: 'single',
                        timezone: 'America/Los_Angeles'
                      }}
                    />
                  </Col>

                  <Col sm={12} md={4}>
                    <FormGroupElement
                      inputType="number"
                      disabled={!edit}
                      label="Number of uses"
                      labelClassName="pl-10px"
                      inputName="number_of_uses"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('number_of_uses')}
                      formikTouched={formik.touched.number_of_uses}
                      formikError={formik.errors.number_of_uses}
                    />
                  </Col>

                  <Col sm={12} md={6} className="mt-2">
                    <FormGroupElement
                      inputType="checkbox"
                      disabled={!edit}
                      inputName="reminding_before_expire"
                      label="Remind me 1 month before expiring"
                      labelClassName="pl-10px"
                      formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                      inputClassName="skin-change"
                      checked={formik.values.reminding_before_expire === true}
                      {...formik.getFieldProps('reminding_before_expire')}
                      formikTouched={formik.touched.reminding_before_expire}
                      formikError={formik.errors.reminding_before_expire}
                    />
                  </Col>

                  <Col sm={12} md={2} className="mt-2">
                    <FormGroupElement
                      inputType="checkbox"
                      disabled={!edit}
                      inputName="is_active"
                      label="Active"
                      labelClassName="pl-10px"
                      formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                      inputClassName="skin-change"
                      checked={formik.values.is_active === true}
                      {...formik.getFieldProps('is_active')}
                      formikTouched={formik.touched.is_active}
                      formikError={formik.errors.is_active}
                    />
                  </Col>
                </Row>
              </div>
              <hr />

              {/* Insurance Claim/ CMS fields */}
              <div className="client_profile">
                <Row className="align-items-center">
                  <strong className="mb-1  black-color">
                    Insurance Claim/CMS Fields
                  </strong>
                  <Col sm={12} md={6}>
                    <FormGroupElement
                      inputType="checkbox"
                      disabled={!edit}
                      inputName="insuranceClaim"
                      label="Show additional claim fields"
                      labelClassName="pl-10px"
                      formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
                      inputClassName="skin-change"
                      defaultChecked={formik.values.insuranceClaim === true}
                      {...formik.getFieldProps('insuranceClaim')}
                      formikTouched={formik.touched.insuranceClaim}
                      formikError={formik.errors.insuranceClaim}
                    />
                  </Col>
                </Row>
              </div>
              <hr />

              {/* client Default service */}
              <div className="client_profile">
                <Row className="align-items-center">
                  <strong className=" black-color">
                    Client Default Service
                  </strong>

                  <div className="client_profile--clientDefaultService skin-change">
                    <div className="client_profile--clientDefaultService__head  skin-change">
                      <span>Service Code</span>
                    </div>

                    <FieldArray
                      name="clientServices"
                      render={(arrayHelpers) => (
                        <>
                          {!!formik.values?.clientServices?.length &&
                            formik.values?.clientServices.map(
                              (service, index) => (
                                <div
                                  key={index}
                                  className="client_profile--defaultServiceForm"
                                >
                                  <>
                                    <div className="">
                                      <FormGroupElement
                                        disabled={!edit}
                                        inputType="radio"
                                        inputName={`clientServices[${index}]-${
                                          service?.id
                                        }-${nanoid()}`}
                                        label={`${service?.code} ${service?.service} | ${service?.time} min`}
                                        labelClassName="pl-10px overflow-set"
                                        formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                                        inputClassName="skin-change"
                                        formikTouched={
                                          formik.touched.clientServices?.[index]
                                        }
                                        formikError={
                                          formik.errors.clientServices?.[index]
                                        }
                                        value={service?.id}
                                        checked={
                                          save
                                            ? service.is_default === true ||
                                              formik.values.defaultService.includes(
                                                service?.id
                                              )
                                            : formik.values.defaultService.includes(
                                                service?.id
                                              )
                                        }
                                        onChange={(e) => {
                                          let arrayOfId = []
                                          arrayOfId.push(
                                            ...formik.values.defaultService,
                                            e.target.value
                                          )
                                          formik.setFieldValue(
                                            'defaultService',
                                            arrayOfId
                                          )
                                        }}
                                      />
                                    </div>

                                    <div className="">
                                      <strong className="pe-1">
                                        $
                                        {
                                          formik.values?.clientServices?.[index]
                                            ?.fee
                                        }
                                      </strong>
                                      <Edit2
                                        size={18}
                                        color="black"
                                        className="cursorPointer"
                                        onClick={() => {
                                          handleUpdateFee(
                                            `clientServices[${index}].fee`,
                                            parseInt(service?.fee),
                                            service?.code,
                                            true
                                          )
                                        }}
                                      />
                                      <Trash2
                                        size={20}
                                        color="red"
                                        className="cursorPointer ml-1"
                                        onClick={(e) => {
                                          arrayHelpers.remove(index)
                                        }}
                                      />
                                    </div>
                                  </>
                                </div>
                              )
                            )}

                          <Col sm={12}>
                            <FormGroupElement
                              inputType="select"
                              disabled={!edit || loading}
                              inputName="serviceList"
                              placeholder="-- Select to add new service --"
                              inputClassName="form-select radius-25 dark-background pointer"
                              value={formik.values.serviceList}
                              onChange={(e) => {
                                const code = formik.values?.services.find(
                                  (item) => item.id === e.target.value
                                )

                                const duplicateData =
                                  formik.values?.clientServices.find(
                                    (item) => item.id === e.target.value
                                  )

                                !duplicateData &&
                                  arrayHelpers.push({
                                    ...code
                                  })
                              }}
                              formikTouched={formik.touched.serviceList}
                              formikError={formik.errors.serviceList}
                            >
                              <option value={''} disabled>
                                -- Select to add new Service --
                              </option>
                              {formik.values?.services?.map((item, index) => {
                                return (
                                  <option key={index} value={item.id}>
                                    {item.code} {item.service} | {item.time}
                                    min, Charges : {item.fee}
                                  </option>
                                )
                              })}
                            </FormGroupElement>
                          </Col>
                        </>
                      )}
                    />
                  </div>
                </Row>
              </div>
              <hr />

              {/* Submit */}
              <div className="client_profile">
                <Row className="mt-1 align-items-center">
                  <Col sm={12} md={6}>
                    {save && (
                      <Button
                        disabled={!edit}
                        className="button-danger pd"
                        onClick={handleOpenAlertModal}
                      >
                        <Trash2 size={15} />
                        <span className="pl-10px pe-1">Delete</span>
                      </Button>
                    )}
                  </Col>

                  <Col sm={12} md={6}>
                    <div className="client_profile--submission">
                      <Button
                        disabled={!edit}
                        className="button-cancel pd"
                        onClick={() => {
                          formik.resetForm()
                          setImage(null)
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        disabled={!edit || registerLoading || updateLoading}
                        className="button-success pd"
                        onClick={() => formik.handleSubmit()}
                      >
                        {registerLoading || updateLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <Check size={15} />
                        )}
                        <span className="pl-10px pe-1">
                          {save === true ? 'Update' : 'Save'}
                        </span>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </FormikProvider>
        </>
      )}
    </>
  )
}

export default ClientForm
