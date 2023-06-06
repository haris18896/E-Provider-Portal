import { createSlice } from '@reduxjs/toolkit'
import {
  addAdminNoteAction,
  deleteAdminNoteAction,
  getAdminNoteByIdAction,
  getAllAdminNotesAction,
  updateAdminNoteAction
} from './adminNotesAction'

export const AdminNotesReducer = createSlice({
  name: 'adminNotes',
  initialState: {
    addAdminNotePending: false,
    deleteAdminNotePending: false,
    updateAdminNotePending: false,
    getAdminNoteByIdPending: false,
    getAllAdminNotesPending: false,
    addAdminNote: {},
    getAdminNotes: {},
    updateAdminNote: {},
    getAdminNoteById: {},
    error: null
  },
  reducers: {
    resetGetAllAdminNotes: (state) => {
      state.getAllAdminNotes = {}
    },
    resetGetAdminNoteById: (state) => {
      state.getAdminNoteById = {}
    },
    resetAddAdminNote: (state) => {
      state.addAdminNote = {}
    },
    resetUpdateAdminNote: (state) => {
      state.updateAdminNote = {}
    }
  },
  extraReducers: (builder) => {
    builder
      // ** Get All Admin Notes
      .addCase(
        getAllAdminNotesAction.pending,
        (state) => (state.getAllAdminNotesPending = true)
      )
      .addCase(getAllAdminNotesAction.fulfilled, (state, action) => {
        state.getAllAdminNotesPending = false
        state.getAdminNotes = action.payload
      })
      .addCase(getAllAdminNotesAction.rejected, (state, action) => {
        state.getAllAdminNotesPending = false
        state.getAdminNotes = {}
        state.error = action.payload
      })

      // ** Get Admin Note by id
      .addCase(
        getAdminNoteByIdAction.pending,
        (state) => (state.getAdminNoteByIdPending = true)
      )
      .addCase(getAdminNoteByIdAction.fulfilled, (state, action) => {
        state.getAdminNoteByIdPending = false
        state.getAdminNoteById = action.payload
      })
      .addCase(getAdminNoteByIdAction.rejected, (state, action) => {
        state.getAdminNoteByIdPending = false
        state.getAdminNoteById = {}
        state.error = action.payload
      })

      // ** Add Admin Note
      .addCase(addAdminNoteAction.pending, (state) => {
        state.addAdminNotePending = true
      })
      .addCase(addAdminNoteAction.fulfilled, (state, action) => {
        state.addAdminNotePending = false
        state.addAdminNote = action.payload
      })
      .addCase(addAdminNoteAction.rejected, (state, action) => {
        state.addAdminNotePending = false
        state.addAdminNote = {}
        state.error = action.payload
      })

      // ** Update Admin Note
      .addCase(
        updateAdminNoteAction.pending,
        (state) => (state.updateAdminNotePending = true)
      )
      .addCase(updateAdminNoteAction.fulfilled, (state, action) => {
        state.updateAdminNotePending = false
        state.updateAdminNote = action.payload
      })
      .addCase(updateAdminNoteAction.rejected, (state, action) => {
        state.updateAdminNotePending = false
        state.updateAdminNote = {}
        state.error = action.payload
      })

      // ** Update Admin Note
      .addCase(
        deleteAdminNoteAction.pending,
        (state) => (state.deleteAdminNotePending = true)
      )
      .addCase(deleteAdminNoteAction.fulfilled, (state) => {
        state.deleteAdminNotePending = false
      })
      .addCase(deleteAdminNoteAction.rejected, (state, action) => {
        state.deleteAdminNotePending = false
        state.error = action.payload
      })
  }
})

export const {
  resetAddAdminNote,
  resetUpdateAdminNote,
  resetGetAllAdminNotes,
  resetGetAdminNoteById
} = AdminNotesReducer.actions

export default AdminNotesReducer.reducer
