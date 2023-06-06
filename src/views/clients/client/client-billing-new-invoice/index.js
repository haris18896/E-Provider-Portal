/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// hooks
// third Party Packages
import * as Yup from 'yup'
import moment from 'moment'
import { Check, X } from 'react-feather'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContent } from '@src/components/toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Form,
  Table,
  Spinner
} from 'reactstrap'

// components
import FormGroupElement from '@FormGroupElement'
import CustomSpinner from '../../../../components/spinner/Spinner'
import { dateUS, dateUnix } from '../../../../utility/Utils'
import {
  createClientInvoiceAction,
  deleteClientInvoiceAction,
  getClientBillingAction,
  getClientInvoiceAction,
  updateClientBillingAction
} from '../../../../redux/client/clientAction'
import AlertModal from '../../../../components/alert'
import { resetGetClientInvoice } from '../../../../redux/client/clientSlice'
import { getAllServiceAction } from '../../../../redux/setting/billing/service/serviceAction'
import InvoiceServiceModal from '../../../../components/screen.components/clients.screen/tables/table-client-billing/invoice-modal'

const ClientBillingNewInvoice = () => {
  //** Client ID */
  const params = useParams()
  const { id, idx } = params
  const invoiceId = id
  const clientIdx = idx
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //**  get Provider ID */
  const { user } = useSelector((state) => state?.auth)
  const providerId = user?.user_id

  //** Store */
  const {
    getClientBilling,
    getClientInvoice,
    getClientInvoiceLoading,
    getClientBillingLoading,
    deleteClientInvoiceLoading,
    createClientInvoiceLoading,
    updateClientBillingLoading
  } = useSelector((state) => state.client)
  const { getAllServices } = useSelector((state) => state.service)
  const rows = getAllServices?.serviceLists
  //** States */
  const [open, setOpen] = useState(false)
  const [array, setArray] = useState([])
  const [alertModalOpen, setAlertModalOpen] = useState(false)

  //** Names */
  const providerFullName = `${user?.first_name || '--'} ${
    user?.middle_name || ''
  } ${user?.last_name || ''}`
  const clientFullName = `${getClientInvoice?.first_name || '--'} ${
    getClientInvoice?.middle_name || ''
  } ${getClientInvoice?.last_name || ''}`
  const clientDetail = `${clientFullName}\n${getClientInvoice?.phone_number}\n${getClientInvoice?.email}`
  const providerDetail = `${providerFullName}\n${user?.email}`

  //** useEffect */
  useEffect(() => {
    if (invoiceId && clientIdx) {
      dispatch(
        getClientBillingAction({
          id: invoiceId,
          callback: (res) => {
            dispatch(getClientInvoiceAction({ id: res?.client?.id }))
          }
        })
      )
    }
    if (clientIdx && !invoiceId) {
      dispatch(getClientInvoiceAction({ id: clientIdx }))
    }

    return () => {
      dispatch(resetGetClientInvoice())
    }
  }, [])

  //** Manage Modal */
  const handleCloseAlertModal = () => setAlertModalOpen(false)
  const handleOpenAlertModal = () => {
    setAlertModalOpen(true)
  }
  const handleOpen = () => {
    if (getClientBilling?.status !== 0) {
      if (!open) {
        dispatch(getAllServiceAction({ id: providerId, offset: 0, limit: 100 }))
      }
      setOpen(!open)
    }
  }

  //** Calculate Total Price */
  const TotalPriceOfMonth = (array) =>
    array.reduce((acc, curr) => acc + parseInt(curr.fees), 0)

  const newInvoiceSchema = Yup.object().shape({
    issue_date: Yup.string().required('Date is a required field'),
    client: Yup.string(),
    provider: Yup.string()
  })

  //** Apply query parameters */
  const handleTabChange = (tab) => {
    const queryParams = tab
    const currentUrl = `/clients/client/${clientIdx}`
    const newUrl = currentUrl.includes('?')
      ? `${currentUrl}&${queryParams}`
      : `${currentUrl}?${queryParams}`
    navigate(newUrl)
  }

  //** Formik */
  const formik = useFormik({
    initialValues: {
      services: getClientBilling?.invoice_services || [],
      issue_date: getClientBilling?.issue_date || ''
    },
    enableReinitialize: true,
    validationSchema: newInvoiceSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          fees: TotalPriceOfMonth(values?.services) || 0,
          issue_date: formik.values.issue_date,
          client: clientIdx,
          services: values.services?.map((item) => {
            return {
              id: clientIdx,
              date: item?.date,
              service: item?.id || item?.service?.id,
              fees: item?.fees
            }
          })
        }
        if (!!getClientBilling?.id) {
          dispatch(
            updateClientBillingAction({
              id: getClientBilling?.id,
              data,
              callback: () => {
                handleTabChange('billing')
              }
            })
          )
        } else {
          dispatch(
            createClientInvoiceAction({
              data,
              callback: () => {
                handleTabChange('billing')
              }
            })
          )
        }
      }
    }
  })

  //** Remove Row */
  const removeItem = (id) => {
    if (getClientBilling?.status !== 0) {
      formik.setFieldValue(
        'services',
        formik?.values?.services.filter((item, i) => i !== id)
      )
    }
  }

  const initialServices = formik?.values?.services.map((item) => {
    return {
      id: item?.service?.id || item?.id
    }
  })

  const handleAddServices = ({ values }) => {
    if (!initialServices.some((obj) => obj?.id === values?.id)) {
      const newArray = [...formik.values.services, values]
      setArray((prev) => [...prev, values])
      formik.setFieldValue('services', newArray)
    }
  }

  return (
    <div>
      <AlertModal
        loading={deleteClientInvoiceLoading}
        open={alertModalOpen}
        handleOpen={handleOpenAlertModal}
        handleClose={handleCloseAlertModal}
        handleAction={() => {
          dispatch(
            deleteClientInvoiceAction({
              id: getClientBilling?.id,
              callback: () => {
                handleTabChange('billing')
              }
            })
          )
        }}
        title="Delete Invoice"
        message="Are you sure you want to delete this Invoice ?"
      />
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
          <div className="page-header--title d-f-center">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => handleTabChange('billing')}
            />
            <span className="heading-1 t-gray">
              {!!invoiceId ? 'Edit' : 'New'} Invoice for
              <strong className="t-black">
                {' '}
                {getClientInvoice !== null && clientFullName}
              </strong>
            </span>
          </div>
          <div className="page-header--buttons_right">
            <div className="Row-styling__actions-new-invoice">
              {!!invoiceId && (
                <div className="invoice-Trash-button">
                  <Icon
                    icon="fa-solid:trash-alt"
                    width="15"
                    height="15"
                    className="Trash pointer "
                    onClick={handleOpenAlertModal}
                  />
                </div>
              )}
              <Button
                disabled={
                  createClientInvoiceLoading ||
                  updateClientBillingLoading ||
                  formik.values.services?.length === 0 ||
                  !!formik.errors.issue_date ||
                  getClientBilling?.status === 0
                }
                type="submit"
                className="button-success pd"
                onClick={() => formik.handleSubmit()}
              >
                <span>
                  {createClientInvoiceLoading || updateClientBillingLoading ? (
                    <Spinner size="sm" className="spinner-size" />
                  ) : (
                    <Check size={12} />
                  )}
                </span>
                <span className="px-1">Save</span>
              </Button>
            </div>
          </div>
        </div>

        <CardBody
          className={classNames({
            'p-0': getClientBillingLoading
          })}
        >
          {getClientBillingLoading ? (
            <CustomSpinner />
          ) : (
            <Form onSubmit={formik.handleSubmit} className="new_invoice_form">
              <>
                <p>From</p>
                <p>
                  <strong>{user && providerFullName}</strong>
                </p>
                <p className="new_invoice_form--heading mt-4 mb-3">Invoice</p>
                <Row className="align-items-center">
                  <Col sm={12} md={6}>
                    <p>Bill To</p>
                    {!getClientInvoiceLoading && (
                      <>
                        <p>{clientFullName}</p>
                        <p>{getClientInvoice?.client_address[0]?.address}</p>
                        <p>
                          {`${getClientInvoice?.client_address[0]?.city} ${getClientInvoice?.client_address[0]?.state}, ${getClientInvoice?.client_address[0]?.zipcode}`}
                        </p>
                      </>
                    )}
                  </Col>
                  <Col sm={12} md={6}>
                    <p>Invoice</p>
                    <p># {getClientBilling?.invoice_number || '--'}</p>
                    <div className="new_invoice_form--flatPickr">
                      <p className="mb-1">Issued</p>
                      <Flatpickr
                        //   disabled={disabledField}
                        data-enable-time
                        id="issue_date"
                        name="issue_date"
                        type="date"
                        required
                        disabled={getClientBilling?.status === 0}
                        className={classNames({
                          'radius-25 bg-white form-control skin-change mb-1 w-50': true,
                          invalid: !!formik.errors.issue_date
                        })}
                        value={dateUS(formik.values.issue_date)}
                        onChange={(date) => {
                          formik.setFieldValue('issue_date', dateUnix(date[0]))
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
                    </div>
                    {!!getClientBilling?.id && (
                      <div className="new_invoice_form--flatPickr">
                        <p>Due</p>
                        <p>
                          {!!getClientBilling?.due_date
                            ? moment
                                .unix(getClientBilling?.due_date)
                                .format('MMMM DD, YYYY')
                            : '--'}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>

                <hr className="mt-2 mb-3" />

                <Row className="align-items-center">
                  <Col sm={12} md={5}>
                    <FormGroupElement
                      disabled
                      inputType="textarea"
                      rows={4}
                      label="Client"
                      labelClassName="pl-10px"
                      inputName="client"
                      defaultValue={getClientInvoice && clientDetail}
                      inputClassName="form-fields resize-none skin-change"
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <FormGroupElement
                      disabled
                      inputType="textarea"
                      rows={4}
                      label="Provider"
                      labelClassName="pl-10px"
                      inputName="provider"
                      defaultValue={user && providerDetail}
                      inputClassName="form-fields resize-none skin-change"
                    />
                  </Col>
                </Row>
                {formik.values.services?.length === 0 && (
                  <p className="pl-20px danger-ethera">
                    At least one item is required
                  </p>
                )}

                <hr />
                <Table responsive>
                  <tbody>
                    <tr>
                      <th style={{ minWidth: '220px' }}>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </tbody>
                  <tbody>
                    {formik.values.services?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            {moment.unix(item?.date).format('MM/DD/YYYY')}
                          </td>
                          <td>{item?.services || item.service?.service}</td>
                          <td>{item?.fees}</td>
                          <td>
                            <Icon
                              icon="fa-solid:trash-alt"
                              width="15"
                              height="15"
                              className="Trash pointer"
                              onClick={() => removeItem(i)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td>
                        <Button
                          type="button"
                          className="button-green"
                          onClick={() => handleOpen()}
                        >
                          Add Line Item
                        </Button>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
                <hr />
                <Row className="align-items-center">
                  <Col sm={12} md={5} className="marginLeftAuto">
                    <div className="new_invoice_form--total">
                      <div>
                        <p>Subtotal</p>
                        <p>
                          $
                          {TotalPriceOfMonth(formik?.values?.services).toFixed(
                            2
                          ) || 0.0}
                        </p>
                      </div>
                      <hr />
                      <div>
                        <p>Total</p>
                        <p>
                          $
                          {TotalPriceOfMonth(formik?.values?.services).toFixed(
                            2
                          ) || 0.0}
                        </p>
                      </div>
                      <div>
                        <p>Amount Paid</p>
                        <p>0.00</p>
                      </div>
                      <hr />
                      <div>
                        <p>Balance</p>
                        <span>
                          $
                          {TotalPriceOfMonth(formik?.values?.services).toFixed(
                            2
                          ) || 0.0}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            </Form>
          )}
        </CardBody>
      </Card>
      <InvoiceServiceModal
        open={open}
        rows={rows}
        submit={handleAddServices}
        handleOpen={handleOpen}
      />
    </div>
  )
}

export default ClientBillingNewInvoice
