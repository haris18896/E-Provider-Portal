/* eslint-disable no-confusing-arrow */
import classNames from 'classnames'
import moment from 'moment'
import {
  EmploymentObj,
  genderObj,
  languageListObj,
  maritalStatusObj,
  raceAndEthnicityOptionsLabel
} from '../../../components/screen.components/clients.screen/FormConstants'

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
    name: 'Contact',
    sortable: false,
    cell: (row) => row?.phone_number || '--',
    minWidth: '11rem'
  },
  {
    name: 'Age',
    sortable: false,
    cell: (row) => row?.date_of_birth !== null ? moment(row?.date_of_birth).fromNow(true) : '--'
  },
  {
    name: 'DOB',
    sortable: false,

    cell: (row) => (
      <>
        <span>
          {row?.date_of_birth !== null
            ? moment(row?.date_of_birth).format('MM/DD/YYYY')
            : '--'}
        </span>
      </>
    ),
    minWidth: '10rem'
  },

  {
    name: 'Sex',
    sortable: false,
    cell: (row) => genderObj[parseInt(row?.gender)]?.text || '--'
  },
  {
    name: 'Gender ID',
    sortable: false,
    minWidth: '15rem',
    cell: (row) => row?.gender_identity || '--'
  },
  {
    name: 'Race',
    sortable: false,
    minWidth: '15rem',
    cell: (row) =>
      raceAndEthnicityOptionsLabel[parseInt(row?.race)]?.label || '--'
  },
  {
    name: 'Relationship',
    sortable: false,
    cell: (row) =>
      maritalStatusObj[parseInt(row?.relationship_status)]?.text || '--'
  },
  {
    name: 'Employment',
    sortable: false,
    minWidth:"10rem",
    cell: (row) => EmploymentObj[parseInt(row?.employment_status)]?.text || '--'
  },
  {
    name: 'Language',
    sortable: false,
    minWidth:"10rem",

    cell: (row) => languageListObj[row?.preferred_language]?.text || '--'
  },
  {
    name: 'City',
    sortable: false,
    minWidth:"10rem",

    cell: (row) => row.first_address_city || '--'
  },
  {
    name: 'ZIP',
    sortable: false,
    cell: (row) => row.first_address_zipcode || '--'
  }
]
