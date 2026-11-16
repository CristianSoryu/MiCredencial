<div align="center">

<img src="assets/images/logoUniversidad.png" alt="Logo Universidad Libre" width="90" />

# 📱 Mi Credencial — App Móvil & Web
**Cliente Multiplataforma con React Native, Expo SDK 54 y TypeScript**

</div>

---

## 📋 Descripción

Aplicación móvil y web universal del sistema **Mi Credencial** para la **Universidad Libre — Seccional Cúcuta**. Permite a los miembros de la comunidad universitaria portar su carnet digital con código QR dinámico, actualizar su fotografía de perfil desde la cámara, acceder a los servicios de **Bienestar Universitario** y gestionar carnets temporales.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Expo SDK 54](https://expo.dev/) & [React Native 0.81](https://reactnative.dev/)
- **Enrutamiento:** `expo-router` v6 (rutas basadas en archivos)
- **Lenguaje:** TypeScript 5.9
- **Almacenamiento Local:** `@react-native-async-storage/async-storage`
- **Cámara e Imágenes:** `expo-image-picker`, `expo-image`
- **Códigos QR:** `react-native-qrcode-svg` + `react-native-svg`
- **Mapas:** `react-native-maps`
- **Contenedores:** `Dockerfile` (Node 20 Alpine + Nginx Alpine) & `docker-compose.yml`

---

## 📂 Estructura de Pantallas (`app/`)

- **`(login)/`**: Inicio de sesión institucional, registro de cuenta (`registro`), recuperación/renovación (`renovacion`) y acceso sin cuenta (`noAccount`).
- **`(tabs)/`**:
  - **`index.tsx` (Home):** Visualización del carnet digital con foto, código QR dinámico, carnets temporales activos y notificaciones.
  - **`bienestar.tsx` (Bienestar):** Solicitud de préstamos (raquetas, PC, balones), agendamiento de citas médicas y cursos.
  - **`herramientas.tsx` (Herramientas):** Panel de gestión rápida (usuarios, carga de archivos, estado de carnets, escáner, historial y generación de QR temporal).
  - **`about.tsx` (Acerca de):** Información institucional y ubicación del campus.
- **`carnetTemporal/`**: Generación de códigos QR para pases temporales de visitantes.

---

## 🚀 Comandos de Desarrollo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

3. **Ejecutar por plataforma:**
   - **Web:** `npm run web`
   - **Android (Expo):** `npm run expo-android`
   - **iOS:** `npm run ios`
   - **Linter:** `npm run lint`

4. **Ejecutar con Docker (Producción Web en Nginx):**
   ```bash
   docker compose up -d --build
   ```
   Disponible en `http://localhost:3000`.
