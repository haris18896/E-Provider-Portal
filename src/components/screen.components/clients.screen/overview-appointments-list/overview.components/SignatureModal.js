/* eslint-disable no-unused-vars */
import React from 'react'
// hooks

// third party
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { PenTool, X } from 'react-feather'
import { Modal, ModalBody, Button, Row, Col, Form } from 'reactstrap'

// components
import FormGroupElement from '@FormGroupElement'
import SignatureUpload from '@FileUploader/SignatureUpload'

function SignatureModal({ setOpen, open }) {
  const CloseBtn = (
    <X className="pointer" size={15} onClick={() => setOpen(false)} />
  )

  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

  const signatureSchema = Yup.object().shape({
    name: Yup.string().required('Provider Name is a required Field'),
    credentials: Yup.string(),
    image: Yup.mixed()
      .test('fileSize', 'File size is too large!', (value) => {
        if (value) {
          return value.size < 2 * 1024 * 1024
        }
        return true
      })
      .test('fileFormat', 'File format is not supported!', (value) => {
        if (value) {
          return SUPPORTED_FORMATS.includes(value.type)
        }
        return true
      })
  })

  const formik = useFormik({
    initialValues: {
      name: 'Isaac Kim',
      credentials: '',
      image: ''
    },
    enableReinitialize: true,
    validationSchema: signatureSchema,
    onSubmit: async (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          credentials: values.credentials,
          image: values.image
        }

      }
    }
  })

  return (
    <Modal
      isOpen={open}
      toggle={() => setOpen(!open)}
      className="modal-dialog-centered modalSignature"
    >
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <div className="signature_modal">
            <div className="signature_modal--heading">
              <span>Sign and Lock Progress Note</span>
              {CloseBtn}
            </div>

            <div className="signature_modal--body">
              <div className="signature_modal--body__fields">
                <FormGroupElement
                  autoFocus
                  inputType="text"
                  inputName="name"
                  label="Provider Name"
                  placeholder="Enter Provider's Name"
                  className='react-select form-fields radius-25 skin-change'
                  {...formik.getFieldProps('name')}
                  formikTouched={formik.touched.name}
                  formikError={formik.errors.name}
                />

                <FormGroupElement
                  inputType="text"
                  inputName="credentials"
                  label="Credentials"
                  placeholder="No License Added"
                  className='react-select form-fields radius-25 skin-change'
                  {...formik.getFieldProps('credentials')}
                  formikTouched={formik.touched.credentials}
                  formikError={formik.errors.credentials}
                />

                <div className="signature_modal--body__required">
                  <span>
                    Once You click "Sign & Lock" you will not be able to edit
                    this <a href="#">Learn more</a>
                  </span>
                </div>
              </div>

              <div className="signature_modal--body__signature">
                <SignatureUpload
                  onChange={(file) => formik.setFieldValue('image', file)}
                  file={formik.values.image}
                  touch={formik.touched.image}
                  error={formik.errors.image}
                />
              </div>
            </div>

            <div className="signature_modal--footer">
              <Button onClick={() => {
                formik.handleReset()
                setOpen(!open)
              }} className="button-cancel">
                Cancel
              </Button>
              <Button
                className="button-signature"
                onClick={() => {
                  formik.handleSubmit()
                  setOpen(!open)
                }}
              >
                <PenTool size={20} />
                <span>Sign & Lock</span>
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default SignatureModal
