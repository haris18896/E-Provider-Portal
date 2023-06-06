// ** Router imports
import { Navigate, useRoutes } from 'react-router-dom'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** utils
import { getHomeRouteForLoggedInUser, getUserData } from '../utility/Utils'

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)

  const getHomeRoute = () => {
    const user = getUserData()
    if (user?.is_provider) {
      return getHomeRouteForLoggedInUser(user?.is_provider)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    ...allRoutes
  ])

  return routes
}

export default Router
