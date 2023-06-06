// ** React Imports
import { Fragment, lazy } from 'react'
import { Navigate } from 'react-router-dom'
// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper'
// ** Route Components
import PublicRoute from '@components/routes/PublicRoute'
import PrivateRoute from '@components/routes/PrivateRoute'
// ** Utils
import { isObjEmpty } from '@utils'

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/calendar'

const Login = lazy(() => import('../../views/Login'))
const Register = lazy(() => import('../../views/Register'))
const ForgotPassword = lazy(() => import('../../views/ForgotPassword'))
const CreatePassword = lazy(() => import('../../views/createPassword'))

const Error = lazy(() => import('../../views/Error'))
// Pages
// Appointment tabs
const AccountActivity = lazy(() => import('@src/views/accountActivity'))
const Appointments = lazy(() => import('@src/views/appointment'))
// booking tabs
const Bookings = lazy(() => import('@src/views/bookings'))
const BookingsMonthlyInvoice = lazy(() =>
  import('@src/views/bookings/monthlyInvoices')
)
const BookingsInvoiceList = lazy(() =>
  import('@src/views/bookings/invoices-list')
)
// calendar tabs
const Calendar = lazy(() => import('@src/views/calendar'))
//clients tabs
const Clients = lazy(() => import('@src/views/clients'))
const AddClient = lazy(() => import('@src/views/clients/add-client'))
const EditClient = lazy(() => import('@src/views/clients/edit-client'))
const ClientClicked = lazy(() => import('@src/views/clients/client'))
const NewInvoice = lazy(() =>
  import('@src/views/clients/client/client-billing-new-invoice')
)
// notifications
const Notifications = lazy(() => import('@src/views/notifications'))
// reports tabs
const Reports = lazy(() => import('@src/views/reports'))
const SessionAttendanceReport = lazy(() =>
  import('@src/views/reports/attendance')
)
const ClientDetailReport = lazy(() =>
  import('@src/views/reports/client-details')
)
const CoverageReports = lazy(() =>
  import('@src/views/reports/coverage-reports')
)
const InvoiceListReports = lazy(() => import('@src/views/reports/invoice-list'))
const MonthlyIncomeReports = lazy(() =>
  import('@src/views/reports/monthly-income')
)
const PayoutsReport = lazy(() => import('@src/views/reports/payouts'))
// settings tabs
const SettingMyProfile = lazy(() =>
  import('@src/views/settings/management/profile')
)
const SettingMyTeam = lazy(() => import('@src/views/settings/management/team'))
const SettingInvoice = lazy(() =>
  import('@src/views/settings/documents-and-forms/invoice')
)
const SettingNotesAndForms = lazy(() =>
  import('@src/views/settings/documents-and-forms/notes-and-forms')
)
const SettingOtherDocuments = lazy(() =>
  import('@src/views/settings/documents-and-forms/other-documents')
)
const SettingBillingAndServices = lazy(() =>
  import('@src/views/settings/billing/billing-and-services')
)
const SettingInsurance = lazy(() =>
  import('@src/views/settings/billing/insurance')
)
const SettingCalendar = lazy(() =>
  import('@src/views/settings/scheduling/calendar')
)
const SettingLocation = lazy(() =>
  import('@src/views/settings/scheduling/location')
)
const SettingTeleHealth = lazy(() =>
  import('@src/views/settings/scheduling/telehealth')
)
const SettingNotifications = lazy(() =>
  import('@src/views/settings/notifications/notification')
)
const SettingReminders = lazy(() =>
  import('@src/views/settings/notifications/reminder')
)
const ClientAddPayment = lazy(() => import('@src/views/clients/client/client-add-payment'))
const ClientNotesView = lazy(() => import('../../components/screen.components/clients.screen/edit-client-document.component/client-note-form-view'))
// ** Merge Routes
const Routes = [
  {
    path: '/',
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/login',
    element: <Login />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/register',
    element: <Register />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/create-new-password',
    element: <CreatePassword />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },

  {
    path: '/*',
    element: <Error />,
    meta: {
      layout: 'blank',
      publicRoute: true
    }
  },

  {
    path: '/calendar',
    element: <Calendar />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/appointments',
    element: <Appointments />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/bookings/bookings-list',
    element: <Bookings />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/bookings/monthly-invoices',
    element: <BookingsMonthlyInvoice />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/bookings/invoices-list/:id/:month',
    element: <BookingsInvoiceList />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/clients',
    element: <Clients />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/clients/add-client',
    element: <AddClient />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/clients/edit-client/:id',
    element: <EditClient />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/clients/:clientId/notesView/:id',
    element: <ClientNotesView />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/clients/client/:id',
    element: <ClientClicked />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/clients/client/new-invoice/:idx',
    element: <NewInvoice />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/clients/client/edit-invoice/:idx/:id',
    element: <NewInvoice />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/clients/client/client-add-payment/:id',
    element: <ClientAddPayment />,
    meta: {
      publicRoute: false
    }
  },
  // {
  //   path: '/clients/client/new-superbill',
  //   element: <NewSuperBill />
  // },
  // {
  //   path : '/clients/client/new-claim',
  //   element: <NewClaim />
  // },

  {
    path: '/reports',
    element: <Reports />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/reports/session-attendance-report',
    element: <SessionAttendanceReport />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/reports/client-details-reports-list',
    element: <ClientDetailReport />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/reports/coverage-reports',
    element: <CoverageReports />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/reports/invoice-list-reports',
    element: <InvoiceListReports />,
    meta: {
      publicRoute: false
    }
  },
  {
    path: '/reports/monthly-income',
    element: <MonthlyIncomeReports />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/reports/reports-payout',
    element: <PayoutsReport />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/account-activity',
    element: <AccountActivity />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/notifications',
    element: <Notifications />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/my-profile',
    element: <SettingMyProfile />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/my-team',
    element: <SettingMyTeam />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/invoice',
    element: <SettingInvoice />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/notes-and-forms',
    element: <SettingNotesAndForms />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/other-documents',
    element: <SettingOtherDocuments />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/billing-and-service',
    element: <SettingBillingAndServices />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/insurance',
    element: <SettingInsurance />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/calendar',
    element: <SettingCalendar />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/locations',
    element: <SettingLocation />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/teleHealth',
    element: <SettingTeleHealth />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/notifications',
    element: <SettingNotifications />,
    meta: {
      publicRoute: false
    }
  },

  {
    path: '/settings/reminders',
    element: <SettingReminders />,
    meta: {
      publicRoute: false
    }
  }
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute
        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === 'blank' ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}


const getRoutes = (layout) => {
  const defaultLayout = layout || 'vertical'
  const layouts = ['vertical', 'horizontal', 'blank']

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: '/',
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
