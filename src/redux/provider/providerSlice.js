import { createSlice } from '@reduxjs/toolkit'
import { getProviderDetailsActions } from './providerAction'

export const providerDetailsReducer = createSlice({
  name: 'providerDetail',
  initialState: {
    loading: false,
    getProvider: null
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
      // Get All Locations
      .addCase(getProviderDetailsActions.pending, (state) => {
        state.loading = true
      })
      .addCase(getProviderDetailsActions.fulfilled, (state, action) => {
        success(state)
        state.getProvider = action.payload
      })
      .addCase(getProviderDetailsActions.rejected, (state, action) => {
        error(state, action)
        state.getProvider = null
      })
  }
})

export default providerDetailsReducer.reducer
