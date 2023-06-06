import { Icon } from '@iconify/react'

export default [
  {
    id: 'calendar',
    title: 'Calendar',
    icon: <Icon icon="akar-icons:calendar" />,
    navLink: '/calendar'
  },
  {
    id: 'appointments',
    title: 'Appointments',
    icon: <Icon icon="ant-design:clock-circle-outlined" />,
    navLink: '/appointments'
  },
  {
    id: 'bookings',
    title: 'Bookings',
    icon: <Icon icon="bi:calendar-check" />,
    children: [
      {
        id: 'bookings-view',
        title: 'bookings List',
        icon: <Icon icon="radix-icons:file-text" />,
        navLink: '/bookings/bookings-list'
      },
      {
        id: 'monthly-invoices',
        title: 'Monthly Invoices',
        icon: <Icon icon="cil:layers" />,
        navLink: '/bookings/monthly-invoices'
      }
    ]
  },
  {
    id: 'clients',
    title: 'Clients',
    icon: <Icon icon="heroicons:users" />,
    navLink: '/clients'
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <Icon icon="akar-icons:file" />,
    navLink: '/reports'
  },
  
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Icon icon="clarity:notification-line" />,
    navLink: '/notifications'
  },
  {
    id: 'account-activity',
    title: 'Account Activity',
    icon: <Icon icon="bx:bar-chart-alt-2" />,
    navLink: '/account-activity'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <Icon icon="ci:settings" />,
    children: [
      {
        id: 'management',
        title: 'Management',
        children: [
          {
            id: 'profile',
            title: 'My Profile',
            navLink: '/settings/my-profile'
          },
          {
            id: 'team',
            title: 'My Team',
            navLink: '/settings/my-team'
          }
        ]
      },
      {
        id: 'document_and_files',
        title: 'Documents & Files',
        children: [
          {
            id: 'invoices',
            title: 'Invoice',
            navLink: '/settings/invoice'
          },
          {
            id: 'notes_and_forms',
            title: 'Notes & Forms',
            navLink: '/settings/notes-and-forms'
          },
          {
            id: 'other_documents',
            title: 'Other Documents',
            navLink: '/settings/other-documents'
          }
        ]
      },
      {
        id: 'billings',
        title: 'Billings',
        children: [
          {
            id: 'billing_and_service',
            title: 'Billing & Service',
            navLink: '/settings/billing-and-service'
          },
          {
            id: 'insurance',
            title: 'Insurance',
            navLink: '/settings/insurance'
          }
        ]
      },
      {
        id: 'scheduling',
        title: 'Scheduling',
        children: [
          {
            id: 'calendar',
            title: 'Calendar',
            navLink: '/settings/calendar'
          },
          {
            id: 'telehealth',
            title: 'Telehealth',
            navLink: '/settings/telehealth'
          },
          {
            id: 'locations',
            title: 'Locations',
            navLink: '/settings/locations'
          }
        ]
      },
      {
        id: 'notifications',
        title: 'Notifications',
        children: [
          {
            id: 'notification',
            title: 'Notifications',
            navLink: '/settings/notifications'
          },
          {
            id: 'reminder',
            title: 'Reminders',
            navLink: '/settings/reminders'
          }
        ]
      }
    ]
  }
]
