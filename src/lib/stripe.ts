import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-ignore stripe-version-2026-07-29.dahlia
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
});
