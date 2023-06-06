import * as Yup from 'yup'

export const notificationValidationSchema = Yup.object().shape({
  client_messages: Yup.boolean(),
  payment_received: Yup.boolean(),
  payment_overdue: Yup.boolean(),
  client_check_in: Yup.boolean(),
  software_updates: Yup.boolean()
})

export const notificationsOptions = [
  {
    label: 'Client Message',
    value: false,
    name: 'client_messages'
  },
  {
    label: 'Payment Received',
    value: false,
    name: 'payment_received'
  },
  {
    label: 'Payment Overdue',
    value: false,
    name: 'payment_overdue'
  },
  {
    label: 'Client Check In',
    value: false,
    name: 'client_check_in'
  },
  {
    label: 'software Update',
    value: false,
    name: 'software_updates'
  }
]

// Appointment Reminder options
export const reminderOptions = [
  {
    label: '48 hours before',
    value: 1
  },
  {
    label: '24 hours before',
    value: 2
  },
  {
    label: '1 hour before',
    value: 3
  },
  {
    label: '5 minutes before',
    value: 4
  },
  {
    label: 'Session start time',
    value: 5
  },
  {
    label: 'None',
    value: 6
  }
]

// client notes reminder options
export const clientNotesOptions = [
  {
    label: 'Session end time',
    value: 1,
     name: 'Session end time'
  },
  {
    label: '5 minutes after',
    value: 2,
     name: '5 minutes after'
  },
  {
    label: '1 hour after',
    value: 3,
     name: '1 hour after'
  },
  {
    label: '24 hours after',
    value: 4,
     name: '24 hours after'
  },
  {
    label: '48 hours after',
    value: 5,
     name: '48 hours after'
  },
  {
    label: 'None',
    value: 6,
    name: 'none'
  }
]
