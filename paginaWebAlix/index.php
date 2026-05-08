<?php
$base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$dir = dirname($_SERVER['PHP_SELF']);
header("Location: " . $base_url . $dir . "/html/index.html");
exit();
?>
