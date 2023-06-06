/* eslint-disable no-unused-vars */
import moment from 'moment'
import { Badge } from 'reactstrap'

// && Utilities
import { timeConvertToPmAm } from '../../utility/Utils'

// ** Store && Actions
import { appointmentStatusObj } from '../../components/colors/BadgeColors'

export const columns = () => {
  return [
    {
      name: 'Location',
      sortable: false,
      selector: (row) => row.booking.location?.name || ' ',
      minWidth: '12rem'
    },
    {
      name: 'Space',
      sortable: false,
      selector: (row) => row.booking.room.name || ''
    },
    {
      name: 'Date',
      sortable: true,
      minWidth: '10rem',
      cell: (row) => (
        <>
          <span>
            {row.booking?.start_date !== undefined
              ? moment.unix(row.booking?.start_date).format('MM/DD/YYYY')
              : '--'}
          </span>
        </>
      )
    },
    {
      name: 'Booking Start',
      sortable: false,
      selector: (row) => timeConvertToPmAm(row.booking?.start_time || '--')
    },
    {
      name: 'Booking End',
      sortable: false,
      selector: (row) => timeConvertToPmAm(row.booking?.end_time || '--')
    },
    {
      name: 'Status',
      sortable: false,
      minWidth: '10rem',
      cell: (row) => {
        return (
          <div className="d-f-between w-100Percent">
            <Badge
              color={appointmentStatusObj[row?.status].color}
              pill
              id={`pop-${row.id}`}
              className={
                appointmentStatusObj[row?.status].text !== 'Active'
                  ? 'cancelled-padding booking-badge'
                  : 'active-padding active-booking-color booking-badge'
              }
              // className="booking-badge"
            >
              {appointmentStatusObj[row?.status].text}
            </Badge>
          </div>
        )
      }
    },
    {
      name: 'Client Name(s)',
      sortable: false,
      minWidth: '18rem',
      selector: (row) =>
        `${row.clients[0]?.first_name || '--'} ${
          row.clients[0]?.last_name || '--'
        }`
    },
    {
      name: 'Price',
      sortable: false,
      selector: (row) => `$${row.booking.room_cost}`
    }
  ]
}
