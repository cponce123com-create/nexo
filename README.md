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

Las imágenes se enlazan mediante URL y no se suben a NEXO. Para cambiar el nombre de usuario de una página publicada hay que despublicarla primero. La recuperación y confirmación de correo requieren configurar un proveedor.

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
