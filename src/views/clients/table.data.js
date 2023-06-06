/* eslint-disable no-unused-vars */
import classNames from 'classnames'
import moment from 'moment'
import { Edit2, Mail, PhoneCall } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Button } from 'reactstrap'
import { clientStatus } from '../../components/status/clientStatus'

export const columns = [
  {
    name: 'Name',
    sortable: true,
    cell: (row) => {
      return (
        <>
          <div className="attendance-Name-field">
            <div className="d-flex align-items-center">
              <strong>
                {row.first_name || '--'} {row.last_name || '--'}
              </strong>
              <div
                className={classNames({
                  DOT: true,
                  'DOT--green': row.status === '1',
                  'DOT--yellow': row.status === '2'
                })}
              />{' '}
            </div>
            <span>{clientStatus[row.status].text || '--'}</span>
          </div>
        </>
      )
    },
    minWidth: '26rem'
  },
  {
    name: 'Last Appointment',
    sortable: false,
    cell: (row) => {
      const now = moment()
      const time = row?.latest_appointment !== null && moment.unix(row?.latest_appointment).format('MM-DD-YYYY')
      const days = now.diff(time, 'days')
      return (
        <>
          <div className="attendance-Name-field">
            {row?.latest_appointment !== null ? (
              <p>
                {moment.unix(row?.latest_appointment).format('MMM DD, YYYY')}
              </p>
            ) : (
              '--'
            )}
            <span>{days || '--'} days ago</span>
          </div>
        </>
      )
    }
    // ,
    // width: '15rem'
  },
  {
    name: 'Contact Info',
    sortable: false,
    cell: (row) => {
      const navigate = useNavigate()
      return (
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="attendance-Name-field me-1">
            <div className="d-flex align-items-center">
              <PhoneCall size={15} />
              <p>{row.phone_number || '--'}</p>
            </div>
            <div className="d-flex align-items-center">
              <Mail size={15} />
              <p>{row.email || '--'}</p>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              className="marginLeftAuto badge-button"
              onClick={() => navigate(`/clients/edit-client/${row?.id}`)}
            >
              <Edit2 size={12} className="mr-05px" /> Edit
            </Button>
          </div>
        </div>
      )
    },
    minWidth: '29rem'
  }
]
