/* eslint-disable no-unused-vars */
import React from 'react'

// hooks
import useMediaQuery from '@hooks/useMediaQuery'

// third Party components
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { Button, Label } from 'reactstrap'
import { Calendar, FilePlus } from 'react-feather'

// import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'

// components
import SelectField from '@select'
import { statusList } from './constants'
import { usersList } from '../../appointments.screen/headers/constants'
export const BookingsSelector = ({
  user,
  status,
  location,
  startDate,
  endDate,
  locationsList,
  dateHandler,
  onChangeHandler
}) => {
  const navigate = useNavigate()

  const tablet = useMediaQuery('(min-width: 700px')

  return (
    <>
      <div className="p-1 bg-yellow">
        <div className="bookings-header xSmall-up-between">
          <div className="bookings-header--left">
            <div
              className="AppointmentSelectors_left-dates bookings-header--left__calendar d-f-center skin-change "
              // onClick={() => navigate('/bookings/monthly-invoices')}
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

            <Button
              className="button-white pd-s white-space"
              onClick={() => navigate('/bookings/monthly-invoices')}
            >
              <FilePlus size={15} />
              <span className="px-1 fwl">View Invoices</span>
            </Button>
          </div>

          <div className="bookings-header--selects">
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
              placeholder="Location"
              controlMinWidth="170px"
              wd={tablet && '100%'}
              value={location}
              data={locationsList}
              onChange={(e) => onChangeHandler('location', e)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
