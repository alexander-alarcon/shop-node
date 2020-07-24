const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute('content');

// A reference to Stripe.js initialized with your real test publishable API key.
const stripe = Stripe('pk_test_am12qqFfMmgE2ZeyTRNcagCY');

// The items the customer wants to buy
const purchase = {
  items: [{ id: 'xl-tshirt' }],
};

/* ------- UI helpers ------- */
// Show a spinner on payment submission
const loading = (isLoading) => {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector('button').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('button').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};

// Shows a success message when the payment is complete
const orderComplete = (paymentIntentId) => {
  document
    .querySelector('.result-message a')
    .setAttribute(
      'href',
      `https://dashboard.stripe.com/test/payments/${paymentIntentId}`,
    );
  document.querySelector('.result-message').classList.remove('hidden');
  document.querySelector('button').disabled = true;
  fetch('/shop/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': token,
    },
  }).then(() => {
    window.location.href = '/shop/orders';
  });
};

// Show the customer the error from Stripe if their card fails to charge
const showError = (errorMsgText) => {
  loading(false);
  const errorMsg = document.querySelector('#card-error');
  errorMsg.textContent = errorMsgText;
  setTimeout(() => {
    errorMsg.textContent = '';
  }, 4000);
};

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
const payWithCard = (stripe, card, clientSecret) => {
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    })
    .then((result) => {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete(result.paymentIntent.id);
      }
    });
};

// Disable the button until we have Stripe set up on the page
document.querySelector('button').disabled = true;
fetch('/shop/create-payment-intent', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': token,
  },
  body: JSON.stringify(purchase),
})
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    const elements = stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    const card = elements.create('card', { style });
    // Stripe injects an iframe into the DOM
    card.mount('#card-element');
    card.on('change', (event) => {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector('button').disabled = event.empty;
      document.querySelector('#card-error').textContent = event.error
        ? event.error.message
        : '';
    });
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Complete payment when the submit button is clicked
      payWithCard(stripe, card, data.clientSecret);
    });
  });
