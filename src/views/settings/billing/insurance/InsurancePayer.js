import React, { Fragment, useState, useMemo } from 'react'

// third party pkg
import { Col, Row } from 'reactstrap'

// components
import Pagination from '@pagination'
import { columns, rows } from './table.data'
import InsurancePayerTable from '../../../../components/screen.components/settings.component/billing/table/insurance-payer-table'

export const InsurancePayer = () => {
  const [PageSize, setPagesize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return rows.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, PageSize])

  return (
    <Fragment>
      <Row>
        <Col lg="12" className="tableSetting">
          <InsurancePayerTable
            columns={columns}
            rows={currentTableData}
            PageSize={PageSize}
          />

          {rows.length > 10 && (
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={rows.length}
              pageSize={PageSize}
              setPagesize={setPagesize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </Col>
      </Row>
    </Fragment>
  )
}
