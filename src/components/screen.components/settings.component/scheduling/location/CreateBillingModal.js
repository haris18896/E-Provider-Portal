/* eslint-disable no-unused-vars */
// third party components
import { Modal, ModalBody, Button, Form, Spinner } from 'reactstrap'
import { X } from 'react-feather'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty, getModifiedValues } from '@utils'
import PerfectScrollbar from 'react-perfect-scrollbar'
import CustomSpinner from '../../../../spinner/Spinner'
import FormGroupElement from '@FormGroupElement'
import {
  registerBillingAddressAction,
  updateBillingAddressAction
} from '../../../../../redux/setting/scheduling/billing-address/billingAddressAction'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'

// components

const CreateBillingModal = ({ open, setOpen, id, row, edit }) => {
  const dispatch = useDispatch()
  const { loading, getAllBillingAddress, updateLoading } = useSelector(
    (state) => state.billingAddress
  )
  const limit = getAllBillingAddress.limit
  const offset = getAllBillingAddress.offset
  const updateBillingAddressSchema = Yup.object().shape({
    name: Yup.string().required('Address is a required field'),
    address: Yup.string().required('Address is a required field')
  })

  const formik = useFormik({
    initialValues: {
      name: row?.name || '',
      address: row?.address || ''
    },
    validationSchema: updateBillingAddressSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          address: values.address,
          name: values.name
        }
        if (edit) {
          dispatch(
            updateBillingAddressAction({
              limit,
              offset,
              data,
              providerId: id,
              id: row?.id,
              callback: () => {
                resetForm()
                setOpen(false)
              }
            })
          )
        } else {
          dispatch(
            registerBillingAddressAction({
              id,
              data,
              callback: () => {
                setOpen(false)
                resetForm()
              }
            })
          )
        }
      }
    }
  })

  return (
    <>
      <Modal
        isOpen={open}
        toggle={() => {
          setOpen(!open)
          formik.resetForm()
        }}
        className="modal-dialog-centered modalBilling"
      >
        <div className="modal--header">
          <span>{edit ? 'Update' : 'Register'} Billing Address</span>
          <X
            className="pointer"
            size={15}
            onClick={() => {
              setOpen(false)
              formik.resetForm()
            }}
          />
        </div>

        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody>
            <Form onSubmit={formik.handleSubmit}>
              <div className="px-2">
                <FormGroupElement
                  inputType="text"
                  label="Name"
                  required
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
                  required
                  labelClassName="pl-10px"
                  inputName="address"
                  placeholder="Enter Address"
                  formGroupClassName="mb-1"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('address')}
                  formikTouched={formik.touched.address}
                  formikError={formik.errors.address}
                />
              </div>
              <hr className="m-t-2" />

              <div className="px-2 pb-2 modal-credit-buttons d-flex">
                <Button
                  type="button"
                  className="button-cancel pd"
                  onClick={() => {
                    setOpen(false)
                    formik.resetForm()
                  }}
                >
                  <span>Cancel</span>
                </Button>

                <Button className="button-success pd" type="submit">
                  {loading || updateLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Icon icon="akar-icons:check" width="14" height="14" />
                  )}
                  <span className="px-1"> Save</span>
                </Button>
              </div>
            </Form>
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default CreateBillingModal
