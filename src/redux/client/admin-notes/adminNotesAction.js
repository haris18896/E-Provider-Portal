/* eslint-disable no-unused-vars */
import jwt_decode from 'jwt-decode'
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import { getClientAppointmentsAction } from '../clientAction'

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

export const getAllAdminNotesAction = createAsyncThunk(
  'adminNotes/get-all-admin-notes',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getAllAdminNotes(offset, limit)

      return res?.data
    } catch (err) {
      // fieldErrors(err)
      toast.error('Something went wrong with get all admin notes')
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAdminNoteByIdAction = createAsyncThunk(
  'adminNotes/get-admin-note-by-id',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await useJwt.getAdminNoteById(id)

      return res?.data
    } catch (err) {
      // fieldErrors(err)
      toast.error('Something went wrong')
    }
  }
)

export const addAdminNoteAction = createAsyncThunk(
  'adminNotes/add-admin-note',
  async ({ data, commonParams, callback }, { dispatch, rejectWithValue }) => {
    try {
      const res = await useJwt.addAdminNote(data)
      if (res?.status === 201) {
        dispatch(getClientAppointmentsAction(commonParams))
        callback()
        toast.success('Admin note added successfully')
      }
      return res?.data
    } catch (err) {
      fieldErrors(err)
      // toast.error('Error adding admin note')
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateAdminNoteAction = createAsyncThunk(
  'adminNotes/update-admin-note',
  async ({ id, clientId }, { rejectWithValue }) => {
    try {
      const res = await useJwt.updateAdminNote(id, clientId)

      if (res.data) {
        toast.success('Admin note updated successfully')
      }
    } catch (err) {
      // fieldErrors(err)
      toast.error('Error updating admin note')
    }
  }
)

export const deleteAdminNoteAction = createAsyncThunk(
  'adminNotes/delete-admin-note',
  async (id, { rejectWithValue }) => {
    try {
      const res = await useJwt.deleteAdminNote(id)

      if (res.status) {
        toast.success('Admin note deleted successfully')
      }
      return res?.data
    } catch (err) {
      // fieldErrors(err)
      toast.error('Error deleting admin note')
      return rejectWithValue(err?.response?.data)
    }
  }
)
