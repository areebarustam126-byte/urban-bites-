<?php
/* ============================================================
   orders.php — POST /api/orders.php
   Receives order from frontend, validates, saves to MySQL.
============================================================ */

require_once __DIR__ . '/db.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Read JSON body
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON.']);
    exit;
}

// ── Validation ─────────────────────────────────────────────
$errors = [];

$name    = trim($body['name']    ?? '');
$phone   = trim($body['phone']   ?? '');
$address = trim($body['address'] ?? '');
$notes   = trim($body['notes']   ?? '');
$payment = trim($body['payment'] ?? '');
$items   = $body['items']        ?? [];

if (strlen($name) < 2)
    $errors[] = 'Full name must be at least 2 characters.';

if (!preg_match('/^[\d\s+\-()\u202A-\u202C]{10,20}$/u', $phone))
    $errors[] = 'Please enter a valid phone number (10-20 digits).';

if (strlen($address) < 8)
    $errors[] = 'Delivery address must be at least 8 characters.';

if (!in_array($payment, ['cod', 'jazz', 'easypaisa']))
    $errors[] = 'Invalid payment method.';

if (!is_array($items) || count($items) < 1)
    $errors[] = 'Order must contain at least one item.';

foreach ($items as $item) {
    if (empty($item['id']))    $errors[] = 'Each item must have an id.';
    if (empty($item['name']))  $errors[] = 'Each item must have a name.';
    if (!isset($item['price']) || intval($item['price']) < 1)
        $errors[] = 'Each item price must be a positive number.';
    if (!isset($item['qty']) || intval($item['qty']) < 1)
        $errors[] = 'Each item qty must be at least 1.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ── Calculate totals ────────────────────────────────────────
$subtotal = 0;
foreach ($items as $item) {
    $subtotal += intval($item['price']) * intval($item['qty']);
}
$deliveryFee = $subtotal >= 1000 ? 0 : 150;
$total = $subtotal + $deliveryFee;

// ── Generate Order ID ───────────────────────────────────────
$orderId = 'UB-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

// ── Save to MySQL ───────────────────────────────────────────
$db = getDB();

$itemsJson = json_encode($items);

$stmt = $db->prepare(
    "INSERT INTO orders
     (order_id, customer_name, phone, address, notes, payment_method, items, subtotal, delivery_fee, total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    'ssssssssii',
    $orderId, $name, $phone, $address, $notes,
    $payment, $itemsJson, $subtotal, $deliveryFee, $total
);

if ($stmt->execute()) {
    $stmt->close();
    $db->close();
    echo json_encode([
        'success'     => true,
        'orderId'     => $orderId,
        'subtotal'    => $subtotal,
        'deliveryFee' => $deliveryFee,
        'total'       => $total,
    ]);
} else {
    $stmt->close();
    $db->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save order. Please try again.']);
}
