<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <title>MoneyRocket</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body style="margin: 0; padding: 0; background-color: #cbdcf0;">
    <div id="root"></div>
</body>
</html>