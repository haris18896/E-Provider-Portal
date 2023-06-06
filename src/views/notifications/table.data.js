/* eslint-disable no-unused-vars */
import classNames from 'classnames'
import { Spinner } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteNotificationAction,
  updateReadNotificationAction
} from '../../redux/notification/notificationAction'

const notification_types = {
  1: { text: 'client_messages' },
  2: { text: 'payment received' },
  3: { text: 'payment overdue' },
  4: { text: 'client check in ' },
  5: { text: 'software update ' }
}
export const columns = (offset, limit) => [
  {
    name: '',
    sortable: true,
    cell: (row) => {
      const dispatch = useDispatch()
      const { updateReadLoading } = useSelector((state) => state.notification)
      const handleDelete = (id) => {
        dispatch(deleteNotificationAction({ id, offset, limit }))
      }

      const handleNotification = (id) => {
        const data = {
          read: true
        }
        dispatch(
          updateReadNotificationAction({
            id,
            data,
            offset,
            limit
          })
        )
      }
      return (
        <div className=" notifications--table__tableHover">
          <div className="notifications--table">
            <div className="notifications--table__message d-f-center">
              <div
                className={classNames({
                  'DOT me-1': true,
                  'DOT--red': row?.read === false
                })}
              />
              <div>
                <span
                  onClick={() => handleNotification(row?.id)}
                  className={classNames({
                    'f-bold': row?.read === false
                  })}
                >
                  {row?.content}
                </span>
                .{' '}
              </div>
              {/* <a className="f-bold link ml-5px">{notification_types[row?.notification_type]?.text}</a> */}
            </div>
            <div
              className="notifications--table__icon skin-change"
              onClick={() => handleDelete(row?.id)}
            >
              <Icon icon="fa-solid:trash-alt" width="10" height="10" />
            </div>
          </div>
        </div>
      )
    }
  }
]
