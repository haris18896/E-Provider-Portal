/* eslint-disable no-unused-vars */
import classNames from 'classnames'
import { clientStatusObj } from '../../../components/screen.components/clients.screen/FormConstants'
export const columns = [
  {
    name: 'Name',
    sortable: false,
    cell: (row) => {
      return (
        <div className="attendance-Name-field">
          <div className="d-flex align-items-center">
            <strong className="fs-large t-black">
              {row.client?.first_name} {row.client?.last_name}
            </strong>
            <div
              className={classNames({
                DOT: true,
                'DOT--green': row?.client?.status === '1',
                'DOT--yellow': row?.client?.status === '2'
              })}
            />
          </div>
          <span>{clientStatusObj[parseInt(row?.client?.status)]?.text}</span>
        </div>
      )
    },
    minWidth: '33rem'
  },
  {
    name: 'Show',
    sortable: false,
    cell: (row) => row?.status['1'] || 0
  },
  {
    name: 'Cancelled',
    sortable: false,
    cell: (row) => row?.status['3'] || 0
  },
  {
    name: 'Late Cancelled',
    sortable: false,
    cell: (row) => row?.status['4'] || 0
  },

  {
    name: 'No Show',
    sortable: false,
    cell: (row) => row?.status['2'] || 0
  }
]
