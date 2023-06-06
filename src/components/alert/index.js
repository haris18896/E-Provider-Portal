import React from 'react'

import {
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Button
} from 'reactstrap'

import { Icon } from '@iconify/react'
import { X } from 'react-feather'

function AlertModal({
  loading,
  open,
  handleOpen,
  handleClose,
  title,
  message,
  handleAction
}) {
  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleClose} />
  )

  return (
    <Modal
      isOpen={open}
      toggle={handleClose}
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
          <div className="d-flex justify-content-end align-items-center mt-2">
            <Button
              size="sm"
              className="pointer button-cancel "
              onClick={() => {
                handleClose()
              }}
            >
              <span className="px-1">Cancel</span>
            </Button>

            <Button
              size="sm"
              // color="light-danger "
              className="pointer button-danger"
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="delete-spinner-size" />
              ) : (
                <Icon icon="bi:trash-fill" />
              )}

              <span className="px-1">
                {title === 'Cancel Booking' ? 'Confirm' : 'Delete'}
              </span>
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default AlertModal
