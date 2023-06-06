/* eslint-disable quote-props */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { memo, useRef, useState } from 'react'

// ** Third Party Packages
import * as Yup from 'yup'
import { X } from 'react-feather'
import { useFormik } from 'formik'
import useMediaQuery from '@hooks/useMediaQuery'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Modal, ModalBody, ModalHeader, Button, Form } from 'reactstrap'
// ** Components
import { isObjEmpty } from '@utils'
import FormGroupElement from '@FormGroupElement'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

const InvoiceModal = ({
  open,
  handleOpen,
  data,
  submit,
  messageTemplate,
  superbillMessageTemplate,
  superbill
}) => {
  const [content, setContent] = useState(null)
  const [messages, setMessages] = useState(data?.message || '')

  function replaceDate(str) {
    const currentDate = new Date().toLocaleDateString() // get the current date in a suitable format
    return str?.replace(`${currentDate}`, '{{date}}')
  }
  const newSubject = replaceDate(
    superbill ? data?.superbill_subject : data?.subject
  )

  function handleChange(event) {
    setContent(event.target.innerHTML)
  }

  function handleBlur(event) {
    setContent(event.target.innerHTML)
  }

  const updateInvoiceSchema = Yup.object().shape({
    subject: Yup.string(),
    message: Yup.string()
  })
  const formik = useFormik({
    initialValues: {
      subject: newSubject || '',
      message: content ||  superbill ? data?.superbill_message : data?.message
    },
    validationSchema: updateInvoiceSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        submit({ values, content, superbill })
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
            Edit Message Content
          </h5>
        </ModalHeader>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody>
            <Form onSubmit={formik.handleSubmit}>
              <div className="skin-change p-1">
                <h3>Default {superbill ? 'Superbill' : 'Invoice'} Email</h3>
                <div className="head">
                  <div className="head-row mb-0_5 d-flex align-items-center justify-content-between py-1">
                    <strong>From</strong>
                    <p>{superbill ? data?.superbill_email : data?.email}</p>
                  </div>
                  <div className="head-row align-items-baseline">
                    <span>Subject</span>

                    <FormGroupElement
                      type="text"
                      inputName="subject"
                      inputClassName="radius-25  skin-change "
                      value={formik.values?.subject}
                      placeholder="Subject"
                      {...formik.getFieldProps('subject')}
                      formikTouched={formik.touched.subject}
                      formikError={formik.errors.subject}
                    />
                  </div>
                </div>
                <div className="head">
                  <div className="head-row">
                    <span>Message</span>
                    {superbill ? (
                      <div
                        className="message-box-styling"
                        contentEditable={true}
                        dangerouslySetInnerHTML={{
                          __html: superbillMessageTemplate
                        }}
                        onBlur={handleBlur}
                        onInput={handleChange}
                      />
                    ) : (
                      <div
                        className="message-box-styling"
                        contentEditable={true}
                        dangerouslySetInnerHTML={{ __html: messageTemplate }}
                        onBlur={handleBlur}
                        onInput={handleChange}
                      />
                    )}
                  </div>
                </div>

                <div className="px-2  modal-credit-buttons d-flex py-1">
                  <Button
                    type="button"
                    className="button-cancel pd"
                    onClick={() => {
                      formik.resetForm()
                      handleOpen()
                    }}
                  >
                    <span>Cancel</span>
                  </Button>

                  <Button className="button-success pd" type="submit">
                    <span className="px-1"> Update </span>
                  </Button>
                </div>
              </div>
            </Form>
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default memo(InvoiceModal)
