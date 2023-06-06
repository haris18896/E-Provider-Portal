/* eslint-disable no-unused-vars */
import { Badge, Table } from 'reactstrap'
import { useSkin } from '@src/utility/hooks/useSkin'
import classNames from 'classnames'

// import { Popup } from "../../../popover"

const ClientDemographicsListTable = ({ columns, rows }) => {
  const { skin } = useSkin()

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
          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td>
                <div className="d-flex align-items-center">
                  <strong>{item.name}</strong>{' '}
                  <div
                    className={classNames({
                      DOT: true,
                      'DOT--green': item.status === 'complete',
                      'DOT--yellow': item.status === 'incomplete'
                    })}
                  />
                </div>
              </td>
              <td>{item.contact}</td>
              <td>{item.age}</td>
              <td>{item.dob}</td>
              <td>{item.sex}</td>
              <td>{item.genderId || '--'}</td>
              <td>{item.race}</td>
              <td>{item.relationship || '--'}</td>
              <td>{item.employment || '--'}</td>
              <td>{item.language || '--'}</td>
              <td>{item.city || '--'}</td>
              <td>{item.zip || '--'}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ClientDemographicsListTable
