import { Button, Col, Modal, ModalBody, Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'

const DeleteModal = ({
  deleteModal,
  setDeleteModal,
  submit,
  loading,
  setBasicModal
}) => {
  return (
    <>
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        className="modal-dialog-centered modal-delete text-center px-4"
      >
        <ModalBody>
          <Col className="delete-modal-body">
            <Icon
              icon="pajamas:warning-solid"
              color="#db8886"
              width="45"
              height="45"
            />
            <h5 className="text-center fs-l-med  mt-1">Are you sure </h5>
            <h5 className="text-center fs-l-med mb-1">
              {' '}
              you want to delete this card?
            </h5>

            <p className="fs-s-med mb-2">
              Payments that are still being processed with this card will
              continue to run.
            </p>
            <div>
              <Button
                size="sm"
                className="payment-delete-btn w-100"
                disabled={loading}
                onClick={() => submit()}
              >
                {loading ? (
                  <Spinner size="sm" className="spinner-size-same" />
                ) : (
                  <Icon icon="bi:trash-fill" />
                )}
                <span className="px-1"> Yes, Delete</span>
              </Button>
            </div>
            <div className="mt-1">
              <Button
                size="sm"
                className="payment-cancel-btn w-50 black"
                onClick={() => {
                  setBasicModal(true)
                  setDeleteModal(!deleteModal)
                }}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </ModalBody>
      </Modal>
    </>
  )
}

export default DeleteModal
