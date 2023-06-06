/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react'

import { Card, CardBody, Row, Col } from 'reactstrap'

// components
import { columns, rows } from './table.data'
import MonthlyIncomeHeader from '@src/components/screen.components/reports.screen/headers/monthly-income-header.component'
import DataTable from 'react-data-table-component'
import CustomPagination from '../../../components/pagination/ReactPagination'
import { ChevronDown } from 'react-feather'

const customStyles = {
  cells: {
    style: {
      '&:nth-child(1)': {
        fontWeight: 'bold !important',
        color: "black",
        justifyContent: "left !important"
      },
      justifyContent: "right !important"
    }
  },
  headCells: {
    style: {
      '&:nth-child(1)': {
        justifyContent: "left !important"
      },
      justifyContent: "right !important"
    }
  }
}

function MonthlyIncomeReport() {
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
        {/* Header */}
        <MonthlyIncomeHeader />

        {/* Table Body */}
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
                  customStyles={customStyles}
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

export default MonthlyIncomeReport
