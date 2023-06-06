/* eslint-disable no-unused-vars */
// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'

// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllNotificationAction,
  markAllNotificationAction
} from '../../../../redux/notification/notificationAction'

const NotificationDropdown = () => {
  const dispatch = useDispatch()
  const { getAllNotification, loading, markAllLoading } = useSelector(
    (state) => state.notification
  )
  const rows = getAllNotification?.data
  useEffect(() => {
    dispatch(getAllNotificationAction({ offset: 0, limit: 10 }))
  }, [])

  const unreadNotificationNumber = rows?.filter(
    (item) => item.read === false
  )?.length

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false
        }}
      >
        {rows?.length > 0 && rows.map((item, index) => {
          return (
            <a
              key={index}
              className="d-flex"
              // href={item.switch ? '#' : '/'}
              // onClick={(e) => {
              //   if (!item.switch) {
              //     e.preventDefault()
              //   }
              // }}
            >
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    {/* <div className="me-1">
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                          ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                          : item.avatarIcon
                          ? {
                              icon: item.avatarIcon,
                              color: item.color
                            }
                          : null)}
                      />
                    </div> */}
                    <div className="list-item-body flex-grow-1">
                      {item.content}
                      {/* <small className="notification-text">
                        {item.subtitle}
                      </small> */}
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.content}
                    {/* {item.switch} */}
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */
  const handleReadAllNotification = () => {
    dispatch(markAllNotificationAction())
  }
  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell color="#4b4b4b" size={21} />
        {unreadNotificationNumber !== 0 && (
          <Badge pill color="danger" className="badge-up">
            {unreadNotificationNumber}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            {unreadNotificationNumber !== 0 && (
              <Badge tag="div" color="light-primary" pill>
                {unreadNotificationNumber} New
              </Badge>
            )}
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          <Button color="primary" block onClick={handleReadAllNotification}>
            Read all notifications
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
