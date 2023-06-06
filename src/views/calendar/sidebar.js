/* eslint-disable no-unused-vars */
import React from 'react'
import { calendarStatusObj } from '../../components/screen.components/constants'

// ** Third Party Packages
import { X } from 'react-feather'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import EditAppointment from '../../components/screen.components/calendar.screen/AppointmentForm/editAppointment'

function Sidebar({
  open,
  date,
  timePicker,
  handleOpen,
  onModalOpen,
  onModalClose,
  appointmentSelected
}) {
  // ** Close BTN
  const CloseBtn = <X className="pointer" size={15} onClick={handleOpen} />

  return (
    <Modal
      isOpen={open}
      className="sidebar-lg"
      toggle={handleOpen}
      onOpened={onModalOpen}
      onClosed={onModalClose}
      contentClassName="p-0 "
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        toggle={handleOpen}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark">
          {appointmentSelected?.extendedProps?.status
            ? calendarStatusObj[
                parseInt(appointmentSelected?.extendedProps?.status)
              ]?.title
            : 'Create Appointment'}
        </h5>
      </ModalHeader>

      <ModalBody
        className="flex-grow-1 pb-sm-0 pb-3"
        style={{ height: '-webkit-fill-available' }}
      >
        <EditAppointment
          date={date}
          sidebar={open}
          timePicker={timePicker}
          handleOpen={handleOpen}
          cancelled={appointmentSelected?.extendedProps?.status === 2}
          fieldDisabled={appointmentSelected?.extendedProps?.status === 3}
          appointmentSelected={appointmentSelected}
        />
      </ModalBody>
    </Modal>
  )
}

export default Sidebar
