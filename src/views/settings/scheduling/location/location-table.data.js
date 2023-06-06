/* eslint-disable no-unused-vars */
import { useState } from 'react'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Avatar from '@components/avatar'
import { Button, Spinner } from 'reactstrap'
import FormGroupElement from '@FormGroupElement'
import { useDispatch, useSelector } from 'react-redux'
import logo from '@src/assets/etheraImgs/brand/Logo.png'
import {
  IconData,
  placeOfService
} from '../../../../components/status/ProviderLocation'
import {
  deleteLocationAction,
  getLocationAction,
  updateLocationAction
} from '../../../../redux/setting/scheduling/location/locationAction'
import AlertModal from '../../../../components/alert'
import LocationEditModal from '../../../../components/modal/LocationEditModal'

export const columns = [
  {
    name: 'Name',
    sortable: false,
    cell: (row) => row.name || '--',
    minWidth: '12rem'
  },
  {
    name: 'Address',
    sortable: false,
    cell: (row) => row.address || '--',
    minWidth: '22rem'
  },
  {
    name: 'Icon',
    sortable: false,
    cell: (row) => {
      return (
        IconData[row?.icon]?.icon || (
          <Avatar img={logo} imgHeight="30" imgWidth="30" />
        )
      )
    }
  },

  {
    name: 'Place of Service',
    sortable: false,
    minWidth: '22rem',
    cell: (row) => placeOfService[row?.place_of_service]?.text || '--'
  },

  {
    name: '',
    sortable: false,
    minWidth: '25rem',
    cell: (row) => {
      //** Hooks */
      const dispatch = useDispatch()
      const [id, setId] = useState(null)
      const [openModal, setOpenModal] = useState(false)
      const [providerId, setProviderId] = useState(null)
      const [alertModalOpen, setAlertModalOpen] = useState(false)
      const { getAllLocations, getAllLoading } = useSelector((state) => state.locations)
      const limit = getAllLocations.limit
      const offset = getAllLocations.offset
      // ** Handle Modals
      const handleModal = () => {
        setOpenModal(!openModal)
      }
      const handleEditModal = (providerId, locationId) => {
        dispatch(getLocationAction({ providerId, locationId }))
        setOpenModal(true)
      }
      const handleCloseAlertModal = () => setAlertModalOpen(false)
      const handleOpenAlertModal = (id, providerID) => {
        setAlertModalOpen(true)
        setId(id)
        setProviderId(providerID)
      }
      const handleChangeRadio = (providerId, id, value) => {
        const data = {
          is_default: value
        }
        dispatch(updateLocationAction({ offset, limit, providerId, id, data }))
      }

      //** Store */
      const { deleteLoading, updateLoading } = useSelector(
        (state) => state.locations
      )
      return (
        <>
          <div className="d-flex align-items-center justify-content-between w-100">
            <FormGroupElement
              disabled={updateLoading}
              inputType="radio"
              inputName="setAsDefault"
              label="Set As Default"
              labelClassName="pl-10px"
              formGroupClassName="client_profile--checkbox me-1"
              inputClassName="skin-change"
              checked={row.is_default === true}
              onChange={(e) =>
                handleChangeRadio(row?.provider?.id, row?.id, e.target.checked)
              }
            />

            <div className="pl-20px d-flex">
              <Icon
                className={classNames({
                  'mx-3': true,
                  'open-modal': getAllLoading === true,
                  'open-modal': openModal === true 
                })}
                icon="fa6-solid:pen"
                width="20"
                height="20"
                onClick={() => handleEditModal(row?.provider?.id, row?.id)}
              />

              <Icon
                icon="fa-solid:trash-alt"
                width="20"
                height="20"
                onClick={() => handleOpenAlertModal(row?.id, row?.provider?.id)}
              />
            </div>
          </div>
          <LocationEditModal
            open={openModal}
            handleModal={handleModal}
            providerId={row?.provider?.id}
            id={row?.id}
          />
          <AlertModal
            loading={deleteLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(
                deleteLocationAction({
                  limit,
                  id,
                  providerId,
                  callback: () => handleCloseAlertModal()
                })
              )
            }}
            title="Delete Location"
            message="Are you sure you want to delete this Location ?"
          />
        </>
      )
    }
  }
]
