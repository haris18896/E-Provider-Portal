import { Badge, Table } from 'reactstrap'
import classNames from 'classnames'

import useMediaQuery from "@src/utility/hooks/useMediaQuery"

const ClientSessionAttendanceTable = ({rows }) => {
  const tablet = useMediaQuery('(min-width: 800px)')

  return (
    <Table bordered responsive>
      <thead
        className='bgThead'
      >
        <tr>
        <th style={{borderRight: 'none'}}>Name</th>
        {tablet && (
            <>
          <th style={{border: 'none'}}></th>
          <th style={{border: 'none'}}></th>
          <th style={{border: 'none'}}></th>
          <th style={{border: 'none'}}></th>
          <th style={{border: 'none'}}></th>
          <th style={{border: 'none'}}></th>
            </>
          )}
          <th className='text-align-center'>Show</th>
          <th className='text-align-center'>Cancelled</th>
          <th className='text-align-center'>Late Cancelled</th>
          <th className='text-align-center'>No Show</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td colSpan={tablet && '7'}>
                <div className="attendance-Name-field">
                  <div className="d-flex align-items-center">
                    <strong className='fs-large t-black'>{item.name}</strong>{' '}
                    <div
                      className={classNames({
                        DOT: true,
                        'DOT--green': item.status === 'active',
                        'DOT--yellow': item.status === 'inactive'
                      })}
                    />{' '}
                  </div>
                  <span>{item.status}</span>
                </div>
              </td>
              <td className='text-align-center'>{item.show}</td>
              <td className='text-align-center'>{item.cancelled}</td>
              <td className='text-align-center'>{item.lateCancelled}</td>
              <td className='text-align-center'>{item.noShow}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ClientSessionAttendanceTable
