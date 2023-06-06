/* eslint-disable no-unused-vars */
// ** React Imports
import * as Yup from 'yup'
import { useState } from 'react'
import validator from 'validator'
import classNames from 'classnames'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { isObjEmpty } from '@utils'
import { useSkin } from '@hooks/useSkin'
import { MAIN_URL } from '@src/constants'

// ** Icons Imports
import themeConfig from '@configs/themeConfig'
import { ChevronLeft, Check, X } from 'react-feather'

// ** Custom Components
import toast from 'react-hot-toast'
import { ToastContent } from '@src/components/toast'
import InputPasswordToggle from '@components/input-password-toggle'
import FormGroupElement from '@src/components/formGroup/FormGroupElement'
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  FormFeedback,
  Button,
  Spinner
} from 'reactstrap'
import { ErrorMessage, useFormik } from 'formik'
// ** Styles
import axios from 'axios'
import { decode } from 'jsonwebtoken'
import queryString from 'query-string'
import '@styles/react/pages/page-authentication.scss'

const CreatePassword = () => {
  // ** Hooks
  const { skin } = useSkin()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [loading, setLoading] = useState(false)

  const obj = queryString.parse(search)
  const token = obj.token
  const decoded = decode(token)
  const id = decoded?.user_id

  const illustration =
      skin === 'dark'
        ? 'forgot-password-v2-dark.svg'
        : 'forgot-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const NewPasswordSchema = Yup.object().shape({
    isRequired: Yup.boolean().oneOf(
      [true],
      'You must accept the terms and conditions'
    ),
    newPassword: Yup.string().required("Password is a required Field").test(
      'strong-password',
      'Password must contain at least 8 characters, one number, one uppercase letter and one lowercase letter',
      (value) => {
        if (!value) {
          return true
        }
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 0
        })
      }
    ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords do not match!'
    )
  })
  // formik hook
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      isRequired: false
    },
    validationSchema: NewPasswordSchema,
    onSubmit: async (values) => {
      if (isObjEmpty(formik.errors)) {
        setLoading(true)
        const { newPassword } = values
        const data = {
          id,
          password: newPassword.trim()
        }

        try {
          const response = await axios(
            `${MAIN_URL}/api/create-password-confirm`,
            {
              method: 'POST',
              data,
              headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json'
              }
            }
          )
          toast((t) => (
            <ToastContent
              t={t}
              name={'Password Created Successfully'}
              icon={<Check size={14} />}
              color="success"
              msg={response?.data}
            />
          ))
          if (response.status === 200) {
            navigate('/login')
          }
        } catch (err) {
          toast((t) => (
            <ToastContent
              t={t}
              name={'Error Logging In'}
              icon={<X size={14} />}
              color="danger"
              msg={err.response?.data?.nonFieldErrors?.[0] || err.message}
            />
          ))
        } finally {
          setLoading(false)
        }
      }
    }
  })
  

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo d-flex align-items-center"
          to="/"
          onClick={(e) => e.preventDefault()}
        >
          {skin === 'dark' ? (
            <img
              src={themeConfig.app.appLogoImage}
              alt="logo-dark"
              height={35}
              width={35}
            />
          ) : (
            <img
              src={themeConfig.app.appLogoImage}
              alt="logo-dark"
              height={35}
              width={35}
            />
          )}
          <h2 className="ms-1 mb-0">ethera</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Create Password? 🔒
            </CardTitle>
            <CardText className="mb-2">Enter your New Password</CardText>
            <Form
              className="auth-forgot-password-form mt-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-1 inputs-styling ">
                <Label className="form-label px-1" htmlFor="register-password">
                  New Password
                </Label>
                <InputPasswordToggle
                  id="newPassword"
                  name="newPassword"
                  {...formik.getFieldProps('newPassword')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid':
                      formik.touched.newPassword && formik.errors.newPassword
                  })}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <FormFeedback className="px-1">
                    {formik.errors.newPassword}
                  </FormFeedback>
                )}
              </div>
              <div className="mb-3 inputs-styling ">
                <Label className="form-label px-1" htmlFor="register-password">
                  Confirm New Password
                </Label>
                <InputPasswordToggle
                  id="confirmPassword"
                  name="confirmPassword"
                  {...formik.getFieldProps('confirmPassword')}
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid':
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                  })}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <FormFeedback className="px-1">
                      {formik.errors.confirmPassword}
                    </FormFeedback>
                  )}
              </div>
              <div >
                <FormGroupElement
                  type="checkbox"
                  label={
                    <a href="#" className='text-dark'>{'I agree to the Terms and Conditions'}</a>
                  }
                  inputName="isRequired"
                  labelClassName="pl-28px mt-21 mt-5"
                  inputClassName="skin-change mr-19 my-1 "
                  value={formik.values.isRequired}
                  // defaultChecked={formik.values.isRequired}
                  formikTouched={formik.touched.isRequired}
                  formikError={formik.errors.isRequired}
                  {...formik.getFieldProps('isRequired')}
                />
                
              </div>
              <Button
                color="primary"
                block
                onClick={formik.submitForm}
                className="my-2"
              >
                {loading && <Spinner size="sm" className="mx-1" />}
                Save
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default CreatePassword
