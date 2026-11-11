# Auditoría técnica — NEXO

## Revisado y corregido

- Aislamiento de cuentas, borradores y publicación: pruebas HTTP con dos usuarios.
- Recuperación y verificación: tokens aleatorios de un solo uso con vencimiento y hash en base de datos; se invalidan sesiones al cambiar la contraseña.
- Condición de carrera: se comprueba que la contraseña no haya cambiado antes de crear sesión o reemplazarla.
- Prevención básica de XSS y enlaces peligrosos, validación de origen, límite de tamaño de solicitudes y cookies HttpOnly/SameSite.
- Contador de visitas agregado por día para evitar una fila por visita.
- Copia SQLite mediante VACUUM INTO, probada con comprobación de integridad.

## Riesgos y pendientes antes de producción

1. **Crítico:** SQLite y el limitador local son de una sola instancia. Migrar a PostgreSQL y un límite de solicitudes compartido; no alojar en disco efímero.
2. **Alto:** falta moderación, reportes, límites por cuenta, protección frente a abuso y operación administrativa auditada.
3. **Alto:** validar la integración real de correo, dominio, entrega, configuración HTTPS y políticas de recuperación. La versión de desarrollo omite verificación sin correo configurado.
4. **Alto:** falta almacenamiento y validación segura de imágenes, así como restricciones de contenidos externos; los enlaces remotos exponen la solicitud al servidor de imágenes.
5. **Medio:** faltan MFA, políticas legales, controles de privacidad, caducidad global automatizada de datos y restauración periódica comprobada.
6. **Medio:** faltan estadísticas de clics, pruebas de carga, accesibilidad y pruebas visuales reales en móvil y escritorio.
7. **Medio:** la interfaz aún no implementa bloques de texto, video ni galerías; no se ha probado un servicio de correo real ni un despliegue en la nube.

Las pruebas automatizadas cubren modelos, enlaces, tiendas y flujos HTTP, pero no constituyen una auditoría externa ni una prueba integral de seguridad. No habilitar registro público todavía.

## Revisión de lógica, geometría y conexiones

- El guardado y la publicación conservan las ediciones realizadas mientras se espera la respuesta; se evitan envíos simultáneos desde esos controles.
- El enlace público utiliza el nombre guardado, no el texto aún no guardado en el campo de edición.
- Los mensajes de resultado aparecen junto a los botones de acción y el servidor rechaza duplicados o límites excedidos.
- El texto de los enlaces cambia entre claro y oscuro según el contraste del color elegido; se han ajustado contenedores para pantallas estrechas.
- Se han añadido comprobaciones automatizadas de estos límites y del contraste.

Limitación: no fue posible abrir el servidor local desde el navegador disponible en este entorno. La geometría visual y los recorridos completos mediante clics en móvil y escritorio requieren verificarse en un navegador conectado al servidor antes de su publicación.

## Auditoría de tienda

- El precio normal y la oferta se validan en cliente y servidor; la oferta debe ser menor que el precio normal y acepta hasta dos decimales. El porcentaje se calcula sobre céntimos y el mensaje de WhatsApp usa el precio final.
- La imagen importada es privada hasta que forme parte de un producto visible publicado. El servidor comprueba que pertenezca a la cuenta; se limitan tipo, tamaño y almacenamiento.
- Las imágenes se guardan en SQLite, no en almacenamiento de objetos. Se comprueba la firma de los formatos aceptados, pero todavía no se decodifican ni se reprocesan; hace falta endurecer esa validación antes del despliegue público.
- Quedan pendientes las pruebas visuales y de interacción en navegador, los servicios de almacenamiento escalable y la configuración de infraestructura persistente.
