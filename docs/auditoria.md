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
