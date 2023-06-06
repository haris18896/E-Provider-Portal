/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { memo, useState } from 'react'

// ** Third Party Packages
import * as Yup from 'yup'
import moment from 'moment'
import { X } from 'react-feather'
import { useFormik } from 'formik'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import useMediaQuery from '@hooks/useMediaQuery'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Form, Modal, ModalBody, ModalHeader, Button, Label } from 'reactstrap'
// ** Components
import SelectField from '@select'
import { isObjEmpty } from '@utils'
import FormGroupElement from '@FormGroupElement'
import { dateUS, dateUnix } from '../../../../../../utility/Utils'

const InvoiceServiceModal = ({ open, rows, handleOpen, editPrice, submit }) => {
  const [service, setService] = useState('')
  const { getServiceLoading } = useSelector((state) => state.service)

  const newListOfServices = rows?.map((item, i) => {
    return {
      value: item?.id,
      label: `${item?.service} || Fee ${item?.fee}`,
      service: item?.service,
      fee: item?.fee
    }
  })

  const updateInvoiceSchema = Yup.object().shape({
    services: Yup.string().required('Service is a required field'),
    date: Yup.date().required('Date is a required field'),
    fees: Yup.string().required('Fee is a required field')
  })

  const formik = useFormik({
    initialValues: {
      services: '',
      fees: '',
      date: ''
    },
    validationSchema: updateInvoiceSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        submit({ values })

        handleOpen()
        resetForm()
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
          <h5 className="modal-title ethera-dark fw-600">Add to Invoice</h5>
        </ModalHeader>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody>
            {getServiceLoading ? null : (
              <Form onSubmit={formik.handleSubmit}>
                <div className="px-2">
                  <SelectField
                    label="Default Services"
                    search={false}
                    placeholder="Default Services"
                    disabled={getServiceLoading === true}
                    wd={tablet && '100%'}
                    menuHeight="15rem"
                    data={newListOfServices}
                    className="px-0 plr-0 position-relative"
                    onChange={(e) => {
                      setService(e)
                      formik.setFieldValue('services', e.service)
                      formik.setFieldValue('fees', e.fee)
                      formik.setFieldValue('id', e.value)
                    }}
                  />
                  <Label className="pl-10px">Date</Label>
                  <Flatpickr
                    required
                    data-enable-time
                    id="date"
                    name="date"
                    type="date"
                    className={classNames({
                      'radius-25 bg-white form-control skin-change mb-1': true,
                      invalid: !!formik.errors.date
                    })}
                    value={dateUS(formik.values.date)}
                    onChange={(date) => {
                      formik.setFieldValue('date', dateUnix(date[0]))
                    }}
                    options={{
                      enableTime: false,
                      dateFormat: 'n/j/Y',
                      minDate: 'today',
                      mode: 'single',
                      maxDate: moment().add(1, 'months').format('MM/DD/YYYY')
                    }}
                  />

                  <FormGroupElement
                    inputType="text"
                    label="Description"
                    required
                    disabled={editPrice === true}
                    labelClassName="pl-10px "
                    inputName="services"
                    placeholder="Enter Service"
                    formGroupClassName="mb-1"
                    inputClassName="form-fields radius-25 skin-change "
                    {...formik.getFieldProps('services')}
                    formikTouched={formik.touched.services}
                    formikError={formik.errors.services}
                  />

                  <FormGroupElement
                    inputType="number"
                    label="Amount"
                    required
                    inputName="fees"
                    placeholder="Enter Fee"
                    labelClassName="pl-10px"
                    inputClassName=" react-select form-fields radius-25 skin-change"
                    {...formik.getFieldProps('fees')}
                    formikTouched={formik.touched.fees}
                    formikError={formik.errors.fees}
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
                    }}
                  >
                    <span>Cancel</span>
                  </Button>

                  <Button className="button-success pd" type="submit" disabled={!!formik.errors.date}>
                    <span className="px-1"> Add</span>
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

export default memo(InvoiceServiceModal)
