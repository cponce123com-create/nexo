# Configuración de NEXO en Render, Neon y Cloudinary

## Estado

Esta integración prepara una instalación nueva: PostgreSQL almacena cuentas y referencias, Cloudinary almacena imágenes y Render ejecuta la aplicación. **Las pruebas automatizadas usan PostgreSQL emulado y Cloudinary simulado; todavía se requiere probar con cuentas reales.** No habilites el registro público hasta validar el despliegue, la entrega de correos, la privacidad de imágenes y los controles de abuso.

La migración automática de una instalación SQLite anterior no está implementada. No apuntes una instalación con datos a Neon esperando que se copien: haz antes una copia y planifica una migración verificada de cuentas, sesiones, publicaciones e imágenes.

## 1. Neon

1. Crea un proyecto y una base de datos en Neon.
2. En Connect, copia la cadena PostgreSQL con TLS, preferentemente la conexión de tipo pooled.
3. Guárdala como `DATABASE_URL` en Render. La aplicación crea las tablas que faltan al arrancar; la cuenta de base de datos necesita permisos de creación. Para una base con datos, revisa primero su compatibilidad.

## 2. Cloudinary

1. Crea un producto de Cloudinary y localiza Cloud name, API key y API secret.
2. Configúralos en Render como `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`. La clave secreta solo se usa en el servidor.
3. Las imágenes importadas se procesan y convierten a WebP; se cargan con tipo `authenticated`. NEXO verifica el acceso del usuario o la publicación antes de obtener el archivo. No se envían al navegador los enlaces firmados de Cloudinary.

Prueba el acceso con dos cuentas y desde una ventana privada. Las imágenes externas que el usuario agregue por URL dependen de sus propios proveedores.

## 3. Correo

En Resend configura una clave y un dominio/remitente autorizado. Agrega `RESEND_API_KEY`, `MAIL_FROM` y `PUBLIC_URL` en Render. NEXO exige estas variables en modo producción y utiliza el correo para verificación de cuentas y recuperación de contraseñas. La entrega real requiere probarse con el dominio configurado.

## 4. Render

Crea un **Web Service**, conecta `cponce123com-create/nexo`, rama `main`, runtime Node, y elige plan Free. Campos:

- Build Command: `npm ci --omit=dev`
- Start Command: `npm start`
- `NODE_VERSION`: `24.22.1`
- `NODE_ENV`: `production`
- `DATABASE_URL`: conexión Neon con TLS
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`, `MAIL_FROM`, `PUBLIC_URL`

También puedes usar `render.yaml` como base de un Blueprint y completar las variables marcadas como secretas en Render. `PUBLIC_URL` debe ser la dirección HTTPS real asignada al servicio, por ejemplo `https://tu-nexo.onrender.com`. No configures `PORT` manualmente. Las variables no deben subirse con credenciales al repositorio.

## 5. Comprobación posterior al despliegue

1. Abre `/demo` y revisa la interfaz en celular y computadora.
2. Crea dos cuentas de prueba, verifica correo y registra un producto con imagen y un aviso con flyer.
3. Comprueba que los borradores y sus imágenes no puedan accederse desde otra cuenta o una ventana privada.
4. Publica y despublica; verifica el acceso a la imagen, WhatsApp y Telegram.
5. Reinicia o vuelve a desplegar y confirma que las cuentas, perfiles e imágenes persisten.
6. Revisa límites gratuitos, cuotas y políticas de cada proveedor, y define copias de seguridad.

Render Free puede suspender el servicio por inactividad. Neon y Cloudinary también tienen cuotas; el uso gratuito no garantiza capacidad ilimitada. La limitación de intentos de NEXO sigue en memoria por instancia y no sustituye protección de abuso distribuida.
