/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import { offset } from '@popperjs/core'

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

//** Get All Notifications */
export const getAllNotificationAction = createAsyncThunk(
  'notifications/getAllNotifications',
  async ({ offset, limit, search }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllNotifications(offset, limit, search)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locations'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Notification
export const updateReadNotificationAction = createAsyncThunk(
  'notifications/updateReadNotification',
  async ({ id, data, offset, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateReadNotification(id, data)
      // toast((t) => (
      //   <ToastContent
      //     t={t}
      //     name={'Notification Read Successfully'}
      //     icon={<Check size={14} />}
      //     color="success"
      //     msg={response?.data?.message}
      //   />
      // ))
      dispatch(getAllNotificationAction({ offset, limit }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locations'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Mark All  Notifications
export const markAllNotificationAction = createAsyncThunk(
  'notifications/markAllNotification',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.markAllNotification()
      dispatch(getAllNotificationAction({ offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Notifications'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Notifications
export const getNotification = createAsyncThunk(
  'notifications/getNotifications',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getNotifications()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Notifications'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Notification
export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateNotification(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Notification Update Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getNotification())
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Updating Notifications'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**  Setting / Notification / Notification   */

// ** Get Appointment Reminder
export const getReminderAction = createAsyncThunk(
  'notifications/getReminder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getReminder()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Notifications'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Create  Reminder
export const updateReminderAction = createAsyncThunk(
  'notifications/updateReminder',
  async ({  data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateReminder(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Reminder Updated  Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getReminderAction())
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Register Reminder'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Notification
export const deleteNotificationAction = createAsyncThunk(
  'notifications/deleteNotification',
  async ({ id, offset, limit }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.deleteNotification(id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Notification Deleted Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllNotificationAction({ offset, limit }))
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Deleting Notifications'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)
// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'notifications/handlePageChange',
  async ({ offset, limit, search }, { dispatch }) => {
    dispatch(
      getAllNotificationAction({
        offset,
        limit,
        search
      })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'notifications/handleLimitChange',
  async ({ oldLimit, newLimit, search }, { dispatch }) => {
    dispatch(
      getAllNotificationAction({
        offset: 0,
        limit: newLimit,
        search
      })
    )
  }
)
