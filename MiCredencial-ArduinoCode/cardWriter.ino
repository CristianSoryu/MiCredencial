/*
 * ╔═══════════════════════════════════════════════════════════╗
 * ║                    ESP32 RFID WRITER                      ║
 * ║         Lectura y Escritura de Tarjetas RFID             ║
 * ║                  con Módulo RC522                         ║
 * ╚═══════════════════════════════════════════════════════════╝
 * 
 * Descripción:
 * Sistema completo para leer UIDs y escribir/leer datos
 * en tarjetas RFID MIFARE Classic usando ESP32.
 * 
 * Hardware:
 * - ESP32 Dev Module
 * - Módulo RFID RC522 (MFRC522)
 * - Tarjetas RFID MIFARE Classic 1K
 * 
 * Pines SPI:
 * - SCK:  GPIO 18
 * - MOSI: GPIO 14
 * - MISO: GPIO 19
 * - CS:   GPIO 5
 * - RST:  GPIO 25
 * 
 * Funcionalidades:
 * [1] Leer UID de tarjeta
 * [2] Escribir datos en bloque 4
 * [3] Leer datos del bloque 4
 * 
 * Versión: 1.0
 * Última actualización: 15/02/2026
 */

#include <SPI.h>
#include <MFRC522.h>

// ===== CONFIGURACIÓN DE PINES ESP32 =====
#define SS_PIN    5      // GPIO 5  - Chip Select (SDA)
#define RST_PIN   25     // GPIO 25 - Reset
#define SCK_PIN   18     // GPIO 18 - Clock (SCK)
#define MOSI_PIN  14     // GPIO 14 - Entrada de datos (MOSI)
#define MISO_PIN  19     // GPIO 19 - Salida de datos (MISO)

// ===== INSTANCIA DEL LECTOR RFID =====
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n\n╔═══════════════════════════════════════╗");
  Serial.println("║        ESP32 RFID WRITER v1.0         ║");
  Serial.println("║  Lectura y Escritura de Datos RFID    ║");
  Serial.println("╚═══════════════════════════════════════╝\n");
  
  // Inicializar SPI
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  
  // Inicializar MFRC522
  rfid.PCD_Init();
  
  // Configurar la clave (por defecto todas las tarjetas nuevas tienen FFFFFF)
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  
  Serial.println("📌 Opciones disponibles:");
  Serial.println("  [1] Leer UID de la tarjeta");
  Serial.println("  [2] Escribir datos en la tarjeta");
  Serial.println("  [3] Leer datos de la tarjeta\n");
  Serial.println("Selecciona una opción y presiona Enter...\n");
}

void loop() {
  // Verificar si hay entrada del usuario
  if (Serial.available()) {
    char opcion = Serial.read();
    
    // Limpiar el buffer de entrada
    while (Serial.available()) {
      Serial.read();
    }
    
    delay(500);
    
    switch (opcion) {
      case '1':
        leerUID();
        break;
      case '2':
        escribirDatos();
        break;
      case '3':
        leerDatos();
        break;
      default:
        Serial.println("❌ Opción no válida. Intenta de nuevo.\n");
    }
  }
}

// ===== FUNCIÓN 1: LEER UID =====
void leerUID() {
  Serial.println("\n[1️⃣ ] Acerca una tarjeta RFID...\n");
  
  // Esperar a que haya una tarjeta
  while (!rfid.PICC_IsNewCardPresent()) {
    delay(100);
  }
  
  // Leer UID
  if (!rfid.PICC_ReadCardSerial()) {
    Serial.println("❌ Error al leer la tarjeta");
    return;
  }
  
  Serial.println("╔════════════════════════════════════════╗");
  Serial.println("║         TARJETA DETECTADA             ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  
  Serial.print("🆔 UID: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) {
      Serial.print("0");
    }
    Serial.print(rfid.uid.uidByte[i], HEX);
    
    if (i < rfid.uid.size - 1) {
      Serial.print(" ");
    }
  }
  Serial.println("\n");
  
  // Detener comunicación
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  
  Serial.println("✅ Lectura completada\n");
  mostrarMenu();
}

// ===== FUNCIÓN 2: ESCRIBIR DATOS =====
void escribirDatos() {
  Serial.println("\n[2️⃣ ] Acerca una tarjeta RFID para escribir datos...\n");
  
  // Esperar a que haya una tarjeta
  while (!rfid.PICC_IsNewCardPresent()) {
    delay(100);
  }
  
  if (!rfid.PICC_ReadCardSerial()) {
    Serial.println("❌ Error al leer la tarjeta");
    return;
  }
  
  // Pedir datos al usuario
  Serial.println("Escribe los datos a guardar (máximo 15 caracteres):");
  String datosAEscribir = "";
  
  while (datosAEscribir.length() == 0) {
    if (Serial.available()) {
      char c = Serial.read();
      if (c == '\n') {
        break;
      }
      datosAEscribir += c;
      Serial.write(c);
    }
  }
  
  Serial.println("\n");
  
  // Validar longitud
  if (datosAEscribir.length() > 15) {
    Serial.println("❌ Datos muy largos (máximo 15 caracteres)");
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    mostrarMenu();
    return;
  }
  
  // Preparar buffer (16 bytes)
  byte buffer[16];
  
  // Copiar datos al buffer
  for (int i = 0; i < 16; i++) {
    if (i < datosAEscribir.length()) {
      buffer[i] = (byte)datosAEscribir[i];
    } else {
      buffer[i] = 0x20;  // Llenar con espacios (0x20)
    }
  }
  
  // Bloque a escribir (bloque 4)
  byte bloque = 4;
  
  // Autenticar
  MFRC522::StatusCode status = rfid.PCD_Authenticate(
    MFRC522::PICC_CMD_MF_AUTH_KEY_A, 
    bloque, 
    &key, 
    &(rfid.uid)
  );
  
  if (status != MFRC522::STATUS_OK) {
    Serial.print("❌ Autenticación fallida: ");
    Serial.println(status);
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    mostrarMenu();
    return;
  }
  
  // Escribir bloque
  status = rfid.MIFARE_Write(bloque, buffer, 16);
  
  if (status != MFRC522::STATUS_OK) {
    Serial.print("❌ Escritura fallida: ");
    Serial.println(status);
  } else {
    Serial.println("╔════════════════════════════════════════╗");
    Serial.println("║     ✅ DATOS ESCRITOS EXITOSAMENTE     ║");
    Serial.println("╚════════════════════════════════════════╝\n");
    Serial.print("📝 Datos guardados: ");
    Serial.println(datosAEscribir);
    Serial.println();
  }
  
  // Detener comunicación
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  
  mostrarMenu();
}

// ===== FUNCIÓN 3: LEER DATOS =====
void leerDatos() {
  Serial.println("\n[3️⃣ ] Acerca una tarjeta RFID para leer datos...\n");
  
  // Esperar a que haya una tarjeta
  while (!rfid.PICC_IsNewCardPresent()) {
    delay(100);
  }
  
  if (!rfid.PICC_ReadCardSerial()) {
    Serial.println("❌ Error al leer la tarjeta");
    return;
  }
  
  // Bloque a leer (bloque 4)
  byte bloque = 4;
  byte buffer[18];
  byte bufferSize = sizeof(buffer);
  
  // Autenticar
  MFRC522::StatusCode status = rfid.PCD_Authenticate(
    MFRC522::PICC_CMD_MF_AUTH_KEY_A, 
    bloque, 
    &key, 
    &(rfid.uid)
  );
  
  if (status != MFRC522::STATUS_OK) {
    Serial.print("❌ Autenticación fallida: ");
    Serial.println(status);
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    mostrarMenu();
    return;
  }
  
  // Leer bloque
  status = rfid.MIFARE_Read(bloque, buffer, &bufferSize);
  
  if (status != MFRC522::STATUS_OK) {
    Serial.print("❌ Lectura fallida: ");
    Serial.println(status);
  } else {
    Serial.println("╔════════════════════════════════════════╗");
    Serial.println("║      ✅ DATOS LEÍDOS EXITOSAMENTE      ║");
    Serial.println("╚════════════════════════════════════════╝\n");
    Serial.print("📖 Datos almacenados: ");
    
    // Convertir buffer a string
    String datosLeidos = "";
    for (int i = 0; i < 16; i++) {
      if (buffer[i] != 0x20 && buffer[i] != 0x00) {
        datosLeidos += (char)buffer[i];
      }
    }
    
    Serial.println(datosLeidos);
    Serial.println();
  }
  
  // Detener comunicación
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  
  mostrarMenu();
}

// ===== FUNCIÓN AUXILIAR: MOSTRAR MENÚ =====
void mostrarMenu() {
  Serial.println("📌 Opciones disponibles:");
  Serial.println("  [1] Leer UID de la tarjeta");
  Serial.println("  [2] Escribir datos en la tarjeta");
  Serial.println("  [3] Leer datos de la tarjeta\n");
  Serial.println("Selecciona una opción y presiona Enter...\n");
}
