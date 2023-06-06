import React, { useState } from 'react'

import { Table } from 'reactstrap'

// third party
import { Icon } from '@iconify/react'
import Timeline from '@components/timeline'

export const DocumentTable = ({ columns, rows }) => {
  const [row, setRow] = useState([...rows])

  const handleOpen = (idx) => () => {
    const list = [...rows]
    const newList = list.map((_item, index) => {
      if (index === idx) {
        return { ..._item, isOpen: true }
      }
      return { ..._item }
    })
    setRow(() => newList)
  }

  return (
    <Table bordered responsive className="mt-2 mb-2">
      <thead className="bgThead">
        <tr>
          {columns.map(({ header }, i) => (
            <th key={i}>{header} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {row.map((item, index) => {
          return (
            <tr key={index} className="tableRow" onClick={handleOpen(index)}>
              <td style={{ padding: '1.3rem 2rem' }}>
                <div className="d-flex align-items-start">
                  <Icon
                    className="me-2"
                    icon="eva:menu-outline"
                    width="20"
                    height="20"
                  />
                  <div className="me-1">
                    {!item.isOpen ? (
                      <div>
                        <span className="link sub-heading-2 me-1">
                          {item.title || '--'}
                        </span>
                        <Icon icon="fa6-solid:pen" width="15" height="15" />
                      </div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center flex-col">
                          <Icon
                            icon="material-symbols:folder-open"
                            width="15"
                            height="15"
                          />

                          <span className="link me-1 ml-5px">
                            {item.title || '--'}
                          </span>
                          <Icon icon="fa6-solid:pen" width="15" height="15" />
                        </div>

                        {item.documentFiles.map((doc, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-end custom-timeline flex-col"
                          >
                            <div className="custom-timeline__horizontal" />
                            {/* <div className="custom-timeline">
                              <div className="custom-timeline__vertical" />
                              <div className="custom-timeline__horizontal" />
                            </div> */}

                            <Icon
                              icon="fa6-solid:file-lines"
                              width="15"
                              height="15"
                              className="custom-timeline__icon"
                            />

                            <span className="link me-1 ml-5px">{doc.file}</span>
                            <Icon icon="fa6-solid:pen" width="15" height="15" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </td>

              <td style={{ padding: '1.3rem 2rem' }}>
                <div>
                  <div className="me-1 mt-1">
                    {!item.isOpen ? (
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="link sub-heading-2">
                            {item.title}
                          </span>
                        </div>
                        <div className="marginLeftAuto">
                          <a target="_blank" href={item?.document || null}>
                            <Icon
                              icon="mingcute:download-2-fill"
                              width="20"
                              height="20"
                              className="me-3"
                            />
                          </a>
                          <Icon
                            icon="fa-solid:trash-alt"
                            width="20"
                            height="20"
                          />
                        </div>
                      </div>
                    ) : (
                      item.files.map((doc, i) => (
                        <div key={i} className="documentFiles">
                          <div>
                            <span className="link me-1">{doc.file}</span>
                          </div>
                          <div>
                            <Icon
                              icon="mingcute:download-2-fill"
                              width="20"
                              height="20"
                              className="me-3"
                            />
                            <Icon
                              icon="fa-solid:trash-alt"
                              width="20"
                              height="20"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
