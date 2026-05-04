<?php
// 1. Reanudamos la sesión actual para saber cuál vamos a destruir
session_start();

// 2. Destruimos todas las variables de sesión
session_unset();

// 3. Destruimos la sesión por completo
session_destroy();

// 4. Redirigimos al usuario de vuelta a la página de login
header("Location: login.php");
exit();
?>