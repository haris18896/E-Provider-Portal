import classNames from 'classnames'
import moment from 'moment'
export const columns = [
  {
    name: 'Name',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-flex align-items-center">
          <strong>
            {row?.first_name || '--'} {row?.last_name || '--'}
          </strong>
          <div
            className={classNames({
              DOT: true,
              'DOT--green': row.status === '1',
              'DOT--yellow': row.status === '2'
            })}
          />
        </div>
      )
    },
    minWidth: '16rem'
  },
  {
    name: 'Client Type',
    sortable: false,
    minWidth: '12rem',
    cell: (row) => row.clientType || '--'
  },
  {
    name: 'Start Date',
    sortable: false,
    minWidth: '09rem',
    cell: (row) => {
      return (
        <>
          <span>
            {row?.date_started !== null
              ? moment(row?.date_started).format('MM/DD/YYYY')
              : '--'}
          </span>
        </>
      )
    }
  },

  {
    name: 'Last Appointment',
    sortable: false,
    minWidth: '09rem',
    cell: (row) => {
      return (
        <>
          <span>
            {row?.latest_appointment !== null
              ? moment(row?.latest_appointment).format('MM/DD/YYYY')
              : '--'}
          </span>
        </>
      )
    }
  },

  // {
  //   name: 'Address',
  //   sortable: true,
  //   cell: (row) => row.first_address_address || '--',
  //   minWidth: '15rem'
  // },
  {
    name: 'City',
    sortable: true,
    cell: (row) => row.first_address_city || '--'
  },
  {
    name: 'State',
    sortable: true,
    cell: (row) => row.first_address_state || '--'
  },
  {
    name: 'ZIP',
    sortable: true,
    cell: (row) => row.first_address_zipcode || '--'
  },
  {
    name: 'Phone',
    sortable: true,
    cell: (row) => row.phone_number || '--',
    minWidth: '13rem'
  },
  {
    name: 'Email',
    sortable: true,
    cell: (row) => row.email || '--',
    minWidth: '19rem'
  },
  {
    name: 'Insurance',
    sortable: true,
    minWidth: '10rem',
    cell: (row) => row.insurance || '--'
  }
  // {
  //   name: 'Insurance ID',
  //   sortable: true,
  //   minWidth: '15rem',
  //   cell: (row) => row.insuranceId || '--'
  // }
]
