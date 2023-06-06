/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  getProviderProfileAction,
  updateProviderImageAction,
  updateProviderProfileAction
} from './myProfileActions'

export const providerProfileReducer = createSlice({
  name: 'providerProfile',
  initialState: {
    loading: false,
    updateLoading: false,
    loadingImage: false,
    getProviderProfile: null,
    updateProviderProfile: null
  },
  reducers: {
    resetGetProviderProfile: (state) => {
      state.getProviderProfile = null
    }
  },
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

      //** Get Provider Profile */
      .addCase(getProviderProfileAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getProviderProfileAction.fulfilled, (state, action) => {
        success(state)
        state.getProviderProfile = action.payload
      })
      .addCase(getProviderProfileAction.rejected, (state, action) => {
        error(state, action)
        state.getProviderProfile = null
      })

      //** Update Provider Profile */
      .addCase(updateProviderProfileAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateProviderProfileAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateProviderProfile = action.payload
        state.error = null
      })
      .addCase(updateProviderProfileAction.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload
        state.updateProviderProfile = null
      })

      //** Update Provider Image */
      .addCase(updateProviderImageAction.pending, (state) => {
        state.loadingImage = true
      })
      .addCase(updateProviderImageAction.fulfilled, (state, action) => {
        state.imageError = null
        state.loadingImage = false
      })
      .addCase(updateProviderImageAction.rejected, (state, action) => {
        state.loadingImage = false
        state.uploadImageError = action.payload
      })
  }
})

export const { resetGetProviderProfile } = providerProfileReducer.actions
export default providerProfileReducer.reducer
