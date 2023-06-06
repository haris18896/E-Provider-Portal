import { Badge, Table } from 'reactstrap'

import { Popup } from '../../../popover'
import BookingPopForm from './BookingPopForm'

import { StatusObj } from '@src/components/colors/BadgeColors'
import moment from 'moment'

const BookingsListTable = ({ columns, rows }) => {

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
          const status = item.status
          const color = StatusObj[status] ? StatusObj[status].color : 'primary'

          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td>{item.location}</td>
              <td>{item.space.join(', ')}</td>
              <td>{moment(`${item.date}`).format('MM/DD/YYYY')}</td>
              <td>{item.bookingStart}</td>
              <td>{item.bookingEnd}</td>
              <td
                className="tableRow--status"
              >
                <>
                  <Badge id={`pop-${index}`} color={color}>
                    {item.status}
                  </Badge>
                  <Popup
                    event={`Appointment ${item.status}`}
                    target={`pop-${index}`}
                    body={<BookingPopForm />}
                    popoverClassName="popover-scroll"
                  />
                </>
              </td>
              <td>{item.clientName}</td>
              <td>{item.price}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default BookingsListTable
