/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
// third party pkg
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Icon } from '@iconify/react'

// components
import SelectField from '@select'
import { State } from '../constants'
import FormGroupElement from '@FormGroupElement'
import { Button, CardFooter, Form, Row, Col } from 'reactstrap'

export const BillingProviderInfo = () => {
  const billingSchema = Yup.object().shape({
    type: Yup.string().matches(
      /^(individual|organization)$/,
      'Type must be either Individual or Organization'
    ),
    practice: Yup.boolean(),
    firstName: Yup.string()
      .min(2, 'First Name should be at least 2 letters long')
      .max(15, 'First Name should not exceed more than 15 letters')
      .required('First Name is a required field'),
    middleName: Yup.string()
      .min(2, 'Middle Name should be at least 2 letters long')
      .max(15, 'Middle Name should not exceed more than 15 letters'),
    lastName: Yup.string()
      .min(2, 'Last Name should be at least 2 letters long')
      .max(15, 'Last Name should not exceed more than 15 letters')
      .required('Last Name is a required field'),
    address: Yup.string()
      .min(2, 'Address should be at least 2 letters long')
      .max(15, 'Address should not exceed more than 15 letters'),
    city: Yup.string()
      .min(2, 'City should be at least 2 letters long')
      .max(15, 'City should not exceed more than 15 letters'),
    country: Yup.string(),
    zipCode: Yup.string()
      .min(3, 'Zip Code should be at least 3 letters long')
      .max(7, 'Zip Code should not exceed more than 7 letters'),
    npi: Yup.string()
      .min(5, 'NPI should be at least 5 letters long')
      .max(16, 'NPI should not exceed more than 16 letters'),
    taxonomyCode: Yup.string()
      .min(5, 'Taxonomy should be at least 5 letters long')
      .max(16, 'Taxonomy should not exceed more than 16 letters'),
    claimForm: Yup.boolean(),
    diagnosisCode: Yup.boolean(),
    modifier: Yup.boolean()
  })

  const formik = useFormik({
    initialValues: {
      type: 'individual',
      practice: true,
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      city: '',
      country: 'AL',
      zipCode: '',
      npi: '',
      taxonomyCode: '',
      claimForm: false,
      diagnosisCode: false,
      modifier: false
    },
    enableReinitialize: true,
    validationSchema: billingSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          type: values.type,
          practice: values.practice,
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          address: values.address,
          city: values.city,
          country: values.country,
          zipCode: values.zipCode,
          npi: values.npi,
          taxonomyCode: values.taxonomyCode,
          claimForm: values.claimForm,
          diagnosisCode: values.diagnosisCode,
          modifier: values.modifier
        }
        // dispatch(handleSubmit(data))
      }
    }
  })

  const typeOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Organization', value: 'organization' }
  ]

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className="d-flex align-items-center mt-2 pl-20px">
        {typeOptions.map((item, index) => (
          <Fragment key={index}>
            <FormGroupElement
              key={index}
              inputType="radio"
              label={item.label}
              inputName={item.value}
              labelClassName="pl-10px"
              formGroupClassName="client_profile--checkbox me-2"
              inputClassName="skin-change"
              value={formik.values.type}
              checked={item.value === formik.values.type}
              onChange={() => formik.setFieldValue('type', item.value)}
            />
          </Fragment>
        ))}
      </div>
      <hr />
      <Row className="billing--bills_form px-2">
        <Fragment>
          <FormGroupElement
            inputType="checkbox"
            label="Use Practice Default"
            labelClassName="pl-10px"
            inputName="practice"
            inputClassName="skin-change"
            formGroupClassName="client_profile--checkbox mb-2"
            checked={formik.values.practice}
            value={formik.values.practice}
            onChange={(e) => formik.setFieldValue('practice', e.target.checked)}
          />
        </Fragment>

        <Col sm={12} md={6}>
          <FormGroupElement
            autoFocus
            required
            inputType="text"
            label="First Name"
            placeholder="Enter your first name"
            labelClassName="pl-10px"
            inputName="firstName"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('firstName')}
            formikTouched={formik.touched.firstName}
            formikError={formik.errors.firstName}
          />
        </Col>

        <Col sm={12} md={6}>
          <FormGroupElement
            inputType="text"
            label="Middle Name"
            placeholder="Enter your middle name"
            labelClassName="pl-10px"
            inputName="middleName"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('middleName')}
            formikTouched={formik.touched.middleName}
            formikError={formik.errors.middleName}
          />
        </Col>

        <Col sm={12} md={6}>
          <FormGroupElement
            required
            inputType="text"
            label="Last Name"
            placeholder="Enter your last name"
            labelClassName="pl-10px"
            inputName="lastName"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('lastName')}
            formikTouched={formik.touched.lastName}
            formikError={formik.errors.lastName}
          />
        </Col>

        <Col sm={12} className="mt-1">
          <FormGroupElement
            inputType="text"
            label="Address"
            placeholder="Street Address"
            labelClassName="pl-10px"
            inputName="address"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('address')}
            formikTouched={formik.touched.address}
            formikError={formik.errors.address}
          />
        </Col>

        <Col sm={12} md={4}>
          <FormGroupElement
            inputType="text"
            placeholder="city"
            inputName="city"
            labelClassName="pl-10px"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('city')}
            formikTouched={formik.touched.city}
            formikError={formik.errors.city}
          />
        </Col>

        <Col sm={12} md={4}>
          <SelectField
            header={false}
            value={State[0]}
            data={State}
            change={(e) => formik.setFieldValue('state', e.text)}
          />
        </Col>

        <Col sm={12} md={4}>
          <FormGroupElement
            inputType="text"
            placeholder="zip code"
            labelClassName="pl-10px"
            inputName="zipCode"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('zipCode')}
            formikTouched={formik.touched.zipCode}
            formikError={formik.errors.zipCode}
          />
        </Col>

        <Col sm={12} className="mt-1">
          <FormGroupElement
            inputType="text"
            label="NPI (box 33a)"
            placeholder="00000000"
            labelClassName="pl-10px"
            inputName="npi"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('npi')}
            formikTouched={formik.touched.npi}
            formikError={formik.errors.npi}
          />
        </Col>

        <Col sm={12}>
          <FormGroupElement
            inputType="text"
            label="Taxonomy Code (box 33b)"
            placeholder="00000000"
            labelClassName="pl-10px"
            inputName="taxonomyCode"
            inputClassName="form-fields  radius-25 skin-change"
            {...formik.getFieldProps('taxonomyCode')}
            formikTouched={formik.touched.taxonomyCode}
            formikError={formik.errors.taxonomyCode}
          />
        </Col>
      </Row>

      <hr className="mt-2" />

      <div className="px-2">
        <p className="heading-5">Security Facility Location(Box 32)</p>
        <div className="d-flex align-items-center">
          <FormGroupElement
            inputType="checkbox"
            label="Include on Claim Form"
            labelClassName="pl-10px"
            inputName="claimForm"
            inputClassName="skin-change"
            formGroupClassName="client_profile--checkbox me-1"
            checked={formik.values.claimForm}
            value={formik.values.claimForm}
            onChange={(e) =>
              formik.setFieldValue('claimForm', e.target.checked)
            }
          />
          <Icon icon="fa-solid:question-circle" width="20" height="20" />
        </div>
      </div>

      <hr className="mt-2" />

      <div className="px-2">
        <p className="heading-5">Claims and Superbill Settings</p>
        <div className="d-flex align-items-center">
          <FormGroupElement
            inputType="checkbox"
            label="Include Multiple Diagnosis Code"
            labelClassName="pl-10px"
            inputName="diagnosisCode"
            inputClassName="skin-change"
            formGroupClassName="client_profile--checkbox me-1"
            checked={formik.values.diagnosisCode}
            value={formik.values.diagnosisCode}
            onChange={(e) =>
              formik.setFieldValue('diagnosisCode', e.target.checked)
            }
          />
          <Icon icon="fa-solid:question-circle" width="20" height="20" />
        </div>
      </div>

      <CardFooter className="billing--bills_form__payment">
        <Fragment>
          <p className="heading-5">Modifiers</p>
          <div className="d-flex align-items-center">
            <FormGroupElement
              inputType="checkbox"
              label="Enable Modifiers for your practice"
              labelClassName="pl-10px"
              inputName="modifier"
              inputClassName="skin-change"
              formGroupClassName="client_profile--checkbox me-1"
              checked={formik.values.modifier}
              value={formik.values.modifier}
              onChange={(e) =>
                formik.setFieldValue('modifier', e.target.checked)
              }
            />
            <Icon icon="fa-solid:question-circle" width="20" height="20" />
          </div>
        </Fragment>

        <Button className="button-success mt-3">
          <Icon icon="akar-icons:check" width="15" height="15" />
          <span>Save</span>
        </Button>
      </CardFooter>
    </Form>
  )
}
