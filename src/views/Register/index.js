/* eslint-disable no-unused-vars */
// ** React Imports
import { Link } from "react-router-dom"
import * as Yup from 'yup'
import classNames from 'classnames'
import { useFormik } from 'formik'
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather"
import themeConfig from "@configs/themeConfig"
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle"

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  FormFeedback,
  Form,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap"
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import "@styles/react/pages/page-authentication.scss"

const Register = () => {
  // ** Hooks
  const { skin } = useSkin()
 

  const illustration =
      skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

      /// Formik Validations

      const RegisterClientSchema = Yup.object().shape({
        username: Yup.string().required('Username is a required field!'),
        email: Yup.string()
          .email('Please enter a valid email address')
          .required('Email is a required field!'),
        password: Yup.string().required('Password is a required field!')
      })
       
    /// formik hooks
      const formik = useFormik({
        initialValues: {
          username:"",
          email: '',
          password: ''
        },
        validationSchema: RegisterClientSchema,
        onSubmit: (values) => {
          if (isObjEmpty(formik.errors)) {
            const { username, email, password} = values
            const data = {
              username: username.trim(),
              email: email.trim(),
              password: password.trim()
            }
            // dispatch(handleRegister({ data, navigate }))
          }
        }
      })

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
       
      <Link className="brand-logo d-flex align-items-center" to="/" onClick={(e) => e.preventDefault()}>
          {skin === "dark" ? (
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
              height="35px"
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
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Create your Ethera account
            </CardTitle>
            <CardText className="mb-2">
              Make your app management easy and fun!
            </CardText>
            <Form
              className="auth-register-form mt-2"
              // onSubmit={formik.handleSubmit}
            >
               <div className="minHeightInput">
                <Label className="form-label px-1" for="register-username">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  name='username'
                  placeholder="johndoe"
                  autoFocus
                  {...formik.getFieldProps('username')}
                    className={classNames({
                      'radius-25 skin-change': true,
                      'is-invalid': formik.touched.username && formik.errors.username
                    })}
                />
                {formik.touched.username && formik.errors.username && (
                    <FormFeedback className="ml-1">
                      {formik.errors.username}
                    </FormFeedback>
                  )}
              </div>

              <div className=" minHeightInput">
                <Label className="form-label px-1" for="register-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="provider@example.com"
                  {...formik.getFieldProps('email')}
                    className={classNames({
                      'radius-25 skin-change': true,
                      'is-invalid': formik.touched.email && formik.errors.email
                    })}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormFeedback className="ml-1">
                      {formik.errors.email}
                    </FormFeedback>
                  )}
              </div>

              <div className=" minHeightInput">
                <Label className="form-label px-1" for="password">
                  Password
                </Label>
                <InputPasswordToggle
                  id="password"
                  name="password"
                  {...formik.getFieldProps('password')}
                  inputClassName="radius-25 skin-change"
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid':
                      formik.touched.password && formik.errors.password
                  })}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormFeedback className="ml-1">
                    {formik.errors.password}
                  </FormFeedback>
                )}
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="terms" />
                <Label className="form-check-label" htmlFor="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button tag={Link} to="/" color="primary" block  
              // disabled={loginInProgress}
              >
               {/* <Spinner size="sm"
                className={classNames({'d-none': !loginInProgress})} 
                /> */}
              <span className='px-1'>
                Sign up
              </span>
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google">
                <Mail size={14} />
              </Button>
              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
