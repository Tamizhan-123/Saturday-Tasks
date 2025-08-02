<!DOCTYPE html>
<html>
<head>
    <title>Stripe Payment Gateway</title>
    <script src="https://js.stripe.com/v3/"></script>
    <style>
        .StripeElement {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 15px;
            background-color: white;
        }
    </style>
</head>
<body>
@if (session('success'))
    <h3 style="color:green">{{ session('success') }}</h3>
@endif

<form action="{{ route('stripe.post') }}" method="POST" id="payment-form">
    @csrf

    <input type="text" name="card_holder_name" placeholder="Card Holder Name" required><br><br>

    <label>Card Number</label>
    <div id="card-number" class="StripeElement"></div>

    <label>Expiry Date</label>
    <div id="card-expiry" class="StripeElement"></div>

    <label>CVC</label>
    <div id="card-cvc" class="StripeElement"></div>

    <button type="submit">Pay $100</button>
</form>

<script>
    const stripe = Stripe('{{ config('services.stripe.key') }}');
    const elements = stripe.elements();

    const style = {
        base: {
            color: '#32325d',
            fontSize: '16px',
        }
    };

    const cardNumber = elements.create('cardNumber', { style });
    cardNumber.mount('#card-number');

    const cardExpiry = elements.create('cardExpiry', { style });
    cardExpiry.mount('#card-expiry');

    const cardCvc = elements.create('cardCvc', { style });
    cardCvc.mount('#card-cvc');

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { token, error } = await stripe.createToken(cardNumber);

        if (error) {
            alert(error.message);
        } else {
            const hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);
            form.submit();
        }
    });
</script>
</body>
</html>
