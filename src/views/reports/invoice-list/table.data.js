/* eslint-disable no-unused-vars */
import moment from 'moment'
import { Badge } from 'reactstrap'
import { StatusObj } from '@src/components/colors/BadgeColors'

export const columns = [
  {
    name: 'Invoice Date',
    sortable: true,
    cell: (row) => {
      return (
        <>
          <span>{moment(row.invoiceDate).format('MM/DD/YYYY')}</span>
        </>
      )
    }
  },
  {
    name: 'Primary Clinician',
    sortable: false,
    cell: (row) => {
      return <span>{row.primaryClinician}</span>
    },
    minWidth: '15rem'
  },
  {
    name: 'Secondary Clinician',
    sortable: false,

    cell: (row) => {
      return <span className="link underline">{row.secondaryClinician}</span>
    },
    minWidth: '20rem'
  },

  {
    name: 'Invoice Number',
    sortable: false,
    cell: (row) => {
      return <span># {row.invoiceNumber}</span>
    }
  },
  {
    name: 'Status',
    sortable: false,
    cell: (row) => (
      <Badge color="light-success" pill>
        PAID
      </Badge>
    )
  },

  {
    name: 'Total Amount',
    sortable: false,
    cell: (row) => {
      return <span>$ {row.totalAmount}</span>
    }
  }
]

export const rows = [
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'Brian Siemen',
    invoiceNumber: '7',
    status: 1,
    totalAmount: 100
  },
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'Brian Siemen',
    invoiceNumber: '6',
    status: 'un1',
    totalAmount: 100
  },
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'jamie Sullivian & Hillary Horner',
    invoiceNumber: '5',
    status: 1,
    totalAmount: 100
  },
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'George klock',
    invoiceNumber: '4',
    status: 1,
    totalAmount: 100
  },
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'Brian Siemen',
    invoiceNumber: '3',
    status: 1,
    totalAmount: 100
  },
  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'Brian Siemen',
    invoiceNumber: '2',
    status: 1,
    totalAmount: 100
  },

  {
    invoiceDate: '07/05/2022',
    primaryClinician: 'Paule George',
    secondaryClinician: 'Brian Siemen',
    invoiceNumber: 1,
    status: 1,
    totalAmount: 100
  }
]
