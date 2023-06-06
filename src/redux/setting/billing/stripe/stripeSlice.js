/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  deleteStripeCardAction,
  getAllStripeCardAction,
  registerMoreStripeCardAction,
  registerStripeCardAction,
  updateStripeCardAction
} from './stripeAction'

export const stripeReducer = createSlice({
  name: 'stripe',
  initialState: {
    getAllCards: null,
    registerStripeCard: null,
    getAllCardsLoading: false,
    registerCardsLoading: false,
    registerMoreStripeCard: null,
    registerMoreStripeCardLoading: false,
    updateStripeCardLoading: false,
    deleteStripeCardLoading: false,
    updateStripeCard: null
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

      //** get all stripe cards  */
      .addCase(getAllStripeCardAction.pending, (state) => {
        state.getAllCardsLoading = true
      })
      .addCase(getAllStripeCardAction.fulfilled, (state, action) => {
        state.getAllCardsLoading = false
        state.getAllCards = action.payload
        state.error = null
      })
      .addCase(getAllStripeCardAction.rejected, (state, action) => {
        state.getAllCardsLoading = false
        state.getAllCards = null
        state.error = action.payload
      })

      //** add stripe cards  */
      .addCase(registerStripeCardAction.pending, (state) => {
        state.registerCardsLoading = true
      })
      .addCase(registerStripeCardAction.fulfilled, (state, action) => {
        state.registerCardsLoading = false
        state.registerStripeCard = action.payload
        state.error = null
      })
      .addCase(registerStripeCardAction.rejected, (state, action) => {
        state.registerCardsLoading = false
        state.registerStripeCard = null
        state.error = action.payload
      })

      //** add more stripe cards  */
      .addCase(registerMoreStripeCardAction.pending, (state) => {
        state.registerMoreStripeCardLoading = true
      })
      .addCase(registerMoreStripeCardAction.fulfilled, (state, action) => {
        state.registerMoreStripeCardLoading = false
        state.registerMoreStripeCard = action.payload
        state.error = null
      })
      .addCase(registerMoreStripeCardAction.rejected, (state, action) => {
        state.registerMoreStripeCardLoading = false
        state.registerMoreStripeCard = null
        state.error = action.payload
      })

      //** update stripe cards  */
      .addCase(updateStripeCardAction.pending, (state) => {
        state.updateStripeCardLoading = true
      })
      .addCase(updateStripeCardAction.fulfilled, (state, action) => {
        state.updateStripeCardLoading = false
        state.updateStripeCard = action.payload
        state.error = null
      })
      .addCase(updateStripeCardAction.rejected, (state, action) => {
        state.updateStripeCardLoading = false
        state.updateStripeCard = null
        state.error = action.payload
      })

      //** delete card  */
      .addCase(deleteStripeCardAction.pending, (state) => {
        state.deleteStripeCardLoading = true
      })
      .addCase(deleteStripeCardAction.fulfilled, (state, action) => {
        state.deleteStripeCardLoading = false
        state.error = null
      })
      .addCase(deleteStripeCardAction.rejected, (state, action) => {
        state.deleteStripeCardLoading = false
        state.error = action.payload
      })
  }
})

export default stripeReducer.reducer
