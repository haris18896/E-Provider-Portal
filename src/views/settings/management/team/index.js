/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react'

// custom components
import { Role } from '../constants'
import SelectField from '@select'

//third party packages
import { Card, Button } from 'reactstrap'
import { ChevronDown } from 'react-feather'

// Assests
import CustomPagination from '../../../../components/pagination/ReactPagination'
import DataTable from 'react-data-table-component'
import { columns, rows } from './table.data'

const SettingMyTeam = () => {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(5)
  const [filterRole, setFilterRole] = useState('ALL')

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
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
          <div className="page-header--title mb-1">
            <span className="heading-1">My Team</span>
          </div>
          <div className="page-header--buttons_right">
            <SelectField
              header
              controlMinWidth="180px"
              value={Role[0]}
              data={Role}
              change={(e) => setFilterRole(e.value)}
            />

            <Button className="button-green">Add Team Member</Button>
          </div>
        </div>

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
      </Card>
    </div>
  )
}

export default SettingMyTeam
