/* eslint-disable no-unused-vars */
import React, { Fragment, useMemo, useState } from 'react'

// Third Party components
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import { Button, CardBody, Col, Row } from 'reactstrap'

// Custom Components
import { nanoid } from 'nanoid'
import SelectField from '@select'
import Pagination from '@pagination'
import { columns } from './table.data'
import FormGroupElement from '@FormGroupElement'
import { formType } from './constants'
import DataTable, { createTheme } from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { ExpandedComponent } from '../../../../../components/screen.components/settings.component/document/table/ExpandedComponent'

createTheme(
  'solarized',
  {
    text: {
      // primary: '#',
      secondary: '#2aa198'
    },
    background: {
      default: 'transparent'
    },
    context: {
      background: '#e3f2fd',
      text: '#000'
    },
    divider: {
      default: 'rgba(216, 214, 222, 0.1)'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)

function Template({ defaultType, templateId, setDefaultType, formik }) {
  return (
    <>
      <CardBody>
        <Row className={'align-items-center'}>
          <Col sm={12} md={6}>
            <span className="sub-heading-1">Create New Notes & Forms</span>
          </Col>
          <Col sm={12} md={6}>
            <div className={'notes-and-forms--type'}>
              <SelectField
                header={true}
                search={false}
                menuHeight="10rem"
                value={defaultType}
                data={formType}
                placeholder="Select Form Type"
                className=""
                onChange={(e) => {
                  setDefaultType(e)
                  formik.setFieldValue('type', e)
                }}
              />
            </div>
          </Col>
        </Row>

        <Row className="notes-and-forms--title">
          <Col md={6} lg={6}>
            <FormGroupElement
              autoFocus
              type="text"
              label="Title"
              inputName="title"
              labelClassName="pl-10px"
              placeholder="Enter your form title"
              inputClassName={classNames({
                'form-fields radius-25 skin-change': true,
                'is-invalid': formik.touched.title && formik.errors.title
              })}
              {...formik.getFieldProps('title')}
              formikTouched={formik.touched.title}
              formikError={formik.errors.title}
            />
          </Col>
          <Col className={'d-flex align-items-center'}>
            <Link to="#" className="team-link mt-1">
              <span className="f-bold link">Preview</span>
            </Link>
          </Col>
        </Row>
      </CardBody>

      <Fragment>
        <DataTable
          columns={columns({ formik })}
          data={formik.values?.content}
          highlightOnHover
          pointerOnHover
          paginationServer
          rowsPerPage={100}
          className="react-dataTable no-right-border"
          sortIcon={<ChevronDown size={10} />}
          expandableRows
          expandOnRowClicked={true}
          expandableRowsHideExpander={true}
          expandableRowsComponent={(row) => (
            <ExpandedComponent
              formik={formik}
              data={row?.data}
              templateId={templateId}
              index={row?.data?.index}
              onClose={() => {}}
            />
          )}
          // expandableRowExpanded={(row) => row?.data?.isExpanded}
        />

        <hr className="mt-0" />

        <div className="template-table--body__Button">
          <Button
            className="button-success"
            disabled={formik.values?.content?.length >= 100}
            onClick={() => {
              formik.setFieldValue('content', [
                ...formik.values.content,
                {
                  type: null,
                  question: '',
                  required: false,
                  option: [],
                  index: formik.values.content.length,
                  isExpanded: false
                }
              ])
            }}
          >
            Add New
          </Button>
        </div>
      </Fragment>
    </>
  )
}

export default Template
