/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
// hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'
// components
import SelectField from '@select'
import FormIconField from '@FormIconField'
import FormGroupElement from '@FormGroupElement'
// import { statusList, usersList } from './constants'
// Third party
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
import { clientStatusList } from '../../FormConstants'

function ClientsHeader({ onSearchChange, onChangeHandler }) {
  const navigate = useNavigate()
  const large = useMediaQuery('(min-width: 991px)')

  const [user, setUser] = useState('all-users')

  return (
    <Row className="p-2 pt-3 align-items-center bg-yellow">
      <Col sm={6} md={4} lg={3} xl={2}>
        <SelectField
          header
          search={false}
          placeholder="Status"
          controlMinWidth="170px"
          // wd={tablet && '100%'}
          // value={status}
          data={clientStatusList}
          className="mb-1"
          inputClassName="react-select form-fields radius-25 skin-change "
          onChange={(e) => onChangeHandler('status', e)}
        />

      </Col>
      <Col sm={6} md={4} lg={3} xl={4}>
        <FormIconField
          id="Search"
          name="searchKeyword"
          size={10}
          iconsName="ant-design:search-outlined"
          // value={searchKeyword}
          onChange={(e) => onSearchChange(e)}
          className="input-group-merge"
          inputClassName="input-control skin-change mb-1 large-space-input"
          iconClassName="icon-control skin-change mb-1"
        />
      </Col>
      {/* <Col sm={6} md={4} lg={3} xl={2}>
        <FormGroupElement
          inputType="select"
          style={{ borderRadius: '20px', padding: '3px 15px' }}
          value={user}
          bsSize="sm"
          className="skin-change"
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="all-users">All users</option>
          <option value="Ethera">Ethera</option>
          <option value="Brian">Brian</option>
        </FormGroupElement>
      </Col> */}
      <Col
        sm={6}
        md={4}
        lg={3}
        xl={3}
        offset={1}
        className={classNames({ marginLeftAuto: large })}
      >
        <div className={classNames({ 'mb-1': true, 'text-align-end': large })}>
          <Button
            className="button-green"
            onClick={() => navigate('/clients/add-client')}
          >
            Add Client
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default ClientsHeader
