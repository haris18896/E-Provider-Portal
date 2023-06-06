import React from 'react'
import { Briefcase, Shield, Users } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

function ReportsCardsBottom() {
    const navigate = useNavigate()
  const reports = [
    // {
    //   title: 'Billing',
    //   icon: <Briefcase size={15} className="billing-icon" />,
    //   reportOne: 'Monthly Income',
    //   reportTwo: 'Invoice',
    //   reportThree: 'Payout'
    // },
    {
      title: 'Clients',
      icon: <Users size={15} className="billing-icon" />,
      reportOne: 'Client Details',
      reportTwo: 'Session Attendance'
    },
    {
      title: 'Insurance',
      icon: <Shield size={15} className="billing-icon" />,
      reportOne: 'Coverage Reports'
    }
  ]

  return (
    <Row className='pb-3'>
      <Col className="pt-1 mb-1 " lg={12}>
        <p className='fs-large mb-0_5'>Reports</p>
        <p>
          View detailed data on your practice's performance <a>Learn more</a>
        </p>
      </Col>
      {reports.map(({icon, title, reportOne, reportTwo, reportThree}, index) => (
        <Col sm={12} md={4} xl={3} key={index}>
          <div className="reports-box  py-2 mt-1">
            <div className="report-title-div">
              {icon}
              <span>{title}</span>
            </div>
            <div className="billing-btn px-2 ">
              <Button size="sm" className="mt-1 billing-income-btn " onClick={() => (reportOne === 'Monthly Income' ? navigate('/reports/monthly-income') : reportOne === 'Client Details' ? navigate('/reports/client-details-reports-list') : navigate('/reports/coverage-reports'))}>
                {reportOne}
              </Button>
              {reportTwo !== undefined ? (
                <Button size="sm" className="mt-1 billing-income-btn " onClick={() => (reportTwo === 'Invoice' ? navigate('/reports/invoice-list-reports') : navigate('/reports/session-attendance-report'))}>
                  {reportTwo}
                </Button>
              ) : null}
              {reportThree !== undefined ? (
                <Button size="sm" className="mt-1 billing-income-btn " onClick={() => reportThree === 'Payout' && navigate('/reports/reports-payout')}>
                  {reportThree}
                </Button>
              ) : null}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default ReportsCardsBottom
