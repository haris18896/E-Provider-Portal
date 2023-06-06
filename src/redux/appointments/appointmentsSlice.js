import { createSlice } from '@reduxjs/toolkit'

import {
  getAllAppointmentsAction,
  getAppointmentByIdAction,
  updateAppointmentAction,
  ValidateRoomAction
} from './appointmentsAction'

export const AppointmentsReducer = createSlice({
  name: 'appointments',
  initialState: {
    appointmentsListPending: false,
    appointmentPending: false,
    updatePending: false,
    success: false,
    getAllAppointments: {
      data: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    getAppointment: null,
    updateBooking: {},

    error: null
  },
  reducers: {
    resetAppointmentsList: (state) => {
      state.getAllAppointments = {
        data: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetGetAppointmentById: (state) => {
      state.getAppointment = {}
    },
    resetUpdateAppointment: (state) => {
      state.updateBooking = {}
    }
  },

  extraReducers: (builder) => {
    builder

      // ** Get all Appointments
      .addCase(getAllAppointmentsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllAppointmentsAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllAppointments.data = action.payload?.result
        state.getAllAppointments.offset = action.payload?.offset
        state.getAllAppointments.limit = action.payload?.limit
        state.getAllAppointments.total = action.payload?.count
      })
      .addCase(getAllAppointmentsAction.rejected, (state, action) => {
        state.loading = false
        state.getAllAppointments = {
          data: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // ** Get appointment by id
      .addCase(getAppointmentByIdAction.pending, (state) => {
        state.appointmentPending = true
      })
      .addCase(getAppointmentByIdAction.fulfilled, (state, action) => {
        state.appointmentPending = false
        state.getAppointment = action.payload
      })
      .addCase(getAppointmentByIdAction.rejected, (state, action) => {
        state.appointmentPending = false
        state.getAppointment = {}
        state.error = action.payload
      })

      // ** Update Appointment
      .addCase(updateAppointmentAction.pending, (state) => {
        state.updatePending = true
        state.success = false
      })
      .addCase(updateAppointmentAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.success = true
        state.updateBooking = action.payload
      })
      .addCase(updateAppointmentAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateBooking = {}
        state.success = false
        state.error = action.payload
      })
  }
})

export const {
  resetAppointmentsList,
  resetGetAppointmentById,
  resetUpdateAppointment
} = AppointmentsReducer.actions

export default AppointmentsReducer.reducer
