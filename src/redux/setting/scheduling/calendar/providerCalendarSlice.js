import { createSlice } from '@reduxjs/toolkit'
import {
  getProviderCalendarAction,
  updateProviderCalendarAction
} from './providerCalendarAction'

export const providerCalendarReducer = createSlice({
  name: 'providerCalendar',
  initialState: {
    error: null,
    loading: false,
    updateLoading: false,
    getProviderCalendar: null,
    updateProviderCalendar: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ** Get provider calendar
      .addCase(getProviderCalendarAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getProviderCalendarAction.fulfilled, (state, action) => {
        state.loading = false
        state.getProviderCalendar = action.payload
        state.error = null
      })
      .addCase(getProviderCalendarAction.rejected, (state, action) => {
        state.loading = false
        state.getProviderCalendar = {}
        state.error = action.payload
      })

      // ** update calendar
      .addCase(updateProviderCalendarAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateProviderCalendarAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateProviderCalendar = action.payload
        state.error = null
      })
      .addCase(updateProviderCalendarAction.rejected, (state, action) => {
        state.updateLoading = false
        state.updateProviderCalendar = {}
        state.error = action.payload
      })
  }
})

export default providerCalendarReducer.reducer
