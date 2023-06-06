import { useState } from 'react'
import { Icon } from '@iconify/react'
import AlertModal from '../../../../components/alert'
import { useDispatch, useSelector } from 'react-redux'
import { deleteServiceAction, getServiceByIdAction } from '../../../../redux/setting/billing/service/serviceAction'
import ServiceModal from '../../../../components/screen.components/settings.component/billing/table/billing-service-table/service-modal/ServiceModal'

export const columns = [
  {
    name: 'Code',
    sortable: false,
    cell: (row) => row.code || '--'
  },

  {
    name: 'Service',
    sortable: false,
    cell: (row) => `${row.service || '--'}`,
    minWidth: '30rem'
  },
  {
    name: 'Fee',
    sortable: false,
    cell: (row) => {
      //**  get Provider ID */
      const providerId = useSelector((state) => state?.auth?.user?.user_id)

      //** Store */
      const { deleteLoading } = useSelector((state) => state.service)

      // State
      const dispatch = useDispatch()
      const [id, setId] = useState(null)
      const [open, setOpen] = useState(false)
      const [alertModalOpen, setAlertModalOpen] = useState(false)

      const handleOpen = (providerId, id) => {
        setOpen(!open)
        if (id && open === false) {
          dispatch(getServiceByIdAction({ providerId, id }))
        }
      }

      const handleCloseAlertModal = () => setAlertModalOpen(false)
      const handleOpenAlertModal = (providerId, id) => {
        setAlertModalOpen(true)
        setId(id)
      }
      return (
        <div className="billing--bills_form--table_row w-100">
          <span>${row.fee || '--'}</span>
          <div className="billing--bills_form--table_row--icons">
            <Icon
              icon="fa-solid:pen"
              width="15"
              height="15"
              onClick={() => handleOpen(providerId, row?.id)}
            />
            <Icon
              icon="fa6-solid:trash-can"
              width="15"
              height="15"
              onClick={() => handleOpenAlertModal(providerId, row?.id)}
            />
          </div>
          <ServiceModal
            open={open}
            handleOpen={handleOpen}
            edit={true}
            id={providerId}
          />
          <AlertModal
            loading={deleteLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(
                deleteServiceAction({
                  providerId,
                  id,
                  callback: () => handleCloseAlertModal()
                })
              )
            }}
            title="Delete Service"
            message="Are you sure you want to delete this Service ?"
          />
        </div>
      )
    },
    minWidth: '25rem'
  }
]

export const rows = [
  {
    code: '90834',
    service: 'Psychotherapy, 45 mint',
    fee: 100
  },
  {
    code: '90837',
    service: 'Psychotherapy, 60 mint',
    fee: 100
  },
  {
    code: '90853',
    service: 'Group Therapy, 60 mint',
    fee: 70
  }
]
