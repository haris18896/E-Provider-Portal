/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// third party components
import {
  Modal,
  ModalBody,
  Button,
  Row,
  Col,
  Badge,
  ModalHeader,
  Spinner
} from 'reactstrap'
import * as Yup from 'yup'
import Prism from 'prismjs'
import moment from 'moment'
import SelectField from '@select'
import { isObjEmpty } from '@utils'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'
import FormIconField from '@FormIconField'
import { Briefcase, Plus, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import { useDispatch, useSelector } from 'react-redux'
import { FieldArray, FormikProvider, useFormik } from 'formik'

// components
import CustomSpinner from '@spinner'
import {
  getAllClientBillingAction,
  updateClientBillingAction
} from '../../../../../redux/client/clientAction'

const billingType = [
  { label: 'Self Pay', value: 1 }
  // { label: 'Insurance', value: 2 }
]
function modal({ open, setOpen }) {
  const dispatch = useDispatch()
  const {
    getClientBilling,
    getClientBillingLoading,
    updateClientBillingLoading,
    getAllClientBillingData
  } = useSelector((state) => state.client)
  const { getAllServices } = useSelector((state) => state.service)
  const clientServicesList = getAllServices?.serviceLists

  const [updateFeeData, setUpdateFeeData] = useState({})
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [updateFeeModal, setUpdateFeeModal] = useState(false)
  const [openClientsList, setOpenClientsList] = useState(null)
  const [openServicesList, setOpenServicesList] = useState(false)

  const offset = getAllClientBillingData?.offset
  const limit = getAllClientBillingData?.limit
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  const editBillingSchema = Yup.object().shape({
    type: Yup.string(),
    // serviceSelect: Yup.string(),
    services: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        time: Yup.string(),
        code: Yup.string(),
        price: Yup.string()
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      type: getClientBilling?.billing_type || 1,
      // serviceSelect: '',
      services: getClientBilling?.invoice_services || []
    },
    enableReinitialize: true,
    validationSchema: editBillingSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        if (values?.services?.length > 0) {
          const data = {
            client: getClientBilling?.client?.id,
            services: values?.services?.map((item) => {
              return {
                id: getClientBilling?.client?.id,
                date: getClientBilling?.created_at,
                service: item?.service?.id,
                fees: item?.fees
              }
            })
          }
          dispatch(
            updateClientBillingAction({
              id: getClientBilling?.id,
              data,
              callback: () => {
                setOpen(false)
                dispatch(
                  getAllClientBillingAction({
                    offset,
                    limit,
                    client: getClientBilling?.client?.id
                  })
                )
              }
            })
          )
        } else {
          toast((t) => (
            <ToastContent
              t={t}
              name="At Least One Service Required"
              icon={<X size={14} />}
              color="danger"
            />
          ))
        }
      }
    }
  })
  const defaultBillingType = billingType.filter(
    (item) => item.value === parseInt(formik.values?.type)
  )[0]
  // ** Add services to Client's Appointment
  const addServiceToAppointment = (data) => {
    const services = formik.values?.services || []

    if (!services.some((service) => service.service?.id === data?.id)) {
      formik.setFieldValue(`services`, [
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
  // ** Modal Close
  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        setUpdateFeeModal(false)
      }}
    />
  )
  const disabledField = false
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
                className="button-cancel pd mx-1"
                onClick={() => {
                  handleUpdateFee('', '', '', false)
                }}
              >
                <span className="px-1">Cancel</span>
              </Button>

              <Button
                size="sm"
                className=" button-success "
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
        toggle={() => {
          setOpen(false)
          formik.resetForm()
        }}
        className="modal-dialog-centered modalBilling"
      >
        <div className="modal--header">
          <span>Edit Billing</span>
          <X
            className="pointer"
            size={15}
            onClick={() => {
              setOpen(false)
              formik.resetForm()
            }}
          />
        </div>
        <div className="modal--tag">
          <strong>
            Billing-
            {!getClientBillingLoading &&
            getClientBilling?.created_at !== undefined
              ? moment.unix(getClientBilling?.created_at).format('MMM DD, YYYY')
              : '--'}
          </strong>
        </div>
        <ModalBody>
          {getClientBillingLoading ? (
            <div className="padding-top-bottom">
              <CustomSpinner />
            </div>
          ) : (
            <div className="modal--body">
              <FormikProvider value={formik}>
                <>
                  <SelectField
                    label="Billing Type"
                    className="plr-0 position-relative p-0"
                    // wd="100%"
                    menuHeight="9rem"
                    search={false}
                    value={defaultBillingType}
                    data={billingType}
                    onChange={(e) => {
                      formik.setFieldValue('type', e.value)
                    }}
                    formikError={!!formik.errors.type}
                  />

                  <FieldArray
                    name="services"
                    render={(arrayHelpers, i) => {
                      return (
                        <div>
                          <div
                            key={i}
                            className="Appointment_Form--clientsDetails__selectors"
                          >
                            {formik.values?.services && (
                              <FieldArray
                                name={`services`}
                                render={(serviceHelpers) => (
                                  <>
                                    {formik.values?.services?.length > 0 && (
                                      <>
                                        <div className="mb-1 px-1 appointments-detail-tag white mt-1">
                                          <Briefcase size={15} />
                                          <span>Services</span>
                                        </div>

                                        {formik.values?.services?.map(
                                          (serviceObj, serviceIndex) => (
                                            <Row
                                              className="clients__row"
                                              key={serviceIndex}
                                            >
                                              <Col
                                                sm={12}
                                                className={classNames({
                                                  'clients__row--div': true
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
                                                  {serviceObj?.service?.service}
                                                </span>

                                                <div>
                                                  <span>
                                                    <b>$ {serviceObj?.fees}</b>
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
                                                      handleUpdateFee(
                                                        `services[${serviceIndex}].fees`,
                                                        serviceObj?.fees,
                                                        serviceObj?.service
                                                          ?.code,
                                                        true
                                                      )
                                                    }}
                                                  />
                                                  {formik.values?.services
                                                    ?.length > 1 && (
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
                                                  )}
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
                                {showSearchBar && (
                                  <FormIconField
                                    id="Search-services"
                                    name={`search-services-[1]`}
                                    size={10}
                                    iconsName="entypo:select-arrows"
                                    className="input-group-merge"
                                    inputClassName="input-control skin-change padding-y-search-md"
                                    iconClassName="icon-control skin-change"
                                    placeholder="Services..."
                                    onChange={(e) => {}}
                                    onFocus={() => {
                                      setOpenServicesList(i)
                                      setOpenClientsList(null)
                                    }}
                                  />
                                )}

                                {openServicesList === i && (
                                  <ul>
                                    {clientServicesList.length > 0 &&
                                      clientServicesList.map(
                                        (data, dataIndex) => (
                                          <li key={dataIndex}>
                                            <p
                                              className="w-75"
                                              onClick={(e) => {
                                                setOpenServicesList(null)
                                                addServiceToAppointment(data)
                                                setShowSearchBar(false)
                                              }}
                                            >
                                              <span>+</span>
                                              {`${data?.service} | ${data?.time} mints`}
                                            </p>
                                            <p>
                                              <strong>{data?.code}</strong>
                                            </p>
                                            <p>
                                              <strong>${data?.fee}</strong>
                                            </p>
                                          </li>
                                        )
                                      )}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    }}
                  />

                  <Button
                    className="add-more my-1 ml-8px width-150"
                    onClick={() => setShowSearchBar(true)}
                  >
                    <Plus size={15} /> <span>Service</span>
                  </Button>
                </>
              </FormikProvider>
              <span className="ml-10px">
                Note: Changes made here after affect this session only
              </span>
              <hr />
              <div className="modal--footer">
                <Button
                  className="button-success pd"
                  onClick={() => {
                    formik.handleSubmit()
                  }}
                >
                  {updateClientBillingLoading && (
                    <Spinner size="sm" className="mr-1" />
                  )}
                  <span className="ml-1">Save</span>
                </Button>{' '}
                <Button
                  className="button-white pd"
                  onClick={() => {
                    setOpen(false)
                    formik.resetForm()
                  }}
                >
                  Cancel
                </Button>{' '}
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default modal
