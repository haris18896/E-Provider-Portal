import moment from "moment"


export const columns = [
  {
    name: 'Date',
    sortable: true,
    cell: (row) => {
      return (
        <>
          <span>{moment(row.date).format('MM/DD/YYYY')}</span>
        </>
      )
    },
    minWidth: "34rem"
  },
  {
    name: 'Client Payments',
    sortable: false,
    cell: (row) => {
        return <span>$ {row.clientPayment || "--"}</span>
      }
  },
  {
    name: 'Insurance Payments',
    sortable: false,
    cell: (row) => {
      return <span>$ {row.insurancePayment || "--"}</span>
    }
  },

  {
    name: 'Total',
    sortable: false,
    cell: (row) => {
        return <span>$ {row.total || "--"}</span>
      }
  }
]

export const rows = [
  {
    date: 'July 2022',
    clientPayment: 100,
    insurancePayment: 450,
    total: 550
  },
  {
    date: 'June 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  },
  {
    date: 'May 2022',
    clientPayment: 250,
    insurancePayment: 450,
    total: 700
  },
  {
    date: 'April 2022',
    clientPayment: 150,
    insurancePayment: 150,
    total: 300
  },
  {
    date: 'March 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  },
  {
    date: 'February 2022',
    clientPayment: 1200,
    insurancePayment: 650,
    total: 1850
  },
  {
    date: 'january 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  },
  {
    date: 'July 2022',
    clientPayment: 100,
    insurancePayment: 450,
    total: 550
  },
  {
    date: 'June 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  },
  {
    date: 'May 2022',
    clientPayment: 250,
    insurancePayment: 450,
    total: 700
  },
  {
    date: 'April 2022',
    clientPayment: 150,
    insurancePayment: 150,
    total: 300
  },
  {
    date: 'March 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  },
  {
    date: 'February 2022',
    clientPayment: 1200,
    insurancePayment: 650,
    total: 1850
  },
  {
    date: 'january 2022',
    clientPayment: null,
    insurancePayment: null,
    total: null
  }
]
