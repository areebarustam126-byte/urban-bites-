<?php
/* ============================================================
   contact.php — POST /api/contact.php
   Receives contact form data, validates, saves to MySQL.
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
$contact = trim($body['contact'] ?? '');
$message = trim($body['message'] ?? '');

if (strlen($name) < 2)
    $errors[] = 'Name must be at least 2 characters.';

// Validate email OR phone
$isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL);
$isPhone = preg_match('/^[\d\s+\-()\u202A-\u202C]{7,20}$/u', $contact);
if (!$contact || (!$isEmail && !$isPhone))
    $errors[] = 'Please enter a valid email or phone number.';

if (strlen($message) < 4)
    $errors[] = 'Message must be at least 4 characters.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ── Save to MySQL ───────────────────────────────────────────
$db = getDB();

$stmt = $db->prepare(
    "INSERT INTO contact_messages (name, contact, message) VALUES (?, ?, ?)"
);
$stmt->bind_param('sss', $name, $contact, $message);

if ($stmt->execute()) {
    $stmt->close();
    $db->close();
    echo json_encode(['success' => true]);
} else {
    $stmt->close();
    $db->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save message. Please try again.']);
}
