const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Premium Vendor Membership',
                        description: 'Unlock Client info on all Tenders',
                    },
                    unit_amount: 5000, // $50.00
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/vendor/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL}/vendor/dashboard?payment=cancel`,
            customer_email: req.user.email,
            client_reference_id: req.user.id, // Pass user ID to webhook
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Find user by the reference ID we passed earlier
        await User.findByIdAndUpdate(session.client_reference_id, { isPremium: true });
    }

    res.json({ received: true });
};