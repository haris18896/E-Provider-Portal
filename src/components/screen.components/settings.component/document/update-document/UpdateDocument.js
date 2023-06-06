import { Modal, ModalBody, Button, Form, Spinner } from 'reactstrap'
import { X } from 'react-feather'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import PerfectScrollbar from 'react-perfect-scrollbar'
import FormGroupElement from '@FormGroupElement'
import { Icon } from '@iconify/react'
import { useSelector, useDispatch } from 'react-redux'
import { updateOtherDocumentsAction } from '../../../../../redux/setting/documents-and-forms/other-documents/otherDocumentsAction'

const UpdateDocument = ({ open, setOpen, id, data }) => {
  const dispatch = useDispatch()
  const { getAllOtherDocuments, updateLoading } = useSelector(
    (state) => state.otherDocuments
  )
  const offset = getAllOtherDocuments?.offset
  const limit = getAllOtherDocuments?.limit
  const updateOtherDocumentSchema = Yup.object().shape({
    name: Yup.string().required('Address is a required field')
  })

  const formik = useFormik({
    initialValues: {
      name: data || ''
    },
    validationSchema: updateOtherDocumentSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          document_name: values.name
        }
        dispatch(
          updateOtherDocumentsAction({
            limit,
            offset,
            data,
            id,
            callback: () => {
              resetForm()
              setOpen(false)
            }
          })
        )
      }
    }
  })

  return (
    <>
      <Modal
        isOpen={open}
        toggle={() => {
          setOpen(!open)
          formik.resetForm()
        }}
        className="modal-dialog-centered modalBilling"
      >
        <div className="modal--header">
          <span> Edit Document </span>
          <X
            className="pointer"
            size={15}
            onClick={() => {
              setOpen(false)
              formik.resetForm()
            }}
          />
        </div>

        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <ModalBody>
            <Form onSubmit={formik.handleSubmit}>
              <div className="px-2">
                <FormGroupElement
                  inputType="text"
                  label="Name"
                  required
                  labelClassName="pl-10px"
                  inputName="name"
                  placeholder="Enter Name"
                  formGroupClassName="mb-1"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('name')}
                  formikTouched={formik.touched.name}
                  formikError={formik.errors.name}
                />
              </div>
              <hr className="m-t-2" />

              <div className="px-2 pb-2 modal-credit-buttons d-flex">
                <Button
                  type="button"
                  className="button-cancel pd"
                  onClick={() => {
                    setOpen(false)
                    formik.resetForm()
                  }}
                >
                  <span>Cancel</span>
                </Button>

                <Button className="button-success pd" type="submit">
                  {updateLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Icon icon="akar-icons:check" width="14" height="14" />
                  )}
                  <span className="px-1"> Update</span>
                </Button>
              </div>
            </Form>
          </ModalBody>
        </PerfectScrollbar>
      </Modal>
    </>
  )
}

export default UpdateDocument
