# NEXO

Plataforma gratuita de páginas personales y tienda con consultas por WhatsApp. Esta versión implementa un primer sistema multiusuario para desarrollo y pruebas. **Todavía no está lista para abrirse al público**: faltan moderación, almacenamiento de imágenes, pruebas del servicio de correo real y las medidas operativas descritas en `docs/arquitectura.md`.

## Ejecutar

Se necesita Node.js 22.13 o superior (se recomienda una versión LTS compatible). El proyecto usa SQLite integrado en Node y no requiere instalar paquetes.

```sh
npm start
```

Abrir <http://localhost:3000>, registrar una cuenta, editar el perfil y pulsar «Publicar página». La página quedará disponible en `/u/nombre-de-usuario`. Para ejecutar pruebas: `npm test`.

Los datos se guardan por defecto en `nexo.sqlite` en el directorio actual. La variable `DATABASE_PATH` permite cambiar la ruta y `PORT` cambia el puerto. Conserva y respalda la base de datos, incluidos sus archivos WAL cuando corresponda. Los archivos SQLite y `.env` están ignorados por Git.

## Funciones actuales

- Registro e inicio de sesión con contraseña y sesiones en cookies; aislamiento básico por usuario.
- Perfil, enlaces, colores y tienda de hasta seis productos con precio e imagen por URL.
- Borradores privados, publicación y despublicación de perfiles.
- Botón de WhatsApp que prepara un mensaje con producto y precio. El número del vendedor es visible y la operación no procesa pagos.
- Recuento de visitas de los últimos 30 días; cuenta solicitudes, no personas únicas.

Las imágenes de productos se pueden cargar como JPG, PNG o WebP (máximo 2 MB) o enlazar por URL. Las imágenes importadas se guardan en SQLite, cuyo archivo y respaldo incluyen esos datos. Para cambiar el nombre de usuario de una página publicada hay que despublicarla primero. La recuperación y confirmación de correo requieren configurar un proveedor.

## Organización

- `server/`: base de datos, autenticación y rutas HTTP.
- `src/model.js`, `src/store.js`: validación y modelo compartido.
- `src/app.js`, `src/preview.js`, `src/styles.css`: editor y página pública.
- `tests/`: pruebas de modelo y flujos HTTP entre cuentas.
- `docs/`: arquitectura, referencias y pendientes.

## Seguridad de la cuenta

En el editor, la sección Seguridad permite cambiar la contraseña (cierra todas las sesiones) y cerrar las demás sesiones. La recuperación por correo requiere configurar el proveedor indicado abajo.

## Correo y recuperación

Para habilitar verificación de correo y recuperación de contraseña configura `RESEND_API_KEY`, `MAIL_FROM` (remitente autorizado por el proveedor) y `PUBLIC_URL` (la dirección HTTPS de la aplicación). En producción, el servidor exige estas tres variables al iniciar. El usuario solicita el correo de verificación desde su panel; debe verificarlo antes de publicar. En desarrollo sin correo configurado no se envían mensajes y se omite esta comprobación: no utilices esa modalidad para usuarios reales.

Los enlaces de verificación y recuperación vencen en una hora y son de un solo uso. La recuperación invalida las sesiones existentes. La integración de correo debe probarse con una cuenta y dominio configurados antes de utilizarse.

## Copias de seguridad

Ejecuta `node scripts/backup.js ruta/a/nexo.sqlite ruta/a/copia-nueva.sqlite`. El archivo de destino no debe existir. Guarda la copia cifrada y verifica regularmente que pueda restaurarse; la base contiene datos privados de cuentas.

## Demostración de interfaz

Con el servidor en marcha, visita `http://localhost:3000/demo` o selecciona «Explorar demostración» en la pantalla de acceso. La demo usa datos ficticios en memoria; no publica una página y se reinicia al salir. Los productos no tienen número de WhatsApp configurado. Las imágenes vacías son marcadores visuales hasta que se importe un archivo o se indique una URL.

En «Añadir una red social» se pueden elegir Instagram, TikTok, Facebook, YouTube, WhatsApp, Telegram, X, Threads, LinkedIn, Pinterest, Snapchat, Twitch, Discord y Spotify, además de enlaces generales. Cada usuario debe ingresar la dirección real de su propio perfil.

## Precios y descuentos

En cada producto indica un precio normal y, opcionalmente, un precio con descuento menor. NEXO muestra el porcentaje calculado y envía el precio final en el mensaje de WhatsApp. El porcentaje se redondea a dos decimales. Los productos anteriores sin oferta mantienen su precio normal.

Las imágenes importadas se guardan de forma privada y se hacen visibles en productos publicados. El límite inicial es de 30 imágenes y 20 MB por cuenta; las imágenes no referenciadas por el borrador ni por la versión publicada se depuran al subir otra imagen una vez transcurridas 24 horas. Una imagen cargada debe asociarse y guardarse antes de ese plazo. El almacenamiento requiere disco persistente y copias de seguridad.
