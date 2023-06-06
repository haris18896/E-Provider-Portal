/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import AlertModal from '../../../../components/alert'
import { useState } from 'react'
import { deleteBillingAddressAction } from '../../../../redux/setting/scheduling/billing-address/billingAddressAction'
import CreateBillingModal from '../../../../components/screen.components/settings.component/scheduling/location/CreateBillingModal'

export const columns = (setPage) => [
  {
    name: 'Name',
    sortable: false,
    minWidth: '15rem',
    cell: (row) =>
      `${row?.name || '--'}`
  },
  {
    name: 'Address',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-flex align-items-center justify-content-between">
          {row?.address || '--'}
        </div>
      )
    },
    minWidth: '40rem'
  },
  {
    name: '',
    sortable: false,
    cell: (row) => {
      const dispatch = useDispatch()
      const { deleteLoading, getAllBillingAddress } = useSelector(
        (state) => state.billingAddress
      )
      const limit = getAllBillingAddress.limit
      const [open, setOpen] = useState(false)
      const [alertModalOpen, setAlertModalOpen] = useState(false)
      const handleCloseAlertModal = () => setAlertModalOpen(false)
      const handleOpenAlertModal = () => {
        setAlertModalOpen(true)
      }
      const handleOpen = () => {
        setOpen(!open)
      }

      return (
        <div className="pl-20px d-flex">
          <Icon
            className="me-3"
            icon="fa6-solid:pen"
            width="20"
            height="20"
            onClick={() => handleOpen()}
          />
          <Icon
            icon="fa-solid:trash-alt"
            width="20"
            height="20"
            onClick={() => handleOpenAlertModal()}
          />
          <CreateBillingModal
            setOpen={setOpen}
            open={open}
            id={row?.provider?.id}
            row={row}
            edit={true}
          />
          <AlertModal
            loading={deleteLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(
                deleteBillingAddressAction({
                  limit,
                  id: row?.id,
                  providerId: row?.provider?.id,
                  callback: () => {
                    handleCloseAlertModal()
                    setPage(0)
                  }
                })
              )
            }}
            title="Delete Billing Address"
            message="Are you sure you want to delete this Billing Address ?"
          />
        </div>
      )
    }
  }
]
