/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_51M9SBOF9LNmI3C814aLtEq9ipeG328FyDD0WllsvNU7tEug2kqXTTjSQZSOSAay6g89qLJ5xTtQoIaFmTsbb8Btl00Oi8bulnD');

export const bookTour = async tourId => {
  try {
    //(1) Get checkout session from API
    // const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)
    // console.log(session);

    //(2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id

    });

  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }

};

