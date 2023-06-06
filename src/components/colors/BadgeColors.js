import {
  Send,
  Save,
  Info,
  PieChart,
  CheckCircle,
  ArrowDownCircle
} from 'react-feather'

// ** Vars
export const StatusObj = {
  1: { color: 'light-success', icon: CheckCircle },
  2: { color: 'light-secondary', icon: Send },
  3: { color: 'primary', icon: Save },
  4: { color: 'light-danger', icon: Info },
  5: { color: 'light-danger', icon: Info }
}

export const bookingStatusObj = {
  1: { color: 'light-success', icon: Send },
  2: { color: 'light-danger', icon: Info },
  3: { color: 'light-success', icon: CheckCircle }
}

export const StatusObjText = {
  1: { text: 'Active' },
  2: { text: 'Cancelled' },
  3: { text: 'Complete' }
}
export const appointmentStatusObj = {
  1: { text: 'Active', color: 'light-success', value: 1, icon: Send },
  2: { text: 'Cancelled', color: 'light-danger', value: 2, icon: Info },
  3: { text: 'Completed', color: 'light-info', value: 3, icon: CheckCircle },
  4: { text: 'Late Show', color: 'light-warning', value: 4},
  5: { text: 'No Show', color: 'light-danger', value: 5},
  6: { text: 'Late Cancelled', color: 'light-danger', value: 6}
}

export const invoiceStatus = {
  0: { color: 'light-success', value: 1, text: 'Paid' },
  1: { color: 'light-danger', value: 2, text: 'Un-Paid' },
  2: { color: 'light-secondary', value: 3, text: 'Void' }
}

export const billingObj = {
  1: { color: 'light-success', icon: CheckCircle },
  2: { color: 'light-danger', icon: Info },
  3: { color: 'light-secondary', icon: Info }
}
export const billingObjText = {
  1: { text: 'paid' },
  2: { text: 'Unpaid' },
  3: { text: 'Void' }
}
export const billingTypeText = {
  1: { text: 'selfPay' },
  2: { text: 'Insurance' }
}
