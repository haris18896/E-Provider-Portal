/* eslint-disable no-unused-vars */
// ** React Imports
import { Link } from "react-router-dom"
import * as Yup from "yup"
import validator from 'validator'
import classNames from "classnames"

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Icons Imports
import { ChevronLeft } from "react-feather"
import themeConfig from "@configs/themeConfig"
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle"
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
  Button
} from "reactstrap"
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik"
// ** Styles
import "@styles/react/pages/page-authentication.scss"

const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration =
      skin === "dark" ? "forgot-password-v2-dark.svg" : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default

    
    const ResetPasswordSchema = Yup.object().shape({
      oldPassword: Yup.string().required("Old Password is a required field!"),
      newPassword: Yup.string()
    .test(
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
      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords do not match!')
    })
  // formik hook
    const formik = useFormik({
      initialValues: {
        oldPassword:"",
        newPassword:""
      },
      validationSchema: ResetPasswordSchema,
      onSubmit: (values) => {
        if (isObjEmpty(formik.errors)) {
          const {oldPassword, newPassword} = values
          const data = {
            oldPassword: oldPassword.trim(),
            newPassword: newPassword.trim()
          }
          // dispatch(handleReset(data))
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
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your Old Password 
            </CardText>
            <Form
              className="auth-forgot-password-form mt-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-1 inputs-styling">
                <Label className="form-label px-1" htmlFor="register-password">
                  Old Password
                </Label>
                <InputPasswordToggle
                  id="oldPassword"
                  name="oldPassword"
                  {...formik.getFieldProps("oldPassword")}
                  className={classNames({
                    "input-group-merge": true,
                    "is-invalid":
                      formik.touched.oldPassword && formik.errors.oldPassword
                  })}
                />
                {formik.touched.oldPassword  &&
                formik.errors.oldPassword  && (
                  <FormFeedback className="px-1">{formik.errors.oldPassword}</FormFeedback>
                )}
              </div>
              <div className="mb-1 inputs-styling">
                <Label className="form-label px-1" htmlFor="register-password">
                  New Password
                </Label>
                <InputPasswordToggle
                  id="newPassword"
                  name="newPassword"
                  {...formik.getFieldProps("newPassword")}
                  className={classNames({
                    "input-group-merge": true,
                    "is-invalid":
                      formik.touched.newPassword && formik.errors.newPassword
                  })}
                />
                {formik.touched.newPassword  &&
                formik.errors.newPassword  && (
                  <FormFeedback className="px-1">{formik.errors.newPassword}</FormFeedback>
                )}
              </div>
              <div className="mb-1 inputs-styling">
                <Label className="form-label px-1" htmlFor="register-password">
                  Confirm New Password
                </Label>
                <InputPasswordToggle
                  id="confirmPassword"
                  name="confirmPassword"
                  {...formik.getFieldProps("confirmPassword")}
                  className={classNames({
                    "input-group-merge": true,
                    "is-invalid":
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                  })}
                />
                {formik.touched.confirmPassword  &&
                formik.errors.confirmPassword  && (
                  <FormFeedback className="px-1">{formik.errors.confirmPassword}</FormFeedback>
                )}
              </div>
              <Button color="primary" block onClick={formik.submitForm} className="my-2">
                Change
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default ForgotPassword
