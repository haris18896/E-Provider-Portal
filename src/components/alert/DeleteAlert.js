import React from 'react'

import { Badge, Spinner, Modal, ModalHeader, ModalBody } from 'reactstrap'

import { Icon } from '@iconify/react'
import { X } from 'react-feather'

function DeleteAlert({
  open,
  title,
  loading,
  message,
  actionText,
  handleOpen,
  onModalOpen,
  onModalClose
}) {
  const CloseBtn = (
    <X
      className="pointer fw-600"
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
      toggle={handleOpen}
      onOpened={onModalOpen}
      onClosed={onModalClose}
      contentClassName="p-0 "
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        toggle={handleOpen}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">{title}</h5>
      </ModalHeader>
      <ModalBody className="px-3 py-2">
        <div className="px-2 py-1">
          <h4 style={{ fontSize: '16px' }}>{message}</h4>
          <div className="d-flex justify-content-end align-items-center mt-1">
            <Badge
              className="pointer button-cancel mx-1"
              onClick={() => {
                onModalClose()
              }}
            >
              <span className="px-1">Cancel</span>
            </Badge>

            <Badge
              color="light-danger "
              className="pointer badge-pill border-none"
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="delete-spinner-size" />
              ) : (
                <Icon icon="bi:trash-fill" />
              )}

              <span className="px-1">{actionText}</span>
            </Badge>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default DeleteAlert
