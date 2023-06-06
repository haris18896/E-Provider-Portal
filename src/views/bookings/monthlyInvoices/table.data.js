import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Badge } from 'reactstrap'
import {
  billingObj,
  billingObjText
} from '../../../components/colors/BadgeColors'
export const columns = [
  {
    name: 'Date',
    sortable: true,
    minWidth: '10rem',
    cell: (row) => {
      const navigate = useNavigate()
      return (
        <>
          <span onClick={() => navigate(`/bookings/invoices-list/${row?.id}`)}>
            {row?.due_date !== undefined
              ? moment.unix(row?.due_date).format('MMMM, YYYY')
              : '--'}
          </span>
        </>
      )
    }
  },
  {
    name: 'Invoice Number',
    sortable: false,
    minWidth: '12rem',
    cell: (row) => {
      const navigate = useNavigate()
      const month =  moment.unix(row?.due_date).format('MMMM')
      return (
        <span
          className="link pointer"
          onClick={() => navigate(`/bookings/invoices-list/${row?.id}/${month}`)}
        >
          # {row?.invoice_number || '--'}
        </span>
      )
    }
  },
  {
    name: 'Status',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-f-between w-100Percent">
          <Badge
            pill
            color={billingObj[row?.status]?.color}
            id={`pop-${row.id}`}
          >
            {billingObjText[row.status]?.text}
          </Badge>
        </div>
      )
    }
  },

  {
    name: 'Total',
    sortable: false,
    cell: (row) => (
      <>
        <span> $ {row?.total_amount.toFixed(2) || 0}</span>
      </>
    )
  }
]
