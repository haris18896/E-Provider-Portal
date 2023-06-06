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
        title: 'Bookings List',
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
  // {
  //   id: 'account-activity',
  //   title: 'Account Activity',
  //   icon: <Icon icon="bx:bar-chart-alt-2" />,
  //   navLink: '/account-activity'
  // },

  {
    id: 'settings',
    title: 'Settings',
    icon: <Icon icon="ci:settings" />,
    children: [
      {
        id: 'management',
        title: 'Management',
        icon: <Icon icon="akar-icons:circle" width="15" height="15" />,
        children: [
          {
            id: 'profile',
            title: 'My Profile',
            navLink: '/settings/my-profile',
            icon: <Icon icon="icomoon-free:user" width="20" height="20" />
          }
          // {
          //   id: 'team',
          //   title: 'My Team',
          //   navLink: '/settings/my-team',
          //   icon: <Icon icon="ri:team-fill" width="20" height="20" />
          // }
        ]
      },
      {
        id: 'document_and_files',
        title: 'Documents & Files',
        icon: <Icon icon="akar-icons:circle" width="15" height="15" />,
        children: [
          {
            id: 'invoices',
            title: 'Invoice',
            navLink: '/settings/invoice',
            icon: <Icon icon="fa6-solid:file-invoice-dollar" width="20" height="20" />
          },
          {
            id: 'notes_and_forms',
            title: 'Notes & Forms',
            navLink: '/settings/notes-and-forms',
            icon: <Icon icon="fluent:form-multiple-28-filled" width="20" height="20" />
          },
          {
            id: 'other_documents',
            title: 'Other Documents',
            navLink: '/settings/other-documents',
            icon: <Icon icon="fluent:document-pill-20-filled" width="20" height="20" />
          }
        ]
      },
      {
        id: 'billings',
        title: 'Billings',
        icon: <Icon icon="akar-icons:circle" width="15" height="15" />,
        children: [
          {
            id: 'billing_and_service',
            title: 'Billing & Service',
            navLink: '/settings/billing-and-service',
            icon: <Icon icon="fa-regular:money-bill-alt" width="20" height="20" />
          }
          // {
          //   id: 'insurance',
          //   title: 'Insurance',
          //   navLink: '/settings/insurance',
          //   icon: <Icon icon="map:insurance-agency" width="20" height="20" />
          // }
        ]
      },
      {
        id: 'scheduling',
        title: 'Scheduling',
        icon: <Icon icon="akar-icons:circle" width="15" height="15" />,
        children: [
          {
            id: 'calendar',
            title: 'Calendar',
            navLink: '/settings/calendar',
            icon: <Icon icon="fa-regular:money-bill-alt" width="20" height="20" />
          },
          {
            id: 'telehealth',
            title: 'Telehealth',
            navLink: '/settings/telehealth',
            icon: <Icon icon="game-icons:health-normal" width="20" height="20" />
          },
          {
            id: 'locations',
            title: 'Locations',
            navLink: '/settings/locations',
            icon: <Icon icon="carbon:location-heart-filled" width="20" height="20" />
          }
        ]
      },
      {
        id: 'notifications',
        title: 'Notifications',
        icon: <Icon icon="akar-icons:circle" width="15" height="15" />,
        children: [
          {
            id: 'notification',
            title: 'Notifications',
            navLink: '/settings/notifications',
            icon: <Icon icon="carbon:location-heart-filled" width="20" height="20" />
          }
          // {
          //   id: 'reminder',
          //   title: 'Reminders',
          //   navLink: '/settings/reminders',
          //   icon: <Icon icon="carbon:location-heart-filled" width="20" height="20" />
          // }
        ]
      }
    ]
  }
]
