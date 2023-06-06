/* eslint-disable no-unused-vars */
//third party packages
import { nanoid } from 'nanoid'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FieldArray, Form, FormikProvider, useFormik } from 'formik'
import { Check, DownloadCloud, Plus, Trash2, X } from 'react-feather'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Col,
  Button,
  Row,
  Label,
  Spinner
} from 'reactstrap'
import toast from 'react-hot-toast'
import useMediaQuery from '@hooks/useMediaQuery'
import { ToastContent } from '@src/components/toast'
import Spinner1 from '../../../../components/spinner/Spinner'

//components
import {
  ProviderType,
  StateTypes
} from '../../../../components/status/ProviderTypes'
import SelectField from '@select'
import {
  PhoneUS,
  isObjEmpty,
  dateUnix,
  dateUS,
  getModifiedValues
} from '@utils'
import FormGroupElement from '@FormGroupElement'
import { State, licenseTypes } from '../constants'
import FileUploaderSingle from '../../../../components/fileUploader/FileUploaderSingle'
import { settingMyProfileValidation } from './constant'
//** Actions  */
import {
  getProviderProfileAction,
  updateProviderProfileAction
} from '../../../../redux/setting/management/myProfile/myProfileActions'
import { createNewPasswordAction } from '../../../../redux/authentication/authAction'
import moment from 'moment'
import { resetGetProviderProfile } from '../../../../redux/setting/management/myProfile/myProfileSlice'

// Runtime components

const CustomCol = ({ children, md = 6, sm = 12, lg = 3 }) => {
  return (
    <Col sm={sm} md={md} lg={lg}>
      {children}
    </Col>
  )
}

const SettingMyProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const mediumScreen = useMediaQuery('max-width: 1380px')

  //** Get Profile Data */
  const { getProviderProfile, loading, updateLoading, loadingImage } =
    useSelector((state) => state.providers)
  const { passwordLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(resetGetProviderProfile())

    dispatch(getProviderProfileAction())
  }, [])

  //** Split the Dashes */
  const dateString = moment
    .unix(getProviderProfile?.date_of_birth)
    .format('MM/DD/YYYY')
  const splitDashes = dateString.split('/')
  const month = splitDashes[0]
  const day = splitDashes[1]
  const year = splitDashes[2]

  const formik = useFormik({
    initialValues: {
      first_name: getProviderProfile?.first_name || '',
      last_name: getProviderProfile?.last_name || '',
      middle_name: getProviderProfile?.middle_name || '',
      suffix: getProviderProfile?.suffix || '',
      date_of_birth: getProviderProfile?.date_of_birth || new Date(),
      day: getProviderProfile?.date_of_birth === null ? '' : day,
      month: getProviderProfile?.date_of_birth === null ? '' : month,
      year: getProviderProfile?.date_of_birth === null ? '' : year,
      practice: getProviderProfile?.practice || '',
      email: getProviderProfile?.email || '',
      phone_number: getProviderProfile?.phone_number || '',
      provider_license: getProviderProfile?.provider_license || [],
      npi: getProviderProfile?.npi || '',
      npi_two: getProviderProfile?.npi_two || '',
      tax: getProviderProfile?.npi || '',
      tax_two: getProviderProfile?.npi_two || '',
      taxonomy: getProviderProfile?.taxonomy || '',
      caqh: getProviderProfile?.caqh || '',
      password: '',
      confirmNewPassword: ''
    },
    validationSchema: settingMyProfileValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const notEmptyLicense = values.provider_license.filter(
          (license) =>
            license.license_type === '' ||
            license.license_number === '' ||
            license.expire_date === '' ||
            license.state === ''
        )

        if (notEmptyLicense.length > 0) {
          toast((t) => (
            <ToastContent
              t={t}
              name="Update Profile"
              icon={<X size={14} />}
              color="danger"
              msg="Please fill all license fields"
            />
          ))
        } else {
          let imageData = null
          if (image) {
            imageData = new FormData()
            imageData.append('image', image)
          }
          const dayValue =
            parseInt(values.day) !== parseInt(formik.initialValues.day)
          const monthValue =
            parseInt(values.month) !== parseInt(formik.initialValues.month)
          const yearValue =
            parseInt(values.year) !== parseInt(formik.initialValues.year)

          const newDateString = new Date(
            `${values.month}/${values.day}/${values.year}`
          )
          const ts = moment(newDateString).unix()
          const data = {
            first_name: values?.first_name,
            last_name: values?.last_name,
            middle_name: values?.middle_name,
            suffix: values?.suffix,
            date_of_birth: values?.date_of_birth,
            practice: values?.practice,
            email: values?.email,
            phone_number: values?.phone_number,
            provider_license: values?.provider_license,
            npi: values?.npi,
            npi_two: values?.npi_two,
            taxonomy: values?.taxonomy,
            caqh: values?.caqh
          }
          const newData = {
            ...data,
            date_of_birth:
              dayValue || monthValue || yearValue ? ts : values?.date_of_birth
          }
          const modifiedData = getModifiedValues(newData, formik.initialValues)

          if (Object.keys(modifiedData).length !== 0 || imageData !== null) {
            dispatch(
              updateProviderProfileAction({
                id: getProviderProfile?.id,
                data: modifiedData,
                image: imageData,
                navigate
              })
            )
          }

          if (formik.values.password) {
            const passwordData = {
              id: getProviderProfile?.id,
              password: formik.values.password
            }
            dispatch(
              createNewPasswordAction({
                data: passwordData,
                callback: () => formik.resetForm(),
                navigate
              })
            )
          }
        }
      }
    }
  })

  const initialLicenses = formik.initialValues?.provider_license?.map(
    (provider_license) => {
      return {
        value: provider_license?.license_type,
        text: ProviderType[provider_license?.license_type]?.text || 'All'
      }
    }
  )
  const initialStates = formik.initialValues?.provider_license?.map(
    (provider_license) => {
      return {
        value: provider_license?.state,
        text: StateTypes[provider_license?.state]?.text || 'All'
      }
    }
  )

  return (
    <div>
      <Card>
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">My Profile</span>
        </div>
        {loading ? (
          <Spinner1 />
        ) : (
          <>
          <div className="client_profile">
              <p className="my-2 heading-3">Profile Information</p>
          </div>
              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <div className={'client_profile'}>
                     <Row className="align-items-start">
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        autoFocus
                        required
                        type="text"
                        label="First Name"
                        placeholder="Enter your first name"
                        labelClassName="pl-10px"
                        inputName="first_name"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('first_name')}
                        formikTouched={formik.touched.first_name}
                        formikError={formik.errors.first_name}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        required
                        type="text"
                        label="Last Name"
                        placeholder="Enter your last name"
                        labelClassName="pl-10px"
                        inputName="last_name"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('last_name')}
                        formikTouched={formik.touched.last_name}
                        formikError={formik.errors.last_name}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        type="text"
                        label="Middle Name"
                        placeholder="Enter your middle name"
                        labelClassName="pl-10px"
                        inputName="middle_name"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('middle_name')}
                        formikTouched={formik.touched.middle_name}
                        formikError={formik.errors.middle_name}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        type="text"
                        label="Suffix"
                        placeholder="Enter your siffix"
                        labelClassName="pl-10px"
                        inputName="suffix"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('suffix')}
                        formikTouched={formik.touched.suffix}
                        formikError={formik.errors.suffix}
                      />
                    </Col>
                  <Col sm={12} md={6}>
                    <div className="d-flex align-items-center form-label ">
                      <Label className="pl-10px">Date of Birth</Label>
                    </div>
                      <Row>
                        <Col xs={4} sm={4} md={4} className="pr-0">
                          <FormGroupElement
                            inputType="number"
                            label="Month"
                            max={12}
                            labelClassName="pl-10px "
                            inputName="month"
                            inputClassName="form-fields radius-25 skin-change "
                            {...formik.getFieldProps('month')}
                            formikTouched={formik.touched.month}
                            formikError={formik.errors.month}
                          />
                        </Col>

                        <Col xs={4} sm={4} md={4} className="pr-0">
                          <FormGroupElement
                            inputType="number"
                            label="Day"
                            max={31}
                            labelClassName="pl-10px"
                            inputName="day"
                            inputClassName="form-fields radius-25 skin-change "
                            {...formik.getFieldProps('day')}
                            formikTouched={formik.touched.day}
                            formikError={formik.errors.day}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4} className="pr-0">
                          <FormGroupElement
                            inputType="number"
                            label="Year"
                            labelClassName="pl-10px"
                            inputName="year"
                            inputClassName="form-fields radius-25 skin-change"
                            {...formik.getFieldProps('year')}
                            formikTouched={formik.touched.year}
                            formikError={formik.errors.year}
                          />
                        </Col>
                      </Row>
                  </Col>
                  </Row>
                  </div>

                  <div className={'client_profile'}>
                    <Row className="align-items-start">
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        required
                        type="text"
                        label="Practice Name"
                        placeholder="Enter your practice name"
                        labelClassName="pl-10px"
                        inputName="practice"
                        inputClassName="form-fields radius-25 skin-change resize-none"
                        {...formik.getFieldProps('practice')}
                        formikTouched={formik.touched.practice}
                        formikError={formik.errors.practice}
                      />
                    </Col>
                  </Row>
                  </div>

                  {/* Check this again */}
                  <div className={classNames({
                    'px-2': mediumScreen,
                    client_profile: !mediumScreen
                  })}>
                  <Row>
                    <Col sm={12}>
                      <FileUploaderSingle
                        label="Profile Image"
                        labelClassName="mt-1"
                        onChange={(file) => {
                          setImage(file)
                        }}
                        url={getProviderProfile?.avatar}
                        file={image}
                      >
                        <strong>Profile Image</strong>
                        <DownloadCloud size={64} />
                        <p className="text-secondary text-center">
                          <span className="text-success">Choose image</span> or
                          drag and drop image <br /> upload .jpg or .png image{' '}
                          <br />
                          Max upload size: 10MB
                        </p>
                      </FileUploaderSingle>
                    </Col>
                  </Row>
                  </div>
                  <hr />

                  <div className={'client_profile'}>
                    <p className="my-2 heading-3">Account Information</p>
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        type="text"
                        required
                        label="Account Email"
                        placeholder="Enter your Account Email"
                        labelClassName="pl-10px"
                        inputName="email"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('email')}
                        formikTouched={formik.touched.email}
                        formikError={formik.errors.email}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <FormGroupElement
                        type="text"
                        required
                        label="Mobile Phone Number"
                        helpIcon={
                          <Icon
                            className="ml-5px"
                            icon="clarity:help-solid"
                            width="15"
                            height="15"
                          />
                        }
                        placeholder="Enter your Phone Number"
                        labelClassName="pl-10px"
                        inputName="phone_number"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('phone_number')}
                        formikTouched={formik.touched.phone_number}
                        formikError={formik.errors.phone_number}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'phone_number',
                            PhoneUS(e.target.value)
                          )
                        }
                      />
                    </Col>
                    <small className="pb-2 mx-2">
                      Used to verify your account should you need to recover
                      your username or reset your password
                    </small>
                  </div>
                  <hr />

                  <div className="client_profile">
                    <p className="my-2 heading-3">License</p>
                    <FieldArray
                      name="provider_license"
                      render={(arrayHelpers) => (
                        <>
                          {formik?.values?.provider_license.map((_, index) => (
                            <div key={index} className="client_profile--licenseList">
                              <Row className="align-items-start">
                                <Col sm={12} md={6}>
                                  <SelectField
                                    label="License Type"
                                    menuHeight="20rem"
                                    header={false}
                                    className="plr-0 position-relative"
                                    // defaultWidth="100%"
                                    defaultValue={
                                      initialLicenses[index] || licenseTypes[0]
                                    }
                                    data={licenseTypes}
                                    search={false}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `provider_license.${index}.license_type`,
                                        `${e.value}`
                                      )
                                    }
                                  />
                                </Col>
                                <Col sm={12} md={6}>
                                  <FormGroupElement
                                    inputType="text"
                                    label={'License #'}
                                    placeholder="Enter your license"
                                    labelClassName="pl-10px"
                                    id={`provider_license.${index}.license_number-${nanoid()}`}
                                    inputName={`provider_license[${index}].license_number`}
                                    inputClassName="form-fields radius-25 skin-change"
                                    {...formik.getFieldProps(
                                      `provider_license.${index}.license_number`
                                    )}
                                    formikTouched={
                                      formik?.touched?.provider_license?.[index]
                                        ?.license_number
                                    }
                                    formikError={
                                      formik?.errors?.provider_license?.[index]
                                        ?.license_number
                                    }
                                  />
                                </Col>
                                <Col sm={12} md={6}>
                                  <Label
                                      htmlFor={`provider_license[${index}].expire_date`}
                                      className="mb-0_5 pl-10px"
                                  >
                                    License Expiration
                                  </Label>
                                  <Flatpickr
                                      data-enable-time
                                      type="date"
                                      placeholder="MM/DD/YYYY"
                                      id={`provider_license[${index}].expire_date`}
                                      name={`provider_license[${index}].expire_date`}
                                      className="radius-25 bg-white form-control skin-change mb-1 pointer"
                                      value={dateUS(
                                          formik.values?.provider_license?.[index]
                                              ?.expire_date
                                      )}
                                      onChange={(date) => {
                                        formik.setFieldValue(
                                            `provider_license[${index}].expire_date`,
                                            dateUnix(date)
                                        )
                                      }}
                                      options={{
                                        dateFormat: 'n/j/Y',
                                        minDate: 'today',
                                        enableTime: false,
                                        mode: 'single'
                                      }}
                                  />
                                </Col>
                                <Col sm={12} md={6}>
                                  <SelectField
                                      label="License State"
                                      menuHeight="18rem"
                                      className="plr-0 position-relative"
                                      header={false}
                                      defaultValue={
                                          initialStates[index] || State[0]
                                      }
                                      data={State}
                                      search={false}
                                      onChange={(e) =>
                                          formik.setFieldValue(
                                              `provider_license.${index}.state`,
                                              `${e.value}`
                                          )
                                      }
                                  />
                                </Col>
                                {formik.values.provider_license.length > 1 && (
                                    <div className="trashLeft">
                                      <Icon
                                          icon="bi:trash-fill"
                                          color="red"
                                          width="20"
                                          height="20"
                                          onClick={() => arrayHelpers.remove(index)}
                                          className="pointer"
                                      />
                                    </div>
                                )}
                              </Row>

                              {formik.values.provider_license.length - 1 ===
                                  index && (
                                      <Button
                                          className="add-more my-1 "
                                          onClick={() =>
                                              arrayHelpers.push({
                                                licenseType: '',
                                                license_number: '',
                                                expire_date: '',
                                                state: 'LA'
                                              })
                                          }
                                      >
                                        <Plus size={15} />{' '}
                                        <small>
                                          <span>Additional License</span>
                                        </small>
                                      </Button>
                                  )}
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </div>

                  <div className="client_profile">
                    <Row className="mt-2">
                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'NPI Type 1'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="npi"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('npi')}
                        formikTouched={formik.touched.npi}
                        formikError={formik.errors.npi}
                      />
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'NPI Type 2'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="npi_two"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('npi_two')}
                        formikTouched={formik.touched.npi_two}
                        formikError={formik.errors.npi_two}
                      />
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'Tax ID for NPI Type 1'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="tax"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('tax')}
                        formikTouched={formik.touched.tax}
                        formikError={formik.errors.tax}
                      />
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'Tax ID for NPI Type 2'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="tax_two"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('tax_two')}
                        formikTouched={formik.touched.tax_two}
                        formikError={formik.errors.tax_two}
                      />
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'taxonomy Code (Box 33b)'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="taxonomy"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('taxonomy')}
                        formikTouched={formik.touched.taxonomy}
                        formikError={formik.errors.taxonomy}
                      />
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'CAQH'}
                        placeholder="0000000000"
                        labelClassName="pl-10px"
                        inputName="caqh"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('caqh')}
                        formikTouched={formik.touched.caqh}
                        formikError={formik.errors.caqh}
                      />
                    </Col>
                  </Row>
                  </div>
                  <hr />

                  <div className="client_profile">
                  <Row className={'align-item-start'}>
                    <p className="my-2 heading-3">License</p>
                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label={'New Password'}
                        placeholder=""
                        labelClassName="pl-10px"
                        inputName="password"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('password')}
                        formikTouched={formik.touched.password}
                        formikError={formik.errors.password}
                      />
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <FormGroupElement
                        type="text"
                        label="Confirm New Password"
                        placeholder=""
                        labelClassName="pl-10px"
                        inputName="confirmNewPassword"
                        inputClassName="form-fields radius-25 skin-change"
                        {...formik.getFieldProps('confirmNewPassword')}
                        formikTouched={formik.touched.confirmNewPassword}
                        formikError={formik.errors.confirmNewPassword}
                      />
                    </Col>
                  </Row>
                  <small className="pb-2 mx-2">
                    Requirements: 8+ characters, at least one number, one
                    uppercase, and one lowercase letter.
                  </small>
                  <Button
                    type="submit"
                    className="button-success pd mt-2"
                    disabled={loading || loadingImage || passwordLoading}
                  >
                    {loading ||
                    loadingImage ||
                    passwordLoading ||
                    updateLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Check size={15} />
                    )}
                    <span className="px-1">Save</span>
                  </Button>
                  </div>
                </Form>
              </FormikProvider>
          </>
        )}
      </Card>
    </div>
  )
}

export default SettingMyProfile
