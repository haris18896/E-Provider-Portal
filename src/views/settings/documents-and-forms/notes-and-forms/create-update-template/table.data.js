/* eslint-disable no-unused-vars */
import React from 'react'

// ** Third Party Components
import { Icon } from '@iconify/react'
import { formType, questionTypes } from './constants'

export const columns = ({ formik }) => {
  const handleRemoveItem = (index) => {
    const filtered = formik.values.content.filter((_, i) => i !== index)
    formik.setFieldValue('content', filtered)
  }

  return [
    {
      name: 'Order',
      width: '100px',
      cell: () => (
        <Icon
          className="template-table--body__bars"
          icon="fa6-solid:bars"
          width="25"
          height="25"
        />
      )
    },
    {
      name: 'Question Name / Form Element',
      width: '-webkit-calc(-webkit-fill-available - 350px)',
      cell: (row) => (
        <span className={'link'}>
          {row?.question?.length > 90
            ? `${row?.question.slice(0, 90)} ...`
            : row?.question}
        </span>
      )
    },
    {
      name: 'Type',
      width: '150px',
      cell: (row) => {
        return (
          <>
            {typeof row?.type === 'number' ? (
              <span>
                {
                  questionTypes
                    .find((item) => item.value === row?.type)
                    ?.text.split('(')[0]
                }
              </span>
            ) : (
              <span>{row?.type?.text && row?.type?.text.split('(')[0]}</span>
            )}
          </>
        )
      }
    },
    {
      name: 'Required',
      width: '100px',
      cell: (row, index) => (
        <Icon
          className="ml-2"
          icon="fa-solid:trash-alt"
          width={20}
          height={20}
          onClick={() => handleRemoveItem(index)}
        />
      )
    }
  ]
}
