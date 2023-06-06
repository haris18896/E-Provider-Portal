/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// third party pkg
import * as Yup from 'yup'
import { isObjEmpty } from '@utils'
import { Icon } from '@iconify/react'
import { ErrorMessage, useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, Form, Row, Spinner } from 'reactstrap'

// components
import SelectField from '@select'
import FormGroupElement from '@FormGroupElement'
import { iconData, State, services } from './constants'
import { columns as cols } from './billing-address-table.data'
import { SettingsBillingLocation } from '@ScreenComponent/settings.component/scheduling/location/table/table-billing-address'
import { SettingsLocationTable } from '@ScreenComponent/settings.component/scheduling/location/table/table-location'
//** Actions  */
import {
  getAllLocationAction,
  registerLocationAction
} from '../../../../redux/setting/scheduling/location/locationAction'
import CreateBillingModal from '../../../../components/screen.components/settings.component/scheduling/location/CreateBillingModal'

const SettingLocation = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.locations)
  const [currentPage, setPage] = useState(0)

  //**  get Provider ID */
  const id = useSelector((state) => state?.auth?.user?.user_id)

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!open)
  }

  const locationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.object().required('State is required'),
    zipcode: Yup.string().required('ZipCode is required'),
    icon: Yup.object().required('Icon is required'),
    place_of_service: Yup.object().required('Place of service is required'),
    is_default: Yup.boolean().required('Name is required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      city: '',
      state: null,
      zipcode: '',
      icon: null,
      place_of_service: null,
      is_default: false
    },
    enableReinitialize: true,
    validationSchema: locationSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          address: values.address,
          city: values.city,
          state: values.state.value,
          zipcode: values.zipcode,
          icon: values.icon.value,
          place_of_service: values.place_of_service.value,
          is_default: values.is_default
        }

        dispatch(
          registerLocationAction({
            id,
            data,
            callback: () => {
              setPage(0)
              formik.resetForm()
            }
          })
        )
      }
    }
  })
  return (
    <div>
      <Card className='mb-0 pb-3'>
        <div className="p-2 pt-3 bg-yellow ">
          <span className="heading-1">Locations</span>
        </div>
        <SettingsLocationTable
          id={id}
          setPage={setPage}
          currentPage={currentPage}
        />

        <CardBody className="width-check mt-2 ">
          <span className="sub-heading-1">Add New Location</span>
          <form onSubmit={formik.handleSubmit}>
            <Row className="align-items-center mt-1">
              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="Name"
                  inputName="name"
                  labelClassName="pl-10px"
                  // formGroupClassName="input-maxHeight"
                  inputClassName=" react-select form-fields radius-25 skin-change "
                  {...formik.getFieldProps('name')}
                  formikTouched={formik.touched.name}
                  formikError={formik.errors.name}
                  backendError={error?.name?.[0]}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="Address"
                  inputName="address"
                  labelClassName="pl-10px"
                  // formGroupClassName="input-maxHeight"
                  inputClassName=" react-select form-fields radius-25 skin-change"
                  {...formik.getFieldProps('address')}
                  formikTouched={formik.touched.address}
                  formikError={formik.errors.address}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="City"
                  inputName="city"
                  labelClassName="pl-10px"
                  // formGroupClassName="input-maxHeight "
                  inputClassName=" react-select form-fields radius-25 skin-change"
                  {...formik.getFieldProps('city')}
                  formikTouched={formik.touched.city}
                  formikError={formik.errors.city}
                />
              </Col>

              <Col sm={12} md={6}>
                <SelectField
                  className="plr-0 position-relative"
                  label="State"
                  menuHeight="20rem"
                  header={false}
                  search={false}
                  data={State}
                  value={formik.values.state}
                  placeholder="Select State"
                  onChange={(e) => formik.setFieldValue('state', e)}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="Zip Code"
                  inputName="zipcode"
                  labelClassName="pl-10px"
                  // formGroupClassName="input-maxHeight"
                  inputClassName=" react-select form-fields radius-25 skin-change"
                  {...formik.getFieldProps('zipcode')}
                  formikTouched={formik.touched.zipcode}
                  formikError={formik.errors.zipcode}
                />
              </Col>

              <Col sm={12} md={6}>
                <SelectField
                  label="Icon"
                  header={false}
                  search={false}
                  className="plr-0 position-relative"
                  placeholder="Select Icon"
                  inputClassName=" react-select form-fields radius-25 skin-change"
                  value={formik.values.icon}
                  data={iconData}
                  onChange={(e) => formik.setFieldValue('icon', e)}
                />
              </Col>

              <Col sm={12}>
                <SelectField
                  label="Place of Service"
                  header={false}
                  search={false}
                  className="plr-0 position-relative"
                  placeholder="Select Place of Service"
                  value={formik.values.place_of_service}
                  data={services}
                  onChange={(e) => formik.setFieldValue('place_of_service', e)}
                />
              </Col>

              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="checkbox"
                  inputName="setAsDefaultForm"
                  label="Set as Default"
                  labelClassName="pl-10px"
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 pl-10px mt-1"
                  inputClassName="skin-change m-0"
                  checked={formik.values.is_default === true}
                  {...formik.getFieldProps('is_default')}
                  formikTouched={formik.touched.is_default}
                  formikError={formik.errors.is_default}
                />
              </Col>

              <Col sm={12}>
                <div className="cancel-and-save-end">
                  <Button
                    className="button-cancel me-1"
                    type="button"
                    onClick={() => formik.resetForm()}
                  >
                    Cancel
                  </Button>
                  <Button className="button-success" type="submit">
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon icon="akar-icons:check" width="15" height="15" />
                    )}
                    <span className="px-1">Save</span>
                  </Button>
                </div>
              </Col>
            </Row>
          </form>
        </CardBody>

        <hr />
        <div className="d-flex justify-content-between flex-wrap px-2 align-items-baseline">
          <span className="sub-heading-1  pb-1">Billing Address</span>
          <span>
            <Button className="add-more pd-s" onClick={handleOpen}>
              <Icon icon="akar-icons:plus" />
              <span className="px-1">Add Billing Address</span>
            </Button>
          </span>
        </div>

        <SettingsBillingLocation  columns={cols} id={id} />
        <CreateBillingModal setOpen={setOpen} open={open} id={id} edit={false}/>
      </Card>
    </div>
  )
}

export default SettingLocation
