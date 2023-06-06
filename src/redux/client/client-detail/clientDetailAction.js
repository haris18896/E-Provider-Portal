/* eslint-disable no-unused-vars */
import jwt_decode from 'jwt-decode'
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// ** Actions
import {
  getAllClientBillingAction,
  getAllClientsAction,
  getClientAppointmentsAction
} from '../clientAction'

// Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name={key}
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

// ** Get All Providers List
export const AddClientsToAppointmentAction = createAsyncThunk(
  'clientDetails/add-client-to-appointment',
  async ({ id, data, clientId, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.addClientToAppointment(id, data)

      if (res?.data) {
        callback()
        dispatch(
          getClientAppointmentsAction({ id: clientId, offset: 0, limit: 5 })
        )
        toast.success('Client has been added to appointment')
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteClientFromAppointmentAction = createAsyncThunk(
  'clientDetails/delete-client',
  async (
    { appointmentId, deleteClientId, clientId, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await useJwt.deleteClientFromAppointment({
        id: appointmentId,
        clientId: deleteClientId
      })

      if (res.status === 200) {
        callback()
        dispatch(
          getClientAppointmentsAction({ id: clientId, offset: 0, limit: 5 })
        )
        toast.success('Client has been deleted from appointment')
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteNoteFromAppointmentAction = createAsyncThunk(
  'clientDetails/delete-client-note',
  async ({ noteId, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.deleteClientNoteFromAppointment({
        noteId
      })

      if (res.status === 204) {
        callback()
        toast.success('Note has been deleted from appointment')
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addClientNoteAttachmentsAction = createAsyncThunk(
  'clientDetails/client-note-attachment',
  async ({ id, data, clientId, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.addAttachmentToClientNote(id, data)

      if (res?.data) {
        callback(res?.data)
        dispatch(
          getClientAppointmentsAction({ id: clientId, offset: 0, limit: 5 })
        )
        toast.success('Attachment uploaded successfully')
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteNoteAttachmentAction = createAsyncThunk(
  'clientDetails/delete-note-attachment',
  async ({ id, attachmentIndex, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.deleteNoteAttachment(id, attachmentIndex)

      if (res.status === 204) {
        callback()
        toast.success('Attachment deleted successfully')
      }

      return res?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addClientNoteToClientAppointmentAction = createAsyncThunk(
  'clientDetails/add-client-note-to-client-appointment',
  async ({ data, callback }, { rejectWithValue }) => {
    try {
      const res = await useJwt.addNoteToAppointment(data)
      if (res?.data) {
        callback(res?.data)
        toast.success('Client Note successfully added to appointment')
      }
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateClientNoteToClientAppointmentAction = createAsyncThunk(
  'clientDetails/update-client-note-to-client-appointment',
  async ({ noteId, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.updateNoteInAppointment(noteId, data)
      if (res?.data) {
        callback(res?.data)
        toast.success('Client Note has ben updated successfully')
      }
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const handlePageChange = createAsyncThunk(
  'client/handlePageChange',
  async ({ offset, limit, startDate, endDate, status }, { dispatch }) => {
    dispatch(
      getClientAppointmentsAction({
        offset,
        limit,
        status,
        endDate,
        startDate
      })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'client/handleLimitChange',
  async (
    { oldLimit, newLimit, search, startDate, endDate, status },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getClientAppointmentsAction({
          offset: 0,
          limit: newLimit,
          status,
          endDate,
          startDate
        })
      )
    }
  }
)
