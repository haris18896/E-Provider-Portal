/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'
// hooks
import useMediaQuery from '@hooks/useMediaQuery'
// third Party components
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import { Button, Label } from 'reactstrap'
// ** CSV Export
import { CSVLink } from 'react-csv'

// components
import SelectField from '@select'
import { usersList, statusList } from './constants'
import { appointmentStatusObj } from '../../../colors/BadgeColors'
import { timeConvertToPmAm } from '../../../../utility/Utils'

export default function AppointmentsSelectors({
  user,
  rows,
  status,
  location,
  startDate,
  endDate,
  locationsList,
  dateHandler,
  onChangeHandler
}) {
  const today = new Date()

  const headers = [
    { label: 'Date', key: 'Date' },
    { label: 'Start Time', key: 'start_time' },
    { label: 'End Time', key: 'end_time' },
    { label: 'Client Name(s)', key: 'client' },
    { label: 'Location', key: 'location' },
    { label: 'Status', key: 'status' }
  ]

  const data = useMemo(() => {
    return rows.map((row) => {
      return {
        Date:
          row?.start_date !== undefined || row?.start_date !== undefined
            ? moment.unix(row?.start_date).format('MM/DD/YYYY')
            : '--',

        start_time: timeConvertToPmAm(row?.start_time || '--'),
        end_time: timeConvertToPmAm(row?.end_time || '--'),
        client: `${row?.clients[0]?.first_name || '--'} ${
          row?.clients[0]?.last_name || '--'
        }`,
        location: row.provider_location?.name || '--',
        status: appointmentStatusObj[row.status].text || '--'
      }
    })
  }, [rows])

  const tablet = useMediaQuery('(min-width: 700px')

  return (
    <>
      <div className="pt-3 p-2 bg-yellow">
        <div className="appointment-header xSmall-up-between">
          <div
            className={classNames({
              'AppointmentSelectors_left-dates appointment-header--bottom_date d-f-center skin-change white-space': true,
              'mx-1': tablet
            })}
          >
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
                {moment(startDate).format('MMM DD YYYY')} -{' '}
                {moment(endDate).format('MMM DD YYYY')}
              </span>
            </Label>
          </div>

          <div className="appointment-header--selects">
            {/* <SelectField
              header
              search={false}
              placeholder="User"
              controlMinWidth="170px"
              wd={tablet && '100%'}
              value={user}
              data={usersList}
              onChange={(e) => onChangeHandler('user', e)}
            /> */}

            <SelectField
              header
              search={false}
              placeholder="Status"
              controlMinWidth="170px"
              wd={tablet && '100%'}
              value={status}
              data={statusList}
              onChange={(e) => onChangeHandler('status', e)}
            />

            <SelectField
              header
              search={false}
              menuHeight="20rem"
              placeholder="Location"
              controlMinWidth="170px"
              wd={tablet && '100%'}
              value={location}
              data={locationsList}
              onChange={(e) => onChangeHandler('location', e)}
            />

            <div className="appointment-header--selects__button">
              <CSVLink
                data={data}
                headers={headers}
                className="text-decoration-none"
                filename={`Appointments-list-${today}.csv`}
              >
                <Button
                  size="sm "
                  className="fs-x-small button-white pd-s w-100"
                >
                  <Icon icon="dashicons:upload" width="15" height="15" />
                  <span className="ml-5px">Export</span>
                </Button>
              </CSVLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
