/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from 'react'

// third party
import { Icon } from '@iconify/react'
import { Button, Table } from 'reactstrap'
import TemplateForm from '../../../../../views/settings/documents-and-forms/notes-and-forms/template/form'
import { nanoid } from 'nanoid'

export const TemplateTable = ({ columns, rows }) => {
  const [row, setRow] = useState([...rows])
  const [rowIndex, setRowIndex] = useState('')
  const [data, setData] = useState({})

  const handleOpen = (idx) => {
    const list = [...rows]
    const newList = list.map((_item, index) => {
      if (index === idx) {
        return { ..._item, isOpen: true }
      }
      return { ..._item }
    })
    setRow(newList)
    setRowIndex(`${idx}`)
  }

  const handleClose = (idx) => {
    const list = [...rows]
    const newList = list.map((_item, index) => {
      if (index === idx) {
        return { ..._item, isOpen: false }
      }
      return { ..._item }
    })
    setRow(newList)
    setRowIndex(idx)
  }


  return (
    <Fragment>
      {/* Table Head */}
      {rowIndex && data && (
        <Table responsive className="template-table">
          <thead className="bgThead">
            <tr className="template-table--header">
              <th>Order</th>
              <th style={{ minWidth: '600px' }}>
                Question Name / Form Element
              </th>
              <th style={{ textAlign: 'right' }}>Type</th>
              <th style={{ textAlign: 'right' }}>Required</th>
            </tr>
          </thead>
        </Table>
      )}

      {/* Form should be here */}
      {rowIndex && data && (
        <TemplateForm onClose={handleClose} index={rowIndex} item={data} />
      )}

      {/* Table Body */}
      <Table responsive className="template-table">
        {!rowIndex && (
          <thead className="bgThead">
            <tr>
              {columns.map(({ header }, i) => (
                <th key={i} className="template-table--header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="template-table--body">
          {row.map((item, index) => {
            const questionType = item.questionType.split(' (')
            return (
              <Fragment key={index}>
                {!item.isOpen && (
                  <>
                    <tr key={index} className="tableRow">
                      <td className="text-align-center">
                        <Icon
                          className="template-table--body__bars"
                          icon="fa6-solid:bars"
                          width="25"
                          height="25"
                          onClick={() => {
                            handleOpen(index)
                            setData(item)
                          }}
                        />
                      </td>
                      <td
                        className="link"
                        onClick={() => {
                          handleOpen(index)
                          setData(item)
                        }}
                      >
                        <p>
                          {item.question.length > 90
                            ? `${item.question.slice(0, 90)} ...`
                            : item.question}
                        </p>
                      </td>
                      <td
                        onClick={() => {
                          handleOpen(index)
                          setData(item)
                        }}
                      >
                        <p>{questionType[0]}</p>
                      </td>
                      <td>
                        <Icon
                          className="ml-2"
                          icon="fa-solid:trash-alt"
                          width={20}
                          height={20}
                        />
                      </td>
                    </tr>
                  </>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </Table>

      <hr className="mt-0" />

      <div className="template-table--body__Button">
        <Button
          className="button-success"
          onClick={() => {
            setRowIndex(nanoid())
            setData({
              questionType: '',
              question: '',
              required: false,
              ans: [
                {
                  answerType: '',
                  answer: '',
                  answerDetail: ''
                }
              ]
            })
          }}
        >
          Add New
        </Button>
      </div>
    </Fragment>
  )
}
