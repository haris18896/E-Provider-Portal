import { MAIN_URL } from '@src/constants'
// ** Auth Endpoints
export default {
  loginEndpoint: `${MAIN_URL}/api/login`,
  createNewPasswordEndpoint: `${MAIN_URL}/api/create-password-confirm`,
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',

  // ** Calendar
  calendarEndPoint: `${MAIN_URL}/api`,
  etheraLocationsEndPoint: `${MAIN_URL}/api/e-location`,
  addAppointmentEndPoint: `${MAIN_URL}/api/appointment`,
  providerLocationsEndPoint: `${MAIN_URL}/api/providers`,
  calendarValidateRoomsEndPoint: `${MAIN_URL}/api/locations`,
  deleteCalendarBookingEndPoint: `${MAIN_URL}/api/booking`,
  updateCalendarAppointmentEndPoint: `${MAIN_URL}/api/appointment`,
  updateCalendarBookingEndPoint: `${MAIN_URL}/api/booking`,
  
  //** Client */
  getClientEndPoint: `${MAIN_URL}/api/clients/`,
  getAllClientsEndPoint: `${MAIN_URL}/api/clients`,
  registerClientEndPoint: `${MAIN_URL}/api/clients`,
  updateClientEndPoint: `${MAIN_URL}/api/clients/`,
  getClientNotesEndPoint: `${MAIN_URL}/api/document`,
  uploadInsuranceCardImageEndPoint: `${MAIN_URL}/api/users/`,
  getClientServicesEndPoint: `${MAIN_URL}/api/client-service`,
  getClientAppointmentsEndPoint: `${MAIN_URL}/api/client-overview`,
  getAllClientBillingEndPoint: `${MAIN_URL}/api/client-invoices`,
  getClientBillingEndPoint: `${MAIN_URL}/api/client-invoices/`,
  updateClientBillingEndPoint: `${MAIN_URL}/api/client-invoices/`,
  getAllClientDocumentsEndPoint: `${MAIN_URL}/api/client-documents`,
  addClientsToAppointment: `${MAIN_URL}/api/appointment`,
  deleteClientFromAppointment: `${MAIN_URL}/api/appointment`,
  deleteNoteFromClientAppointment: `${MAIN_URL}/api/appointment-notes`,
  addAttachmentToClientNote: `${MAIN_URL}/api/appointment-notes`,
  deleteNoteAttachment: `${MAIN_URL}/api/appointment-notes`,
  addNoteToAppointment: `${MAIN_URL}/api/appointment-notes`,
  updateNoteInAppointment: `${MAIN_URL}/api/appointment-notes`,
  getClientInvoiceEndPoint: `${MAIN_URL}/api/invoice-client/`,
  registerClientDocumentsEndPoint: `${MAIN_URL}/api/client-documents`,

  // ** Admin Notes
  getAllAdminNotes: `${MAIN_URL}/api`,
  getAdminNoteById: `${MAIN_URL}/api`,
  addAdminNote: `${MAIN_URL}/api/appointment-notes`,
  updateAdminNote: `${MAIN_URL}/api`,
  deleteAdminNote: `${MAIN_URL}/api`,

  //** Setting /  Scheduling /  Locations */
  getLocationEndPoint: `${MAIN_URL}/api/providers/`,
  getLocationAllEndPoint: `${MAIN_URL}/api/providers/`,
  registerLocationEndPoint: `${MAIN_URL}/api/providers/`,
  updateLocationEndPoint: `${MAIN_URL}/api/provider-location/`,
  deleteLocationEndPoint: `${MAIN_URL}/api/provider-location/`,

  //** Setting /  Management /  My profile */
  providerImageUploadEndPoint: `${MAIN_URL}/api/users/`,
  getProviderProfileEndPoint: `${MAIN_URL}/api/providers/me`,
  updateProviderProfileEndPoint: `${MAIN_URL}/api/providers/`,

  //** Appointments
  updateAppointmentEndpoint: `${MAIN_URL}/api/appointment/`,
  getAllAppointmentsEndPoint: `${MAIN_URL}/api/appointment-tab`,
  getAppointmentByIdEndPoint: `${MAIN_URL}/api/appointment-tab`,

  //** Bookings
  addBookingEndpoint: `${MAIN_URL}/api/booking`,
  editBookingEndPoint: `${MAIN_URL}/api/booking`,
  validateRoomEndPoint: `${MAIN_URL}/api/locations`,
  getAllBookingsEndPoint: `${MAIN_URL}/api/appointment`,
  getBookingByIdEndPoint: `${MAIN_URL}/api/appointment`,
  getUpdateBookingByIdEndPoint: `${MAIN_URL}/api/booking`,
  getBookingInvoiceEndPoint: `${MAIN_URL}/api/appointment-invoice`,

  //** Bookings / Billing invoices
  getAllBillingsEndPoint: `${MAIN_URL}/api/invoices`,
  getMonthlyInvoiceEndPoint: `${MAIN_URL}/api/invoices`,

  //** Locations */
  getAllLocationsEndPoint: `${MAIN_URL}/api/locations`,

  //**  Provider */
  getProviderDetailsEndPoint: `${MAIN_URL}/api/providers/`,

  //** Reports */
  reportsEndPoint: `${MAIN_URL}/api/reports`,
  getAllReportsEndPoint: `${MAIN_URL}/api/reports`,
  getAllMonthlyClientsDetailsEndPoint: `${MAIN_URL}/api/clients/client-detail`,
  getAllSessionAttendanceEndPoint: `${MAIN_URL}/api/attendance`,
  getClientPaymentEndPoint: `${MAIN_URL}/api/client-payment`,

  //**  Notification  */
  getAllNotificationsEndPoint: `${MAIN_URL}/api/notification`,
  getNotificationsEndPoint: `${MAIN_URL}/api/notification-setting/me`,
  getReminderEndPoint: `${MAIN_URL}/api/reminder-setting`,

  //** Setting /  Billing /  Service */
  getAllServiceEndPoint: `${MAIN_URL}/api/providers/`,
  getServiceByIdEndPoint: `${MAIN_URL}/api/providers/`,
  updateServiceEndPoint: `${MAIN_URL}/api/provider-service/`,
  deleteServiceEndPoint: `${MAIN_URL}/api/provider-service/`,
  registerServiceEndPoint: `${MAIN_URL}/api/provider-service`,

  //** Setting /  Billing /  Billing Info */
  registerBillingInfoEndPoint:  `${MAIN_URL}/api/billing-info`,

  //** Stripe */
  getAllStripeCardEndPoint: `${MAIN_URL}/api/provider-stripe`,
  registerStripeCardEndPoint: `${MAIN_URL}/api/provider-stripe-accounts`,
  registerMoreStripeCardEndPoint: `${MAIN_URL}/api/card`,
  updateStripeCardEndPoint: `${MAIN_URL}/api/provider-stripe/change-default`,

  // ** Settings / Documents / Notes and Forms
  notesAndFormsEndPoint: `${MAIN_URL}/api/document`,

  // ** Settings / Documents /Other-Document
  OtherDocumentsEndPoint: `${MAIN_URL}/api/other-documents`,

  // ** Settings / Documents / Invoice
  getInvoiceEndPoint: `${MAIN_URL}/api/invoice-setting`,
  getSuperBillsEndPoint: `${MAIN_URL}/api/superbill-setting`,

  //** Client / Client Billing / Invoice */
  createClientInvoiceEndpoint: `${MAIN_URL}/api/client-invoices`,

  //** Setting /  Sccheduling /  Location */
  billingAddressEndpoint: `${MAIN_URL}/api/providers/`,

  //** Setting /  Sccheduling /  calendar setting */
  getProviderCalendarEndPoint: `${MAIN_URL}/api/provider-calendar/me`,

  //** Setting /  Sccheduling /  Notification */
  reminderEndPoint: `${MAIN_URL}/api/reminder-setting/me`,
  updateReminderEndPoint: `${MAIN_URL}/api/reminder-setting/me`,
  markAllNotificationEndPoint: `${MAIN_URL}/api/notification/mark-all`
}
