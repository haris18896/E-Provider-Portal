/* eslint-disable no-unused-vars */
import { Badge, Table } from 'reactstrap'
import { useSkin } from '@src/utility/hooks/useSkin'
import classNames from 'classnames'

// import { Popup } from "../../../popover"

const ClientDetailsListTable = ({ columns, rows }) => {
  const { skin } = useSkin()

  return (
    <Table bordered responsive>
      <thead
        className='bgThead'
      >
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i} className='whiteSpace  '>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td className='pd-table'>
                <div className="d-flex align-items-center">
                  <strong>{item.name}</strong>{' '}
                  <div
                    className={classNames({
                      DOT: true,
                      'DOT--green': item.status === 'active',
                      'DOT--yellow': item.status === 'inactive'
                    })}
                  />
                </div>
              </td>
              <td className='pd-table' >{item.clientType || '--'}</td>
              <td className='pd-table' >{item.startDate || '--'}</td>
              <td className='pd-table' >{item.lastAppt || '--'}</td>
              <td className='pd-table' >{item.address || '--'}</td>
              <td className='pd-table' >{item.city || '--'}</td>
              <td className='pd-table' >{item.state || '--'}</td>
              <td className='pd-table' >{item.zip || '--'}</td>
              <td className='pd-table' >{item.phone || '--'}</td>
              <td className='pd-table' >{item.email || '--'}</td>
              <td className='pd-table' >{item.insurance || '--'}</td>
              <td className='pd-table' >{item.insuranceId || '--'}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ClientDetailsListTable
