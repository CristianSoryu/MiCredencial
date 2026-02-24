fetch("https://randomuser.me/api/")
    .then(response => response.json())
    .then(data => {

        const usuario = data.results[0];

        // Nombre completo
        const nombreCompleto = 
            usuario.name.first + " " + usuario.name.last;

        document.getElementById("nombre").textContent = nombreCompleto;

        // Programas posibles
        const programas = [
            "Ingeniería de Sistemas",
            "Ingeniería Industrial",
            "Derecho",
            "Administración de Empresas",
            "Contaduría Pública",
            "Ingeniería TIC"
        ];

        const programaAleatorio = programas[Math.floor(Math.random() * programas.length)];
        document.getElementById("programa").textContent = programaAleatorio;

        // Código aleatorio
        const codigo = "2025" + Math.floor(100000 + Math.random() * 900000);
        document.getElementById("codigoEstudiante").textContent = codigo;

        // Aquí luego podremos generar el QR usando el código
        console.log("Espacio listo para QR");

    })
    .catch(error => {
        console.error("Error al obtener los datos:", error);
    });