import { Check, FileText, Trash2, Edit2 } from 'react-feather'
import { Icon } from '@iconify/react'
import AlertModal from '../../../../components/alert'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteOtherDocumentsAction } from '../../../../redux/setting/documents-and-forms/other-documents/otherDocumentsAction'
import UpdateDocument from '../../../../components/screen.components/settings.component/document/update-document/UpdateDocument'

export const columns = [
  {
    name: 'Document Name',
    minWidth: '30rem',
    cell: (row) => {
      const [open, setOpen] = useState(false)

      const handleOpen = () => {
        setOpen(!open)
      }
      return (
        <>
          <div className="d-flex  list-group-document  align-items-center justify-content-between w-100">
            <div>
              <span className="me-1">
                <FileText size={16} />
              </span>
              <a className="link document-URL">{row?.document_name || '--'}</a>
            </div>
            <div>
              <Icon
                icon="fa6-solid:pen"
                width="15"
                height="15"
                onClick={() => handleOpen()}
              />
            </div>
          </div>
          <UpdateDocument setOpen={setOpen} open={open} id={row?.id} data={row?.document_name}/>
        </>
      )
    }
  },
  {
    name: 'File Name',
    minWidth: '40rem',
    cell: (row) => {
      const dispatch = useDispatch()
      const [documentId, setDocumentId] = useState(null)
      const [alertModalOpen, setAlertModalOpen] = useState(false)
      const { deleteLoading, getAllOtherDocuments } = useSelector(
        (state) => state.otherDocuments
      )
      const limit = getAllOtherDocuments?.limit

      //** Manage Modal */
      const handleCloseAlertModal = () => setAlertModalOpen(false)
      const handleOpenAlertModal = (id) => {
        setDocumentId(id)
        setAlertModalOpen(true)
      }
      return (
        <>
          <AlertModal
            loading={deleteLoading}
            open={alertModalOpen}
            handleOpen={handleOpenAlertModal}
            handleClose={handleCloseAlertModal}
            handleAction={() => {
              dispatch(deleteOtherDocumentsAction({ id: documentId, limit }))
            }}
            title="Delete Document"
            message="Are you sure you want to delete this Document ?"
          />
          <div className="d-flex  list-group-document  align-items-center justify-content-between w-100">
            <div>
              <span className="me-1">
                <FileText size={16} />
              </span>
              <a className=" document-URL link">{row?.title || '--'}</a>
            </div>
            <div className="d-flex align-items-center">
              <a target="" href={row?.document || null} className="black download-link">
                <Icon
                  icon="mingcute:download-2-fill"
                  width="20"
                  height="20"
                  className="me-3"
                />
              </a>
              <Icon
                icon="fa-solid:trash-alt"
                width="20"
                height="20"
                onClick={() => handleOpenAlertModal(row?.id)}
              />
            </div>
          </div>
        </>
      )
    }
  }
]

// export const rows = [
//   {
//     isOpen: false,
//     document: 'Document Form #01',
//     documentName: 'Covid Forms',
//     documentFolder: 'Covid Forms',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #01',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #02',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #02',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #03',
//     folder: 'Covid Forms',
//     documentFiles: [

//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #03',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #04',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #03',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #04',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #05',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #06',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #07',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #07',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #08',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #08',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #09',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #10',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #11',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #12',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   },
//   {
//     isOpen: false,
//     document: 'Document Name #13',
//     folder: 'Covid Forms',
//     documentFiles: [
//       {
//         file: 'Covid Safety form'
//       },
//       {
//         file: 'Covid-free declaration form'
//       },
//       {
//         file: 'International travel form'
//       }
//     ],
//     file: 'File Name #04',
//     files: [
//       {
//         file: 'Covid_Safety_form.pdf'
//       },
//       {
//         file: 'Covid-free_declaration form.xls'
//       },
//       {
//         file: 'international_travel_form.xls'
//       }
//     ]
//   }
// ]
