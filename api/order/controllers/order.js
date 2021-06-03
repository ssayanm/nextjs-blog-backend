"use strict";
const api_key = process.env.REACT_APP_STRIPE_SKEY;
const stripe = require("stripe")(api_key);
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const { total, items, token, address } = JSON.parse(ctx.request.body);
    // const { id } = ctx.state.user;

    const stripeAmount = Math.floor(total * 100);

    const charge = await stripe.charges.create({
      amount: stripeAmount,
      currency: "inr",
      source: token,
      description: `order ${new Date()} by ${ctx.state.user._id}`,
    });

    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      items,
    });
    return order;
  },
};
