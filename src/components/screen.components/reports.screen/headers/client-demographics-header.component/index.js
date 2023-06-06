import React, { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Button } from 'reactstrap'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import {
  EmploymentObj,
  genderObj,
  languageListObj,
  maritalStatusObj,
  raceAndEthnicityOptionsLabel
} from '../../../clients.screen/FormConstants'

function ClientDemographicsHeader({ rows }) {
  const navigate = useNavigate()
  const today = new Date()

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Contact', key: 'phone_number' },
    { label: 'Age', key: 'client_age' },
    { label: 'DOB', key: 'client_dob' },
    { label: 'Sex', key: 'client_gender' },
    { label: 'Gender ID', key: 'client_genderId' },
    { label: 'Race', key: 'client_race' },
    { label: 'Relationship', key: 'client_relationship' },
    { label: 'Employment', key: 'client_employment' },
    { label: 'Language', key: 'client_language' },
    { label: 'City', key: 'city' },
    { label: 'ZIP', key: 'zipcode' }
  ]

  const data = useMemo(() => {
    return rows?.map((row) => {
      return {
        name: `${row?.first_name || '--'} ${row?.last_name || '--'}`,
        phone_number: row?.phone_number || '--',
        client_age:
          row?.date_of_birth !== null
            ? moment(row?.date_of_birth).fromNow(true)
            : '--',
        client_dob:
          row?.date_of_birth !== null
            ? moment(row?.date_of_birth).format('MM/DD/YYYY')
            : '--',
        client_gender: genderObj[parseInt(row?.gender)]?.text || '--',
        client_genderId: row?.gender_identity || '--',
        client_race:
          raceAndEthnicityOptionsLabel[parseInt(row?.race)]?.label || '--',
        client_relationship:
          maritalStatusObj[parseInt(row?.relationship_status)]?.text || '--',
        client_employment:
          EmploymentObj[parseInt(row?.employment_status)]?.text || '--',
        client_language: languageListObj[row?.preferred_language]?.text || '--',
        city: row?.first_address_city || '--',
        zipcode: row?.first_address_zipcode || '--'
      }
    })
  }, [rows])

  return (
    <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
      <div className="page-header--title d-f-center">
        <Icon
          className="page-header--title__leftArrow"
          icon="bx:chevron-left"
          width="40"
          height="40"
          onClick={() => navigate(-1)}
        />
        <span className="heading-1">Client Demoghraphics</span>
      </div>
      {data && data.length > 0 && (
        <div className="page-header--export">
          <CSVLink
            data={data}
            headers={headers}
            className="text-decoration-none"
            filename={`Clients-list-${today}.csv`}
          >
            <Button size="sm " className="fs-x-small button-white pd">
              <Icon icon="dashicons:upload" width="15" height="15" />
              <span className="ml-5px">Export</span>
            </Button>
          </CSVLink>
        </div>
      )}
    </div>
  )
}

export default ClientDemographicsHeader
