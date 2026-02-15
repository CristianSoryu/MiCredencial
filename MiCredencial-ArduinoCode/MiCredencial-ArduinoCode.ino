#include <SPI.h>
#include <MFRC522.h>

// ===== DEFINIR PINES PARA ESP32 =====
#define SS_PIN    5      // GPIO 5  - Chip Select (SDA)
#define RST_PIN   25     // GPIO 25 - Reset
#define SCK_PIN   18     // GPIO 18 - Clock (SCK)
#define MOSI_PIN  14     // GPIO 14 - Entrada de datos (MOSI)
#define MISO_PIN  19     // GPIO 19 - Salida de datos (MISO)

// ===== CREAR INSTANCIA DEL RFID CON TODOS LOS PINES =====
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  // Inicializar puerto Serial
  Serial.begin(115200);
  delay(2000);
  
  // Inicializar SPI con todos los pines especificados
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  
  // Inicializar MFRC522
  rfid.PCD_Init();
  
}

void loop() {
  // Verificar si hay una tarjeta nueva
  if (!rfid.PICC_IsNewCardPresent()) {
    return;
  }
  
  Serial.println("📍 Tarjeta detectada, leyendo...");
  
  // Verificar si se puede leer la tarjeta
  if (!rfid.PICC_ReadCardSerial()) {
    Serial.println("❌ Error al leer la tarjeta");
    return;
  }

  Serial.print("\n🆔 UID: ");
  
  // Recorrer cada byte del UID
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) {
      Serial.print("0");
    }
    Serial.print(rfid.uid.uidByte[i], HEX);
    
    if (i < rfid.uid.size - 1) {
      Serial.print(" ");
    }
  }
  Serial.println();
  
  // Detener comunicación con la tarjeta
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  
  // Esperar 2 segundos antes de leer otra tarjeta
  delay(2000);
}
