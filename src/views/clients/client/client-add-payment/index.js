/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Table,
  Badge,
  Spinner
} from 'reactstrap'
import FormGroupElement from '@FormGroupElement'
import { useFormik } from 'formik'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { updateClientBillingAction } from '../../../../redux/client/clientAction'
import { useDispatch, useSelector } from 'react-redux'
import { Check } from 'react-feather'

// const clientAddPayment = [
//   {
//     label: 'Online card on file',
//     value: 1,
//     name: 'online_card_on_file'
//   },
//   {
//     label: 'Cash',
//     value: 2,
//     name: 'cash'
//   },
//   {
//     label: 'Check',
//     value: 3,
//     name: 'check'
//   },
//   {
//     label: 'External Card',
//     value: 4,
//     name: 'external_card'
//   }
// ]

const ClientAddPayment = () => {
  const params = useParams()
  const { id } = params
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectPaymentType, setSelectPaymentType] = useState(0)
  const { updateClientBillingLoading } = useSelector((state) => state.client)
  const formik = useFormik({
    initialValues: {
      online_card_on_file: false,
      cash: false,
      check: false,
      external_card: false
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        console.log(values)
      }
    }
  })
  const handleSubmit = () => {
    const data = {
      status: 0
    }
    dispatch(
      updateClientBillingAction({
        id,
        data,
        callback: () => navigate(-1)
      })
    )
  }
  return (
    <>
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
          <div className="page-header--title d-f-center">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => navigate(-1)}
            />
            <span className="heading-1 t-gray">
              Add Payment for
              <strong className="t-black"> Fahad Ahmad</strong>
            </span>
          </div>
        </div>

        <CardBody>
          <Form
          //   onSubmit={formik.onSubmi)}
          >
            <Row>
              <Col sm={12} md={12} lg={8}>
                <div className="add-payment d-flex ">
                  <div className="add-payment-title">
                    <h4 className="add-payment-title-numbering">2</h4>
                  </div>
                  <div className="add-payment-card">
                    <div className="add-payment-card-box">
                      <p className="add-payment-card-box-title">
                        Choose payment method
                      </p>
                      <p>A payment method is required</p>
                      <div className="add-payment-card-box-detail py-2">
                        <FormGroupElement
                          inputType="radio"
                          inputName="select_payment"
                          label="Online card on file"
                          formGroupClassName="mt-0 mb-0 add-payment-checkbox"
                          inputClassName="skin-change m-2"
                          checked={selectPaymentType === 1}
                          onChange={
                            () => setSelectPaymentType(1)
                          }
                        />

                        <FormGroupElement
                          inputType="radio"
                          inputName="select_payment1"
                          label="Cash"
                          formGroupClassName="mt-0 mb-0 add-payment-checkbox"
                          inputClassName="skin-change m-2"
                          checked={selectPaymentType === 2}
                          onChange={() => setSelectPaymentType(2)}
                        />
                        {selectPaymentType === 2 && (
                          <>
                            <div className="my-0.5 mx-4">
                              <label>Payment Date</label>
                              <Flatpickr
                                //   disabled={disabledField}
                                data-enable-time
                                label="Payment Date"
                                id="appointmentDate"
                                name="appointmentDate"
                                type="date"
                                className=" bg-white  form-control skin-change w-50"
                                //   value={dateUS(formik.values.start_date)}
                                //   onChange={(date) => {
                                //     formik.setFieldValue(
                                //       'start_date',
                                //       dateUnix(date[0])
                                //     )
                                //   }}
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
                          </>
                        )}
                        <FormGroupElement
                          inputType="radio"
                          inputName="select_payment2"
                          label="Check"
                          formGroupClassName="mt-0 mb-0 add-payment-checkbox"
                          inputClassName="skin-change m-2"
                          checked={selectPaymentType === 3}
                          onChange={() => setSelectPaymentType(3)}
                        />
                        {selectPaymentType === 3 && (
                          <>
                            <div className="my-0.5 mx-4">
                              <div className="d-flex">
                                <div>
                                  <label>Payment Date</label>
                                  <Flatpickr
                                    //   disabled={disabledField}
                                    data-enable-time
                                    label="Payment Date"
                                    id="appointmentDate"
                                    name="appointmentDate"
                                    type="date"
                                    className=" bg-white  form-control skin-change  "
                                    //   value={dateUS(formik.values.start_date)}
                                    //   onChange={(date) => {
                                    //     formik.setFieldValue(
                                    //       'start_date',
                                    //       dateUnix(date[0])
                                    //     )
                                    //   }}
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
                                <div className="mx-1">
                                  <label>Check Number</label>
                                  <FormGroupElement
                                    inputType="number"
                                    inputName="check_number"
                                    placeholder="Exp. 1234"
                                    formGroupClassName="mt-0 mb-0 add-payment-checkbox"
                                    inputClassName="skin-change "
                                    // onChange={() => setSelectPaymentType(4)}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <FormGroupElement
                          inputType="radio"
                          inputName="select_payment3"
                          label="External Card"
                          formGroupClassName="mt-0 mb-0 add-payment-checkbox"
                          inputClassName="skin-change m-2"
                          checked={selectPaymentType === 4}
                          onChange={() => setSelectPaymentType(4)}
                        />

                        {selectPaymentType === 4 && (
                          <>
                            <div className="my-0.5 mx-4">
                              <label>Payment Date</label>
                              <Flatpickr
                                //   disabled={disabledField}
                                data-enable-time
                                label="Payment Date"
                                id="appointmentDate"
                                name="appointmentDate"
                                type="date"
                                className=" bg-white form-control skin-change w-50"
                                //   value={dateUS(formik.values.start_date)}
                                //   onChange={(date) => {
                                //     formik.setFieldValue(
                                //       'start_date',
                                //       dateUnix(date[0])
                                //     )
                                //   }}
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="button-success my-2 mx-3"
                  onClick={() => handleSubmit()}
                >
                  {updateClientBillingLoading ? (
                    <Spinner size="sm" className='spinner-size' />
                  ) : (
                    <Check size={12} />
                  )}
                  <span className='px-1'>Charge</span>
                </Button>
                {/* <div className="add-payment d-flex">
                <div className="add-payment-title">
                  <h4 className="add-payment-title-numbering">1</h4>
                </div>
                <div className="add-payment-card">
                  <div className="add-payment-card-box">
                    <p className="add-payment-card-box-title">
                      Select invoices and confirm payment amount
                    </p>
                    <p>You can make partial payments on new invoices</p>
                    <div className="add-payment-card-box-detail">
                      <table class="table border-none add-payment-card-box-detail-table">
                        <thead className="bg-transparent ">
                          <tr>
                            <th scope="col">
                              <FormGroupElement
                                inputType="checkbox"
                                inputName="invoice"
                                label="invoice"
                                labelClassName="pl-10px"
                                formGroupClassName="client_profile--checkbox mt-0"
                                inputClassName="skin-change my-0"
                              />
                            </th>
                            <th scope="col">Detail</th>
                            <th scope="col">Type </th>
                            <th scope="col">Balance</th>
                            <th scope="col">Amount </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">
                              <FormGroupElement
                                inputType="checkbox"
                                inputName="invoice"
                                label="N/F 345"
                                labelClassName="pl-10px"
                                formGroupClassName="client_profile--checkbox"
                                inputClassName="skin-change my-0"
                              />
                            </th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>

                            </td>
                          </tr>
                          <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                          </tr>
                          <tr className="border-top">
                            <th scope="row"></th>
                            <td></td>
                            <td>Subtotal</td>
                            <td></td>
                            <td>$100</td>
                          </tr>
                          <tr>
                            <th scope="row"></th>
                            <td></td>
                            <td>
                              {' '}
                              <FormGroupElement
                                inputType="checkbox"
                                inputName="invoice"
                                label="Apply Available credit ($0)"
                                labelClassName="pl-10px"
                                formGroupClassName="client_profile--checkbox"
                                inputClassName="skin-change my-0"
                              />
                            </td>
                            <td></td>
                            <td>$100</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div> */}
              </Col>
              {/* <Col sm={12} md={12} lg={4}>
                <div>
                  <h4>Summary</h4>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Total</strong>
                    <strong>$0</strong>
                  </div>
                  <Button className="w-100 mt-2 border-radius-5" size="sm">
                    Add $0 Payment
                  </Button>
                </div>
              </Col> */}
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  )
}

export default ClientAddPayment
