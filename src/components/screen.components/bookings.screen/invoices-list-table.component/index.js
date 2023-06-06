/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Badge, Table } from 'reactstrap'

const InvoicesListTable = ({ columns, idx }) => {
  const { getMonthInvoice, loading } = useSelector((state) => state.booking)
  const getAllInvoices = getMonthInvoice?.bookings

  // //**  Total Running Hours */
  const getBookingList = (bookingList) => {
    let result = []
    let total = 0
    bookingList &&
      bookingList.forEach((booking, i) => {
        let hours = 0
        let price = 0
        if (booking?.prices?.tier !== null) {
          hours += parseInt(booking?.prices?.hours)
        }
        price += parseInt(booking?.prices?.price)
        total += hours
        const data = {
          totalPrice: price,
          pricesHours: hours,
          totalHours: total,
          ...booking
        }
        result.push(data)
      })
    return result
  }
  const list = getBookingList(getAllInvoices)
  const totalHours = list.length > 0 && list[list.length - 1].totalHours

  // //**  Total Amount */
  const getTotalCharged = ({
    totalChargedBookings,
    promoCredit,
    etheraCredit
  }) => {
    if (
      Number(totalChargedBookings) >
      Number(promoCredit) + Number(etheraCredit)
    ) {
      const totalCharged =
        Number(totalChargedBookings) -
        (Number(promoCredit) + Number(etheraCredit))
      return totalCharged
    } else {
      return 0
    }
  }
  const totalCharged = getTotalCharged({
    totalChargedBookings: getMonthInvoice?.total_amount,
    promoCredit: getMonthInvoice?.applied_promo_credit,
    etheraCredit: getMonthInvoice?.applied_ethera_credit
  })

  return (
    <Table bordered responsive id={idx}>
      <thead className="bgThead">
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list?.map((item, i) => {
          return (
            <tr
              key={i}
              className="tableRow"
            >
              <td>{item.prices?.tier || '--'}</td>
              <td>{item.booking_number || '--'}</td>
              <td>
                {item.created_at !== undefined
                  ? moment.unix(item.created_at).format('MM/DD/YYYY')
                  : '--'}
              </td>
              <td>
                {item.start_date !== null
                  ? moment.unix(item.start_date).format('MM/DD/YYYY')
                  : '--'}
              </td>
              <td>
                {item.cancel_date !== null
                  ? moment.unix(item.cancel_date).format('MM/DD/YYYY')
                  : '--'}
              </td>
              <td>{item.location?.name || '--'}</td>
              <td>{item.room.name || '--'}</td>
              <td>${item.prices?.price || '0'}</td>
              <td>{item.prices?.hours || '0'} hours</td>
              <td>{parseFloat(item?.totalHours)} hours</td>
              <td>${item.room_cost || '--'}</td>
            </tr>
          )
        })}
        <tr className="borderLess-cell bgGray">
          <td colSpan={6}>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{totalHours || '--'} hour</td>
          <td>${getMonthInvoice?.total_amount.toFixed(2) || '0.00'}</td>
        </tr>
        <tr className="borderLess-cell bgGray">
          <td colSpan={6}>Promo Credit</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>${getMonthInvoice?.applied_promo_credit || '0.00'}</td>
        </tr>
        <tr className="borderLess-cell bgGray">
          <td colSpan={6}>Ethera Credit</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>${getMonthInvoice?.applied_ethera_credit || '0.00'}</td>
        </tr>
        <tr className="borderLess-cell bgGray">
          <td colSpan={6}>Total Charge</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style={{ whiteSpace: 'nowrap' }}>${totalCharged.toFixed(2)} </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default InvoicesListTable
