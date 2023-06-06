import React, { useEffect, useState } from 'react'
// third party pkg
import * as Yup from 'yup'
import { isObjEmpty, getModifiedValues } from '@utils'
import { Check } from 'react-feather'
import { FormikProvider, useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CardBody, CardFooter, Form, Spinner } from 'reactstrap'

// components
import FormGroupElement from '@FormGroupElement'
import CustomSpinner from '../../../../components/spinner/Spinner'
// Store & Redux
import PaymentModalBox from '../../../../components/screen.components/settings.component/billing/payment-modal'
import { getAllStripeCardAction } from '../../../../redux/setting/billing/stripe/stripeAction'
import {
  getBillingInfoAction,
  registerBillingInfoAction,
  updateBillingInfoAction
} from '../../../../redux/setting/billing/billing-info/billingInfoAction'

export const Billing = () => {
  const dispatch = useDispatch()
  const [basicModal, setBasicModal] = useState(false)

  //** Provider ID */
  const providerId = useSelector((state) => state?.auth?.user?.user_id)

  const { loading, getBillingInfo, updateLoading, getLoading } = useSelector(
    (state) => state.billingInfo
  )

  useEffect(() => {
    dispatch(getBillingInfoAction({ id: providerId }))
  }, [])

  const billingSchema = Yup.object().shape({
    ssn: Yup.string()
      .min(5, 'Tax Id or SSN should be at least 5 letters long')
      .max(16, 'Tax Id or SSN should not exceed more than 16 letters'),
    npi: Yup.string()
      .min(5, 'NPI should be at least 5 letters long')
      .max(16, 'NPI should not exceed more than 16 letters'),
    organization_npi: Yup.string()
      .min(5, 'Organization NPI should be at least 5 letters long')
      .max(16, 'Organization NPI should not exceed more than 16 letters')
  })

  const formik = useFormik({
    initialValues: {
      ssn: getBillingInfo?.ssn || '',
      npi: getBillingInfo?.npi || '',
      organization_npi: getBillingInfo?.organization_npi || ''
    },
    enableReinitialize: true,
    validationSchema: billingSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const initialData = {
          ssn: formik.initialValues.ssn,
          npi: formik.initialValues.npi,
          organization_npi: formik.initialValues.organization_npi
        }
        const data = {
          ssn: values.ssn,
          npi: values.npi,
          organization_npi: values.organization_npi
        }

        const modified_data = getModifiedValues(data, initialData)
        if (!isObjEmpty(modified_data)) {
          dispatch(
            updateBillingInfoAction({ id: providerId, data: modified_data })
          )
        } else {
          dispatch(registerBillingInfoAction({ data }))
        }
      }
    }
  })

  return (
    <>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          {getLoading ? (
            <CustomSpinner />
          ) : (
            <CardBody>
              <div className="billing--bills_form">
                <FormGroupElement
                  inputType="text"
                  label="Tax ID or SSN"
                  placeholder="--"
                  labelClassName="pl-10px"
                  inputName="ssn"
                  inputClassName="form-fields  radius-25 skin-change"
                  {...formik.getFieldProps('ssn')}
                  formikTouched={formik.touched.ssn}
                  formikError={formik.errors.ssn}
                />
                <FormGroupElement
                  inputType="text"
                  label="NPI"
                  placeholder="--"
                  labelClassName="pl-10px"
                  inputName="npi"
                  inputClassName="form-fields  radius-25 skin-change"
                  {...formik.getFieldProps('npi')}
                  formikTouched={formik.touched.npi}
                  formikError={formik.errors.npi}
                />
                <FormGroupElement
                  inputType="text"
                  label="Organization NPI"
                  placeholder="--"
                  labelClassName="pl-10px"
                  inputName="organization_npi"
                  inputClassName="form-fields  radius-25 skin-change"
                  {...formik.getFieldProps('organization_npi')}
                  formikTouched={formik.touched.organization_npi}
                  formikError={formik.errors.organization_npi}
                />
                <div className="d-flex justify-content-end">
                  <Button
                    className="button-cancel mx-1 "
                    size="sm"
                    type="button"
                    onClick={() => formik.resetForm()}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="button-success "
                    size="sm"
                    type="submit"
                    disabled={loading || updateLoading}
                  >
                    {loading || updateLoading ? (
                      <Spinner size="sm" className="spinner-size" />
                    ) : (
                      <Check size={13} />
                    )}
                    <span className="mx-1">Save</span>
                  </Button>
                </div>
              </div>
            </CardBody>
          )}

          <CardFooter className="billing--bills_form__payment">
            <p className="heading-5 mb-1">Online Payments</p>
            <Button
              className="button-green"
              onClick={() => {
                dispatch(getAllStripeCardAction())
                setBasicModal(!basicModal)
              }}
            >
              Setup Stripe Account
            </Button>
          </CardFooter>
        </Form>
      </FormikProvider>
      <PaymentModalBox basicModal={basicModal} setBasicModal={setBasicModal} />
    </>
  )
}
