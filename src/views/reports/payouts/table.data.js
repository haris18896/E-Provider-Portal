import moment from 'moment'
import { Badge } from 'reactstrap'
import { StatusObj } from '@src/components/colors/BadgeColors'

export const columns = [
  {
    name: '',
    sortable: false,
    cell: (row) => {
      return <span className="link">{row.transaction}</span>
    }
  },
  {
    name: 'Status',
    sortable: false,
    cell: (row) => (
      <Badge color={StatusObj[row.status].color} pill>
        PAID
      </Badge>
    )
  },
  {
    name: 'Bank/Card',
    sortable: false,

    cell: (row) => {
      return <span>{row.bank}</span>
    },
    minWidth: '20rem'
  },

  {
    name: 'Description',
    sortable: false,
    cell: (row) => {
      return <span>{row.description}</span>
    }
  },

  {
    name: 'Date',
    sortable: true,
    cell: (row) => {
      return (
        <>
          <span>{moment(row.date).format('MM/DD/YYYY')}</span>
        </>
      )
    }
  },

  {
    name: 'Amount',
    sortable: false,
    cell: (row) => {
      return (
        <>
          <span className="fw-bold">$ {row.amount} </span> USD
        </>
      )
    }
  }
]
export const rows = [
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  },
  {
    transaction: 'Transaction',
    status: '1',
    bank: 'JPMORGHAN CHASE BANK, NA',
    description: 'Stripe Payout',
    date: 'October 20, 1996',
    amount: 547.11
  }
]
