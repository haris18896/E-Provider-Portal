/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** Third Party Packages
import { X } from 'react-feather'
import { Modal, Button, ModalBody, ModalHeader } from 'reactstrap'
import { Icon } from '@iconify/react'
import FileUploaderMultiple from '../../../fileUploader/FileUploaderMultiple'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { addClientNoteAttachmentsAction } from '../../../../redux/client/client-detail/clientDetailAction'

function AttachmentModel({
  id,
  open,
  files,
  setFiles,
  clientId,
  handleOpen,
  onModalOpen,
  onModalClose,
  addAttachment
}) {
  const dispatch = useDispatch()
  const { clientNoteAttachmentPending } = useSelector(
    ({ clientDetails }) => clientDetails
  )

  // ** Close BTN
  const CloseBtn = (
    <X
      className="pointer"
      size={15}
      onClick={() => {
        handleOpen()
        onModalClose()
      }}
    />
  )

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleOpen()
      }}
      onOpened={onModalOpen}
      onClosed={onModalClose}
      contentClassName="p-0 "
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="ethera-modal-top-background"
        toggle={() => {
          handleOpen()
        }}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark">Attachment</h5>
      </ModalHeader>

      <ModalBody
        className="flex-grow-1 pb-sm-0 pb-3"
        style={{ height: '-webkit-fill-available' }}
      >
        <FileUploaderMultiple
          files={files}
          setFiles={setFiles}
          loading={clientNoteAttachmentPending}
          submit={() => {
            const formData = new FormData()
            files.map((item) => formData.append('files', item))

            dispatch(
              addClientNoteAttachmentsAction({
                id: addAttachment?.noteId,
                clientId: id,
                data: formData,
                callback: (res) => {
                  onModalClose()
                }
              })
            )
          }}
        />
      </ModalBody>
    </Modal>
  )
}

export default AttachmentModel
