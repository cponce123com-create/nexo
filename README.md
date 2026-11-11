# NEXO

Plataforma gratuita de páginas personales y tienda con consultas por WhatsApp. Esta versión implementa un primer sistema multiusuario para desarrollo y pruebas. **Todavía no está lista para abrirse al público**: faltan verificación de correo, recuperación de contraseña, moderación y las medidas operativas descritas en `docs/arquitectura.md`.

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

Las imágenes se enlazan mediante URL y no se suben a NEXO. Para cambiar el nombre de usuario de una página publicada hay que despublicarla primero. No hay recuperación de contraseña ni confirmación de correo todavía.

## Organización

- `server/`: base de datos, autenticación y rutas HTTP.
- `src/model.js`, `src/store.js`: validación y modelo compartido.
- `src/app.js`, `src/preview.js`, `src/styles.css`: editor y página pública.
- `tests/`: pruebas de modelo y flujos HTTP entre cuentas.
- `docs/`: arquitectura, referencias y pendientes.
