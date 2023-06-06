import React, { useMemo } from 'react'
// components
import AppointmentStats from '../../../../views/bookings/stats.component'
import useMediaQuery from '@hooks/useMediaQuery'

// third party
import classNames from 'classnames'
import { Row, Col } from 'reactstrap'
import { Upload } from 'react-feather'
import { StatusObjText } from '../../../colors/BadgeColors'
import { timeConvertToPmAm } from '../../../../utility/Utils'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { useSelector } from 'react-redux'

export function BookingsHeader({ rows, TotalPriceOfMonth }) {
  const today = new Date()

  const { getProvider } = useSelector((state) => state.providerDetail)

  const headers = [
    { label: 'Location', key: 'location' },
    { label: 'Space', key: 'room' },
    { label: 'Date', key: 'Date' },
    { label: 'Start Time', key: 'start_time' },
    { label: 'End Time', key: 'end_time' },
    { label: 'Status', key: 'status' },
    { label: 'Client Name(s)', key: 'client' },
    { label: 'Price', key: 'price' }
  ]

  const data = useMemo(() => {
    return rows.map((row) => {
      return {
        location: row?.booking.location?.name || '--',
        room: row?.booking.room?.name || '--',
        Date:
          moment.unix(row?.booking?.start_date).format('MM/DD/YYYY') || '--',
        start_time: timeConvertToPmAm(row?.booking?.start_time) || '--',
        end_time: timeConvertToPmAm(row?.booking?.end_time) || '--',
        status: StatusObjText[row?.booking.status].text || '--',
        client: `${row.clients[0]?.first_name || '--'} ${
          row.clients[0]?.last_name || '--'
        }`,
        price: row?.booking.room_cost || '--'
      }
    })
  }, [rows])

  const MedScreen = useMediaQuery('(min-width: 992px)')

  return (
    <>
      <Row className="pt-1 m-1 mb-0 justify-content-between align-items-center">
        <Col sm={12} md={9} className="p-0">
          <Row>
            <Col sm={6} md={4} lg={3} className="p-0">
              <AppointmentStats
                name="This Months's Balance"
                stat={TotalPriceOfMonth.toFixed(2)}
                bg={{ backgroundColor: '#e5e3d7' }}
              />
            </Col>
            <Col sm={6} md={4} lg={3} className="p-0">
              <AppointmentStats
                name="Ethera Credit"
                stat={getProvider?.ethera_credit || '0.00'}
                bg={{ backgroundColor: '#f5f5f5' }}
              />
            </Col>
            <Col sm={6} md={4} lg={3} className="p-0">
              <AppointmentStats
                name="Promo Credit"
                stat={getProvider?.promo_credit || '0.00'}
                bg={{ backgroundColor: '#f5f5f5' }}
              />
            </Col>
            <Col sm={6} md={4} lg={3} className="p-0">
              <AppointmentStats
                remaining
                name="Remaining Cancellation"
                stat={getProvider?.cancelation_balance || '0.00'}
                bg={{ backgroundColor: '#f5f5f5' }}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={6} md={4} lg={2} className="p-0">
          {data && data.length > 0 && (
            <CSVLink
              data={data}
              headers={headers}
              className="text-decoration-none"
              filename={`Bookings-list-${moment(today).format('MMM')}.csv`}
            >
              <div
                className={classNames({
                  'd-flex appointments-export align-items-center justify-content-center skin-change bg-invert black-color': true,
                  marginLeftAuto: MedScreen
                })}
              >
                <Upload size={15} />
                <p>Export</p>
              </div>
            </CSVLink>
          )}
        </Col>
      </Row>
    </>
  )
}
