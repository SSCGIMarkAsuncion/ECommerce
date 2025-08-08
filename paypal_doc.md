# (Create Order)[https://developer.paypal.com/docs/api/orders/v2/#orders-create-request-body]
## Required Schema
```javascript
CREATE_ORDER {
  purchase_units: [{
    reference_id: "<Cart_Id>",
    shipping: {
      type: "SHIPPING" | "PICKUP_IN_STORE" | "PICKUP_FROM_PERSON",
      name: {
        full_name: "<payer_name>"
      },
      email_address: "<email>",
      phone_number: {
        country_code: "63",
        national_number: "<number>",
      },
      address: {
        address_line_1: "<address>",
        address_line_2:  "<address>",
        admin_area_2: "<city_town>",
        admin_area_1: "PHILIPPINES",
        postal_code: "<postal>",
        country_code: "PH"
      }
    },
    amount: {
      currency_code: "PHP",
      value: "<number_string>"
    },
  }],
  intent: "CAPTURE" | "AUTHORIZE", // use capture for immediate pay
}
```
## FLOW
```
user_orders (clicks paypal button) -> create_order (use cartId for ref, server prepares the order information, paypal handles actual transaction) -> onApprove (capture orderId and payerId, push to db) -> Update status of cart
```


# Success
createOrder -> onApprove

# Error
createOrder -> onError

# Cancel
createOrder -> onCancel
