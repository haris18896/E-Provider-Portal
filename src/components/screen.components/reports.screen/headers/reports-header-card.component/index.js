/* eslint-disable multiline-ternary */
/* eslint-disable comma-dangle */
import React from 'react'

import { Icon } from '@iconify/react'
import { Col, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import moment from 'moment'

const ReportHeader = () => {
  const { getReports } = useSelector((state) => state.reports)
  const currentDate = moment()
  const nextMonth = moment(currentDate).add(1, 'month')
  const reportData = [
    {
      id: 1,
      heading: 'YTD Income',
      price: `$ ${getReports?.ytd_income?.price__sum || '0'}`,
      appointment: `${getReports?.ytd_appointment || '0'} Appointment`,
      client: `${getReports?.ytd_clients || '0'} Client`
    },
    {
      id: 2,
      heading: `Income From ${moment().format('MMMM YYYY')}`,
      price: `$ ${getReports?.current_income?.fees__sum || '0'}`,
      appointment: `${getReports?.current_appointment || '0'} Appointment`,
      client: `${getReports?.current_clients || '0'} Client`
    },
    {
      id: 3,
      heading: `Projected Income for ${moment(nextMonth).format('MMMM YYYY')}`,
      price: `$ ${getReports?.next_month_income?.fees__sum || '0'}`,
      appointment: `${getReports?.next_month_appointment || '0'} Appointment`,
      client: `${getReports?.next_month_clients || '0'} Client`
    }
  ]
  return (
    <>
      <Row>
        {reportData?.map(({ id, heading, price, appointment, client }, i) => (
          <Col lg={4} key={i}>
            <ListGroup className="report-card skin-change" flush>
              <ListGroupItem
                className={
                  id === 1
                    ? 'report-YTD-head report-heading'
                    : id === 2
                    ? 'report-income-head report-heading'
                    : id === 3
                    ? 'report-project-head report-heading'
                    : 'hlooo'
                }
              >
                <p className="fs-small mb-0">{heading}</p>
                <h3 className="fs-xx-large f-bold mb-0">{price} </h3>
              </ListGroupItem>
              <ListGroupItem className="d-flex report-icons-head">
                <div className="me-1 report-icons-head--icons">
                  <span className="report-icons">
                    <Icon
                      icon="fa6-regular:calendar-check"
                      width="20"
                      height="20"
                    />
                  </span>
                  <span className="fs-small"> {appointment} </span>
                </div>
                {client !== undefined ? (
                  <div>
                    <span className="report-icons">
                      <Icon icon="heroicons:users" width="20" height="20" />
                    </span>
                    <span className="fs-small"> {client} </span>
                  </div>
                ) : null}
              </ListGroupItem>
            </ListGroup>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default ReportHeader
