/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'

// hooks
import useMediaQuery from '@hooks/useMediaQuery'

// Third party
import * as Yup from 'yup'
import classNames from 'classnames'
import { isObjEmpty, checkForEmptyValues } from '@utils'
import { Icon } from '@iconify/react'
import { Button } from 'reactstrap'
import { useFormik, FieldArray, FormikProvider, Form } from 'formik'

// components
import SelectField from '@select'
import FormGroupElement from '@FormGroupElement'
import {
  answerTypeOptions,
  multipleChoices,
  questionTypes,
  radioOptions
} from '../../../../../views/settings/documents-and-forms/notes-and-forms/create-update-template/constants'

export const ExpandedComponent = (props) => {
  const { data, templateId, formik, index, onClose } = props
  const tablet = useMediaQuery('(min-width: 700px)')

  const schema = Yup.object().shape({
    type: Yup.object().required('Question Type is a required Field!'),
    question: Yup.string().required('Question is a required field!'),
    required: Yup.boolean(),
    option: Yup.array().of(
      Yup.object().shape({
        answerType: Yup.object(),
        answer: Yup.string(),
        answerDetail: Yup.string()
      })
    )
  })

  const questionnaireFormik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      if (isObjEmpty(questionnaireFormik.errors)) {
        if (values.type.value === 3 || values.type.value === 4) {
          if (values.option.length > 0) {
            let hasError = false

            for (let i = 0; i < values.option.length; i++) {
              if (
                !values.option[i].answer ||
                values.option[i].answer.trim() === ''
              ) {
                questionnaireFormik.setFieldError(
                  `option[${i}]`,
                  'All fields are required!'
                )

                props.formik.setFieldError(
                  `option[${i}]`,
                  'All fields are required!'
                )

                hasError = true
                break
              }
            }

            if (!hasError) {
              props.formik.setFieldValue(
                `content[${index}]`,
                questionnaireFormik.values
              )
            }
          } else {
            questionnaireFormik.setFieldError(
              `option`,
              'At least one option is required!'
            )
          }
        } else {
          props.formik.setFieldValue(
            `content[${index}]`,
            questionnaireFormik.values
          )
        }
      }
    }
  })

  const answerButton =
    questionnaireFormik.values?.type?.value === 3 ||
    questionnaireFormik.values?.type?.value === 4

  const handleRemoveItem = (index) => {
    const filtered = props.formik.values.content
      .filter((_, i) => i !== index)
      .map((item, index) => ({
        ...item,
        index
      }))
    props.formik.setFieldValue('content', filtered)
  }

  return (
    <Fragment>
      <FormikProvider value={questionnaireFormik}>
        <Form
          className="template-table--Form"
          onSubmit={questionnaireFormik.handleSubmit}
        >
          <div className="template-table--Form__questionType">
            <SelectField
              isSearchable={false}
              header={false}
              wd="100%"
              className="plr-0"
              defaultValue={data.type}
              data={questionTypes}
              onChange={(e) => {
                questionnaireFormik.setFieldValue(`type`, e)
              }}
            />

            <Icon
              icon="fa-solid:trash-alt"
              width="20"
              height="20"
              className="ml-2 mb-1"
              onClick={() => handleRemoveItem(index)}
            />
          </div>

          <FormGroupElement
            inputType="textarea"
            rows={4}
            label="Question"
            placeholder="Enter Question"
            labelClassName="pl-1"
            inputName={`question-${index}`}
            formGroupClassName="template-table--Form__question"
            inputClassName={classNames({
              'resize-none radius-25 skin-change': true,
              invalid:
                questionnaireFormik.touched.question &&
                questionnaireFormik.errors.question
            })}
            value={questionnaireFormik.values.question}
            onChange={(e) => {
              questionnaireFormik.setFieldValue(`question`, e.target.value)
            }}
            formikTouched={questionnaireFormik.touched.question}
            formikError={questionnaireFormik.errors.question}
          />

          {/* Answer */}
          {answerButton && (
            <FieldArray
              name="option"
              render={(arrayHelpers) => (
                <>
                  <Button
                    className="add-more pd-s  mb-1 template-table--Form__addMore"
                    onClick={() =>
                      arrayHelpers.push({
                        answerType: '',
                        answer: '',
                        answerDetail: ''
                      })
                    }
                  >
                    <Icon icon="akar-icons:plus" />
                    <span className="px-1">Answer</span>
                  </Button>

                  <div className="template-table--Form__answer">
                    {questionnaireFormik.values?.option.length > 0 &&
                      questionnaireFormik.values?.option.map((ans, index) => (
                        <div
                          key={index}
                          className="template-table--Form__answer--longAnswer"
                        >
                          <div className="template-table--Form__answer--longAnswer__selectors">
                            <section>
                              <FormGroupElement
                                required
                                inputName={`name-${index}`}
                                inputType={'text'}
                                placeholder={'option'}
                                formGroupClassName="template-table--Form__question"
                                inputClassName="resize-none radius-25 skin-change min-w-200px"
                                {...questionnaireFormik.getFieldProps(
                                  `option[${index}].answer`
                                )}
                                formikTouched={
                                  questionnaireFormik.touched.option?.[index]
                                    ?.answer
                                }
                                formikError={
                                  questionnaireFormik.errors.question?.[index]
                                    ?.answer
                                }
                              />
                            </section>

                            <section>
                              <SelectField
                                header={false}
                                wd="100%"
                                isSearchable={false}
                                controlMaxWidth={tablet && '250px'}
                                controlMinWidth="230px"
                                value={
                                  data?.option?.answerType ||
                                  answerTypeOptions[0]
                                }
                                data={answerTypeOptions}
                                onChange={(e) =>
                                  questionnaireFormik.setFieldValue(
                                    `option[${index}].answerType`,
                                    e
                                  )
                                }
                              />
                            </section>

                            <div className="template-table--Form__answer--longAnswer__detail">
                              {questionnaireFormik.values.option[index]
                                .answerType.value === 2 && (
                                <section>
                                  <FormGroupElement
                                    inputType="text"
                                    placeholder="Please specify dates, reasons, etc."
                                    labelClassName="pl-1"
                                    inputName={`option.${index}.answerDetail`}
                                    inputClassName="resize-none radius-25 skin-change"
                                    {...questionnaireFormik.getFieldProps(
                                      `option[${index}].answerDetail`
                                    )}
                                    formikTouched={
                                      questionnaireFormik.touched.option?.[
                                        index
                                      ]?.answerDetail
                                    }
                                    formikError={
                                      questionnaireFormik.errors.option?.[index]
                                        ?.answerDetail
                                    }
                                  />
                                </section>
                              )}

                              <Icon
                                icon="fa-solid:trash-alt"
                                width="20"
                                height="20"
                                className="template-table--Form__answer--longAnswer__trash"
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            />
          )}

          {/* Actions */}
          <div className="template-table--Form__actions">
            <div className="template-table--Form__actions__checkbox">
              <FormGroupElement
                inputType="checkbox"
                inputName={`required-${index}`}
                label="Require Answer"
                labelClassName="pl-10px"
                formGroupClassName="client_profile--checkbox client_profile--doubleCol__50 Appointment_Form--clientsDetails--checkbox"
                inputClassName="skin-change"
                checked={questionnaireFormik.values.required === true}
                onChange={(e) =>
                  questionnaireFormik.setFieldValue(
                    `required`,
                    e.target.checked
                  )
                }
              />
            </div>

            <div className="template-table--Form__actions__buttons">
              <Button
                name={`cancel-${index}`}
                className="button-cancel pd"
                onClick={() => {
                  onClose()
                  questionnaireFormik.resetForm()
                  props.formik.setFieldValue(`content[${index}]`, {
                    index,
                    option: [],
                    question: '',
                    required: false,
                    type: null
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!isObjEmpty(questionnaireFormik.errors)}
                name={`submit-${index}`}
                className="button-success pd"
                onClick={() => {
                  questionnaireFormik.handleSubmit()
                  onClose()
                }}
              >
                <Icon icon="akar-icons:check" />
                <span className="px-1">Save</span>
              </Button>
            </div>
          </div>

          {questionnaireFormik.errors?.option && (
            <p className={'error pt-1'}>{questionnaireFormik.errors?.option}</p>
          )}
        </Form>
      </FormikProvider>
    </Fragment>
  )
}
