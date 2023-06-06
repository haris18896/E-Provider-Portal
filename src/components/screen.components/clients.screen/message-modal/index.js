/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
// hooks
import { isObjEmpty } from '@utils'
import { useSkin } from '@hooks/useSkin'
// third party components
// import * as Yup from 'yup'
// import { useFormik, FormikProvider } from 'formik'
import { Icon } from '@iconify/react'
import { Modal, ModalBody, Button, Input, Label } from 'reactstrap'

// components
import Chat from '@src/components/message'
import TextEditor from '@src/components/editor'
import moment from 'moment'
import { Paperclip } from 'react-feather'

function MessageModal({ open, setOpen, getClient }) {
  const skin = useSkin()
  const today = new Date()
  const currentTime = `${today.getHours()}:${today.getMinutes()}`

  const currentDate = new Date()

  // const messageSchema = Yup.object().shape({})

  // const formik = useFormik({
  //   initialValues: {},
  //   validationSchema: messageSchema,
  //   enableReinitialize: true,
  //   onSubmit: (values) => {
  //     if (isObjEmpty(formik.errors)) {
  //       const data = { ...values }
  //       // dispatch(sendMessage)
  //     }
  //   }
  // })

  return (
    <Modal
      isOpen={open}
      toggle={() => setOpen(!open)}
      className="modal-dialog-centered message"
    >
      <ModalBody className="message_modal">
        <div className="message_modal--header">
          <Icon
            icon="fa-solid:chevron-left"
            width="25"
            height="25"
            color="#fefefe"
            onClick={() => setOpen(false)}
            className="chevron-left"
          />
          <div>
            <span className="heading-3 t-white">Message to</span>{' '}
            <span className="heading-2 t-white f-bold">
              {' '}
              {getClient?.first_name} {getClient?.last_name}
            </span>
          </div>
        </div>

        {/* <FormikProvider value={formik}> */}
        <div className="message_modal--messages">
          <div className="message_modal--messages--chats">
            {/* Chat box here */}
            <div className="message_modal--messages--chats__date">
              <p>{moment(currentDate).format('MM/DD/YYYY')}</p>
            </div>
            <div className="message_modal--messages--chats__content">
              <Chat
                messages={[
                  {
                    msg: 'Lorem ipsum, dolor sit amet consectetur adipisicingelit. Nihil similique perferendis magnam repellendus optio voluptas sequi cum? Distinctio ea provident sunt est dolore. Repellendus ab saepe odit impedit culpa laboriosam.',
                    time: currentTime
                  },
                  {
                    msg: 'Lorem ipsum, dolor sit amet consectetur adipisicingelit.',
                    time: currentTime
                  },
                  {
                    msg: 'Lorem ipsum.',
                    time: currentTime
                  }
                ]}
              />

              <Chat
                isSender
                messages={[
                  {
                    msg: 'Lorem ipsum, dolor sit amet consectetur adipisicingelit. Nihil similique perferendis magnam repellendus optio voluptas sequi cum? Distinctio ea provident sunt est dolore. Repellendus ab saepe odit impedit culpa laboriosam.',
                    time: currentTime
                  },
                  {
                    msg: 'Lorem ipsum.',
                    time: currentTime
                  },
                  {
                    msg: 'Lorem ipsum, dolor sit amet consectetur adipisicingelit.',
                    time: currentTime
                  }
                ]}
              />
            </div>
          </div>

          <hr />
          <div className="message_modal--messages--alert">
            <Icon
              icon="akar-icons:triangle-alert-fill"
              width="30"
              height="30"
            />
            <div>
              <span className="p-heading-2 t-ethera">
                This messaging platform is not intended for immediate support,
                crisis intervention, or as a replacement or therapeutic sevices.
                if you are experiencing an emergency or crisis and need
                immediate help, call 911 or go to the nearest emergency room
              </span>
            </div>
          </div>
          <hr />

          <div className="message_modal--messages__textEditor">
            <TextEditor
              toolbar={{
                options: ['inline', 'list', 'history'],
                inline: {
                  inDropdown: false,
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                  options: ['bold', 'italic'],
                  bold: { className: 'toolbarClassName--text' },
                  italic: { className: 'toolbarClassName--text' }
                },
                list: {
                  inDropdown: false,
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                  options: ['unordered', 'ordered'],
                  unordered: { className: 'toolbarClassName--text' },
                  ordered: { className: 'toolbarClassName--text' }
                }
              }}
            />
          </div>

          <div className="message_modal--messages__submission">
            <div>
              <Label htmlFor="link" className="pointer">
                <Paperclip size={18} />
              </Label>
              <Input
                type="file"
                id="link"
                className="d-none"
                // onChange={imageUploader}
              />
            </div>
            <Button
              className="button-success pd"
              disabled
              // onClick={() => formik.handleSubmit()}
            >
              Send
            </Button>
          </div>
        </div>
        {/* </FormikProvider> */}
      </ModalBody>
    </Modal>
  )
}

export default MessageModal
