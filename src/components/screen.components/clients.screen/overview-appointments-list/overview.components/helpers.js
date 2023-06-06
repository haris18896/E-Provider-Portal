/* eslint-disable no-unused-vars */
import React, { memo } from 'react'

// ** Custom Components
import { EditorState } from 'draft-js'
import TextEditor from '@src/components/editor'
import FormGroupElement from '@FormGroupElement'

// ** Third Party Packages
import { Icon } from '@iconify/react'
import { Edit2, FileText, Paperclip, Trash2 } from 'react-feather'

// ** Store && Actions
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'

const statusTextMap = {
  4: 'Late Show',
  5: 'No Show'
}

export const GetAppointmentStatusText = memo(
  ({ appointmentStatus, bookingStatus }) => {
    const status = parseInt(appointmentStatus || bookingStatus)
    return statusTextMap[status] ? <span>{statusTextMap[status]}</span> : null
  }
)

export const renderFilePreview = (file) => {
  if (file.title.includes('.png', '.jpg', '.jpeg', '.gif')) {
    return (
      <img
        className="rounded"
        alt={file.title}
        src={file.file}
        height="28"
        width="28"
      />
    )
  } else {
    return <FileText size="28" />
  }
}

export const Edit = memo(
  ({
    index,
    noteId,
    deleteHandler,
    editHandler,
    deleteIndex,
    appointmentId,
    handleAttachmentModalOpen
  }) => {
    const { deleteNotePending } = useSelector(
      ({ clientDetails }) => clientDetails
    )

    return (
      <div className="list_overview--appointments__header--details__edit">
        <div className="skin-change" onClick={editHandler}>
          <Edit2 size={15} />
        </div>
        <div
          className="skin-change"
          onClick={() => !deleteNotePending && deleteHandler()}
        >
          {deleteNotePending && deleteIndex === index ? (
            <Icon icon={'eos-icons:loading'} width={'15'} height={'15'} />
          ) : (
            <Trash2 size={15} />
          )}
        </div>
        <div
          className="skin-change"
          onClick={() => {
            handleAttachmentModalOpen({
              open: true,
              id: appointmentId,
              noteId
            })
          }}
        >
          <Paperclip size={15} />
        </div>
      </div>
    )
  }
)

const Answer = ({
  formik,
  content,
  expand,
  index,
  noteId,
  type,
  contentIndex
}) => {
  if (
    expand.open &&
    expand.edit &&
    expand.index === index &&
    expand.appointmentNoteId === noteId
  ) {
    const rows = type === 1 && 4
    return (
      <div className={'mx-2'}>
        {/*{content?.required && <p className={'m-b-5'} style={{ float: 'left', color: 'red' }}>*</p>}*/}
        <FormGroupElement
          inputType={type === 1 ? 'textarea' : 'text'}
          inputName={`answer-${index}-${type}`}
          rows={rows}
          label={''}
          labelClassName="pl-10px"
          required={content.required}
          value={
            formik.values.appointment_notes?.[index]?.content[contentIndex]
              ?.answer
          }
          onChange={(e) =>
            formik.setFieldValue(
              `appointment_notes.[${index}].content[${contentIndex}].answer`,
              e.target.value
            )
          }
          inputClassName="form-fields resize-none skin-change"
        />
      </div>
    )
  } else {
    return <p className={'m-l-24'}>{content?.answer || null}</p>
  }
}

const Check = ({
  formik,
  content,
  expand,
  index,
  noteId,
  type,
  contentIndex
}) => {
  const handleRadioChange = (e, i) => {
    formik.setFieldValue(
      `appointment_notes.[${index}].content[${contentIndex}].radioCheck`,
      e.target.value
    )
  }

  return (
    <div className={'mx-2'}>
      {content?.option.map((option, i) => (
        <FormGroupElement
          key={i}
          disabled={
            !expand.open ||
            !expand.edit ||
            expand.index !== index ||
            expand.appointmentNoteId !== noteId
          }
          inputName={`option-${option?.answer}-${type}`}
          label={`${option.answer}`}
          inputType={type === 4 ? 'radio' : type === 3 && 'checkbox'}
          labelClassName="pl-10px"
          inputClassName="skin-change"
          value={option?.answer}
          checked={
            type === 3
              ? formik.values?.appointment_notes?.[index]?.content?.[
                  contentIndex
                ]?.option?.[i]?.checked === true
              : type === 4 &&
                option?.answer.trim() ===
                  formik.values.appointment_notes?.[index]?.content[
                    contentIndex
                  ]?.radioCheck
          }
          onChange={(e) => {
            if (type === 3) {
              formik.setFieldValue(
                `appointment_notes.[${index}].content[${contentIndex}].option[${i}].checked`,
                e.target.checked
              )
            } else if (type === 4) {
              handleRadioChange(e, i) // call the custom radio change handler
            }
          }}
          // checked={formik.getFieldProps(`${name}[${i}]`).value} // Get the `checked` prop from Formik's `getFieldProps` method
          formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
        />
      ))}
    </div>
  )
}

export default function renderContent(props) {
  const { formik, content, expand, index, noteId, contentIndex } = props
  switch (parseInt(content.type)) {
    case 1:
      return (
        <Answer
          type={1}
          index={index}
          formik={formik}
          expand={expand}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 2:
      return (
        <Answer
          type={2}
          index={index}
          formik={formik}
          expand={expand}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 3:
      return (
        <Check
          type={3}
          index={index}
          formik={formik}
          expand={expand}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 4:
      return (
        <Check
          type={4}
          index={index}
          formik={formik}
          expand={expand}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    default:
      return null
  }
}

export const renderEditor = (props) => {
  const {
    title,
    editorValue,
    setEditorValue,
    onSubmit,
    cancelHandler,
    cancelBtnDisabled,
    saveBtnDisabled
  } = props
  return (
    <div className={'fullWidth mx-0 mt-1'}>
      <div className="list_overview--appointments__editorHeading whiteSpace">
        <strong>{title}</strong>
      </div>
      <TextEditor
        value={editorValue}
        setValue={setEditorValue}
        toolbar={{
          options: ['inline', 'list', 'history'],
          inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'italic'],
            bold: {
              className: 'toolbarClassName--text'
            },
            italic: {
              className: 'toolbarClassName--text'
            }
          },
          list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['unordered', 'ordered'],
            unordered: {
              className: 'toolbarClassName--text'
            },
            ordered: {
              className: 'toolbarClassName--text'
            }
          }
        }}
      />

      {onSubmit && (
        <div className="signature m-t-10">
          <div>{/*created by*/}</div>
          <div className={'d-flex'}>
            <Button
              color={'button-white me-1 pd-s'}
              onClick={() => cancelHandler()}
              disabled={cancelBtnDisabled}
            >
              Cancel
            </Button>

            <Button
              className="button-success pd-s"
              disabled={saveBtnDisabled}
              onClick={() => onSubmit()}
            >
              {saveBtnDisabled ? (
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
    </div>
  )
}

const ClientDocumentAnswer = ({ content, noteId, type, contentIndex }) => {
  const rows = type === 1 && 4
  return (
    <div className={'mx-2'}>
      {/*{content?.required && <p className={'m-b-5'} style={{ float: 'left', color: 'red' }}>*</p>}*/}
      <FormGroupElement
        inputType={type === 1 ? 'textarea' : 'text'}
        inputName={`answer-${contentIndex}-${type}`}
        rows={rows}
        disabled
        label={''}
        labelClassName="pl-10px"
        // required={content.required}
        value={content[contentIndex]?.answer}
        inputClassName="form-fields resize-none skin-change"
      />
    </div>
  )
}

const ClientDocumentCheck = ({ content, noteId, type, contentIndex }) => {
  return (
    <div className={'mx-2'}>
      {content?.option.map((option, i) => (
        <FormGroupElement
          key={i}
          inputName={`option-${option?.answer}-${type}`}
          label={`${option.answer}`}
          inputType={type === 4 ? 'radio' : type === 3 && 'checkbox'}
          labelClassName="pl-10px"
          inputClassName="skin-change"
          value={option?.answer}
          checked={
            type === 3
              ? content?.[contentIndex]?.option?.[i]?.checked === true
              : type === 4 &&
                option?.answer.trim() === content[contentIndex]?.radioCheck
          }
          formGroupClassName="client_profile--checkbox client_profile--doubleCol__50"
        />
      ))}
    </div>
  )
}

export const renderClientDocumentContent = (props) => {
  const { content, noteId, contentIndex } = props
  switch (parseInt(content.type)) {
    case 1:
      return (
        <ClientDocumentAnswer
          type={1}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 2:
      return (
        <ClientDocumentAnswer
          type={2}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 3:
      return (
        <ClientDocumentCheck
          type={3}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    case 4:
      return (
        <ClientDocumentCheck
          type={4}
          noteId={noteId}
          content={content}
          contentIndex={contentIndex}
        />
      )
    default:
      return null
  }
}
