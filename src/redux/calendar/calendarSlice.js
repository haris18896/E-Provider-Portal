import { createSlice } from '@reduxjs/toolkit'

import {
  getCalendarClientsAction,
  addCalendarBookingAction,
  calendarAddNewClientAction,
  getCalendarValidRoomsAction,
  deleteCalendarBookingAction,
  updateCalendarBookingAction,
  addCalendarAppointmentAction,
  updateCalendarAppointmentAction,
  deleteCalendarAppointmentAction,
  getCalendarOtherLocationsAction,
  getCalendarClientServicesAction,
  getCalendarAppointmentByIdAction,
  getCalendarEtheraLocationsAction,
  getAllCalendarAppointmentsAction,
  addCalendarAppointmentWithBookingAction,
  updateCalendarBookingWithAppointmentAction
} from './calendarActions'

export const CalendarReducer = createSlice({
  name: 'calendar',
  initialState: {
    pending: false,
    addBookingPending: false,
    addNewClientPending: false,
    updateBookingPending: false,
    deleteBookingPending: false,
    getValidRoomsPending: false,
    addAppointmentPending: false,
    getClientServicesPending: false,
    updateAppointmentPending: false,
    deleteAppointmentPending: false,
    getEtheraLocationsPending: false,
    getCalendarClientsPending: false,
    getProvidersLocationsPending: false,
    getCalendarAppointmentPending: false,
    addAppointmentWithBookingPending: false,
    updateBookingWithAppointmentPending: false,
    calendarEvents: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    success: false,
    addBooking: [],
    addNewClient: null,
    addAppointment: [],
    updateBooking: null,
    getValidRooms: null,
    getClientServices: [],
    getCalendarClients: [],
    updateAppointment: null,
    getEtheraLocations: null,
    getProviderLocations: null,
    getCalendarAppointment: {},
    addAppointmentWithBooking: null,
    updateBookingWithAppointment: null,
    error: null
  },
  reducers: {
    resetCalendarEvents: (state) => {
      state.calendarEvents = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetGetCalendarAppointment: (state) => {
      state.getCalendarAppointment = {}
    },
    resetEtheraLocations: (state) => {
      state.getEtheraLocations = {}
    },
    resetProviderLocations: (state) => {
      state.getProviderLocations = {}
    },
    resetValidRooms: (state) => {
      state.getValidRooms = {}
    },
    resetAddNewClient: (state) => {
      state.addNewClient = ''
    },
    resetCalendarClients: (state) => {
      state.getCalendarClients = []
    },
    resetClientServices: (state) => {
      state.getClientServices = []
    },
    resetAddAppointment: (state) => {
      state.addAppointment = {}
    },
    resetAddBooking: (state) => {
      state.addBooking = {}
    },
    resetAddAppointmentWithBooking: (state) => {
      state.addAppointmentWithBooking = {}
    },
    resetUpdateAppointment: (state) => {
      state.updateAppointment = {}
    },
    resetUpdateBooking: (state) => {
      state.updateBooking = {}
    },
    resetUpdateBookingWithAppointment: state => {
      state.updateBookingWithAppointment = {}
    }
  },
  extraReducers: (builder) => {
    builder

      // ** Get all Appointments
      .addCase(getAllCalendarAppointmentsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCalendarAppointmentsAction.fulfilled, (state, action) => {
        state.loading = false
        state.calendarEvents.data = action.payload?.result
        state.calendarEvents.offset = action.payload?.offset
        state.calendarEvents.limit = action.payload?.limit
        state.calendarEvents.total = action.payload?.count
      })
      .addCase(getAllCalendarAppointmentsAction.rejected, (state, action) => {
        state.loading = false
        state.calendarEvents = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // ** Get Calendar Appointment By ID
      .addCase(getCalendarAppointmentByIdAction.pending, (state) => {
        state.getCalendarAppointmentPending = true
      })
      .addCase(getCalendarAppointmentByIdAction.fulfilled, (state, action) => {
        state.getCalendarAppointment = action.payload
        state.getCalendarAppointmentPending = false
      })

      .addCase(getCalendarAppointmentByIdAction.rejected, (state, action) => {
        state.error = action.payload
        state.getCalendarAppointment = {}
        state.getCalendarAppointmentPending = false
      })

      // ** Ethera Locations
      .addCase(getCalendarEtheraLocationsAction.pending, (state) => {
        state.getEtheraLocationsPending = true
      })
      .addCase(getCalendarEtheraLocationsAction.fulfilled, (state, action) => {
        state.getEtheraLocationsPending = false
        state.getEtheraLocations = action.payload
      })
      .addCase(getCalendarEtheraLocationsAction.rejected, (state, action) => {
        state.error = action.payload
        state.getEtheraLocationsPending = false
        state.getEtheraLocations = {}
      })

      // ** Provider Locations
      .addCase(getCalendarOtherLocationsAction.pending, (state) => {
        state.getProvidersLocationsPending = true
      })
      .addCase(getCalendarOtherLocationsAction.fulfilled, (state, action) => {
        state.getProvidersLocationsPending = false
        state.getProviderLocations = action.payload
      })
      .addCase(getCalendarOtherLocationsAction.rejected, (state, action) => {
        state.error = action.payload
        state.getProvidersLocationsPending = false
        state.getProviderLocations = {}
      })

      // ** get Valid Rooms
      .addCase(getCalendarValidRoomsAction.pending, (state) => {
        state.getValidRoomsPending = true
      })
      .addCase(getCalendarValidRoomsAction.fulfilled, (state, action) => {
        state.getValidRoomsPending = false
        state.getValidRooms = action.payload
      })
      .addCase(getCalendarValidRoomsAction.rejected, (state, action) => {
        state.getValidRoomsPending = false
        state.error = action.payload
        state.getValidRooms = {}
      })

      // ** add New Client
      .addCase(calendarAddNewClientAction.pending, (state) => {
        state.addNewClientPending = true
      })
      .addCase(calendarAddNewClientAction.fulfilled, (state, action) => {
        state.addNewClientPending = false
        state.addNewClient = action.payload?.access
      })
      .addCase(calendarAddNewClientAction.rejected, (state, action) => {
        state.error = action.payload
        state.addNewClient = ''
        state.addNewClientPending = false
      })

      // ** Get Calendar Clients
      .addCase(getCalendarClientsAction.pending, (state) => {
        state.getCalendarClientsPending = true
      })
      .addCase(getCalendarClientsAction.fulfilled, (state, action) => {
        state.getCalendarClientsPending = false
        state.getCalendarClients = action.payload
      })
      .addCase(getCalendarClientsAction.rejected, (state, action) => {
        state.getCalendarClientsPending = false
        state.getCalendarClients = []
        state.error = action.payload
      })

      // ** Get Client Services
      .addCase(getCalendarClientServicesAction.pending, (state) => {
        state.getClientServicesPending = true
      })
      .addCase(getCalendarClientServicesAction.fulfilled, (state, action) => {
        state.getClientServicesPending = false
        state.getClientServices = action.payload
      })
      .addCase(getCalendarClientServicesAction.rejected, (state, action) => {
        state.getClientServicesPending = false
        state.getClientServices = []
        state.error = action.payload
      })

      // ** Add Appointment
      .addCase(addCalendarAppointmentAction.pending, (state) => {
        state.addAppointmentPending = true
        state.success = false
      })
      .addCase(addCalendarAppointmentAction.fulfilled, (state, action) => {
        state.addAppointmentPending = false
        state.addAppointment = action.payload
        state.success = true
      })
      .addCase(addCalendarAppointmentAction.rejected, (state, action) => {
        state.addAppointmentPending = false
        state.error = action.payload
        state.success = false
      })

      // ** Add Booking
      .addCase(addCalendarBookingAction.pending, (state) => {
        state.addBookingPending = true
      })
      .addCase(addCalendarBookingAction.fulfilled, (state, action) => {
        state.addBookingPending = false
        state.addBooking = action.payload
      })
      .addCase(addCalendarBookingAction.rejected, (state, action) => {
        state.addBookingPending = false
        state.error = action.payload
        state.addBooking = {}
      })

      // ** Add Appointment With Booking
      .addCase(addCalendarAppointmentWithBookingAction.pending, (state) => {
        state.addAppointmentWithBookingPending = true
        state.success = false
      })
      .addCase(
        addCalendarAppointmentWithBookingAction.fulfilled,
        (state, action) => {
          state.addAppointmentWithBookingPending = false
          state.addAppointmentWithBooking = action.payload
          state.success = true
        }
      )
      .addCase(
        addCalendarAppointmentWithBookingAction.rejected,
        (state, action) => {
          state.addAppointmentWithBookingPending = false
          state.error = action.payload
          state.success = false
        }
      )

      // ** delete Booking
      .addCase(deleteCalendarBookingAction.pending, (state) => {
        state.deleteBookingPending = true
        state.success = false
      })
      .addCase(deleteCalendarBookingAction.fulfilled, (state) => {
        state.deleteBookingPending = false
        state.success = true
      })
      .addCase(deleteCalendarBookingAction.rejected, (state, action) => {
        state.deleteBookingPending = false
        state.error = action.payload
        state.success = false
      })

      // ** delete Appointment
      .addCase(deleteCalendarAppointmentAction.pending, (state) => {
        state.deleteAppointmentPending = true
        state.success = false
      })
      .addCase(deleteCalendarAppointmentAction.fulfilled, (state) => {
        state.deleteAppointmentPending = false
        state.success = true
      })
      .addCase(deleteCalendarAppointmentAction.rejected, (state, action) => {
        state.deleteAppointmentPending = false
        state.error = action.payload
        state.success = false
      })

      // ** update Appointment
      .addCase(updateCalendarAppointmentAction.pending, (state) => {
        state.updateAppointmentPending = true
        state.success = false
      })
      .addCase(updateCalendarAppointmentAction.fulfilled, (state, action) => {
        state.updateAppointmentPending = false
        state.success = true
        state.updateAppointment = action.payload
      })
      .addCase(updateCalendarAppointmentAction.rejected, (state, action) => {
        state.updateAppointmentPending = false
        state.error = action.payload
        state.success = false
      })

      // ** Update Booking
      .addCase(updateCalendarBookingAction.pending, (state) => {
        state.updateBookingPending = true
        state.success = false
      })
      .addCase(updateCalendarBookingAction.fulfilled, (state, action) => {
        state.updateBookingPending = false
        state.success = true
        state.updateBooking = action.payload
      })
      .addCase(updateCalendarBookingAction.rejected, (state, action) => {
        state.updateBookingPending = false
        state.error = action.payload
        state.success = false
      })

      // ** Update Booking with Appointment
      .addCase(updateCalendarBookingWithAppointmentAction.pending, (state) => {
        state.updateBookingWithAppointmentPending = true
        state.success = false
      })
      .addCase(updateCalendarBookingWithAppointmentAction.fulfilled, (state, action) => {
        state.updateBookingWithAppointmentPending = false
        state.success = true
        state.updateBookingWithAppointment = action.payload
      })
      .addCase(updateCalendarBookingWithAppointmentAction.rejected, (state, action) => {
        state.updateBookingWithAppointmentPending = false
        state.error = action.payload
        state.success = false
      })

  }
})

export const {
  resetValidRooms,
  resetAddBooking,
  resetAddNewClient,
  resetClientServices,
  resetAddAppointment,
  resetCalendarEvents,
  resetEtheraLocations,
  resetCalendarClients,
  resetProviderLocations,
  resetUpdateAppointment,
  resetUpdateBooking,
  resetGetCalendarAppointment,
  resetAddAppointmentWithBooking
} = CalendarReducer.actions

export default CalendarReducer.reducer
