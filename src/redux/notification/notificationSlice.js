/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  updateReminderAction,
  deleteNotificationAction,
  getAllNotificationAction,
  getNotification,
  getReminderAction,
  updateNotification,
  updateReadNotificationAction,
  markAllNotificationAction
} from './notificationAction'

export const notificationsReducer = createSlice({
  name: 'notifications',
  initialState: {
    getReminderDetail: null,
    markAllNotification: null,
    getNotificationDetail: null,
    updateNotificationDetail: null,
    updateReminderActionDetail: null,
    updateReadNotificationDetail: null,
    getAllNotification: {
      data: [],
      offset: 0,
      limit: 10,
      count: 0
    },
    loading: false,
    markAllLoading: false,
    updateReadLoading: false,
    updateReminderLoading: false,
    updateNotificationloading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    const success = (state) => {
      state.loading = false
      state.error = null
    }

    const error = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder

      // Get All  Notification
      .addCase(getAllNotificationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllNotificationAction.fulfilled, (state, action) => {
        success(state)
        state.getAllNotification.data = action.payload?.result
        state.getAllNotification.offset = action.payload?.offset
        state.getAllNotification.limit = action.payload?.limit
        state.getAllNotification.count = action.payload?.count
      })
      .addCase(getAllNotificationAction.rejected, (state, action) => {
        error(state, action)
        state.getAllNotification = null
      })
      // Mark All  Notification
      .addCase(markAllNotificationAction.pending, (state) => {
        state.markAllLoading = true
      })
      .addCase(markAllNotificationAction.fulfilled, (state, action) => {
        state.markAllLoading = false
        state.markAllNotification = action.payload
        state.error = null
      })
      .addCase(markAllNotificationAction.rejected, (state, action) => {
        state.markAllLoading = false
        state.getAllNotification = null
        state.error = action.payload
      })

      // Get Notification
      .addCase(getNotification.pending, (state) => {
        state.loading = true
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        success(state)
        state.getNotificationDetail = action.payload
      })
      .addCase(getNotification.rejected, (state, action) => {
        error(state, action)
        state.getNotificationDetail = null
      })

      // update Notification
      .addCase(updateReadNotificationAction.pending, (state) => {
        state.updateReadLoading = true
      })
      .addCase(updateReadNotificationAction.fulfilled, (state, action) => {
        state.updateReadLoading = false
        state.updateReadNotificationDetail = action.payload
        state.error = null
      })
      .addCase(updateReadNotificationAction.rejected, (state, action) => {
        state.updateReadLoading = false
        state.updateReadNotificationDetail = null
        state.error = action.payload
      })

      // update Notification
      .addCase(updateNotification.pending, (state) => {
        state.updateNotificationloading = true
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.updateNotificationloading = false
        state.updateNotificationDetail = action.payload
        state.error = null
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.updateNotificationloading = false
        state.updateNotificationDetail = null
        state.error = action.payload
      })

      //**    Reminder Section */

      // Register  Reminder
      .addCase(updateReminderAction.pending, (state) => {
        state.updateReminderLoading = true
      })
      .addCase(updateReminderAction.fulfilled, (state, action) => {
        state.updateReminderLoading = false
        state.updateReminderActionDetail = action.payload
        state.error = action.payload
      })
      .addCase(updateReminderAction.rejected, (state, action) => {
        state.updateReminderLoading = false
        state.updateReminderActionDetail = null
        state.error = action.payload
      })

      // Get  Reminder
      .addCase(getReminderAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getReminderAction.fulfilled, (state, action) => {
        success(state)
        state.getReminderDetail = action.payload
      })
      .addCase(getReminderAction.rejected, (state, action) => {
        error(state, action)
        state.getReminderDetail = null
      })

      // Delete Notification
      .addCase(deleteNotificationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteNotificationAction.fulfilled, (state, action) => {
        success(state)
      })
      .addCase(deleteNotificationAction.rejected, (state, action) => {
        error(state, action)
      })
  }
})

export default notificationsReducer.reducer
