# CarnetDigitalCuUnilibre
En este proyecto buscamos hacer un sistema de carnets virtuales para poder ingresar a la universidad libre, se tendra que poder ingresar con:

-cartets fisicos
-carnets digitales (nfc)
-codigo de barras

cada "centralita" debera poder leer estos 3 metodos de ingreso, hacer una peticion al servidor principal y mostrar los datos del usuario en pantalla

# libreria visual
en este proyecto se utilizo la libreria de bitluni; https://github.com/bitluni/ESP32CompositeVideo para poder sacar video compuesto del esp32, para poder integrarlo a una pantalla externa, que no necesariamente sea una pantalla TFT.