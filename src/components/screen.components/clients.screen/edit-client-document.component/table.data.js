/* eslint-disable no-unused-vars */
import moment from 'moment'
import { useState } from 'react'
import AlertModal from '../../../alert'
import { useDispatch, useSelector } from 'react-redux'
import { Check, FileText, Trash2 } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteClientDocumentsAction } from '../../../../redux/client/clientAction'

export const columns = [
  {
    name: 'All Documents',
    minWidth: '50rem',
    cell: (row) => {
      const params = useParams()
      const { id } = params
      const clientId = id
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const [documentId, setDocumentId] = useState(null)
      const [alertModalOpen, setAlertModalOpen] = useState(false)
      const { deleteDocumentLoading } = useSelector((state) => state.client)

      //** Manage Modal */
      const handleCloseAlertModal = () => setAlertModalOpen(false)
      const handleOpenAlertModal = (id) => {
        setDocumentId(id)
        setAlertModalOpen(true)
      }

      const handleNoteView = (file, id) => {
        if (file === null) {
          navigate(`/clients/${clientId}/notesView/${id}`)
        }
      }
      return (
        <>
          <AlertModal
            loading={deleteDocumentLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(
                deleteClientDocumentsAction({ id: documentId, clientId })
              )
            }}
            title="Delete Document"
            message="Are you sure you want to delete this Document ?"
          />
          <div className="d-flex  list-group-document  align-items-center justify-content-between w-100">
            <div className="width-title">
              <span className="me-1">
                <FileText size={16} />
              </span>
              <a
                target=""
                href={row?.file || null}
                className="black document-URL "
                onClick={() => handleNoteView(row?.file, row?.id)}
              >
                {row?.title || '--'}
              </a>
              {row?.updated_at !== null && (
                <Check
                  size="13"
                  className="view-check-document"
                  stroke="#fff"
                  strokeWidth={3}
                />
              )}
            </div>
            <div>
              <Trash2
                size={20}
                color="red"
                onClick={() => handleOpenAlertModal(row?.id)}
              />
            </div>
          </div>
        </>
      )
    }
  },
  {
    name: 'Received',
    cell: (row) => {
      return (
        <span>
          {(row?.created_at !== undefined &&
            moment.unix(row?.created_at).format('MM/DD/YYYY')) ||
            '-'}
        </span>
      )
    }
  },
  {
    name: 'Completed',
    cell: (row) => {
      return (
        <span>
          {row?.updated_at !== null
            ? moment.unix(row?.updated_at).format('MM/DD/YYYY')
            : '--'}
        </span>
      )
    }
  }
]
