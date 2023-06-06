/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect } from 'react'
import SelectField from '@select'
import {
  iconData,
  services,
  State
} from '../../views/settings/scheduling/location/constants'
import {
  IconData,
  placeOfService,
  StateData
} from '../../components/status/ProviderLocation'
// ** Utils
import { isObjEmpty, getModifiedValues } from '@utils'

// ** Third Party Packages
import * as Yup from 'yup'
import { X } from 'react-feather'
import { useFormik } from 'formik'
import { Icon } from '@iconify/react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from 'reactstrap'

// ** Components
import FormGroupElement from '@FormGroupElement'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { updateLocationAction } from '../../redux/setting/scheduling/location/locationAction'
import { resetGetLocation } from '../../redux/setting/scheduling/location/locationSlice'

const LocationEditModal = ({ open, handleModal, providerId, id }) => {

  const dispatch = useDispatch()

  const { getLocation, getAllLocations, updateLoading } = useSelector(
    (state) => state.locations
  )
  const limit = getAllLocations.limit
  const offset = getAllLocations.offset

  useEffect(() => {
    return () => {
      dispatch(resetGetLocation())
    }
  }, [])

  const updateLocationSchema = Yup.object().shape({
    name: Yup.string().required("Name is a required field"),
    address: Yup.string().required("Address is a required field"),
    city: Yup.string().required("City is a required field"),
    state: Yup.object().nullable(),
    zipcode: Yup.string().required("Zipcode is a required field"),
    icon: Yup.object().nullable(),
    place_of_service: Yup.object().nullable(),
    is_default: Yup.boolean()
  })

  const formik = useFormik({
    initialValues: {
      name: getLocation?.name || '',
      address: getLocation?.address || '',
      city: getLocation?.city || '',
      state: getLocation?.state || null,
      zipcode: getLocation?.zipcode || '',
      icon: getLocation?.icon || null,
      place_of_service: getLocation?.place_of_service || null
    },
    validationSchema: updateLocationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          address: values.address,
          city: values.city,
          state: values.state.value,
          zipcode: values.zipcode,
          icon: values.icon.value,
          place_of_service: values.place_of_service.value
        }
        const modifiedValues = getModifiedValues(data, formik.initialValues)

        dispatch(
          updateLocationAction({
            offset,
            limit,
            providerId,
            id,
            data: modifiedValues
          })
        )
        resetForm()
      }
    }
  })


  // ** Modal Close Handle
  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        handleModal()
        dispatch(resetGetLocation())
      }}
    />
  )

  const defaultPlaceOfService = services.filter(
    (item) => item.value === formik.values.place_of_service
  )[0]
  const defaultState = State.filter(
    (item) => item.value === formik.values.state
  )[0]
  const defaultIcon = iconData.filter(
    (item) => item.value === formik.values.icon
  )[0]

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleModal()
        dispatch(resetGetLocation())
      }}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        close={CloseBtn}
        toggle={() => {
          handleModal()
          dispatch(resetGetLocation())
        }}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">Edit Location</h5>
      </ModalHeader>

      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form onSubmit={formik.handleSubmit}>
            <div className="px-2">
              <FormGroupElement
                inputType="text"
                label="Name"
                labelClassName="pl-10px"
                inputName="name"
                placeholder="Enter Name"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('name')}
                formikTouched={formik.touched.name}
                formikError={formik.errors.name}
              />
              <FormGroupElement
                inputType="text"
                label="Address"
                labelClassName="pl-10px"
                inputName="address"
                placeholder="Enter Address"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('address')}
                formikTouched={formik.touched.address}
                formikError={formik.errors.address}
              />
              <FormGroupElement
                inputType="text"
                label="City"
                labelClassName="pl-10px"
                inputName="address"
                placeholder="Enter City"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('city')}
                formikTouched={formik.touched.city}
                formikError={formik.errors.city}
              />
              <SelectField
                label="State"
                header={false}
                search={false}
                menuHeight="10rem"
                value={defaultState}
                data={State}
                placeholder="State"
                className="plr-0"
                onChange={(e) => formik.setFieldValue('state', e)}
              />
              <FormGroupElement
                inputType="text"
                label="Zip Code"
                inputName="zipcode"
                placeholder="--"
                labelClassName="pl-10px"
                className=" react-select form-fields radius-25 skin-change"
                {...formik.getFieldProps('zipcode')}
                formikTouched={formik.touched.zipcode}
                formikError={formik.errors.zipcode}
              />
              <SelectField
                label="Icon"
                header={false}
                search={false}
                placeholder="Icon"
                value={defaultIcon}
                data={iconData}
                // className="plr-0"
                onChange={(e) => formik.setFieldValue('icon', e)}
              />

              <SelectField
                label="Place"
                header={false}
                search={false}
                placeholder="Place of Services"
                value={defaultPlaceOfService}
                data={services}
                className="plr-0"
                onChange={(e) => formik.setFieldValue('place_of_service', e)}
              />
            </div>
            <hr className="m-t-2" />

            <div className="px-2 pb-2 modal-credit-buttons d-flex">
              <Button type="button" className="button-delete pd">
                <span
                  onClick={() => {
                    handleModal(false)
                    dispatch(resetGetLocation())
                  }}
                >
                  Cancel
                </span>
              </Button>

              <Button
                disabled={!formik.dirty}
                className="button-success pd"
                type="submit"
              >
                {updateLoading && <Spinner size="sm" />}
                <span className="px-1"> Update</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default memo(LocationEditModal)
