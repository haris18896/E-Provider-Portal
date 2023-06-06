// ** Redux Imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import navbar from './navbar'
import layout from './layout'
import skinReducer from './skin'
import ClientReducer from './client/clientSlice'
import ReportsReducer from './reports/reportsSlice'
import BookingsReducer from './booking/bookingSlice'
import AuthReducer from './authentication/authSlice'
import CalendarReducer from './calendar/calendarSlice'
import ELocationsReducer from './location/locationsSlice'
import providerDetailsReducer from './provider/providerSlice'
import stripeReducer from './setting/billing/stripe/stripeSlice'
import AppointmentsReducer from './appointments/appointmentsSlice'
import serviceReducer from './setting/billing/service/serviceSlice'
import notificationsReducer from './notification/notificationSlice'
import AdminNotesReducer from './client/admin-notes/adminNotesSlice'
import LocationsReducer from './setting/scheduling/location/locationSlice'
import ClientDetailsReducer from './client/client-detail/clientDetailSlice'
import billingInfoReducer from './setting/billing/billing-info/billingInfoSlice'
import providerProfileReducer from './setting/management/myProfile/myProfileSlice'
import providerCalendarReducer from './setting/scheduling/calendar/providerCalendarSlice'
import BillingAddressReducer from './setting/scheduling/billing-address/billingAddressSlice'
import NotesAndFormsReducer from './setting/documents-and-forms/notes-and-forms/notesReducer'
import InvoiceReducer from './setting/documents-and-forms/notes-and-forms/invoice/invoiceSlice'
import otherDocumentsReducer from './setting/documents-and-forms/other-documents/otherDocumentsSlice'

const store = configureStore({
  reducer: {
    navbar,
    layout,
    skin: skinReducer,
    auth: AuthReducer,
    calendar: CalendarReducer,
    appointments: AppointmentsReducer,
    booking: BookingsReducer,
    reports: ReportsReducer,
    ELocation: ELocationsReducer,
    locations: LocationsReducer,
    providers: providerProfileReducer,
    providerDetail: providerDetailsReducer,
    client: ClientReducer,
    clientDetails: ClientDetailsReducer,
    adminNotes: AdminNotesReducer,
    service: serviceReducer,
    notification: notificationsReducer,
    notesAndForms: NotesAndFormsReducer,
    billingAddress: BillingAddressReducer,
    settingInvoice: InvoiceReducer,
    providerCalendar: providerCalendarReducer,
    otherDocuments: otherDocumentsReducer,
    stripe: stripeReducer,
    billingInfo: billingInfoReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export { store }
