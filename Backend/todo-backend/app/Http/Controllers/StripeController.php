<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe;

class StripeController extends Controller
{
    public function stripe()
    {
        return view('stripe');
    }

    public function stripePost(Request $request)
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        \Stripe\Charge::create([
            "amount" => 100 * 100, // 100 USD
            "currency" => "usd",
            "source" => $request->stripeToken,
            "description" => "Test payment from Laravel"
        ]);

        return back()->with('success', 'Payment successful!');
    }
}
