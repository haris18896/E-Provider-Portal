// ** React Imports
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Icon } from '@iconify/react'

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap'

// actions
import { handleLogout } from '../../../../redux/authentication/authSlice'
// ** Default Avatar Image
import defaultAvatar from '@src/assets/default.png'
import { useDispatch, useSelector } from 'react-redux'

const UserDropdown = () => {
  const avatar = useSelector((state) => state.auth?.user?.avatar)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          {/* <span className="user-name fw-bold">John Doe</span> */}
          {/* <span className="user-status">Admin</span> */}
        </div>
        <Avatar
          img={avatar ? avatar : defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          imgClassName={'object-fit-cover'}
          // status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/settings/my-profile" onClick={() => navigate('/settings/my-profile')}>
          <Icon icon="bxs:user" className="me-75" />
          <span className="align-middle">
            <strong>Profile</strong>
          </span>
        </DropdownItem>
        {/*<DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>*/}
        {/*  <Icon icon="eva:settings-fill" className="me-75" />*/}
        {/*  <span className="align-middle">*/}
        {/*    <strong>Settings</strong>*/}
        {/*  </span>*/}
        {/*</DropdownItem>*/}
        {/*<DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>*/}
        {/*  <Icon icon="dashicons:editor-help" className="me-75" />*/}
        {/*  <span className="align-middle">*/}
        {/*    <strong>Help</strong>*/}
        {/*  </span>*/}
        {/*</DropdownItem>*/}
        {/*<DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>*/}
        {/*  <Icon icon="ant-design:bulb-filled" className="me-75" />*/}
        {/*  <span className="align-middle">*/}
        {/*    <strong>Request a Feature</strong>*/}
        {/*  </span>*/}
        {/*</DropdownItem>*/}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Icon icon="entypo:log-out" className="me-75" />
          <span className="align-middle">
            <strong>Logout</strong>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
