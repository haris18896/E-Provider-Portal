/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third party packages
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { X } from 'react-feather'
import { Icon } from '@iconify/react'
import { Button, Card, Spinner } from 'reactstrap'

// ** Custom Components
import CustomSpinner from '@spinner'
import Template from './create-update-template'
import { ToastContent } from '@src/components/toast'
import { formType } from './create-update-template/constants'
import NotesAndForms from './notes-and-forms/notes-and-forms'
import TemplateLibrary from './template-library/template-library'

// ** Store && Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  createTemplateAction,
  GetTemplateByIdAction,
  UpdateTemplateAction
} from '../../../../redux/setting/documents-and-forms/notes-and-forms/notesAction'
import {
  resetAddTemplate,
  resetGetTemplateById
} from '../../../../redux/setting/documents-and-forms/notes-and-forms/notesReducer'

const SettingNotesAndForms = () => {
  const dispatch = useDispatch()

  // ** Selectors
  const { addTemplatePending, updatePending, getTemplatePending } = useSelector(
    (state) => state.notesAndForms
  )

  // ** States
  const [defaultType, setDefaultType] = useState(null)
  const [templateId, setTemplateId] = useState('')
  const [newTemplate, setNewTemplate] = useState(false)
  const [tab, setTab] = useState('Notes and Forms'.toLowerCase().trim())

  const templateSchema = Yup.object().shape({
    title: Yup.string().required('Template title is a required field!'),
    type: Yup.object().nullable(),
    content: Yup.array().of(
      Yup.object().shape({
        type: Yup.object().nullable(),
        question: Yup.string(),
        required: Yup.boolean(),
        option: Yup.array().of(
          Yup.object().shape({
            answerType: Yup.string(),
            answer: Yup.string(),
            answerDetail: Yup.string()
          })
        )
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      type: null,
      content: []
    },
    validationSchema: templateSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const content = values?.content.length
          ? values?.content.map((item) => ({
              type: item?.type?.value,
              question: item?.question,
              required: item?.required || false,
              option: item?.option
            }))
          : []

        let fieldEmpty = false
        for (let i = 0; i < values.content.length; i++) {
          if (
            !values.content[i].type ||
            values.content[i].question.trim() === ''
          ) {
            formik.setFieldError(
              'content',
              'Question and Question Type is a required field!'
            )
            toast((t) => (
              <ToastContent
                t={t}
                name="Error While Submitting Template"
                icon={<X size={14} />}
                color="danger"
                msg={'All Fields are required'}
              />
            ))

            fieldEmpty = true
          }
        }

        const data = {
          title: values.title,
          type: values.type.value,
          content
        }

        if (!fieldEmpty && !templateId) {
          dispatch(
            createTemplateAction({
              data,
              callback: () => {
                setTab('notes and forms')
                setNewTemplate(false)
                formik.resetForm()
              }
            })
          )
        }

        if (!fieldEmpty && templateId) {
          dispatch(
            UpdateTemplateAction({
              id: templateId,
              data,
              callback: () => {
                setTab('notes and forms')
                setNewTemplate(false)
                formik.resetForm()
              }
            })
          )
        }
      }
    }
  })

  useEffect(() => {
    if (templateId) {
      dispatch(
        GetTemplateByIdAction({
          id: templateId,
          callback: async (res) => {
            const type = formType.find(
              (item) => item.value === parseInt(res?.type)
            )
            setDefaultType(type)
            formik.setFieldValue('type', type)
            formik.setFieldValue('title', res?.title)
            formik.setFieldValue('content', res?.content)
          }
        })
      )
    }
  }, [templateId])

  useEffect(() => {
    return () => {
      dispatch(resetAddTemplate())
    }
  }, [])

  return (
    <div>
      <Card className="notes-and-forms">
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">Notes & Forms</span>
        </div>

        <div className="notes-and-forms--tabs bg-yellow">
          <div className="head--tabs notes-and-forms--tabs__tab">
            {['Notes and Forms'].map((item, index) => (
              <span
                key={index}
                className={classNames({
                  'span-tabs ': true,
                  'head--tabs__selected white-border':
                    tab === item.toLowerCase().trim()
                })}
                onClick={() => setTab(item.toLowerCase().trim())}
              >
                {item}
              </span>
            ))}
          </div>

          {newTemplate ? (
            <div className="notes-and-forms--tabs__buttons">
              <Button
                className="button-white"
                onClick={() => {
                  setNewTemplate(false)
                  formik.resetForm()
                  setTemplateId(null)
                  dispatch(resetGetTemplateById())
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  updatePending ||
                  addTemplatePending ||
                  formik.errors.type ||
                  formik.values.type === null ||
                  formik.values.content.length === 0 ||
                  (!templateId && formik.errors.title)
                }
                className="button-success"
                onClick={() => formik.handleSubmit()}
              >
                {addTemplatePending || updatePending ? (
                  <Icon icon={'eos-icons:loading'} width={'20'} height={'20'} />
                ) : (
                  <Icon
                    icon={'material-symbols:check-small-rounded'}
                    width={'20'}
                    height={'20'}
                  />
                )}
                <span className="px-1">{templateId ? 'Update' : 'Save'}</span>
              </Button>
            </div>
          ) : (
            <div className="notes-and-forms--tabs__buttons">
              <Button
                className="button-green"
                onClick={() => setNewTemplate(true)}
              >
                Create New Template
              </Button>
            </div>
          )}
        </div>

        {getTemplatePending ? (
          <CustomSpinner />
        ) : newTemplate ? (
          <Template
            formik={formik}
            templateId={templateId}
            defaultType={defaultType}
            setDefaultType={setDefaultType}
          />
        ) : (
          <>
            {tab === 'notes and forms' ? (
              <Fragment>
                <NotesAndForms
                  formik={formik}
                  templateId={templateId}
                  setTemplateId={setTemplateId}
                  setNewTemplate={setNewTemplate}
                />
              </Fragment>
            ) : tab === 'template library' ? (
              <Fragment>
                <TemplateLibrary />
              </Fragment>
            ) : (
              ''
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default SettingNotesAndForms
