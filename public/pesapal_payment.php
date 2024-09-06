<?php
// pesapal_payment.php

// Pesapal credentials
$consumerKey = process.;  // Replace with your Pesapal Consumer Key
$consumerSecret = 'yourConsumerSecret';  // Replace with your Pesapal Consumer Secret

// Pesapal OAuth endpoint
$oauthUrl = 'https://pesapal.com/api/AuthRequestToken';

// Function to generate the OAuth signature
function generateOAuthSignature($url, $params, $consumerSecret) {
    $baseString = "POST&" . rawurlencode($url) . "&" . rawurlencode(http_build_query($params));
    $signatureKey = rawurlencode($consumerSecret) . "&";
    return base64_encode(hash_hmac('sha1', $baseString, $signatureKey, true));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $amount = $data['amount'];
    $description = $data['description'];
    $reference = $data['reference'];
    $email = $data['email'];
    $method = $data['method'];

    // Prepare OAuth parameters
    $oauthParams = [
        'oauth_consumer_key' => $consumerKey,
        'oauth_nonce' => time(),
        'oauth_signature_method' => 'HMAC-SHA1',
        'oauth_timestamp' => time(),
        'oauth_version' => '1.0',
        'oauth_callback' => 'http://your-redirect-url.com' // Add your callback URL
    ];

    // Generate OAuth signature
    $oauthParams['oauth_signature'] = generateOAuthSignature($oauthUrl, $oauthParams, $consumerSecret);

    // Create the OAuth request
    $options = [
        'http' => [
            'header' => "Content-Type: application/x-www-form-urlencoded",
            'method' => 'POST',
            'content' => http_build_query($oauthParams)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($oauthUrl, false, $context);

    if ($result === FALSE) {
        // Handle error
        echo json_encode(['error' => 'OAuth request failed']);
        exit();
    }

    // Assume $pesapalRedirectUrl is generated from Pesapal API:
    $pesapalRedirectUrl = 'https://pesapal.com/redirect?ref=' . $reference;

    // Return the URL for redirection
    echo json_encode(['redirectUrl' => $pesapalRedirectUrl]);
}
?>
