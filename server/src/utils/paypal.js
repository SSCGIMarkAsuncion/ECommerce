import { Checkout } from "../schema/carts.js"

export class Paypal {
  /*
   cart CartSchema
   userInfo CREATE_ORDER.purchase_units[i].shipping
    refer to paypal_doc.md
  */
  static createOrder(cart, checkoutBody) {
    const breakdown = new Checkout(cart.products);
    return {
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: cart._id,
        shipping: {
          ...checkoutBody
        },
        amount: {
          currency_code: "PHP",
          value: `${breakdown.total}`
        }
      }],
    };
  }
}