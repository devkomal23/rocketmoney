<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; }
        .container { padding: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Loan Agreement</h1>
        <p>Date: {{ $date }}</p>
        <p>Loan Amount: {{ $loan->amount }}</p>
        </div>
</body>
</html>