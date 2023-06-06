import { Badge, Table } from "reactstrap"
import { useNavigate } from "react-router-dom"

import { StatusObj } from '@src/components/colors/BadgeColors'


const MonthlyInvoiceTable = ({ columns, rows }) => {
    const navigate = useNavigate()

  return (
    <Table bordered responsive>
      <thead className='bgThead'>
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, i) => {
          const status = item.status
          const color = StatusObj[status] ? StatusObj[status].color : "primary"

          return (
            <tr key={i} className="tableRow">
              <td style={{fontWeight: 'bold'}} onClick={() => navigate('/bookings/invoices-list')}>{item.date}</td>
              <td>#{item.invoiceNumber}</td>
              <td className='tableRow--status' >
                <Badge
                  color={color}
                >
                  {item.status}
                </Badge>
              </td>
              <td>${item.total}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default MonthlyInvoiceTable
