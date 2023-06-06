import React from 'react'

// third party
import { Table } from 'reactstrap'
import classNames from 'classnames'
import { Icon } from '@iconify/react'

export const NotificationTable = ({ rows }) => {
  return (
    <Table bordered responsive>
      <tbody>
        {rows.map((item, index) => {
          return (
            <tr
              key={index}
              className="tableRow notifications--table__tableHover"
            >
              <td>
                <div className="notifications--table">
                  <div className="notifications--table__message d-f-center">
                    <div
                      className={classNames({
                        'DOT me-1': true,
                        'DOT--red': item.status === 'unread'
                      })}
                    />
                    <div>
                      <span
                        className={classNames({
                          'f-bold': item.status === 'unread'
                        })}
                      >
                        {item.notification}
                      </span>
                      .{' '}
                    </div>
                    <a href="#" className="f-bold link">
                      {item.method}
                    </a>
                  </div>
                  <div className="notifications--table__icon skin-change">
                    <Icon icon="fa-solid:trash-alt" width="10" height="10" />
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
