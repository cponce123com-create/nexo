# Arquitectura y pendientes

## Implementado

El servidor Node utiliza SQLite para usuarios, sesiones, borradores, publicaciones y eventos de visita. Las contraseñas se guardan con scrypt y sal aleatoria, las sesiones usan tokens aleatorios guardados como hash, cookies HttpOnly y SameSite=Lax, y las escrituras comprueban el origen. La página pública entrega la última versión publicada, sin enlaces ni productos ocultos; el editor solo accede a la página de la sesión activa. Existe un límite básico de intentos por IP en memoria. Se guardan eventos de visita con retención prevista de 30 días; los eventos antiguos de una página se eliminan al consultar sus estadísticas.

## Límites de seguridad y escalabilidad

Esta implementación es una base de pruebas, no una infraestructura lista para lanzamiento. SQLite es una base local de una instancia: no proporciona almacenamiento compartido entre réplicas, y en alojamientos con disco efímero se perderían cuentas y perfiles. Migrar a PostgreSQL con transacciones, migraciones, índices y conexiones controladas antes de crecer. El limitador es local y se reinicia al reiniciar la instancia; no protege despliegues distribuidos ni sustituye controles a nivel de proxy.

No hay verificación de correo, recuperación de cuenta, MFA, revocación general de sesiones, captcha, moderación, restricciones de registro, límites por usuario, auditoría administrativa ni gestión de abuso. Tampoco hay subida de archivos: las imágenes son enlaces remotos. Antes de ofrecer el servicio al público, implementar y probar estas capacidades, definir políticas de privacidad, copias de seguridad probadas y restauración, observabilidad, protección contra abuso y retención automatizada. El correo no está verificado y no debe usarse como prueba de identidad.

Para despliegues futuros, usar HTTPS; `NODE_ENV=production` activa cookies Secure. Debe haber almacenamiento persistente y copias seguras. Revisar la configuración del proxy y la detección de origen en el entorno de despliegue. No almacenar datos reales hasta completar estas medidas.

## Próximos módulos

1. Identidad: verificación de correo, recuperación de acceso, cambio de contraseña y gestión de sesiones con proveedor probado.
2. Medios: carga a almacenamiento de objetos, validación y límites de tamaño y tipo.
3. Bloques: texto, video y galerías con contenido seguro y versionado.
4. Analítica: clics, agregación y limpieza automática; evitar recopilar información innecesaria.
5. Administración y moderación: permisos separados, reportes, límites de uso y auditoría.
6. Escala: PostgreSQL, migraciones reproducibles, limitador compartido, pruebas de carga y monitoreo.
7. Producto: accesibilidad, pruebas visuales móviles, recuperación de fallos y copia de seguridad.

La plataforma sigue siendo gratuita; no se han incorporado cobros ni planes.
