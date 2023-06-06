/* eslint-disable no-unused-vars */
import moment from 'moment'
import { useState } from 'react'
import {
  Badge,
  Button,
  List,
  PopoverBody,
  UncontrolledPopover
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Edit2, FileText, CheckCircle, Info } from 'react-feather'
import { getClientBillingAction } from '../../../../redux/client/clientAction'
import { getAllServiceAction } from '../../../../redux/setting/billing/service/serviceAction'
import Modal from '../../../../components/screen.components/clients.screen/tables/table-client-billing/modal'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import classNames from 'classnames'

const clientStatusObjText = {
  0: { text: 'Paid' },
  1: { text: 'Unpaid' },
  2: { text: 'Void' }
}
const StatusObj = {
  0: { color: 'light-success', icon: CheckCircle },
  1: { color: 'light-danger', icon: CheckCircle },
  2: { color: 'light-secondary', icon: Info }
}
export const columns = [
  {
    name: 'Date',
    sortable: true,
    minWidth: '10rem',
    cell: (row) => (
      <>
        <span>
          {row?.created_at !== null
            ? moment.unix(row?.created_at).format('MMM DD, YYYY')
            : '--'}
        </span>
      </>
    )
  },
  {
    name: 'Invoice',
    sortable: false,
    minWidth: '18rem',
    cell: (row) => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      // const handleOpen = (id) => {
      //   navigate(`/clients/client/edit-invoice/${id}`)
      // }

      return (
        <div
          style={{ minWidth: '13rem' }}
          className="invoice-div pointer"
          onClick={() =>
            navigate(
              `/clients/client/edit-invoice/${row?.client?.id}/${row?.id}`
            )
          }
        >
          <FileText size={15} />
          <span>invoice {row?.invoice_number || '--'}</span>
        </div>
      )
    }
  },
  {
    name: 'Fee',
    sortable: false,
    selector: (row) => `$ ${row?.fees}` || '--'
  },
  {
    name: 'Client',
    sortable: false,
    minWidth: '15rem',
    cell: (row) =>
      `${row?.client?.first_name || '--'} ${
        row?.client?.last_name || '--'
      }`
  },
  {
    name: 'Status',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-f-between w-100Percent">
          <Badge
            color={StatusObj[row?.status]?.color}
            pill
            id={`pop-${row.id}`}
          >
            {clientStatusObjText[row?.status].text}
          </Badge>
        </div>
      )
    }
  },
  {
    name: 'Action',
    sortable: false,
    cell: (row) => {
      //**  get Provider ID */
      const id = useSelector((state) => state?.auth?.user?.user_id)
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const [open, setOpen] = useState(false)
      const handleOpen = () => {
        if (parseInt(row?.status) !== 0) {
          setOpen(!open)
          dispatch(getClientBillingAction({ id: row?.id, callback: () => {} }))
          dispatch(getAllServiceAction({ id, offset: 0, limit: 100 }))
        }
      }
      const handlePathChange = () => {
        if (parseInt(row?.status) !== 0) {
          navigate(`/clients/client/client-add-payment/${row?.id}`)
        }
      }
      return (
        <>
          <Button
            className="billing-edit-button"
            id={`edit-invoice-${row?.id}`}
          >
            <Icon
              color="black"
              icon="uiw:edit"
              width="35"
              height="28"
              className={classNames({
                'pointer billing-edit': true
              })}
            />
          </Button>
          <UncontrolledPopover
            trigger="focus"
            placement="left"
            target={`edit-invoice-${row?.id}`}
            // className='no-overflow'
          >
            <PopoverBody className="dropDown-popover ">
              <List>
                <li onClick={handleOpen}>Edit</li>
                <li onClick={handlePathChange}>Add payment</li>
              </List>
            </PopoverBody>
          </UncontrolledPopover>
          <Modal setOpen={setOpen} open={open} />
        </>
      )
    },
    minWidth: '10rem'
  }
]
