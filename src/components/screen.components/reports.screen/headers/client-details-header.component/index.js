/* eslint-disable no-unused-vars */
import moment from 'moment'
import { Button, Label } from 'reactstrap'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { CSVLink } from 'react-csv'

// components
import SelectField from '@select'
import { useMemo } from 'react'
import { clientStatusList } from '../../../clients.screen/FormConstants'

function ClientDetailsHeader({
  rows,
  status,
  startDate,
  endDate,
  dateHandler,
  onChangeHandler
}) {
  const navigate = useNavigate()
  const today = new Date()

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Client Type', key: 'client_type' },
    { label: 'Start Date', key: 'date_started' },
    { label: 'Last Appointment', key: 'latest_appointment' },
    { label: 'Address', key: 'address' },
    { label: 'City', key: 'city' },
    { label: 'State', key: 'state' },
    { label: 'ZIP', key: 'zipcode' },
    { label: 'Phone', key: 'phone_number' },
    { label: 'Email', key: 'email' },
    { label: 'Insurance', key: 'insurance' },
    { label: ' Insurance ID', key: 'insurance_id' }
  ]

  const data = useMemo(() => {
    return rows?.map((row) => {
      return {
        name: `${row?.first_name || '--'} ${row?.last_name || '--'}`,
        client_type: row?.client_type || '--',
        date_started:
          row?.date_started !== null
            ? moment(row?.date_started).format('MM/DD/YYYY')
            : '--',
        latest_appointment:
          row?.latest_appointment !== null
            ? moment.unix(row?.latest_appointment).format('MM/DD/YYYY')
            : '--',
        address: row?.first_address_address || '--',
        city: row?.first_address_city || '--',
        state: row?.first_address_state || '--',
        zipcode: row?.first_address_zipcode || '--',
        phone_number: row?.phone_number || '--',
        email: row?.email || '--',
        insurance: row?.insurance || '--',
        insurance_id: row?.insurance_id || '--'
      }
    })
  }, [rows])

  return (
    <div className="pt-3 p-2 bg-yellow">
      <div className="page-header xSmall-up-between">
        <div className="page-header--title d-f-center mb-1">
          <Icon
            className="page-header--title__leftArrow"
            icon="bx:chevron-left"
            width="40"
            height="40"
            onClick={() => navigate(-1)}
          />
          <span className="heading-1">Client Details</span>
        </div>

        <div className="page-header--buttons_right">
          <SelectField
            header
            controlMinWidth="180px"
            placeholder="Status"
            value={status}
            data={clientStatusList}
            onChange={(e) => onChangeHandler('status', e)}
          />
          {data && data.length > 0 && (
            <CSVLink
              data={data}
              headers={headers}
              className="text-decoration-none"
              filename={`Clients-list-${today}.csv`}
            >
              <Button className="button-white pd mb-1">
                <Icon icon="dashicons:upload" width="15" height="15" />
                <span className="ml-5px">Export</span>
              </Button>
            </CSVLink>
          )}
        </div>
      </div>

      <div className="AppointmentSelectors_left-dates page-header--bottom_date d-f-center skin-change mb-1">
        <Flatpickr
          id="datePicker"
          name="datePicker"
          // value={dateTimeFilter}
          className="form-control datePicker-non-visible"
          onChange={dateHandler}
          options={{
            mode: 'range',
            enableTime: false,
            dateFormat: 'F j, Y'
          }}
        />
        <Label htmlFor="datePicker" className="mb-0 pointer">
          <Calendar size={20} color="#fff" />
          <strong className="fs-s-med">From : </strong>
          <span>
            {moment(startDate).format('MMM YYYY')} -{' '}
            {moment(endDate).format('MMM YYYY')}
          </span>
        </Label>
      </div>
    </div>
  )
}

export default ClientDetailsHeader
