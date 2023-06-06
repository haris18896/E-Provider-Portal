import React, { memo } from 'react'

import Select from 'react-select'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import { DropdownIndicator, customStyles } from '@ReactSelectStyles'

function SelectField({
  header,
  label,
  data,
  wd,
  menuHeight,
  controlMinWidth,
  controlMaxWidth,
  containerZIndex,
  search,
  placeholder,
  disabled,
  defaultWidth,
  formikError,
  ...rest
}) {
  return (
    <>
      {label && <Label className="pl-10px">{label}</Label>}
      <Select
        options={data}
        placeholder={placeholder}
        components={{
          IndicatorSeparator: false,
          DropdownIndicator
        }}
        isSearchable={search}
        isDisabled={disabled}
        getOptionLabel={(e) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {e.icon}
            <span style={{ marginLeft: 5 }}>{e.text || e.label}</span>
          </div>
        )}
        styles={customStyles(
          header,
          wd,
          menuHeight,
          controlMinWidth,
          controlMaxWidth,
          containerZIndex,
          defaultWidth,
          formikError
        )}
        {...rest}
      />
    </>
  )
}

SelectField.propTypes = {
  wd: PropTypes.string,
  menuHeight: PropTypes.string,
  data: PropTypes.array,
  change: PropTypes.func,
  header: PropTypes.bool,
  search: PropTypes.bool,
  value: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  controlMinWidth: PropTypes.string,
  controlMaxWidth: PropTypes.string
}

export default memo(SelectField)
