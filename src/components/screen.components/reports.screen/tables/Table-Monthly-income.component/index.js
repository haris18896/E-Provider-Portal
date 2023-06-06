import { Table } from 'reactstrap'

import useMediaQuery from '@src/utility/hooks/useMediaQuery'

const MonthlyIncomeReportTable = ({ rows }) => {
  const tablet = useMediaQuery('(min-width: 800px)')

  return (
    <Table bordered responsive>
      <thead className="bgThead">
        <tr>
          <th style={{ borderRight: 'none' }}>Date</th>
          {tablet && (
            <>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
              <th style={{ border: 'none' }}></th>
            </>
          )}

          <th className='text-align-right'>Client payments</th>
          <th className='text-align-right'>Insurance payments</th>
          <th className='text-align-right'>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr
              key={index}
              className="tableRow"
            >
              <td className='f-bold t-black' colSpan={tablet && 7}>
                {item.date}
              </td>
              <td className='text-align-right' >$ {item.clientPayment || '--'}</td>
              <td className='text-align-right' >$ {item.insurancePayment || '--'}</td>
              <td className='text-align-right' >$ {item.total || '--'}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default MonthlyIncomeReportTable
