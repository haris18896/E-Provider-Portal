/* eslint-disable no-unused-vars */
// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'

// ** Custom Components
import NavbarUser from './NavbarUser'
import themeConfig from '@configs/themeConfig'

// ** Third Party Components
import { Sun, Moon, Menu } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { getAllStripeCardAction } from '../../../../redux/setting/billing/stripe/stripeAction'

const ThemeNavbar = (props) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  useEffect(() => {
    dispatch(getAllStripeCardAction())
  }, [])
  const { getAllCards } = useSelector((state) => state.stripe)
  const rows = getAllCards?.sources

  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className="ficon" onClick={() => setSkin('light')} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin('dark')} />
    }
  }

  const navigate = useNavigate()

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center justify-content-between ">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu me-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Menu
                className="ficon"
                color={skin === 'dark' ? '#fff' : '#636b7b'}
              />
            </NavLink>
          </NavItem>
        </ul>
        <NavItem className="d-block">
          <NavLink
            className="nav-link-style d-flex align-items-center justify-content-start"
            onClick={() => navigate('/appointments')}
          >
            <img
              src={themeConfig.app.appLogoImage}
              width={40}
              height={40}
              alt="logo"
            />
            <span
              className={classNames({
                'logo-text': true,
                'dark-logo-text': skin === 'dark'
              })}
            >
              ethera
            </span>
          </NavLink>
        </NavItem>
      </div>
      {!rows?.length ? (
        <NavItem className="d-block show-mini-navbar-hide-small-screen">
          <NavLink className="nav-link-style d-flex align-items-center justify-content-start">
            <span
              className={classNames({
                ' mt-1': true,
                'dark-logo-text': skin === 'dark'
              })}
            >
              Please setup your stripe account to start booking.
            </span>
            <span
              className={classNames({
                ' mt-1 link p-l-3': true,
                'dark-logo-text': skin === 'dark'
              })}
              onClick={() => navigate('/settings/billing-and-service')}
            >
              Click here
            </span>
          </NavLink>
        </NavItem>
      ) : null}
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
