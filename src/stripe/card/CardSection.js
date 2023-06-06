/* eslint-disable comma-dangle */
/* eslint-disable semi */
import { CardElement } from '@stripe/react-stripe-js';
import React from 'react'
import { Label } from 'reactstrap';
import "../card/card.css"
const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
const CardSection = () => {
  return (
   
    <Label>
        Card Details
        <CardElement options={CARD_ELEMENT_OPTIONS}/>
    </Label>
  )
}

export default CardSection