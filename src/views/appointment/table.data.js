/* eslint-disable no-unused-vars */
// ** Third Party Components
import moment from 'moment'
import { Badge } from 'reactstrap'

// ** Utilities
import { timeConvertToPmAm } from '../../utility/Utils'

// ** Components
import { appointmentStatusObj } from '../../components/colors/BadgeColors'

export const columns = () => {
  return [
    {
      name: 'Date',
      sortable: true,
      minWidth: '10rem',
      cell: (row) => (
        <>
          <span>
            {row.start_date !== undefined
              ? moment.unix(row.start_date).format('MM/DD/YYYY')
              : '--'}
          </span>
        </>
      )
    },
    {
      name: 'StartTime',
      sortable: false,
      selector: (row) => timeConvertToPmAm(row?.start_time || '--')
    },
    {
      name: 'EndTime',
      sortable: false,
      selector: (row) => timeConvertToPmAm(row?.end_time || '--')
    },
    {
      name: 'Client Name(s)',
      sortable: false,
      minWidth: '15rem',
      selector: (row) =>
        `${row?.clients[0]?.first_name || '--'} ${
          row?.clients[0]?.last_name || '--'
        }`
    },
    {
      name: 'Location',
      sortable: false,
      selector: (row) => row.provider_location?.name || '--',
      minWidth: '15rem'
    },
    {
      name: 'Status',
      sortable: false,
      cell: (row) => {
        return (
          <div className="d-f-between w-100Percent">
            <Badge
              color={appointmentStatusObj[row?.status]?.color}
              pill
              id={`pop-${row.id}`}
              className={
                appointmentStatusObj[row?.status].text !== 'Active'
                  ? 'cancelled-padding'
                  : 'active-padding active-booking-color'
              }
            >
              {appointmentStatusObj[row?.status].text}
            </Badge>
          </div>
        )
      }
    }
  ]
}
