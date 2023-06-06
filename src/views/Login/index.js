import React, { useContext } from 'react'

// ** context
import { AbilityContext } from '@src/utility/context/Can'

// Yup and classnames
import * as Yup from 'yup'
import classNames from 'classnames'

// import Spinner from '../common/Spinner'
import themeConfig from '@configs/themeConfig'
import InputPasswordToggle from '@components/input-password-toggle'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Link, useNavigate } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
// import { handleLogin } from '../../redux/actions/auth'
// import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Spinner
} from 'reactstrap'
import '@styles/base/pages/authentication.scss'
import { useDispatch, useSelector } from 'react-redux'

// ** actions
import { login } from '@store/authentication/authAction'

function Login() {
  const skin = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)

  const { loginInProgress } = useSelector((state) => state.auth)

  const LoginAdminSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is a required field!'),
    password: Yup.string().required('Password is a required field!')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginAdminSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const { email, password } = values
        const data = {
          email: email.trim(),
          password: password.trim()
        }
        dispatch(login({ data, ability, navigate }))
      }
    }
  })

  return (
    <div className="bg-ethera">
      <div className="auth-wrapper auth-basic px-2 ">
        <div className="auth-inner py-2">
          <Card className="auth-inner mb-0">
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                {skin === 'dark' ? (
                  <img
                    src={themeConfig.app.appLogoImage}
                    alt="logo-dark"
                    height="150px"
                  />
                ) : (
                  <img
                    src={themeConfig.app.appLogoImage}
                    alt="logo-dark"
                    height="150px"
                  />
                )}
              </Link>
              <CardTitle tag="h4" className="mb-2 text-center">
                Provider Login
              </CardTitle>
              <Form
                className="auth-login-form mt-2"
                onSubmit={formik.handleSubmit}
              >
                <div className="minHeightLoginInputs">
                  <Label className="form-label px-1" for="email">
                    Email
                  </Label>
                  <Input
                    autoFocus
                    type="email"
                    id="email"
                    name="email"
                    placeholder="provider@example.com"
                    {...formik.getFieldProps('email')}
                    className={classNames({
                      'radius-25 skin-change': true,
                      'is-invalid': formik.touched.email && formik.errors.email
                    })}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormFeedback className="px-1">
                      {formik.errors.email}
                    </FormFeedback>
                  )}
                </div>

                <div className="minHeightLoginInputs">
                  <div className="d-flex justify-content-between ">
                    <Label className="form-label px-1" for="password">
                      Password
                    </Label>
                  </div>
                  <InputPasswordToggle
                    id="password"
                    name="password"
                    inputClassName="radius-25 skin-change"
                    {...formik.getFieldProps('password')}
                    className={classNames({
                      'input-group-merge': true,
                      'is-invalid':
                        formik.touched.password && formik.errors.password
                    })}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormFeedback className="px-1">
                      {formik.errors.password}
                    </FormFeedback>
                  )}
                </div>

                <Button
                  type="submit"
                  color="primary"
                  block
                  className="button-primary my-2"
                  disabled={loginInProgress}
                >
                  <Spinner
                    size="sm"
                    className={classNames({
                      'd-none ': !loginInProgress
                    })}
                  />
                  <span className='mx-1'>Sign In</span>
                </Button>
              </Form>
              <div className="my-1 d-flex align-items-center justify-content-between">
                <p
                  className="floatRight"
                  onClick={() => navigate('/create-new-password')}
                >
                  <span className="link">Forgot Password</span>
                </p>

                <p htmlFor="terms">
                  New to Ethera?
                  <span className="link" onClick={() => navigate('/register')}>
                    {' '}
                    Register{' '}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
