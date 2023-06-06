/* eslint-disable no-unused-vars */
import React, { useState, useMemo, lazy, useCallback, Fragment } from 'react'

// hooks
import { dateUS, isObjEmpty } from '@utils'
import { useSkin } from '@hooks/useSkin'

// third party
import * as Yup from 'yup'
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { Button, ListGroupItem } from 'reactstrap'
import { FormikProvider, useFormik } from 'formik'
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Lock,
  Paperclip,
  Plus,
  Trash2,
  PenTool,
  X
} from 'react-feather'

// components
import SelectField from '@select'
import { EditorState, ContentState } from 'draft-js'
import TextEditor from '@src/components/editor'
import FormGroupElement from '@FormGroupElement'
import SignatureModal from './overview.components/SignatureModal'
import renderContent, {
  Edit,
  renderFilePreview,
  GetAppointmentStatusText,
  renderEditor
} from './overview.components/helpers'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  addClientNoteToClientAppointmentAction,
  deleteClientFromAppointmentAction,
  deleteNoteAttachmentAction,
  deleteNoteFromAppointmentAction,
  updateClientNoteToClientAppointmentAction
} from '../../../../redux/client/client-detail/clientDetailAction'
import { useParams } from 'react-router-dom'

const Appointment = ({
  today,
  number,
  idParam,
  notesList,
  notesData,
  addClient,
  appointment,
  handleClientModalOpen,
  handleAttachmentModalOpen
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const { id: paramId } = useParams()
  // ** States
  const [note, setNote] = useState(null)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [formikIndexer, setFormikIndexer] = useState({
    noteIndex: null,
    contentIndex: null
  })
  const [deleteAttachment, setDeleteAttachment] = useState(null)
  const [expand, setExpand] = useState({
    open: false,
    edit: false,
    index: null,
    appointmentNoteId: null
  })
  const [stateIndex, setStateIndex] = useState(null)
  // const plainText = appointment?.content?.[0]?.note
  //
  // const contentState = ContentState.createFromText(plainText)
  // const editorState = EditorState.createWithContent(contentState)
  const [editorValue, setEditorValue] = useState(EditorState.createEmpty())

  const {
    deleteClientPending,
    deleteAttachmentPending,
    addClientNoteToAppointmentPending,
    updateClientNoteToAppointmentPending
  } = useSelector(({ clientDetails }) => clientDetails)

  const addNotePending = addClientNoteToAppointmentPending

  const schema = Yup.object().shape({
    id: Yup.string(),
    time: Yup.string(),
    date: Yup.string(),
    notesContent: Yup.array().of(Yup.object()),
    appointment_notes: Yup.array().of(Yup.object()),
    admin_note_files: Yup.array().of(Yup.object())
  })

  const formik = useFormik({
    initialValues: {
      id: appointment?.id,
      date: appointment?.date,
      time: appointment?.time,
      notesContent: appointment?.content,
      admin_note_files: appointment?.appointment_notes_files,
      appointment_notes: appointment?.appointment_notes || []
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          appointment: appointment.id,
          title: values.title,
          content: values.content
        }

      }
    }
  })

  const handleExpand = ({ open, index, appointmentNoteId, edit }) => {
    setExpand((prevState) => ({
      ...prevState,
      open,
      index,
      edit,
      appointmentNoteId
    }))
  }

  const swapElement = ([...array]) => {
    const index = array.findIndex((item) => item.id === paramId)
    const temp = array[index]
    array[index] = array[0]
    array[0] = temp
    return array
  }

  return (
    <>
      <hr />
      <FormikProvider value={formik}>
        {formik.values?.date ? (
          <div className="list_overview--appointments">
            <div className="list_overview--appointments__header">
              <div className="list_overview--appointments__header--date mb-1 ">
                <span>
                  {moment(dateUS(appointment.date)).format('MMM DD, YYYY')}
                </span>
              </div>

              <div className="list_overview--appointments__header--details mb-1">
                <div className="list_overview--appointments__header--details__tag">
                  <div>
                    <p>Admin Note</p>
                  </div>

                  {/*<div className={'ml-1'}>*/}
                  {/*  <Edit*/}
                  {/*    deleteHandler={() => {}}*/}
                  {/*    expandHandler={() => {}}*/}
                  {/*    handleAttachmentModalOpen={() => {}}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>
              </div>

              <div className="list_overview--appointments__header--time mb-1 m-t-5 ml-1">
                <span>
                  {moment(appointment?.time, 'HH:mm:ss').format('h:mm A')}
                </span>
              </div>
            </div>
            {/* Admin Note */}
            {formik.values.notesContent?.length > 0 &&
              formik.values.notesContent.map((notes, index) => (
                <div
                  key={index}
                  className="list_overview--appointments__description--soap"
                >
                  {/* Show Admin Note */}
                  <div style={{ whiteSpace: 'pre-wrap' }}>{notes.note}</div>

                  {/* Edit Admin Note Block */}
                  {/*{expand.open &&*/}
                  {/*  expand.edit &&*/}
                  {/*  expand.appointmentNoteId === formik.values.id &&*/}
                  {/*  renderEditor({*/}
                  {/*    title: 'Admin Note',*/}
                  {/*    editorValue,*/}
                  {/*    setEditorValue,*/}
                  {/*    saveBtnDisabled: false,*/}
                  {/*    cancelBtnDisabled: false,*/}
                  {/*    cancelHandler: () => {*/}
                  {/*      handleExpand({*/}
                  {/*        index,*/}
                  {/*        edit: false,*/}
                  {/*        open: true,*/}
                  {/*        appointmentNoteId: index*/}
                  {/*      })*/}
                  {/*    },*/}
                  {/*    onSubmit: () => {}*/}
                  {/*  })}*/}
                </div>
              ))}
            {/* Admin note attachments list */}
            <div className={'m-t-5 m-b-5'}>
              {expand.open &&
                expand.appointmentNoteId === formik.values.id &&
                formik.values.admin_note_files?.length > 0 &&
                formik.values?.admin_note_files.map(
                  (attachment, attachmentIndex) => (
                    <ListGroupItem
                      key={`${attachment.name}-${attachmentIndex}`}
                      className="d-flex align-items-center justify-content-between m-b-3"
                    >
                      <div
                        className="file-details d-flex align-items-center pointer"
                        onClick={() =>
                          window.open(`${attachment.file}`, '_blank')
                        }
                      >
                        <div className="file-preview me-1">
                          {renderFilePreview(attachment)}
                        </div>
                        <div>
                          <p className="file-name mb-0">
                            {attachment?.title.length > 25
                              ? `${attachment?.title.substring(0, 25)} ...`
                              : attachment?.title}
                          </p>
                        </div>
                      </div>
                      <Button
                        disabled={deleteAttachmentPending}
                        color="danger"
                        outline
                        size="sm"
                        className="btn-icon ml-1 pointer"
                        onClick={() => {
                          setDeleteAttachment(attachmentIndex)
                          const _newAttachmentsList = [
                            ...formik.values?.admin_note_files
                          ]
                          // dispatch(
                          //   deleteNoteAttachmentAction({
                          //     id: formik.values.id,
                          //     attachmentIndex,
                          //     callback: () => {
                          //       _newAttachmentsList.splice(attachmentIndex, 1)
                          //       formik.setFieldValue(
                          //         `admin_note_files`,
                          //         _newAttachmentsList
                          //       )
                          //     }
                          //   })
                          // )
                        }}
                      >
                        {deleteAttachmentPending &&
                        deleteAttachment === attachmentIndex ? (
                          <Icon
                            icon={'eos-icons:loading'}
                            width={'15'}
                            height={'15'}
                            color={'#ea5455'}
                          />
                        ) : (
                          <Icon
                            icon={'iconoir:cancel'}
                            width={'15'}
                            height={'15'}
                            color={'#ea5455'}
                          />
                        )}
                      </Button>
                    </ListGroupItem>
                  )
                )}
            </div>
          </div>
        ) : (
          // Admin Note
          <div className="list_overview--appointments">
            <div className="list_overview--appointments__header">
              <div className="list_overview--appointments__header--date mb-1">
                <span>
                  {moment(dateUS(appointment.start_date)).format(
                    'MMM DD, YYYY'
                  )}
                </span>
              </div>

              <div className="list_overview--appointments__header--details mb-1">
                <div className="list_overview--appointments__header--details__tag">
                  <div>
                    <p>Appointment #{number}</p>
                    <sub>CPT: {appointment?.appointment_services.length > 0 && appointment?.appointment_services.map((cpt, index) => (
                        <React.Fragment key={index}>
                          <b>{cpt}</b>
                          {index < appointment?.appointment_services.length - 1 && ', '}
                        </React.Fragment>
                    ))}</sub>
                  </div>

                  <GetAppointmentStatusText
                    appointmentStatus={appointment.status}
                    bookingStatus={appointment?.booking?.status}
                  />
                </div>
              </div>

              {/*<div className="list_overview--appointments__header--notes">*/}
              <section className={'me-1'}>
                <SelectField
                  header
                  disabled={addClientNoteToAppointmentPending}
                  isSearchable={false}
                  placeholder={'Notes'}
                  controlMinWidth="200px"
                  value={note}
                  data={notesData}
                  isLoading={addNotePending}
                  onChange={(e) => {
                    setNote(e)
                    if (
                      !formik.values.appointment_notes.some(
                        (item) => item.title.trim() === e.text.trim()
                      )
                    ) {
                      const _note = notesList.filter(
                        (note) => note.id === e.value
                      )[0]

                      const data = {
                        appointment: appointment?.id,
                        type: '2',
                        id: e.value,
                        title: _note.title,
                        content: _note.content
                      }

                      dispatch(
                        addClientNoteToClientAppointmentAction({
                          data,
                          callback: (res) => {
                            formik.setFieldValue('appointment_notes', [
                              ...formik.values.appointment_notes,
                              res
                            ])

                            setExpand({
                              open: true,
                              index: formik.values.appointment_notes.length,
                              appointmentNoteId: res?.id
                            })

                            setNote(null)
                          }
                        })
                      )

                      // setSelectedNotes([_note])
                      // setSelectedNotes([...selectedNotes, _note])
                    }
                  }}
                />
              </section>

              <div className="list_overview--appointments__header--time mb-1 m-t-5 ml-1">
                <span>
                  {moment(appointment?.start_time, 'HH:mm:ss').format('h:mm A')}{' '}
                  - {moment(appointment?.end_time, 'HH:mm:ss').format('h:mm A')}
                </span>
              </div>
            </div>

            <div className="list_overview--appointments__description--head__clients">
              {appointment?.clients?.length > 0 &&
                swapElement(appointment?.clients).map((client, index) => (
                  <span key={index} className="skin-change">
                    {`${client?.first_name || '--'} ${
                      client?.last_name || '--'
                    }`}{' '}
                    {deleteClientPending && stateIndex === index ? (
                      <Icon
                        icon={'eos-icons:loading'}
                        className={'ml-1'}
                        width={'20'}
                        height={'20'}
                      />
                    ) : (
                      <>
                        {client?.id !== idParam && (
                          <Icon
                            icon={'iconoir:cancel'}
                            width={'20'}
                            height={'20'}
                            color={'#000'}
                            className={'ml-1'}
                            onClick={() => {
                              setStateIndex(index)
                              dispatch(
                                deleteClientFromAppointmentAction({
                                  appointmentId: appointment?.id,
                                  clientId: idParam,
                                  deleteClientId: client?.id,
                                  callback: () => {}
                                })
                              )
                            }}
                          />
                        )}
                      </>
                    )}
                  </span>
                ))}

              <Button
                disabled={parseInt(appointment.status) === 2}
                className={'pd-s add-more m-b-8'}
                onClick={() =>
                  handleClientModalOpen({
                    open: !addClient.modalOpen,
                    id: appointment.id
                  })
                }
              >
                <Icon icon="akar-icons:plus" />
                <b className="px-1 py-0">Add</b>
              </Button>
            </div>

            {!parseInt(appointment?.status === 2) &&
              formik.values?.appointment_notes.length > 0 &&
              formik.values?.appointment_notes.map((appointmentNote, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom:
                      index !== formik.values?.appointment_notes.length - 1 &&
                      '1px solid #e2dbc8'
                  }}
                  className="list_overview--appointments__description--soap mt-1"
                >
                  <div className="list_overview--appointments__description--head__row">
                    <div className="list_overview--appointments__header--details__tag--editComp">
                      <Edit
                        index={index}
                        deleteIndex={stateIndex}
                        noteId={appointmentNote?.id}
                        appointmentId={appointment?.id}
                        editHandler={() =>
                          handleExpand({
                            index,
                            edit: true,
                            open: true,
                            appointmentNoteId: appointmentNote?.id
                          })
                        }
                        deleteHandler={() => {
                          setStateIndex(index)
                          const newNotes = [...formik.values.appointment_notes]
                          dispatch(
                            deleteNoteFromAppointmentAction({
                              noteId: appointmentNote?.id,
                              callback: () => {
                                newNotes.splice(index, 1)
                                formik.setFieldValue(
                                  'appointment_notes',
                                  newNotes
                                )
                              }
                            })
                          )
                        }}
                        handleAttachmentModalOpen={handleAttachmentModalOpen}
                      />
                    </div>
                  </div>

                  <div className="list_overview--appointments__description--head__row">
                    <div className="list_overview--appointments__description--head__noteHeading whiteSpace">
                      <strong>{`${
                        appointmentNote?.title.length > 16
                          ? `${appointmentNote?.title.substring(0, 16)}...`
                          : appointmentNote?.title
                      }`}</strong>{' '}
                      <Lock size={15} />
                    </div>
                    <div className="list_overview--appointments__description--head__expand">
                      {expand.open &&
                      expand.index === index &&
                      expand.appointmentNoteId === appointmentNote.id ? (
                        <div
                          onClick={() =>
                            handleExpand({
                              index,
                              edit: false,
                              open: false,
                              appointmentNoteId: appointmentNote.id
                            })
                          }
                        >
                          <strong>Hide</strong>
                          <ChevronDown size={20} />
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            handleExpand({
                              index,
                              edit: false,
                              open: true,
                              appointmentNoteId: appointmentNote.id
                            })
                          }
                        >
                          <strong>Expand</strong>
                          <ChevronRight size={20} />
                        </div>
                      )}
                    </div>
                  </div>

                  {expand.open &&
                    expand.index === index &&
                    expand.appointmentNoteId === appointmentNote.id && (
                      <>
                        {appointmentNote.content.some(
                          (item) => item.other_document === true
                        ) ? (
                          <div className={'fullWidth m-l-5 m-r-5'}>
                            {appointmentNote?.content.map((content, i) => (
                              <Fragment key={i}>
                                {!expand.edit && (
                                  <div
                                    style={{
                                      whiteSpace: 'pre-wrap',
                                      marginTop: '1rem'
                                    }}
                                  >
                                    {content.note}
                                  </div>
                                )}

                                {expand.open &&
                                  expand.edit &&
                                  expand.appointmentNoteId ===
                                    appointmentNote?.id &&
                                  renderEditor({
                                    title: 'Other Note',
                                    editorValue,
                                    setEditorValue
                                  })}
                              </Fragment>
                            ))}
                          </div>
                        ) : (
                          <div className="list_overview--appointments__description--soap__note skin-change">
                            {appointmentNote.content.length > 0 &&
                              appointmentNote.content.map((content, i) => (
                                <div
                                  key={i}
                                  className="list_overview--appointments__description--soap__note--fragment"
                                >
                                  <div className="list_overview--appointments__description--soap__note--heading">
                                    <div className="DOT DOT--green me-1" />
                                    <p>
                                      <strong>{content?.question}</strong>
                                    </p>
                                  </div>

                                  {renderContent({
                                    formik,
                                    content,
                                    expand,
                                    index,
                                    contentIndex: i,
                                    noteId: appointmentNote.id
                                  })}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}

                  {expand.edit &&
                    expand.open &&
                    expand.appointmentNoteId === appointmentNote?.id &&
                    expand.index === index && (
                      <div className="signature m-t-10">
                        <div>
                          <span>
                            Created by {user?.first_name} {user.last_name}
                            {/*{moment(today).format('MMM DD, YYYY')}*/}
                          </span>
                        </div>

                        <div className={'d-flex'}>
                          <Button
                            color={'button-white me-1 pd-s'}
                            onClick={() => {
                              handleExpand({
                                index,
                                edit: false,
                                open: true,
                                appointmentNoteId: appointmentNote?.id
                              })
                              formik.resetForm()
                            }}
                            disabled={updateClientNoteToAppointmentPending}
                          >
                            Cancel
                          </Button>

                          <Button
                            className="button-success"
                            disabled={updateClientNoteToAppointmentPending}
                            onClick={() => {
                              const data = {
                                appointment: appointment?.id,
                                title:
                                  formik.values.appointment_notes[index]?.title,
                                content:
                                  formik.values.appointment_notes[index]
                                    ?.title === 'Other Note'
                                    ? [
                                        {
                                          other_document: true,
                                          note: editorValue
                                            .getCurrentContent()
                                            .getPlainText()
                                        }
                                      ]
                                    : formik.values.appointment_notes[index]
                                        ?.content
                              }

                              dispatch(
                                updateClientNoteToClientAppointmentAction({
                                  noteId: appointmentNote?.id,
                                  data,
                                  callback: (res) => {
                                    handleExpand({
                                      index,
                                      edit: false,
                                      open: true,
                                      appointmentNoteId: appointmentNote?.id
                                    })
                                    formik.setFieldValue(
                                      `appointment_notes.[${index}]`,
                                      res
                                    )
                                  }
                                })
                              )
                            }}
                          >
                            {updateClientNoteToAppointmentPending ? (
                              <Icon
                                icon="eos-icons:loading"
                                width="15"
                                height="15"
                                rotate={1}
                              />
                            ) : (
                              <Icon
                                icon={'material-symbols:check-small-rounded'}
                                width="15"
                                height="15"
                                rotate={1}
                              />
                            )}
                            <span className={'px-1'}>Save</span>
                          </Button>
                        </div>
                      </div>
                    )}

                  <div className={'m-t-5 m-b-5'}>
                    {expand.open &&
                      expand.appointmentNoteId === appointmentNote?.id &&
                      expand.index === index &&
                      appointmentNote?.appointment_notes_files?.length > 0 &&
                      appointmentNote?.appointment_notes_files.map(
                        (attachment, attachmentIndex) => (
                          <ListGroupItem
                            key={`${attachment.name}-${attachmentIndex}`}
                            className="d-flex align-items-center justify-content-between m-b-3"
                          >
                            <div
                              className="file-details d-flex align-items-center pointer"
                              onClick={() =>
                                window.open(`${attachment.file}`, '_blank')
                              }
                            >
                              <div className="file-preview me-1">
                                {renderFilePreview(attachment)}
                              </div>
                              <div>
                                <p className="file-name mb-0">
                                  {attachment?.title.length > 25
                                    ? `${attachment?.title.substring(
                                        0,
                                        25
                                      )} ...`
                                    : attachment?.title}
                                </p>
                              </div>
                            </div>
                            <Button
                              disabled={deleteAttachmentPending}
                              color="danger"
                              outline
                              size="sm"
                              className="btn-icon ml-1 pointer"
                              onClick={() => {
                                setDeleteAttachment(attachmentIndex)
                                const _newAttachmentsList = [
                                  ...appointmentNote?.appointment_notes_files
                                ]
                                dispatch(
                                  deleteNoteAttachmentAction({
                                    id: appointmentNote.id,
                                    attachmentIndex: attachment.id,
                                    callback: () => {
                                      const newAttachments =
                                        _newAttachmentsList.filter(
                                          (item) => item.id !== attachment.id
                                        )
                                      formik.setFieldValue(
                                        `appointment_notes.[${index}].appointment_notes_files`,
                                        newAttachments
                                      )
                                    }
                                  })
                                )
                              }}
                            >
                              {deleteAttachmentPending &&
                              deleteAttachment === attachmentIndex ? (
                                <Icon
                                  icon={'eos-icons:loading'}
                                  width={'15'}
                                  height={'15'}
                                  color={'#ea5455'}
                                />
                              ) : (
                                <Icon
                                  icon={'iconoir:cancel'}
                                  width={'15'}
                                  height={'15'}
                                  color={'#ea5455'}
                                />
                              )}
                            </Button>
                          </ListGroupItem>
                        )
                      )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </FormikProvider>
    </>
  )
}

function AppointmentsListOverView({
  idParam,
  addClient,
  appointments,
  handleClientModalOpen,
  handleAttachmentModalOpen
}) {
  const today = new Date()
  const notes = useSelector((state) => state.client.clientNotes)
  const notesList = [
    ...notes,
    {
      type: '2',
      id: 'other_document',
      title: 'Other Note',
      content: [
        {
          other_document: true,
          note: null
        }
      ]
    }
  ]

  const notesData = useMemo(() => {
    return (
      notesList?.map((note) => ({
        text:
          note?.title.length > 16
            ? `${note?.title.substring(0, 16)}...`
            : `${note?.title}`,
        value: note?.id
      })) ?? []
    )
  }, [notesList?.length])

  return (
    <>
      {appointments.map((appointment, index) => (
        <Appointment
          key={index}
          today={today}
          idParam={idParam}
          number={index + 1}
          notesData={notesData}
          addClient={addClient}
          notesList={notesList}
          appointment={appointment}
          handleClientModalOpen={handleClientModalOpen}
          handleAttachmentModalOpen={handleAttachmentModalOpen}
        />
      ))}
    </>
  )
}

export default AppointmentsListOverView
