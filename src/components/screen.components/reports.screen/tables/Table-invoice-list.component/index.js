import { Badge, Table } from "reactstrap"

import { StatusObj } from '@src/components/colors/BadgeColors'

const InvoiceListReportsTable = ({ columns, rows }) => {

  return (
    <Table bordered responsive>
      <thead
        className='bgThead'
      >
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          const status = item.status
          const color = StatusObj[status] ? StatusObj[status].color : "primary"

          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td>{item.invoiceDate}</td>
              <td>{item.primaryClinician}</td>
              <td><a href='#' className='link underline'>{item.secondaryClinician}</a></td>
              <td># {item.invoiceNumber}</td>
              <td
                className="tableRow--status"
                }
              >
                <>
                  <Badge id={`pop-${index}`} color={color}>
                    {item.status}
                  </Badge>
                  {/* <Popup
                    event={`Appointment ${item.status}`}
                    target={`pop-${index}`}
                    body={<BookingPopForm />}
                  /> */}
                </>
              </td>
              <td>$ {item.totalAmount}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default InvoiceListReportsTable
