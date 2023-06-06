import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import moment from 'moment'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    axios.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken()
        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error
        if (response && response.status === 401) {
          localStorage.clear()
          // localStorage.removeItem('accessToken')
          // window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // token
  // onAccessTokenFetched(accessToken) {
  //   this.subscribers = this.subscribers.filter((callback) =>
  //     callback(accessToken)
  //   )
  // }
  //
  // addSubscriber(callback) {
  //   this.subscribers.push(callback)
  // }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('userData'))
  }

  setUserData({ role, decoded }) {
    const superUserAbility = {
      action: 'manage',
      subject: 'all'
    }
    if (role) {
      const useData = { ...decoded, ability: [superUserAbility] }
      localStorage.setItem('userData', JSON.stringify(useData))
    }
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  // ** Authentication
  login(data) {
    return axios.post(this.jwtConfig.loginEndpoint, data)
  }

  createNewPassword(data) {
    const endpoint = `${this.jwtConfig.createNewPasswordEndpoint}`
    return axios.post(endpoint, data)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  // ** Calendar
  getAllCalendarAppointments(offset, limit, startDate, endDate) {
    let endpoint = `${this.jwtConfig.calendarEndPoint}/calendar-list?offset=${offset}&limit=${limit}`

    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    return axios.get(endpoint)
  }

  getCalendarAppointmentById(id) {
    const endpoint = `${this.jwtConfig.calendarEndPoint}/calendar-list/${id}`

    return axios.get(endpoint)
  }

  getEtheraLocations(offset, limit) {
    const endpoint = `${this.jwtConfig.etheraLocationsEndPoint}?offset=${offset}&limit=${limit}`
    return axios.get(endpoint)
  }

  getProvidersLocations(id, offset, limit) {
    const endpoint = `${this.jwtConfig.providerLocationsEndPoint}/${id}/provider-location?offset=${offset}&limit=${limit}/`

    return axios.get(endpoint)
  }

  validateCalendarRooms(id, data) {
    const endpoint = `${this.jwtConfig.calendarValidateRoomsEndPoint}/${id}/valid-rooms-list`

    return axios.post(endpoint, data)
  }

  getClientServices(offset, limit, clients, search) {
    let endpoint = `${this.jwtConfig.getClientServicesEndPoint}?clients=${clients}&offset=${offset}&limit=${limit}`

    if (search) {
      endpoint += `&search=${search}`
    }

    return axios.get(endpoint)
  }

  addAppointment(data) {
    const endpoint = `${this.jwtConfig.addAppointmentEndPoint}`

    return axios.post(endpoint, data)
  }

  addBooking(data) {
    const endpoint = `${this.jwtConfig.addBookingEndpoint}`

    return axios.post(endpoint, data)
  }

  addAppointmentWithBooking(data, id) {
    const endpoint = `${this.jwtConfig.addBookingEndpoint}/${id}/appointment`

    return axios.post(endpoint, data)
  }

  deleteCalendarBooking(id) {
    const endpoint = `${this.jwtConfig.deleteCalendarBookingEndPoint}/${id}`

    return axios.delete(endpoint)
  }

  deleteCalendarAppointment(id) {
    const endpoint = `${this.jwtConfig.updateCalendarAppointmentEndPoint}/${id}`

    return axios.delete(endpoint)
  }

  updateCalendarAppointment(id, data) {
    const endpoint = `${this.jwtConfig.updateCalendarAppointmentEndPoint}/${id}`

    return axios.patch(endpoint, data)
  }

  updateCalendarBooking(id, data) {
    const endpoint = `${this.jwtConfig.updateCalendarBookingEndPoint}/${id}`

    return axios.patch(endpoint, data)
  }

  getAllCalendarClients(offset, limit, search) {
    let endpoint = `${this.jwtConfig.getAllClientsEndPoint}?offset=${offset}&limit=${limit}`

    if (search) {
      endpoint += `&search=${search}`
    }
    return axios.get(endpoint)
  }

  //**  Client
  getAllClients(offset, limit, startDate, endDate, search, status) {
    let endpoint = `${this.jwtConfig.getAllClientsEndPoint}?offset=${offset}&limit=${limit}&ordering=-date_started`

    if (search) {
      endpoint += `&search=${search}`
    }

    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }

    return axios.get(endpoint)
  }

  getClient(id) {
    const endpoint = `${this.jwtConfig.getClientEndPoint}${id}`
    return axios.get(endpoint)
  }
  getClientInvoice(id) {
    const endpoint = `${this.jwtConfig.getClientInvoiceEndPoint}${id}`
    return axios.get(endpoint)
  }

  registerClient(data) {
    const endpoint = `${this.jwtConfig.registerClientEndPoint}`
    return axios.post(endpoint, data)
  }
  registerClientDocuments(data) {
    const endpoint = `${this.jwtConfig.registerClientDocumentsEndPoint}`
    return axios.post(endpoint, data)
  }
  deleteClientDocuments(id) {
    const endpoint = `${this.jwtConfig.registerClientDocumentsEndPoint}/${id}`
    return axios.delete(endpoint)
  }
  uploadInsuranceCardImage(id, img) {
    const endpoint = `${this.jwtConfig.uploadInsuranceCardImageEndPoint}${id}/insurance`

    return axios.post(endpoint, img)
  }

  updateClient(id, data) {
    const endpoint = `${this.jwtConfig.updateClientEndPoint}${id}`
    return axios.patch(endpoint, data)
  }

  updateClientImage(id, img) {
    const endpoint = `${this.jwtConfig.uploadInsuranceCardImageEndPoint}${id}/insurance/change`
    return axios.patch(endpoint, img)
  }

  getAllClientBilling(offset, limit, status, client) {
    let endpoint = `${this.jwtConfig.getAllClientBillingEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`
    if (client) {
      endpoint += `&client=${client}`
    }
    if (status !== null && status !== undefined) {
      endpoint += `&status=${status}`
    }

    return axios.get(endpoint)
  }
  getAllClientDocuments(id) {
    const endpoint = `${this.jwtConfig.getAllClientDocumentsEndPoint}?client=${id}&ordering=-created_at`
    return axios.get(endpoint)
  }

  deleteClient(id) {
    const endpoint = `${this.jwtConfig.getClientEndPoint}${id}`
    return axios.delete(endpoint)
  }

  clientNotes() {
    const endpoint = `${this.jwtConfig.getClientNotesEndPoint}?type=2&is_checked=True`

    return axios.get(endpoint)
  }

  createClientInvoice(data) {
    const endpoint = `${this.jwtConfig.createClientInvoiceEndpoint}`
    return axios.post(endpoint, data)
  }
  getClientAppointments({ id, status, endDate, startDate }) {
    let endpoint = `${this.jwtConfig.getClientAppointmentsEndPoint}?clients=${id}&ordering=-start_date`

    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }

    return axios.get(endpoint)
  }
  getClientBilling(id) {
    const endpoint = `${this.jwtConfig.getClientBillingEndPoint}${id}`
    return axios.get(endpoint)
  }
  updateClientBilling(id, data) {
    const endpoint = `${this.jwtConfig.getClientBillingEndPoint}${id}`
    return axios.patch(endpoint, data)
  }

  deleteClientInvoice(id) {
    const endpoint = `${this.jwtConfig.getClientBillingEndPoint}${id}`
    return axios.delete(endpoint)
  }

  addClientToAppointment(id, data) {
    const endpoint = `${this.jwtConfig.addClientsToAppointment}/${id}/client-add`

    return axios.post(endpoint, data)
  }

  deleteClientFromAppointment({ id, clientId }) {
    const endPoint = `${this.jwtConfig.deleteClientFromAppointment}/${id}/client-delete`

    const data = {
      client: clientId
    }

    return axios.post(endPoint, data)
  }

  deleteClientNoteFromAppointment({ noteId }) {
    const endPoint = `${this.jwtConfig.deleteNoteFromClientAppointment}/${noteId}`

    return axios.delete(endPoint)
  }

  addAttachmentToClientNote(id, data) {
    const endpoint = `${this.jwtConfig.addAttachmentToClientNote}/${id}/appointment-notes-files`

    return axios.post(endpoint, data)
  }

  deleteNoteAttachment(id, attachmentIndex) {
    const endpoint = `${this.jwtConfig.deleteNoteAttachment}/${id}/appointment-notes-files/${attachmentIndex}`

    return axios.delete(endpoint)
  }

  addNoteToAppointment(data) {
    const endpoint = `${this.jwtConfig.addNoteToAppointment}`

    return axios.post(endpoint, data)
  }

  updateNoteInAppointment(noteId, data) {
    const endpoint = `${this.jwtConfig.updateNoteInAppointment}/${noteId}`

    return axios.patch(endpoint, data)
  }

  // ** Admin Notes
  getAllAdminNotes(offset, limit) {
    const endpoint = `${this.jwtConfig.getAllAdminNotes}?offset=${offset}&limit=${limit}`

    return axios.get(endpoint)
  }

  getAdminNoteById(id) {
    const endpoint = `${this.jwtConfig.getAdminNoteById}/${id}`

    return axios.get(endpoint)
  }

  addAdminNote(data) {
    const endpoint = `${this.jwtConfig.addAdminNote}`

    return axios.post(endpoint, data)
  }

  updateAdminNote(id, clientId) {
    const endpoint = `${this.jwtConfig.updateAdminNote}/${id}?client=${clientId}`

    return axios.put(endpoint)
  }

  deleteAdminNote(id) {
    const endpoint = `${this.jwtConfig.deleteAdmin}/${id}`

    return axios.delete(endpoint)
  }

  //** Setting /  Scheduling /  Locations */
  registerLocation(id, data) {
    const endpoint = `${this.jwtConfig.registerLocationEndPoint}${id}/provider-location`
    return axios.post(endpoint, data)
  }

  getAllLocation(offset, limit, id) {
    const endpoint = `${this.jwtConfig.getLocationAllEndPoint}${id}/provider-location?ordering=name&offset=${offset}&limit=${limit}&ordering=-created_at`
    return axios.get(endpoint)
  }

  getLocation(providerId, locationId) {
    const endpoint = `${this.jwtConfig.getLocationEndPoint}${providerId}/provider-location/${locationId}`
    return axios.get(endpoint)
  }

  updateLocation(id, data) {
    const endpoint = `${this.jwtConfig.updateLocationEndPoint}${id}`
    return axios.patch(endpoint, data)
  }

  deleteLocation(id) {
    const endpoint = `${this.jwtConfig.deleteLocationEndPoint}${id}`
    return axios.delete(endpoint)
  }

  //** Setting /  Management /  My profile */

  getProviderProfile() {
    const endpoint = `${this.jwtConfig.getProviderProfileEndPoint}`
    return axios.get(endpoint)
  }

  updateProviderProfile(id, data) {
    const endpoint = `${this.jwtConfig.updateProviderProfileEndPoint}${id}`
    return axios.patch(endpoint, data)
  }

  updateProviderImage(id, img) {
    const endpoint = `${this.jwtConfig.providerImageUploadEndPoint}${id}/image/change`
    return axios.patch(endpoint, img)
  }

  //** Setting /  Billing /  Service */
  getAllService(id, offset, limit) {
    const endpoint = `${this.jwtConfig.getAllServiceEndPoint}${id}/service?offset=${offset}&limit=${limit}&ordering=-created_at`
    return axios.get(endpoint)
  }

  registerService(data) {
    const endpoint = `${this.jwtConfig.registerServiceEndPoint}`
    return axios.post(endpoint, data)
  }

  getServiceById(providerId, id) {
    const endpoint = `${this.jwtConfig.getServiceByIdEndPoint}${providerId}/service/${id}`
    return axios.get(endpoint)
  }

  updateService(data, serviceId) {
    const endpoint = `${this.jwtConfig.updateServiceEndPoint}${serviceId}`
    return axios.patch(endpoint, data)
  }

  deleteService(id) {
    const endpoint = `${this.jwtConfig.deleteServiceEndPoint}${id}`
    return axios.delete(endpoint)
  }

  //** Stripe */
  getAllStripeCard() {
    const endpoint = `${this.jwtConfig.getAllStripeCardEndPoint}`
    return axios.get(endpoint)
  }
  registerStripeCard(data) {
    const endpoint = `${this.jwtConfig.registerStripeCardEndPoint}`
    return axios.post(endpoint, data)
  }
  registerMoreStripeCard(data) {
    const endpoint = `${this.jwtConfig.registerMoreStripeCardEndPoint}`
    return axios.post(endpoint, data)
  }
  updateStripeCard(data) {
    const endpoint = `${this.jwtConfig.updateStripeCardEndPoint}`
    return axios.post(endpoint, data)
  }
  deleteStripeCard(id) {
    const endpoint = `${this.jwtConfig.registerMoreStripeCardEndPoint}/${id}`
    return axios.delete(endpoint)
  }

  //** Locations */
  getAllLocations() {
    const endpoint = `${this.jwtConfig.getAllLocationsEndPoint}`
    return axios.get(endpoint)
  }

  //**  Provider */
  getProviderDetails(id) {
    const endpoint = `${this.jwtConfig.getProviderDetailsEndPoint}${id}`
    return axios.get(endpoint)
  }

  //**  Bookings */
  getAllBookings({
    offset,
    limit,
    startDate,
    endDate,
    status,
    location
  }) {

    let endpoint = `${this.jwtConfig.getAllBookingsEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`
    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    if (location) {
      endpoint += `&location=${location}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }
    //**  after integrating its will works */
    // if (user) {
    //   endpoint += `&user=${user}`
    // }
    return axios.get(endpoint)
  }

  getBookingById(id) {
    const endpoint = `${this.jwtConfig.getBookingByIdEndPoint}/${id}`
    return axios.get(endpoint, id)
  }

  getBookingInvoice(id) {
    const endpoint = `${this.jwtConfig.getBookingInvoiceEndPoint}/${id}`
    return axios.get(endpoint)
  }

  updateBooking(id, data) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }

  getUpdateBookingById(id) {
    const endpoint = `${this.jwtConfig.getUpdateBookingByIdEndPoint}/${id}`
    return axios.get(endpoint, id)
  }

  updateBookingAppointment(id, appointment_id, data) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}/appointment/${appointment_id}}`
    return axios.patch(endpoint, data)
  }

  validateRoom(id, data) {
    const endpoint = `${this.jwtConfig.validateRoomEndPoint}/${id}/rooms/valid-rooms`
    return axios.post(endpoint, data)
  }

  //**  Bookings / Billing */

  getAllBillings({ offset, limit }) {
    const endpoint = `${this.jwtConfig.getAllBillingsEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`

    // if (status) {
    //   endpoint += `&status=${status}`
    // }

    // if (provider_type !== '[]' && provider_type !== undefined) {
    //   endpoint += `&provider_type=${provider_type}`
    // }

    // if (search) {
    //   endpoint += `&search=${search}`
    // }

    return axios.get(endpoint)
  }

  getMonthlyInvoice(id) {
    const endpoint = `${this.jwtConfig.getMonthlyInvoiceEndPoint}/${id}`
    return axios.get(endpoint)
  }

  //**  Appointements */
  getAllAppointments({
    offset,
    limit,
    startDate,
    endDate,
    status,
    location
  }) {
    let endpoint = `${this.jwtConfig.getAllAppointmentsEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`

    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    if (location) {
      endpoint += `&location=${location}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }

    return axios.get(endpoint)
  }

  getAppointmentById(id) {
    const endpoint = `${this.jwtConfig.getAppointmentByIdEndPoint}/${id}`
    return axios.get(endpoint)
  }

  updateAppointment(id, data) {
    const endpoint = `${this.jwtConfig.updateAppointmentEndpoint}${id}`
    return axios.patch(endpoint, data)
  }

  getAllMonthlyIncomeReports({ offset, limit }) {
    const endpoint = `${this.jwtConfig.reportsEndPoint}?offset=${offset}&limit=${limit}`

    return axios.get(`${endpoint}/monthlyIncome`)
  }

  getAllMonthlyInvoiceReports({ offset, limit }) {
    const endpoint = `${this.jwtConfig.reportsEndPoint}?offset=${offset}&limit=${limit}`

    return axios.get(`${endpoint}/monthlyInvoiceReport`)
  }

  getAllPayoutReports({ offset, limit }) {
    const endpoint = `${this.jwtConfig.reportsEndPoint}?offset=${offset}&limit=${limit}`

    return axios.get(`${endpoint}/payoutReports`)
  }

  getAllMonthlyClientsDetails({ offset, limit, startDate, endDate, status }) {
    let endpoint = `${this.jwtConfig.getAllMonthlyClientsDetailsEndPoint}?offset=${offset}&limit=${limit}&ordering=-date_started`
    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }
    if (status) {
      endpoint += `&status=${status}`
    }
    return axios.get(endpoint)
  }

  getAllSessionAttendance({ offset, limit, startDate, endDate }) {
    let endpoint = `${this.jwtConfig.getAllSessionAttendanceEndPoint}?offset=${offset}&limit=${limit}&ordering=-created-at`

    if (startDate && endDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}&end_date=${end}`
    }

    return axios.get(endpoint)
  }

  getAllCoverageReports({ offset, limit }) {
    const endpoint = `${this.jwtConfig.reportsEndPoint}?offset=${offset}&limit=${limit}`

    return axios.get(`${endpoint}/coverageReports`)
  }

  //**  Reports  */

  getAllReports() {
    const endpoint = `${this.jwtConfig.getAllReportsEndPoint}`
    return axios.get(endpoint)
  }

  //** Setting / Scheduling / Notification  */
  getNotifications() {
    const endpoint = `${this.jwtConfig.getNotificationsEndPoint}`
    return axios.get(endpoint)
  }

  updateNotification(data) {
    const endpoint = `${this.jwtConfig.getNotificationsEndPoint}`
    return axios.patch(endpoint, data)
  }
  getReminder() {
    const endpoint = `${this.jwtConfig.reminderEndPoint}`
    return axios.get(endpoint)
  }
  updateReminder(data) {
    const endpoint = `${this.jwtConfig.updateReminderEndPoint}`
    return axios.patch(endpoint, data)
  }
  getClientPayment() {
    const endpoint = `${this.jwtConfig.getClientPaymentEndPoint}`
    return axios.get(endpoint)
  }

  // ** Settings / documents / Notes and Forms

  getAllTemplates() {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}`
    return axios.get(endpoint)
  }

  getTemplateById(id) {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}/${id}`

    return axios.get(endpoint)
  }

  checkedTemplates(id, data) {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}/${id}`

    return axios.patch(endpoint, data)
  }

  deleteTemplate(id) {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}/${id}`

    return axios.delete(endpoint)
  }
  createTemplate(data) {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}`
    return axios.post(endpoint, data)
  }

  updateTemplate(id, data) {
    const endpoint = `${this.jwtConfig.notesAndFormsEndPoint}/${id}`

    return axios.patch(endpoint, data)
  }
  // ** Settings / documents / invoice
  getInvoice(id) {
    const endpoint = `${this.jwtConfig.getInvoiceEndPoint}/${id}`
    return axios.get(endpoint)
  }
  updateInvoice(id, data) {
    const endpoint = `${this.jwtConfig.getInvoiceEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }
  getSuperBills(id) {
    const endpoint = `${this.jwtConfig.getSuperBillsEndPoint}/${id}`
    return axios.get(endpoint)
  }
  updateSuperBills(id, data) {
    const endpoint = `${this.jwtConfig.getSuperBillsEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }

  // ** Settings / documents / invoice
  registerOtherDocuments(data) {
    const endpoint = `${this.jwtConfig.OtherDocumentsEndPoint}`
    return axios.post(endpoint, data)
  }
  getAllOtherDocuments(offset, limit) {
    const endpoint = `${this.jwtConfig.OtherDocumentsEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`
    return axios.get(endpoint)
  }
  updateOtherDocuments(id, data) {
    const endpoint = `${this.jwtConfig.OtherDocumentsEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }
  deleteOtherDocuments(id) {
    const endpoint = `${this.jwtConfig.OtherDocumentsEndPoint}/${id}`
    return axios.delete(endpoint)
  }

  //**  Setting / Scheduling / Calendar  */
  getProviderCalendar() {
    const endpoint = `${this.jwtConfig.getProviderCalendarEndPoint}`
    return axios.get(endpoint)
  }
  updateProviderCalendar(data) {
    const endpoint = `${this.jwtConfig.getProviderCalendarEndPoint}`
    return axios.patch(endpoint, data)
  }

  //**  Setting / Scheduling / Location / Billing Address */

  registerBillingAddress(id, data) {
    const endpoint = `${this.jwtConfig.billingAddressEndpoint}${id}/billing-address`
    return axios.post(endpoint, data)
  }
  getAllBillingAddress(offset, limit, id) {
    const endpoint = `${this.jwtConfig.billingAddressEndpoint}${id}/billing-address?offset=${offset}&limit=${limit}&ordering=-created_at`
    return axios.get(endpoint)
  }
  updateBillingAddress(providerId, id, data) {
    const endpoint = `${this.jwtConfig.billingAddressEndpoint}${providerId}/billing-address/${id}`
    return axios.patch(endpoint, data)
  }
  deleteBillingAddress(providerId, id) {
    const endpoint = `${this.jwtConfig.billingAddressEndpoint}${providerId}/billing-address/${id}`
    return axios.delete(endpoint)
  }

  //**  Notifications */
  getAllNotifications(offset, limit, search) {
    let endpoint = `${this.jwtConfig.getAllNotificationsEndPoint}?offset=${offset}&limit=${limit}&ordering=-created_at`
    if (search) {
      endpoint += `&search=${search}`
    }
    return axios.get(endpoint)
  }
  updateReadNotification(id, data) {
    const endpoint = `${this.jwtConfig.getAllNotificationsEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }
  deleteNotification(id) {
    const endpoint = `${this.jwtConfig.getAllNotificationsEndPoint}/${id}`
    return axios.delete(endpoint)
  }
  markAllNotification() {
    const endpoint = `${this.jwtConfig.markAllNotificationEndPoint}`
    return axios.get(endpoint)
  }

  //**  Setting / billing / billing Info */
  registerBillingInfo(data) {
    const endpoint = `${this.jwtConfig.registerBillingInfoEndPoint}`
    return axios.post(endpoint, data)
  }
  getBillingInfoAction(id) {
    const endpoint = `${this.jwtConfig.registerBillingInfoEndPoint}/${id}`
    return axios.get(endpoint)
  }
  updateBillingInfoAction(id, data) {
    const endpoint = `${this.jwtConfig.registerBillingInfoEndPoint}/${id}`
    return axios.patch(endpoint, data)
  }
}
