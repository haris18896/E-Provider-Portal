/* eslint-disable no-unused-vars */
// ** Third Party Components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

import { CustomTooltip } from './chart-tooltip'
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import moment from 'moment'
// import moment from 'moment'

const ReportsBarChart = ({ rows }) => {
  const data = [
    {
      month: 'Jan',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Feb',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Mar',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Apr',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'May',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Jun',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Jul',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Aug',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Sep',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Oct',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Nov',
      ClientPayment: 0,
      InsurancePayments: 0
    },
    {
      month: 'Dec',
      ClientPayment: 0,
      InsurancePayments: 0
    }
  ]

  const sumByMonth = rows?.reduce((acc, { date_received, price }) => {
    const month = moment.unix(date_received).format('MMM')
    acc[month] = (acc[month] || 0) + parseInt(price)
    return acc
  }, {})

  const sumData = Object.keys(!!sumByMonth && sumByMonth).map((month) => ({
    month,
    ClientPayment: sumByMonth[month],
    InsurancePayments: 0
  }))
  
  const result = data.flatMap((month) =>  {
    const record = sumData.find((item) => item.month === month.month)
    return !!record ? [record] : [month]
 })

  const max = result.reduce(function (prev, current) {
    return prev.ClientPayment > current.ClientPayment ? prev : current
  })
  const count = Math.ceil(max.ClientPayment / 20)
  
  return (
    <Card>
      <CardHeader className="flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-sm-center align-items-start">
        <CardTitle tag="h4">Monthly Income</CardTitle>
      </CardHeader>

      <CardBody>
        <div className="recharts-wrapper bar-chart">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart height={400} data={result} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickCount={count} dataKey={"ClientPayment"} />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey="InsurancePayments" stackId="a" fill="#455470" />
              <Bar dataKey="ClientPayment" stackId="a" fill="#a9b583" />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  border: '1px solid #000',
                  width: 'fit-content',
                  borderRadius: '20px',
                  padding: '0.2rem 1.5rem ',
                  margin: 'auto',
                  position: 'relative'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default ReportsBarChart
