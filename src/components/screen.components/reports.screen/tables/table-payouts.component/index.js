import React from 'react'
import { Badge, Table } from 'reactstrap'

import { StatusObj } from '@src/components/colors/BadgeColors'
import moment from 'moment'

const ReportsPayoutsTable = ({ columns, rows }) => {
  return (
    <Table bordered responsive>
      <thead className="bgThead">
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          const status = item.status
          const color = StatusObj[status] ? StatusObj[status].color : 'primary'

          return (
            <tr key={index} className="tableRow">
              <td>
                <a href="#" className="link">
                  Transactions
                </a>
              </td>
              <td>
                <Badge id={`pop-${index}`} color={color}>
                  {item.status}
                </Badge>
              </td>
              <td>{item.bank}</td>
              <td>{item.description}</td>
              <td>{moment(item.date).format('MM/DD/YYYY')}</td>
              <td>
                <div className="d-flex align-items-center justify-content-between">
                  <p>
                    <strong>$ {item.amount}</strong>
                  </p>
                  <p>USD</p>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ReportsPayoutsTable
