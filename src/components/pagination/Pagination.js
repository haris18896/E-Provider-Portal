import classnames from 'classnames'
import { Form, Row, Col } from 'reactstrap'

import FormGroupElement from '@FormGroupElement'
import { DOTS, usePagination } from './usePagination'

const Pagination = (props) => {
  const {
    onPageChange,
    // paginationOptions,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    setPagesize
  } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  })
  if (currentPage === 0) {
    return null
  }
  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const lastPage = paginationRange[paginationRange.length - 1]

  const handlePageChange = (e) => {
    setPagesize(e.target.value)
    onPageChange(1)
  }

  return (
    <Row className="justify-content-between m-1">
      <Col sm={12} md={2}>
        <Form>
          <FormGroupElement
            label="Show: "
            labelClassName="me-1 f-bold"
            formGroupClassName="d-flex align-items-center"
            inputType="select"
            inputName="select"
            style={{ borderRadius: '20px', padding: '3px 15px' }}
            className='select border skin-change'
            onChange={handlePageChange}
          >
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={20}>20 items</option>
            <option value={50}>50 items</option>
          </FormGroupElement>
        </Form>
      </Col>
      <Col sm={12} md={9}>
        <div>
          <ul
            className={classnames('pagination-container ', {
              [className]: className
            })}
          >
            <li
              className={classnames('pagination-item skin-change', {
                disabled: currentPage === 1
              })}
              onClick={onPrevious}
            >
              <div className="arrow left" />
            </li>
            {paginationRange.map((pageNumber, i) => {
              if (pageNumber === DOTS) {
                return (
                  <li className="pagination-item dots skin-change" key={i}>
                    &#8230;
                  </li>
                )
              }

              return (
                <li
                  className={classnames('pagination-item skin-change', {
                    selected: pageNumber === currentPage
                  })}
                  onClick={() => onPageChange(pageNumber)}
                  key={i}
                >
                  {pageNumber}
                </li>
              )
            })}
            <li
              className={classnames('pagination-item skin-change', {
                disabled: currentPage === lastPage
              })}
              onClick={onNext}
            >
              <div className="arrow right" />
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  )
}

export default Pagination
