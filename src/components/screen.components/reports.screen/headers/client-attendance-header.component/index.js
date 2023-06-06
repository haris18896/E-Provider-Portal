import React, { useMemo } from 'react'
import { Icon } from '@iconify/react'

import { Calendar } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Button, Label } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import { CSVLink } from 'react-csv'

function ClientAttendanceHeader({
  onDateChangeHandler,
  startDate,
  endDate,
  rows
}) {
  const navigate = useNavigate()
  const today = new Date()

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Show', key: 'show' },
    { label: 'Cancelled', key: 'Cancelled' },
    { label: 'Late Cancelled', key: 'late_cancelled' },
    { label: 'No Show', key: 'no_show' }
  ]

  const data = useMemo(() => {
    return rows?.map((row) => {
      return {
        name: `${row.client?.first_name} ${row.client?.last_name}`,
        show: row?.status['1'] || '0',
        Cancelled: row?.status['3'] || '0',
        late_cancelled: row?.status['4'] || '0',
        no_show: row?.status['2'] || '0'
      }
    })
  }, [rows])

  return (
    <div className="pt-3 p-2 bg-yellow">
      <div className="page-header xSmall-up-between">
        <div className="page-header--title d-f-center">
          <Icon
            className="page-header--title__leftArrow"
            icon="bx:chevron-left"
            width="40"
            height="40"
            onClick={() => navigate(-1)}
          />
          <span className="heading-1">Attendance</span>
        </div>
        {data && data.length > 0 && (
          <div className="page-header--export">
            <CSVLink
              data={data}
              headers={headers}
              className="text-decoration-none"
              filename={`Attendance-list-${today}.csv`}
            >
              <Button size="sm " className="button-white pd">
                <Icon icon="mingcute:upload-2-fill" width="15" height="15" />
                <span className="ml-5px">Export</span>
              </Button>
            </CSVLink>
          </div>
        )}
      </div>

      <div className="AppointmentSelectors_left-dates page-header--bottom_date d-f-center mt-1 skin-change">
        <Flatpickr
          id="datePicker"
          name="datePicker"
          // value={dateTimeFilter}
          className="form-control datePicker-non-visible"
          onChange={onDateChangeHandler}
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

export default ClientAttendanceHeader
