/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import classNames from 'classnames'

import { columns } from './table.data'
import { useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { Card, CardBody, Button, Table } from 'reactstrap'
import InvoicesListTable from '../../../components/screen.components/bookings.screen/invoices-list-table.component'
import { jsPDF } from 'jspdf'
import SpinnerComponent from '@spinner'

import 'jspdf-autotable'
import { useDispatch, useSelector } from 'react-redux'
import { getMonthlyInvoiceAction } from '../../../redux/booking/bookingAction'
import moment from 'moment'

const InvoicesList = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { getMonthInvoice, loading } = useSelector((state) => state.booking)
  const getProvider = getMonthInvoice?.provider
  const etheraCreditRow = getProvider?.etheracredit || []
  const promoCreditRow = getProvider?.promocredit || []

  //** Merge Two Arrays */
  const CreditArray = [...etheraCreditRow, ...promoCreditRow]
  //** Apply Sorting */
  const CreditMergeArray = CreditArray.sort((a, b) => a?.date - b.date)

  useEffect(() => {
    dispatch(getMonthlyInvoiceAction(id))
  }, [])

  //**  Generate PDF  */
  const handleGeneratePdf = () => {
    const unit = 'pt'
    const size = 'A4'
    const orientation = 'landscape'
    const increaseMargin = 120

    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(12)
    const pageSize = doc.internal.pageSize
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    let ETHERA_PAY = 'EtheraPay'
    let INVOICE_NUMBER = `Invoice ${getMonthInvoice?.invoice_number}`
    let PROVIDER_NAME = `${getProvider?.first_name} ${getProvider?.middle_name} ${getProvider?.last_name} `
    let DURATION = `${moment
      .unix(getMonthInvoice?.created_at)
      .format('MMMM, YYYY')}`
    doc.text(ETHERA_PAY, pageWidth / 2, 30, 'center')
    doc.text(INVOICE_NUMBER, pageWidth / 2, 55, 'center')
    doc.text(PROVIDER_NAME, pageWidth / 2, 80, 'center')
    doc.text(DURATION, pageWidth / 2, 105, 'center')

    doc.autoTable({
      headStyles: { fillColor: [254, 251, 244], textColor: [0, 3, 5] },
      startY: increaseMargin,
      // startY: (doc.lastAutoTable.finalY + 20, { margin: { top: 80 } }),
      html: '#invoice-list'
    })
    doc.autoTable({
      headStyles: { fillColor: [254, 251, 244], textColor: [0, 3, 5] },
      // startY: increaseMargin2,
      startY: (doc.lastAutoTable.finalY + 20, { margin: { top: 80 } }),
      html: '#invoice-list2'
    })

    doc.save(`Invoice_${moment().format('MMMYY')}`)
  }
  return (
    <div>
      <Card>
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
              <span className="heading-1">
                Invoice
                <span className="heading-3 mx-1 t-gray ">
                  {!loading &&
                    moment.unix(getMonthInvoice?.due_date).format('MMMM YYYY')}
                </span>
              </span>
            </div>

            <div className="page-header--export">
              <Button
                size="sm "
                className="fs-x-small button-white pd"
                onClick={handleGeneratePdf}
              >
                <Icon icon="dashicons:upload" width="15" height="15" />
                <span className="ml-5px">Export</span>
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <SpinnerComponent />
        ) : (
          <CardBody style={{ paddingLeft: 0, paddingRight: 0 }}>
            <InvoicesListTable columns={columns} idx="invoice-list" />

            <div className="m-2">
              <Card className="card-transaction maxWidth-cardBalance">
                <div className="mt-3 mb-3">
                  <span className="p-1 creditBalance-invoiceList" tag="h4">
                    <strong>
                      <Icon icon="fa6-solid:wallet" className="mx-1" />
                      Credit Balance
                    </strong>
                  </span>
                </div>
                <hr className="m-0 dividerTop" />
                <table id="invoice-list2">
                  <thead>
                    <tr
                      className={classNames({
                        'transaction-item px-3': true
                      })}
                    >
                      <th className="transaction-title">
                        Opening Credit Balance
                      </th>
                      <th></th>
                      <th>${getMonthInvoice?.provider_open_credit}</th>
                    </tr>
                    <tr
                      className={classNames({
                        'transaction-item px-3 ': true
                      })}
                    >
                      <th>Add Credit</th>
                    </tr>
                    <tr
                      className={classNames({
                        'justify-content-between align-items-center d-flex px-3 bg-white border-bottom': true
                      })}
                    >
                      <th className="transaction-title">Date</th>
                      <th className="transaction-title">Notes</th>
                      <th className="transaction-title">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CreditMergeArray?.map((item, i) => {
                      return (
                        <tr
                          className={classNames({
                            'transaction-item px-3 bg-white': true
                          })}
                          key={i}
                        >
                          <td>
                            {item?.date !== undefined
                              ? moment.unix(item?.date).format('MM/DD/YYYY')
                              : '--'}
                          </td>

                          <td className="max-width">{item?.notes || ''}</td>
                          <td>$ {item?.amount || 0}</td>
                        </tr>
                      )
                    })}

                    <tr
                      className={classNames({
                        'transaction-item px-3': true
                      })}
                    >
                      <td className="transaction-title bold">Credit Applied</td>
                      <td></td>
                      <td className="bold">$ 0</td>
                    </tr>
                    <tr
                      className={classNames({
                        'transaction-item px-3 bgGray': true
                      })}
                    >
                      <td className="transaction-title">
                        Total Credit Balance
                      </td>
                      <td></td>
                      <td>$0 </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  )
}

export default InvoicesList
