/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react'

import { columns, rows } from './table.data'
import { Card, CardBody, Row, Col } from 'reactstrap'
import ReportInvoiceHeader from '../../../components/screen.components/reports.screen/headers/invoice-header.component'
import CustomPagination from '../../../components/pagination/ReactPagination'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

function InvoiceListReports() {
 
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(5)

  const handleLimitChange = (items) => {
    setLimit(items)
    setPage(0)
  }

  const handlePagination = (page) => {
    setPage(page.selected)
  }

  const dataToRender = useMemo(() => {
    const firstIndex = page * limit
    const lastIndex = parseInt(firstIndex) + parseInt(limit)
    return rows.slice(firstIndex, lastIndex)
  }, [page, limit])


  return (
    <div>
      <Card>
        <ReportInvoiceHeader />
        <CardBody style={{ padding: 0 }}>
          <Row>
            <Col lg="12" className="tableSetting">              
              <div className="react-dataTable">
                <DataTable
                  pagination
                  paginationServer
                  rowsPerPage={limit}
                  data={dataToRender}
                  pointerOnHover
                  highlightOnHover
                  theme="solarized"
                  columns={columns}
                  className="react-dataTable"
                  paginationDefaultPage={page + 1}
                  sortIcon={<ChevronDown size={10} />}
                  paginationComponent={() =>
                    CustomPagination({
                      limit,
                      handleLimitChange,
                      page,
                      rows,
                      handlePagination
                    })
                  }
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default InvoiceListReports
