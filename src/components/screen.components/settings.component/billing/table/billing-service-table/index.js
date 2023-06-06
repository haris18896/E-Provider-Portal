import React from 'react'

import { Table } from 'reactstrap'
// third party
import { Icon } from '@iconify/react'

export const BillingServiceTable = ({ columns, rows }) => {

  return (
    <Table bordered responsive className='mt-2'>
      <thead className="bgThead">
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr key={index} className="tableRow">
              <td>{item.code}</td>
              <td>{item.service}</td>
              <td>
                <div className="billing--bills_form--table_row">
                  <span>${item.fee}</span>
                  <div className="billing--bills_form--table_row--icons">
                    <Icon icon="fa-solid:eye" width="15" height="15" />
                    <Icon icon="fa-solid:pen" width="15" height="15" />
                    <Icon icon="fa6-solid:trash-can" width="15" height="15" />
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

