/* eslint-disable no-unused-vars */
import React from 'react'

// ** Components
import CustomSpinner from '@spinner'
import BookingForm from './BookingForm'

// ** Third Party Packages
import { X } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Store && Actions
import { useSelector } from 'react-redux'

import '@styles/react/libs/react-select/_react-select.scss'

const UpdateBookingModal = ({
  open,
  limit,
  offset,
  endDate,
  startDate,
  handleOpen,
  onModalOpen,
  onModalClose,
  locationsList
}) => {
  const { getBooking } = useSelector((state) => state.booking)
  const bookingData = getBooking?.booking

  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleOpen} />
  )

  const { bookingPending } = useSelector((state) => state.booking)

  return (
    <>
      <Modal
        isOpen={open}
        toggle={handleOpen}
        onOpened={onModalOpen}
        onClosed={onModalClose}
        className="modal-dialog-centered calendarModal"
      >
        <ModalHeader
          className="mb-1 ethera-modal-top-background"
          toggle={handleOpen}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title ethera-dark fw-600">
            {bookingData?.status === 1
              ? 'Edit'
              : bookingData?.status === 2
              ? 'Cancelled'
              : bookingData?.status === 3 && 'Completed'}{' '}
            Booking
          </h5>
        </ModalHeader>
        <PerfectScrollbar options={{ wheelPropagation: true }}>
          <ModalBody>
            {bookingPending ? (
              <div className="padding-top-bottom">
                <CustomSpinner />
              </div>
            ) : (
              <BookingForm
                limit={limit}
                offset={offset}
                endDate={endDate}
                startDate={startDate}
                handleOpen={handleOpen}
                locationsList={locationsList}
              />
            )}
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default UpdateBookingModal
