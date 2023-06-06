/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Button, Card, CardBody, CardHeader, Col } from 'reactstrap'
// components
import SelectField from '@select'
import { Role } from './constants'
import ReportsBarChart from '@ScreenComponent/reports.screen/reports-bar-chart.component'
import ReportHeader from '@ScreenComponent/reports.screen/headers/reports-header-card.component'
import ReportsCardsBottom from '@ScreenComponent/reports.screen/reports-bottom-cards.components'

import '@styles/react/libs/charts/recharts.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllReportsAction,
  getClientPaymentAction
} from '../../redux/reports/reportsAction'

function Reports() {
  const { colors } = useContext(ThemeColors)
  const [role, setRole] = useState('ALL')

  const {getClientPayment} = useSelector((state) => state.reports)
  const rows = getClientPayment?.result
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getClientPaymentAction())
    dispatch(getAllReportsAction())
  }, [])


  return (
    <>
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
          <div className="page-header--title">
            <span className="heading-1">Report</span>
          </div>
          <div className="page-header--buttons_right">
            {/* <SelectField
              header
              controlMinWidth="180px"
              value={Role[0]}
              data={Role}
              change={(e) => setRole(e.value)}
            /> */}

            <div className="mx-5px">
              <Button size="sm " className="fs-x-small button-white pd">
                <Icon icon="mingcute:upload-2-fill" width="15" height="15" />
                <span className="ml-5px">Export</span>
              </Button>
            </div>
          </div>
        </div>

        <CardHeader className="header-bgColor pt-0 skin-change">
          <Col lg={10}>
            <ReportHeader />
          </Col>
        </CardHeader>
        <CardBody>
          <Col sm="12">
            <ReportsBarChart primary={colors.primary.main} rows={rows}/>
          </Col>
        </CardBody>
        <hr style={{ marginTop: '50px' }} />
        <div className="px-2">
          <ReportsCardsBottom />
        </div>
      </Card>
    </>
  )
}

export default Reports
