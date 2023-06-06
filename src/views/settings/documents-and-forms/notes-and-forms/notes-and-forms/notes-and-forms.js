/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react'

// ** third party pkg
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { Card, Spinner } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

// ** components
import CustomSpinner from '@spinner'
import { defaultObj } from './notes.list'
import FormGroupElement from '@FormGroupElement'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  DeleteTemplatesAction,
  GetAllTemplatesAction,
  CheckedTemplatesByIdAction,
  CloningTemplateAction
} from '../../../../../redux/setting/documents-and-forms/notes-and-forms/notesAction'
import {
  resetGetAllTemplates,
  resetCheckedTemplate,
  resetGetTemplateById,
  resetClonedTemplate
} from '../../../../../redux/setting/documents-and-forms/notes-and-forms/notesReducer'

function NotesAndForms(props) {
  const { formik, setNewTemplate, templateId, setTemplateId } = props

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, checkedPending, deletePending, cloningPending } =
    useSelector((state) => state.notesAndForms)

  // ** States
  const [list, setList] = useState([])
  const [firstLoad, setFirstLoad] = useState(false)
  const [itemId, setItemId] = useState({ id: '', type: '' })

  const getListCallback = async (res) => {
    const answer = await res.reduce(
      (acc, item) => ({
        ...acc,
        [item.type]: [...(acc[item.type] || []), item]
      }),
      {}
    )

    const finalResult = Object.keys(defaultObj).map((key) => ({
      ...defaultObj[key],
      data: answer[key] || []
    }))

    setList(finalResult)
  }

  useEffect(() => {
    setFirstLoad(true)
    dispatch(
      GetAllTemplatesAction({
        callback: (res) => {
          getListCallback(res)
          setFirstLoad(false)
        }
      })
    )
  }, [])

  useEffect(() => {
    return () => {
      dispatch(resetGetAllTemplates())
      dispatch(resetCheckedTemplate())
      dispatch(resetGetTemplateById())
      dispatch(resetClonedTemplate())
    }
  }, [])

  return (
    <>
      {firstLoad ? (
        <CustomSpinner />
      ) : (
        <Card className="mt-3">
          <div className="bg-gray p-2 skin-change">
            <p>
              <strong>Standardize Your Documentation</strong>
            </p>
            <span>
              use the Template Builder to create your own documentation
              templates, or select from the Template Library
            </span>
          </div>

          {list.map((item, index) => (
            <Fragment key={index}>
              <div className="mt-3">
                {item?.data.length > 0 && (
                  <div
                    className={classNames({
                      'p-2': true,
                      'bg-yellow': item.section === 'Intake Forms'
                    })}
                  >
                    <p className="sub-heading-1">{item.section}</p>
                    <span>{item.detail}</span>
                  </div>
                )}

                {item.note && (
                  <div className="bg-gray px-2 py-1">
                    <span>{item?.note}</span>
                    <a href="#" className="f-bold link">
                      {item?.link}
                    </a>
                  </div>
                )}

                {item?.data.map((obj, i) => (
                  <div key={i} className="notes-and-forms--list skin-change">
                    <div className="notes-and-forms--list__checkbox mt-1 d-flex algin-items-center justify-content-center">
                      <FormGroupElement
                        inputType="checkbox"
                        inputName={`${obj?.title}-i-${i}`}
                        formGroupClassName={'m-t-3'}
                        inputClassName="skin-change"
                        defaultChecked={obj?.is_checked}
                        onChange={(e) => {
                          setItemId({
                            id: obj?.id,
                            type: 'update'
                          })
                          dispatch(
                            CheckedTemplatesByIdAction({
                              id: obj?.id,
                              data: {
                                is_checked: e.target.checked
                              }
                            })
                          )
                        }}
                      />

                      <p
                        className={'link sub-heading-2 ml-1'}
                        // onClick={() => {
                        //   setNewTemplate(true)
                        //   setTemplateId(obj?.id)
                        // }}
                      >
                        {obj?.title}
                      </p>
                    </div>

                    <div className="notes-and-forms--list__edit">
                      {checkedPending &&
                        itemId.id === obj.id &&
                        itemId.type === 'update' && (
                          <Icon
                            icon="eos-icons:loading"
                            width="15"
                            height="15"
                          />
                        )}

                      {/* View Icon */}
                      {/*<Icon icon="bi:eye-fill" width="15" height="15" />*/}

                      {cloningPending &&
                      itemId.id === obj.id &&
                      itemId.type === 'getById' ? (
                        <Icon icon="eos-icons:loading" width="15" height="15" />
                      ) : (
                        <Icon
                          icon="ion:copy"
                          width="15"
                          height="15"
                          onClick={() => {
                            dispatch(
                              CloningTemplateAction({
                                id: obj?.id,
                                callback: getListCallback
                              })
                            )
                            setItemId({ id: obj?.id, type: 'getById' })
                          }}
                        />
                      )}

                      {deletePending &&
                      itemId.id === obj.id &&
                      itemId.type === 'delete' ? (
                        <Icon icon="eos-icons:loading" width="15" height="15" />
                      ) : (
                        <Icon
                          icon="fa-solid:trash-alt"
                          width="15"
                          height="15"
                          onClick={(e) => {
                            dispatch(
                              DeleteTemplatesAction({
                                id: obj?.id,
                                callback: getListCallback
                              })
                            )
                            setItemId({ id: obj?.id, type: 'delete' })
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </Card>
      )}
    </>
  )
}

export default NotesAndForms
