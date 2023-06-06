import { createSlice } from '@reduxjs/toolkit'
import {
  deleteNoteAttachmentAction,
  addClientNoteAttachmentsAction,
  AddClientsToAppointmentAction,
  deleteNoteFromAppointmentAction,
  deleteClientFromAppointmentAction,
  addClientNoteToClientAppointmentAction,
  updateClientNoteToClientAppointmentAction
} from './clientDetailAction'

export const ClientDetailsReducer = createSlice({
  name: 'clientDetails',
  initialState: {
    deleteNotePending: false,
    deleteClientPending: false,
    deleteAttachmentPending: false,
    getNoteAttachmentsPending: false,
    clientNoteAttachmentPending: false,
    addClientToAppointmentPending: false,
    addClientNoteToAppointmentPending: false,
    updateClientNoteToAppointmentPending: false,
    deleteNote: {},
    deleteClient: {},
    deleteAttachment: {},
    clientNoteAttachment: {},
    addClientToAppointment: {},
    addClientNoteToAppointment: {},
    updateClientNoteToAppointment: {},
    error: null
  },
  reducers: {
    resetAddClientToAppointment: (state) => {
      state.addClientToAppointment = {}
    },
    resetDeleteClientFromAppointment: (state) => {
      state.deleteClient = {}
    },
    resetDeleteNote: (state) => {
      state.deleteNote = {}
    },
    resetAddAttachment: (state) => {
      state.clientNoteAttachment = {}
    },
    resetAddClientNoteToAppointment: (state) => {
      state.addClientNoteToAppointment = {}
    },
    resetUpdateClientNoteToAppointment: (state) => {
      state.updateClientNoteToAppointment = {}
    }
  },
  extraReducers: (builder) =>
    builder
      // ** Add Client to Appointment
      .addCase(AddClientsToAppointmentAction.pending, (state) => {
        state.addClientToAppointmentPending = true
      })
      .addCase(AddClientsToAppointmentAction.fulfilled, (state, action) => {
        state.addClientToAppointmentPending = false
        state.addClientToAppointment = action.payload
      })
      .addCase(AddClientsToAppointmentAction.rejected, (state, action) => {
        state.addClientToAppointmentPending = false
        state.addClientToAppointment = {}
        state.error = action.payload
      })

      // ** deleteClientFromAppointmentAction
      .addCase(deleteClientFromAppointmentAction.pending, (state) => {
        state.deleteClientPending = true
      })
      .addCase(deleteClientFromAppointmentAction.fulfilled, (state, action) => {
        state.deleteClientPending = false
        state.deleteClient = action.payload
      })
      .addCase(deleteClientFromAppointmentAction.rejected, (state, action) => {
        state.deleteClientPending = false
        state.deleteClient = {}
        state.error = action.payload
      })

      // ** Delete Note from Client Appointment
      .addCase(deleteNoteFromAppointmentAction.pending, (state) => {
        state.deleteNotePending = true
      })
      .addCase(deleteNoteFromAppointmentAction.fulfilled, (state, action) => {
        state.deleteNotePending = false
        state.deleteNote = action.payload
      })
      .addCase(deleteNoteFromAppointmentAction.rejected, (state, action) => {
        state.deleteNotePending = false
        state.error = action.payload
        state.delteNote = {}
      })

      // ** delete Note attachment
      .addCase(deleteNoteAttachmentAction.pending, (state) => {
        state.deleteAttachmentPending = true
      })
      .addCase(deleteNoteAttachmentAction.fulfilled, (state, action) => {
        state.deleteAttachmentPending = false
        state.deleteAttachment = action.payload
      })
      .addCase(deleteNoteAttachmentAction.rejected, (state, action) => {
        state.deleteAttachmentPending = false
        state.deleteAttachment = {}
        state.error = action.payload
      })

      // ** Add Note attachments
      .addCase(addClientNoteAttachmentsAction.pending, (state) => {
        state.clientNoteAttachmentPending = true
      })
      .addCase(addClientNoteAttachmentsAction.fulfilled, (state, action) => {
        state.clientNoteAttachmentPending = false
        state.clientNoteAttachment = action.payload
      })
      .addCase(addClientNoteAttachmentsAction.rejected, (state, action) => {
        state.clientNoteAttachmentPending = false
        state.clientNoteAttachment = {}
        state.error = action.payload
      })

      // ** Add Note To Client Appointment
      .addCase(addClientNoteToClientAppointmentAction.pending, (state) => {
        state.addClientNoteToAppointmentPending = true
      })
      .addCase(
        addClientNoteToClientAppointmentAction.fulfilled,
        (state, action) => {
          state.addClientNoteToAppointmentPending = false
          state.addClientNoteToAppointment = action.payload
        }
      )
      .addCase(
        addClientNoteToClientAppointmentAction.rejected,
        (state, action) => {
          state.addClientNoteToAppointmentPending = false
          state.addClientNoteToAppointment = {}
          state.error = action.payload
        }
      )

      // ** update Note To Client Appointment
      .addCase(updateClientNoteToClientAppointmentAction.pending, (state) => {
        state.updateClientNoteToAppointmentPending = true
      })
      .addCase(
        updateClientNoteToClientAppointmentAction.fulfilled,
        (state, action) => {
          state.updateClientNoteToAppointmentPending = false
          state.updateClientNoteToAppointment = action.payload
        }
      )
      .addCase(
        updateClientNoteToClientAppointmentAction.rejected,
        (state, action) => {
          state.updateClientNoteToAppointmentPending = false
          state.updateClientNoteToAppointment = {}
          state.error = action.payload
        }
      )
})

export const {
  resetDeleteNote,
  resetAddAttachment,
  resetAddClientToAppointment,
  resetAddClientNoteToAppointment,
  resetDeleteClientFromAppointment,
  resetUpdateClientNoteToAppointment
} = ClientDetailsReducer.actions

export default ClientDetailsReducer.reducer
