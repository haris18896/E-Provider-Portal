/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import * as Yup from 'yup'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import { Check, X } from 'react-feather'
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
import { useFormik } from 'formik'
import InputMask from 'react-input-mask'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import DeleteModal from './DeleteModal'
import { useSkin } from '@hooks/useSkin'
import { useDispatch, useSelector } from 'react-redux'
import { isObjEmpty } from '../../../../../utility/Utils'
import FormGroupElement from '../../../../formGroup/FormGroupElement'
import {
  deleteStripeCardAction,
  registerMoreStripeCardAction,
  registerStripeCardAction,
  updateStripeCardAction
} from '../../../../../redux/setting/billing/stripe/stripeAction'

const PaymentModalBox = ({ basicModal, setBasicModal }) => {
  const dispatch = useDispatch()
  const { skin } = useSkin()
  const stripe = useStripe()
  const elements = useElements()
  const [card, setCard] = useState(0)
  const [auto, setAuto] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)

  const {
    getAllCards,
    getAllCardsLoading,
    registerCardsLoading,
    deleteStripeCardLoading,
    updateStripeCardLoading,
    registerMoreStripeCardLoading
  } = useSelector((state) => state.stripe)
  const rows = getAllCards?.sources

  const StripePaymentSchema = Yup.object().shape({
    card_number: Yup.string().required('Card number is a required field'),
    card_expiry: Yup.string().required('Expiry date is a required field'),
    card_cvc: Yup.string().required('CVC number is a required field'),
    zip_code: Yup.number().required(),
    default_payment: Yup.boolean()
  })
  const formik = useFormik({
    initialValues: {
      card_number: '',
      card_expiry: '',
      card_cvc: '',
      zip_code: '',
      default_payment: false,
      default_card: rows?.filter(
        (item) => item?.id === getAllCards?.default_source
      )[0]?.id
    },
    enableReinitialize: true,
    validationSchema: StripePaymentSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const input = values.card_expiry
        const [month, year] = input.split('/')

        const data = {
          card_number: values.card_number,
          card_cvc: values.card_cvc,
          exp_month: month,
          exp_year: year,
          zip_code: values.zip_code,
          default_payment: values.default_payment
        }

        dispatch(
          registerMoreStripeCardAction({
            data,
            callback: () => {
              resetForm()
              setShowForm(false)
              // setBasicModal(false)
            }
          })
        )
      }
    }
  })

  const handleUpdateCard = () => {
    const data = {
      default_source: formik.values.default_card
    }
    dispatch(updateStripeCardAction({ data }))
  }
  const handleDeleteCard = () => {
    dispatch(
      deleteStripeCardAction({
        id: deleteId,
        callback: () => {
          setDeleteModal(false)
          setBasicModal(true)
        }
      })
    )
  }

  const handleShowForm = () => {
    setShowForm(!showForm)
  }
  const handleDelete = (id) => {
    setDeleteId(id)
    setBasicModal(false)
    setDeleteModal(!deleteModal)
  }
  const handleBasic = () => {
    setBasicModal(true)
    setDeleteModal(false)
  }

  //** Using Regex  */
  const handleCardNumberChange = (event) => {
    const input = event.target.value.replace(/\D/g, '')
    const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 ')
    formik.setFieldValue('card_number', formattedInput)
  }
  const handleInputChange = (event) => {
    const value = event.target.value
    if (value.length >= 3) {
      event.target.value = value.slice(0, 4)
      formik.setFieldValue('card_cvc', value)
    }
  }
  const handleInputChangee = (event) => {
    const { value } = event.target
    const month = parseInt(value, 10)

    if (month < 1 || month > 12) {
      event.target.value = ''
    }
    formik.setFieldValue('card_expiry', event.target.value)
  }
  const cancel = (
    <X
      className="pointer"
      onClick={() => {
        setBasicModal(false)
        formik.resetForm()
        setShowForm(false)
      }}
    />
  )

  return (
    <div>
      <Modal
        isOpen={basicModal}
        toggle={() => {
          setBasicModal(!basicModal)
          formik.resetForm()
          setShowForm(false)
        }}
        className="ModalDialoge payment-modal"
      >
        {/* <PaymentElement/> */}
        <ModalHeader className="mt-1 ModalHeader pb-0 d-flex align-items-center">
          <span className="mb-0 fw-bold fs-22 black">Payment Method</span>
          {cancel}
        </ModalHeader>
        <ModalBody className="modalBody">
          <Row>
            <Col lg={12}>
              <Form onSubmit={formik.handleSubmit}>
                {showForm !== true ? (
                  <Col lg={6}>
                    <Button
                      className="secondary-btn mb-2 w-100"
                      size="sm"
                      onClick={handleShowForm}
                    >
                      Add More Payment
                    </Button>
                  </Col>
                ) : null}
                {showForm && (
                  <Row>
                    <Col lg={12}>
                      <FormGroupElement
                        inputType="text"
                        label="Card Number"
                        labelClassName="pl-10px"
                        value={formik.values.card_number}
                        onChange={handleCardNumberChange}
                        inputName="card_number"
                        pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                        maxLength={19}
                        placeholder="1234 XXXX XXXX 1234"
                        inputClassName={classNames({
                          'radius-25 border px-1 w-100': true,
                          invalid: !!formik.errors.card_number
                        })}
                      />
                    </Col>
                    <Col lg={8}>
                      <div>
                        {/* <FormGroupElement
                          required
                          inputType="text"
                          label="Expiration Date"
                          labelClassName="pl-10px"
                          onChange={handleExpiryDateChange}
                          inputName="card_expiry"
                          placeholder="MM/YY"
                          value={formik.values.card_expiry}
                          inputClassName={classNames({
                            'radius-25 border px-1 w-100': true,
                            invalid: !!formik.errors.card_expiry
                          })}
                        /> */}
                        <label htmlFor="expiry" className="pl-10px form-label">
                          Expiration Date
                        </label>
                        <InputMask
                          id="expiry"
                          mask="99/99"
                          maskPlaceholder="MM/YY"
                          className={classNames({
                            'radius-25 border px-1 form-control w-100': true,
                            invalid: !!formik.errors.card_expiry
                          })}
                          onChange={handleInputChangee}
                          alwaysShowMask={true}
                          // onChange={(event) => {
                          //   const { value } = event.target
                          //   formik.setFieldValue('card_expiry', value)
                          // }}
                        />

                        {/* <CardExpiryElement className="stripe-input radius-25 border px-1" /> */}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div>
                        <FormGroupElement
                          inputType="text"
                          label="CVC"
                          labelClassName="pl-10px sm-label-margin-top"
                          // value={formik.values.card_cvc}
                          onChange={handleInputChange}
                          inputName="card_cvc"
                          placeholder="123"
                          inputClassName={classNames({
                            'radius-25 border px-1 w-100': true,
                            invalid: !!formik.errors.card_cvc
                          })}
                        />
                        {/* <CardCvcElement
                          placeholder="---"
                          className="stripe-input radius-25 border px-1"
                        /> */}
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="d-flex align-items-center payment-checkbox ">
                        <FormGroupElement
                          type="number"
                          label="Zip Code"
                          labelClassName="fs-11 pdl-1 "
                          inputName="zip_code"
                          inputClassName={classNames({
                            'form-fields  border radius-25': true,
                            lightColors: skin === 'dark'
                          })}
                          {...formik.getFieldProps('zip_code')}
                          formikTouched={formik.touched.zip_code}
                          formikError={formik.errors.zip_code}
                        />
                        <FormGroupElement
                          type="checkbox"
                          label="Default payment method"
                          labelClassName="fs-11 pdl-1"
                          inputName="default_payment"
                          formGroupClassName="client_profile--checkbox pdl-1 mrgin-top"
                          inputClassName={classNames({
                            lightColors: skin === 'dark pdl-1'
                          })}
                          // checked={formik.values.default_payment === true}
                          // value={formik.values.default_payment}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `default_payment`,
                              e.target.checked
                            )
                          }}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="ModalFooter float-right mb-1 payment-box-footer d-flex">
                        <Button
                          size="sm"
                          className="ModalCancel button-cancel"
                          onClick={() => {
                            formik.handleReset()
                            setShowForm(!showForm)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          type="submit"
                          className="ModalAdd "
                          disabled={
                            registerCardsLoading ||
                            registerMoreStripeCardLoading
                          }
                        >
                          {registerCardsLoading ||
                          registerMoreStripeCardLoading ? (
                            <Spinner
                              size="sm"
                              className="add-card-spinner-size"
                            />
                          ) : (
                            <Check size={12} />
                          )}
                          <span className="px-1">Add</span>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}
                <Row>
                  <hr />

                  <Col>
                    <h5 className="black">Your Cards</h5>
                    {getAllCardsLoading ? (
                      <div className="d-flex justify-content-center">
                        <Spinner size="lg" color="blue" />
                      </div>
                    ) : rows?.length > 0 ? (
                      rows?.map((item, i) => {
                        return (
                          <div className="mb-2" key={i}>
                            <div className="d-flex align-items-center justify-content-between">
                              <div
                                className="saved_card_elements border"
                                onClick={() =>
                                  formik.setFieldValue('default_card', item.id)
                                }
                              >
                                <div className="saved_card_elements--card">
                                  {item?.card?.brand === 'visa' ? (
                                    <Icon icon="logos:visa" width={35} />
                                  ) : item?.card?.brand === 'mastercard' ? (
                                    <Icon icon="logos:mastercard" width={33} />
                                  ) : (
                                    <Icon icon="logos:mastercard" width={33} />
                                  )}

                                  <FormGroupElement
                                    type="text"
                                    inputName="cardNumber"
                                    value={`XXXX XXXX XXXX ${item?.card?.last4}`}
                                    disabled
                                    inputClassName={classNames({
                                      lightColors: skin === 'dark'
                                    })}
                                    formGroupClassName="saved_card_elements--cardNumber"
                                  />
                                </div>
                                <div className="saved_card_elements--sm-default-box lg-none-preview">
                                  {card === 1 && (
                                    <badge className="saved_card_elements--default-badge">
                                      Default Card
                                    </badge>
                                  )}
                                </div>

                                <div className="saved_card_elements--cardExpiry">
                                  <FormGroupElement
                                    type="text"
                                    inputName="cardexpiry"
                                    value={`${item?.card?.exp_month}/${
                                      item?.card?.exp_year % 100
                                    }`}
                                    disabled
                                    inputClassName={classNames({
                                      lightColors: skin === 'dark'
                                    })}
                                    formGroupClassName="saved_card_elements--cardNumber"
                                  />
                                </div>
                              </div>
                              <div
                                className="payment-trash-btn"
                                onClick={() => handleDelete(item?.id)}
                              >
                                <Icon
                                  icon="subway:delete"
                                  color="#555"
                                  width="12"
                                  height="12"
                                />
                              </div>
                            </div>
                            <div className="d-flex pdl-1 sm-none-preview">
                              <FormGroupElement
                                type="radio"
                                inputName={item.id}
                                // value={formik.values.default_card}
                                label="Default payment method"
                                labelClassName="fs-s-med px-1"
                                checked={formik.values.default_card === item.id}
                                onChange={() =>
                                  formik.setFieldValue('default_card', item.id)
                                }
                                inputClassName={classNames({
                                  lightColors: skin === 'dark'
                                })}
                                formGroupClassName="client_profile--checkbox saved_card_elements--radio"
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className='text-center py-1'>No Cards</div>
                    )}

                    <div className="float-right my-1 payment-detail-btn d-flex">
                      <Button
                        size="sm"
                        className="ModalCancel button-cancel"
                        onClick={() => {
                          setBasicModal(!basicModal)
                          formik.resetForm()
                          setShowForm(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={updateStripeCardLoading || !rows?.length}
                        size="sm"
                        className="reqbgColor  px-2"
                        onClick={handleUpdateCard}
                      >
                        {updateStripeCardLoading ? (
                          <Spinner size="sm" className="spinner-size-update" />
                        ) : (
                          <Check size={12.5} />
                        )}
                        <span className="px-1">Save</span>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        loading={deleteStripeCardLoading}
        submit={handleDeleteCard}
        setBasicModal={setBasicModal}
      />
    </div>
  )
}

export default PaymentModalBox
