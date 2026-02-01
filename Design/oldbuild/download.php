<?php
// Remote ZIP file URL
$url = "http://mosaic.techx.company/public.zip";

// Local path where it should be saved
$savePath = __DIR__ . "/public.zip";

// Open file handle for writing
$fp = fopen($savePath, 'w+');
if (!$fp) {
    die("Failed to open file for writing: $savePath");
}

// Initialize cURL
$ch = curl_init($url);

// Stream the download directly into the file
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
curl_setopt($ch, CURLOPT_TIMEOUT, 0);           // No timeout (important for large files)
curl_setopt($ch, CURLOPT_FAILONERROR, true);    // Fail on HTTP errors

// Execute download
if (curl_exec($ch) === false) {
    echo "cURL error: " . curl_error($ch);
} else {
    echo "✅ File downloaded successfully to: $savePath";
}

// Cleanup
curl_close($ch);
fclose($fp);
