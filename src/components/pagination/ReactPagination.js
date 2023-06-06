import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import { Col, Input, Label, Row } from 'reactstrap'

function CustomPagination({
  limit,
  handleLimit,
  currentPage,
  count,
  handlePagination,
  position
}) {
  return (
    <div
      className={
        position === true
          ? 'main-box-pagination main-box-pagination-bg-color'
          : 'main-box-pagination bg-white'
      }
    >
      <div className={position === true ? 'pagination-position-fixed ' : null}>
        <Row className="mx-2  justify-content-between align-items-center">
          <Col sm={6} md={3} lg={2}>
            <div className="d-flex align-items-center my-1">
              <Label className="me-1 f-bold" for="sort-select">
                show
              </Label>
              <Input
                bsSize="md"
                type="select"
                id="sort-select"
                value={limit}
                className="dataTable-select mx-wd-130px pointer skin-change radius-25"
                onChange={(e) => handleLimit(e.target.value)}
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
              </Input>
            </div>
          </Col>

          <Col sm={6} md={9} lg={8}>
            <ReactPaginate
              previousLabel={''}
              nextLabel={''}
              forcePage={currentPage}
              breakLabel={'...'}
              pageRangeDisplayed={2}
              marginPagesDisplayed={2}
              activeClassName="active"
              pageClassName="page-item"
              breakClassName="page-item"
              nextLinkClassName="page-link"
              pageLinkClassName="page-link"
              breakLinkClassName="page-link"
              previousLinkClassName="page-link"
              nextClassName="page-item next-item"
              previousClassName="page-item prev-item"
              onPageChange={(data) => handlePagination(data)}
              pageCount={Math.ceil(count / limit) || 1}
              containerClassName={
                'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
              }
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

CustomPagination.propTypes = {
  limit: PropTypes.number,
  currentPage: PropTypes.number,
  count: PropTypes.number,
  handleLimit: PropTypes.func,
  handlePagination: PropTypes.func
}

export default CustomPagination
