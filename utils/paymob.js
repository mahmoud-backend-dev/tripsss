// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Import fetch function for Node.js environment

// const API = process.env.API_KEY_PAYMOB;
// const integrationID = 4536791;

// async function authenticateWithPaymob() {
//   const data = {
//     username: "01154407373",
//     password: "Ahmed123@@##$$123"
//   };

//   const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   });


//   if (!response.ok) {
//     throw new Error(`Failed to authenticate with Paymob: ${response.statusText}`);
//   }

//   return await response.json();
// }

// async function createOrder(token) {
//   const data = {
//     "auth_token": token,
//     "delivery_needed": "false",
//     "amount_cents": "10000",
//     "currency": "EGP",
//     "items": []
//   };

//   const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   });
//   return await response.json();
// }

// async function generatePaymentKey(token, orderId) {
//   const data = {
//     "auth_token": token,
//     "amount_cents": "100",
//     "expiration": 3600,
//     "order_id": orderId,
//     "billing_data": {
//       "apartment": "803",
//       "email": "claudette09@exa.com",
//       "floor": "42",
//       "first_name": "ESLAM",
//       "street": "Ethan Land",
//       "building": "8028",
//       "phone_number": "+86(8)9135210487",
//       "shipping_method": "PKG",
//       "postal_code": "01898",
//       "city": "Jaskolskiburgh",
//       "country": "CR",
//       "last_name": "Nicolas",
//       "state": "Utah"
//     },
//     "currency": "EGP",
//     "integration_id": integrationID
//   };

//   const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   });

//   return await response.json();
// }

// async function cardPayment() {
//   try {
//     const authResponse = await authenticateWithPaymob();
//     const token = authResponse.token;

//     const orderResponse = await createOrder(token);
//     const orderId = orderResponse.id;

//     const paymentResponse = await generatePaymentKey(token, orderId);
//     const paymentToken = paymentResponse.token;
//     console.log(`https://accept.paymob.com/api/acceptance/iframes/831328?payment_token=${paymentToken}`)
//     return `https://accept.paymob.com/api/acceptance/iframes/831328?payment_token=${paymentToken}`;
//   } catch (error) {
//     console.error('Error:', error);
//     throw new Error('Error processing payment');
//   }
// }

module.exports = {
  cardPayment
}
const fetch = require('node-fetch');


//const API_KEY_PAYMOB = process.env.API_KEY_PAYMOB;
const integrationID = 4536791;

async function authenticateWithPaymob() {
  const data = {
    username: "01154407373",
    password: "Ahmed123@@##$$123"
  };

  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate with Paymob: ${response.statusText}`);
  }

  return await response.json();
}

async function createOrder(token, amount) {
  const data = {
    "auth_token": token,
    "delivery_needed": "false",
    "amount_cents": `${amount}`,
    "currency": "EGP",
    "items": []
  };

  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

async function generatePaymentKey(token, orderId, obj) {
  const data = {
    "auth_token": token,
    "amount_cents": `${obj.amount}`,
    "expiration": 3600,
    "order_id": orderId,
    "billing_data": {
      "apartment": "803",
      "email": "claudette09@exa.com",
      "floor": "42",
      "first_name": `${obj.name}`,
      "street": "Ethan Land",
      "building": "8028",
      "phone_number": "+86(8)9135210487",
      "shipping_method": "PKG",
      "postal_code": "01898",
      "city": "Jaskolskiburgh",
      "country": "CR",
      "last_name": "Nicolas",
      "state": "Utah",
      "o_id":`${obj.order_id}`
    },
    "currency": "EGP",
    "integration_id": integrationID
  };

  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return await response.json();
}

async function cardPayment(obj, amount) {
  try {
    // if (!API_KEY_PAYMOB) {
    //   throw new Error('API_KEY_PAYMOB is not set');
    // }

    const authResponse = await authenticateWithPaymob();
    const token = authResponse.token;

    const orderResponse = await createOrder(token, amount);
    const orderId = orderResponse.id;

    const paymentResponse = await generatePaymentKey(token, orderId, obj);
    const paymentToken = paymentResponse.token;

    //console.log(`https://accept.paymob.com/api/acceptance/iframes/831328?payment_token=${paymentToken}`);
    
    return {url:`https://accept.paymob.com/api/acceptance/iframes/831328?payment_token=${paymentToken}`,orderId:orderId};
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Error processing payment');
  }
}

module.exports = {
  cardPayment
};
