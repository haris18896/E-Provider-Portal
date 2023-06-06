import React, { useState } from 'react'
// import { useSkin } from '@src/utility/hooks/useSkin'

import { Calendar } from 'react-feather'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { Button, Label } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'


function MonthlyIncomeHeader() {
  // const { skin } = useSkin()
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState('09/23/2022')
  const [endDate, setEndDate] = useState('10/24/2022')
  const [dateTimeFilter, setDateTimeFilter] = useState('')

  const onDateChangeHandler = (dates) => {
    if (dates.length === 1) {
      setStartDate(dates[0])
      setDateTimeFilter('')
    }
    if (dates.length === 2) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }

  return (
    <>
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
            <span className="heading-1">Income Report</span>
          </div>

          <div className="page-header--export">
            <Button size="sm " className="fs-x-small button-white pd">
              <Icon icon="dashicons:upload" width="15" height="15" />
              <span className="ml-5px">Export</span>
            </Button>
          </div>
        </div>

        <div
          className="AppointmentSelectors_left-dates page-header--bottom_date d-f-center mt-1 skin-change"
        >
          <Flatpickr
            id="datePicker"
            name="datePicker"
            value={dateTimeFilter}
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
    </>
  )
}

export default MonthlyIncomeHeader
