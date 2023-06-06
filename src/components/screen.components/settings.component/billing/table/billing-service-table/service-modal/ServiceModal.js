/* eslint-disable no-unused-vars */
import React, { memo, useRef, useState } from 'react'
import {
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Spinner,
  Input
} from 'reactstrap'
import { isObjEmpty, getModifiedValues } from '@utils'
import SelectField from '@select'
import useMediaQuery from '@hooks/useMediaQuery'

// ** Third Party Packages
import * as Yup from 'yup'
import { X } from 'react-feather'
import { useFormik } from 'formik'
import { Icon } from '@iconify/react'
import PerfectScrollbar from 'react-perfect-scrollbar'
// ** Components
import FormGroupElement from '@FormGroupElement'
import {
  registerServiceAction,
  updateServiceAction
} from '../../../../../../../redux/setting/billing/service/serviceAction'
import { useDispatch, useSelector } from 'react-redux'
import CustomSpinner from '../../../../../../spinner/Spinner'
import { servicesList } from './service.data'

const ServiceModal = ({ open, handleOpen, id, edit, editPrice }) => {
  const dispatch = useDispatch()
  const [service, setService] = useState('')
  const { getService, getServiceLoading, updateLoading, registerLoading } =
    useSelector((state) => state.service)

  const updateLocationSchema = Yup.object().shape({
    code: Yup.string().required('Code is a required field'),
    service: Yup.string().required('Service is a required field'),
    time: Yup.string().required('Time is a required field'),
    fee: Yup.string().required('Fee is a required field')
  })

  const formik = useFormik({
    initialValues: {
      code: edit ? getService?.code : '',
      service: edit ? getService?.service : '',
      time: edit ? getService?.time : '',
      fee: edit ? getService?.fee : ''
    },
    validationSchema: updateLocationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          code: values.code,
          service: values.service,
          time: values.time,
          fee: values.fee
        }
        const modifiedValues = getModifiedValues(data, formik.initialValues)

        if (edit) {
          dispatch(
            updateServiceAction({
              data: modifiedValues,
              serviceId: getService?.id,
              providerId: id,
              callback: () => {
                resetForm()
                setService('')
                handleOpen()
              }
            })
          )
        } else {
          dispatch(
            registerServiceAction({
              data,
              id,
              callback: () => {
                resetForm()
                setService('')
                handleOpen()
              }
            })
          )
        }
      }
    }
  })
  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        formik.resetForm()
        setService('')
        handleOpen()
      }}
    />
  )
  const defaultService = servicesList.filter(
    (item) => item.code === formik.values.code
  )[0]
  const tablet = useMediaQuery('(min-width: 700px')
  return (
    <>
      <Modal
        isOpen={open}
        toggle={() => {
          formik.resetForm()
          setService('')
          handleOpen()
        }}
        className="modal-dialog-centered calendarModal"
      >
        <ModalHeader
          className="mb-1 ethera-modal-top-background"
          toggle={() => {
            formik.resetForm()
            handleOpen()
          }}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title ethera-dark fw-600">
            {edit ? 'Edit' : 'Add'} Service
          </h5>
        </ModalHeader>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody>
            {getServiceLoading ? (
              <CustomSpinner />
            ) : (
              <Form onSubmit={formik.handleSubmit}>
                <div className="px-2">
                  <SelectField
                    label="Default Services"
                    search={false}
                    placeholder="Default Services"
                    disabled={editPrice === true}
                    wd={tablet && '100%'}
                    value={defaultService || ''}
                    menuHeight="15rem"
                    data={servicesList}
                    className="px-0 plr-0 position-relative"
                    onChange={(e) => {
                      setService(e)
                      formik.setFieldValue('code', e.code)
                      formik.setFieldValue('service', e.service)
                    }}
                  />

                  <FormGroupElement
                    inputType="text"
                    label="Code"
                    required
                    disabled={editPrice === true}
                    labelClassName="pl-10px"
                    inputName="code"
                    placeholder="Enter Code"
                    // onChange={(e) => {
                    //   formik.setFieldValue('code', e.target.value)
                    //   formik.setFieldValue('service', e.target.value)
                    // }}
                    formGroupClassName="mb-1"
                    inputClassName="form-fields radius-25 skin-change"
                    {...formik.getFieldProps('code')}
                    formikTouched={formik.touched.code}
                    formikError={formik.errors.code}
                  />
                  <FormGroupElement
                    inputType="text"
                    label="Service"
                    required
                    disabled={editPrice === true}
                    labelClassName="pl-10px"
                    inputName="service"
                    placeholder="Enter Service"
                    formGroupClassName="mb-1"
                    inputClassName="form-fields radius-25 skin-change"
                    {...formik.getFieldProps('service')}
                    formikTouched={formik.touched.service}
                    formikError={formik.errors.service}
                  />
                  <FormGroupElement
                    inputType="number"
                    label="Time: minutes"
                    required
                    disabled={editPrice === true}
                    labelClassName="pl-10px"
                    inputName="time"
                    placeholder="Enter Time"
                    formGroupClassName="mb-1"
                    inputClassName="form-fields radius-25 skin-change"
                    {...formik.getFieldProps('time')}
                    formikTouched={formik.touched.time}
                    formikError={formik.errors.time}
                  />

                  <FormGroupElement
                    inputType="number"
                    label="Fee"
                    required
                    inputName="fee"
                    placeholder="Enter Fee"
                    labelClassName="pl-10px"
                    inputClassName=" react-select form-fields radius-25 skin-change"
                    {...formik.getFieldProps('fee')}
                    formikTouched={formik.touched.fee}
                    formikError={formik.errors.fee}
                  />
                </div>
                <hr className="m-t-2" />

                <div className="px-2 pb-2 modal-credit-buttons d-flex">
                  <Button
                    type="button"
                    className="button-cancel pd"
                    onClick={() => {
                      formik.resetForm()
                      setService('')
                      handleOpen()
                      //   dispatch(resetGetLocation())
                    }}
                  >
                    <span>Cancel</span>
                  </Button>

                  <Button
                    disabled={!formik.dirty}
                    className="button-success pd"
                    type="submit"
                  >
                    {edit
                      ? updateLoading && <Spinner size="sm" />
                      : registerLoading && <Spinner size="sm" />}
                    <span className="px-1"> {edit ? 'Update' : 'Save'}</span>
                  </Button>
                </div>
              </Form>
            )}
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default memo(ServiceModal)
