import React from 'react'

export const CustomTooltip = data => {
    if (data.active && data.payload) {
      return (
        <div className='recharts-custom-tooltip'>
          <p className='fw-bold mb-0'>{data.label}</p>
          <hr />
          <div className='active'>
            {data.payload.map(i => {
              return (
                <div className='d-flex align-items-center' key={i.dataKey}>
                  <span
                    className='bullet bullet-sm bullet-bordered me-50'
                    style={{
                      backgroundColor: i.fill
                    }}
                  ></span>
                  <span className='text-capitalize me-75'>
                    {i.dataKey} : {i.payload[i.dataKey]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  
    return null
  }