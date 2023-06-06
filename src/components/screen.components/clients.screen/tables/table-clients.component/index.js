import {  Button, Table } from 'reactstrap'
// hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'
// third party
import moment from 'moment'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Edit2, Mail, PhoneCall } from 'react-feather'

const ClientsListTable = ({ rows }) => {
  const tablet = useMediaQuery('(min-width: 800px)')

  const navigate = useNavigate()

  return (
    <Table bordered responsive>
      <thead
        className='bgThead'
      >
        <tr>
          <th style={{ borderRight: 'none' }}>Name</th>
          {tablet && (
            <>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
            </>
          )}
          <th>Last Appointment</th>
          <th>Contact Info</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td colSpan={tablet && 5} onClick={() => navigate('/clients/client')}>
                <div className="attendance-Name-field">
                  <div className="d-flex align-items-center">
                    <strong>{item.name}</strong>{' '}
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
              <td onClick={() => navigate('/clients/client')}>
                <div className="attendance-Name-field">
                  <p>{moment(item.lastAppt).format('MMM DD, YYYY')}</p>
                  <span>{item.days} days ago</span>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <div className="attendance-Name-field me-1">
                    <div className="d-flex align-items-center">
                      <PhoneCall size={15} />
                      <p>{item.phone}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <Mail size={15} />
                      <p>{item.email}</p>
                    </div>
                  </div>
                  <Button
                    className="marginLeftAuto badge-button"
                    onClick={() => navigate('/clients/edit-client')}
                  >
                    <Edit2 size={12} className='mr-05px' /> Edit
                  </Button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ClientsListTable
