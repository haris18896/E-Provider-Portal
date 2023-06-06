/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'

// ** Hooks
import useMediaQuery from '@hooks/useMediaQuery'
import { isObjEmpty, dateUnix, dateUS } from '@utils'

// third party
import moment from 'moment'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { Button, Label, Row } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { EditorState } from 'draft-js'

// components
import SelectField from '@select'
import CustomSpinner from '@spinner'
import TextEditor from '@src/components/editor'
// import DeleteAlert from '../../../../components/alert/DeleteAlert'
import ClientModal from '@ScreenComponent/clients.screen/overview-appointments-list/AddClientModal'
import AppointmentsListOverView from '@ScreenComponent/clients.screen/overview-appointments-list'
import AttachmentModel from '../../../../components/screen.components/clients.screen/overview-appointments-list/AttachmentModel'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import { addAdminNoteAction } from '@store/client/admin-notes/adminNotesAction'
import { addClientNoteAttachmentsAction } from '@store/client/client-detail/clientDetailAction'
import {
  resetClientNotes,
  resetClientAppointments
} from '@store/client/clientSlice'
import {
  getAllClientsAction,
  getClientNotesAction,
  getClientAppointmentsAction,
  handleClientAppointmentsPagination,
  handleClientAppointmentsLimitChange
} from '@store/client/clientAction'
import { resetAddAdminNote } from '@store/client/admin-notes/adminNotesSlice'
import {
  resetDeleteNote,
  resetAddAttachment,
  resetAddClientToAppointment,
  resetAddClientNoteToAppointment,
  resetDeleteClientFromAppointment,
  resetUpdateClientNoteToAppointment
} from '@store/client/client-detail/clientDetailSlice'
import CustomPagination from '../../../../components/pagination/ReactPagination'
import { Calendar } from 'react-feather'

const statusList = [
  { text: 'All', value: null },
  { text: 'Active', value: 1 },
  { text: 'Cancelled', value: 2 },
  { text: 'Complete', value: 3 },
  { text: 'Late Show', value: 4 },
  { text: 'No Show', value: 5 }
]

function ClientOverView(props) {
  const small = useMediaQuery('(min-width: 500px)')
  const dispatch = useDispatch()

  const { id } = useParams()
  const today = moment(new Date()).format('MMM D, YYYY').split('T')[0]
  const [value, setValue] = useState(EditorState.createEmpty())

  // ** Selectors
  const {
    clientAppointments,
    getAllClientsData,
    clientNotesPending,
    clientAppointmentsPending
  } = useSelector(({ client }) => client)
  const { addAdminNotePending } = useSelector(({ adminNotes }) => adminNotes)

  const limit = clientAppointments?.limit
  const count = clientAppointments?.count
  const offset = clientAppointments?.offset

  const toDay = new Date()
  const _30days = new Date()
  _30days.setDate(toDay.getDate() - 7)

  // ** States
  const [date, setDate] = useState(today)
  const [time, setTime] = useState(moment().format('HH:mm:ss'))
  const [files, setFiles] = useState([])
  const [endDate, setEndDate] = useState(toDay)
  const [startDate, setStartDate] = useState(_30days)
  const [currentPage, setPage] = useState(0)
  const [status, setStatus] = useState(statusList[0])
  const [dateTimeFilter, setDateTimeFilter] = useState('')
  const [addAttachment, setAddAttachment] = useState({
    open: false,
    id: null,
    noteId: null
  })
  const [addClient, setAddClient] = useState({
    modalOpen: false,
    appointmentId: ''
  })
  // const [deleteNote, setDeleteNote] = useState({
  //   open: false,
  //   noteId: null,
  //   clientId: id,
  //   appointmentId: null
  // })

  const commonParams = {
    id: props.id,
    startDate,
    endDate,
    status: status.value
  }

  const data = {
    time,
    type: '1',
    client: id,
    date: dateUnix(date),
    content: [{ note: value.getCurrentContent().getPlainText() }]
  }

  useEffect(() => {
    if (props.id && props.tab === 'overview' && !status.value) {
      dispatch(getClientNotesAction())
      dispatch(getClientAppointmentsAction(commonParams))
    } else if (status) {
      dispatch(getClientAppointmentsAction(commonParams))
    }
  }, [props.id, props.tab, endDate, status])

  const clientsList = getAllClientsData?.clientsList.filter(
    (item) => item.id !== id
  )

  const handleClientModalOpen = ({ open, id }) => {
    setAddClient((prevState) => ({
      ...prevState,
      modalOpen: open,
      appointmentId: id
    }))
  }

  const handleAttachmentModalOpen = ({ open, id, noteId }) => {
    setAddAttachment((prevState) => ({
      ...prevState,
      open,
      id,
      noteId
    }))
  }

  const handleResetClientModal = useCallback(() => {
    dispatch(resetAddClientToAppointment())
    setAddClient((prevState) => ({
      ...prevState,
      modalOpen: false,
      appointmentId: ''
    }))
  }, [dispatch])

  const handleResetAttachmentModal = useCallback(() => {
    setAddAttachment((prevState) => ({
      ...prevState,
      open: false,
      id: null,
      noteId: null
    }))
    setFiles([])
  }, [addAttachment.id])

  const onDateChangeHandler = useCallback((dates) => {
    if (dates.length === 1) {
      setStartDate(dates[0])
      setDateTimeFilter('')
    }
    if (dates.length === 2) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }, [])

  // const handleLimit = (newLimit) => {
  //   dispatch(
  //     handleClientAppointmentsLimitChange({
  //       id,
  //       endDate,
  //       newLimit,
  //       startDate,
  //       oldLimit: limit,
  //       status: status?.value
  //     })
  //   )
  //   setPage(0)
  // }

  // const handlePagination = (page) => {
  //   const newOffset = page.selected * limit
  //   dispatch(
  //     handleClientAppointmentsPagination({
  //       id,
  //       limit,
  //       endDate,
  //       startDate,
  //       status: status?.value,
  //       offset: newOffset === 0 ? 0 : newOffset
  //     })
  //   )
  //   setPage(() => page.selected)
  // }

  const handleSubmitAdminNote = () => {
    if (data.time && data.date && data.content[0].note) {
      dispatch(
        addAdminNoteAction({
          data,
          commonParams,
          callback: () => {
            setDate(today)
            setTime(null)
            setValue(EditorState.createEmpty())
          }
        })
      )
    } else if (!data.content[0].note || data.content[0].note === '') {
      toast.error('Note is required Field')
    } else if (!time) {
      toast.error('Time is a required Field')
    } else if (!date) {
      toast.error('Date is required Field')
    } else toast.error('All fields are mandatory')
  }

  useEffect(() => {
    return () => {
      dispatch(resetDeleteNote())
      dispatch(resetClientNotes())
      dispatch(resetAddAdminNote())
      dispatch(resetAddAttachment())
      dispatch(resetClientAppointments())
      dispatch(resetAddClientToAppointment())
      dispatch(resetAddClientNoteToAppointment())
      dispatch(resetDeleteClientFromAppointment())
      dispatch(resetUpdateClientNoteToAppointment())
    }
  }, [])

  return (
    <>
      <ClientModal
        clientId={props.id}
        addClient={addClient}
        clientsList={clientsList}
        onModalClose={() => handleResetClientModal()}
        open={addClient.modalOpen && !!addClient.appointmentId}
        handleOpen={() =>
          handleClientModalOpen({
            open: !addClient.modalOpen,
            id: addClient?.appointmentId
          })
        }
        onModalOpen={() => {
          if (
            addClient.modalOpen &&
            addClient.appointmentId &&
            !clientsList?.length > 0
          ) {
            dispatch(getAllClientsAction({ offset: 0, limit: 100 }))
          }
        }}
      />

      {/*<DeleteAlert*/}
      {/*    open={deleteNote.open && !!deleteNote.clientId && !!deleteNote.clientId && !!deleteNote.appointmentId}*/}
      {/*  title={'Delete Client'}*/}
      {/*  loading={}*/}
      {/*  message={'Are you sure you want to delete'}*/}
      {/*  actionText={'Delete'}*/}
      {/*  handleOpen={}*/}
      {/*  onModalOpen={}*/}
      {/*  onModalClose={}*/}
      {/*/>*/}

      <AttachmentModel
        id={id}
        files={files}
        setFiles={setFiles}
        addAttachment={addAttachment}
        onModalClose={() => handleResetAttachmentModal()}
        open={
          addAttachment.open && !!addAttachment.id && !!addAttachment.noteId
        }
        onModalOpen={() => {
        }}
        handleOpen={() =>
          handleAttachmentModalOpen({
            open: !addAttachment.modalOpen,
            id: addAttachment?.id
          })
        }
      />

      <div className="list_overview">
        <Row className="bg-yellow list_overview--editor_row skin-change">
          <div>
            <TextEditor
              value={value}
              setValue={setValue}
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

          <div className="list_overview--submission mt-1">
            <Flatpickr
              disabled={clientAppointmentsPending || clientNotesPending}
              data-enable-time
              id="date"
              name="date"
              placeholder={today}
              className="radius-25 bg-white form-control flat-picker-sm mb-1 list_overview--submission--date skin-change"
              options={{
                mode: 'single',
                enableTime: false,
                dateFormat: 'F j, Y',
                minDate: 'today'
              }}
              defaultValue={date}
              onChange={(date) => {
                setDate(moment(date[0]).format('MMM-D-YYYY').split('T')[0])
              }}
            />

            <Flatpickr
              disabled={clientAppointmentsPending || clientNotesPending}
              data-enable-time
              id="time"
              name="time"
              type="time"
              className="radius-25 bg-white form-control flat-picker-sm mb-1 list_overview--submission--time skin-change"
              value={time}
              placeholder={'Time'}
              onChange={(time) => setTime(moment(time[0]).format('HH:mm:ss'))}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'h:i K',
                minuteIncrement: 15
              }}
            />

            <Button
              disabled={
                !time ||
                !date ||
                !value ||
                !data.content.some((item) => Boolean(item)) ||
                clientNotesPending ||
                addAdminNotePending ||
                clientAppointmentsPending
              }
              className="button-green mb-1"
              onClick={() => handleSubmitAdminNote()}
            >
              <span className={'px-1 whiteSpace'}>Admin Note</span>
              <Icon
                icon="eos-icons:loading"
                width={'16'}
                height={'16'}
                color={addAdminNotePending ? '#fefefe' : '#6b9879'}
              />
            </Button>
          </div>
        </Row>

        <div className="list_overview--filters">
          <div
            style={{ padding: '4px 12px' }}
            className="AppointmentSelectors_left-dates bookings-header--left__calendar d-f-center skin-change mr-1 bg-white list_overview--filters__date"
          >
            <Flatpickr
              id="datePicker"
              name="datePicker"
              className="form-control datePicker-non-visible"
              onChange={onDateChangeHandler}
              options={{
                mode: 'range',
                enableTime: false,
                dateFormat: 'F j, Y'
              }}
            />
            <Label htmlFor="datePicker" className="mb-0 pointer">
              <span>
                {moment(startDate).format('MMM DD YYYY')} to{' '}
                {moment(endDate).format('MMM DD YYYY')}
              </span>
            </Label>
          </div>
          <SelectField
            header
            value={status}
            data={statusList}
            isSearchable={false}
            controlMinWidth="200px"
            wd={small ? '180px' : '100%'}
            onChange={(e) => setStatus(e)}
          />
        </div>

        <div className={'mb-2'}>
          {clientAppointmentsPending || clientNotesPending ? (
            <CustomSpinner />
          ) : clientAppointments.data?.length > 0 ? (
            <AppointmentsListOverView
              idParam={id}
              addClient={addClient}
              appointments={clientAppointments.data}
              handleClientModalOpen={handleClientModalOpen}
              handleAttachmentModalOpen={handleAttachmentModalOpen}
            />
          ) : (
            <div
              className="react-dataTable d-flex align-items-center justify-content-center"
              style={{ minHeight: '20vh' }}
            >
              <div className="mb-1 d-flex flex-column align-items-center justify-content-center">
                <Icon
                  className="mb-1"
                  icon="material-symbols:search-rounded"
                  width="50"
                  height="50"
                />
                <h5>No result found </h5>
              </div>
            </div>
          )}
        </div>

        {/* {CustomPagination({
          limit,
          count,
          handleLimit,
          currentPage,
          handlePagination,
          position: true
        })} */}
      </div>
    </>
  )
}

export default ClientOverView
