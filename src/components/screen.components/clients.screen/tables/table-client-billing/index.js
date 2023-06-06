import React, { useState, useEffect } from 'react'

import { Badge, Table } from 'reactstrap'

// third party
import Prism from 'prismjs'
// import { useNavigate } from 'react-router-dom'
import { Edit2, FileText } from 'react-feather'

// component
import { StatusObj } from '@src/components/colors/BadgeColors'
import Modal from './modal'

const ClientBilling = ({ columns, rows }) => {
  const [open, setOpen] = useState(false)

  // const navigate = useNavigate()

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <Table bordered responsive>
      <thead
        className='bgThead'
      >
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          const color = StatusObj[item.status] ? StatusObj[item.status].color : 'primary'

          return (
            <tr key={index} className="tableRow">
              <td>
                <strong>{item.date}</strong>
              </td>
              <td>
                <div className="invoice-div">
                  <FileText size={15} />
                  <span>invoice {item.invoice}</span>
                </div>
              </td>
              <td>$ {item.fee}</td>
              <td>$ {item.client}</td>
              <td>
                <Badge color={color}>{item.status}</Badge>
              </td>
              <td>
                <Edit2
                  size={22}
                  id={`pop-${index}`}
                  className="billing-edit"
                  onClick={() => setOpen(!open)}
                />
                {/* modal here */}
                <Modal setOpen={setOpen} open={open} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ClientBilling
