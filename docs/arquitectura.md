# Arquitectura y pendientes

## Implementado

El servidor Node utiliza PostgreSQL para usuarios, sesiones, borradores, publicaciones y visitas cuando se configura `DATABASE_URL`; SQLite queda para desarrollo local. En producción, las imágenes importadas se guardan en Cloudinary como recursos autenticados. Las contraseñas se guardan con scrypt y sal aleatoria, las sesiones usan tokens aleatorios guardados como hash, cookies HttpOnly y SameSite=Lax, y las escrituras comprueban el origen. La página pública entrega la última versión publicada, sin enlaces ni productos ocultos; el editor solo accede a la página de la sesión activa. Existe un límite básico de intentos por IP en memoria. Las visitas se agregan por día; los datos antiguos de una página se eliminan al consultar sus estadísticas. Aún falta limpieza automatizada general.

## Límites de seguridad y escalabilidad

Esta implementación es una base de pruebas, no una infraestructura lista para lanzamiento. SQLite es una base local de una instancia: no proporciona almacenamiento compartido entre réplicas, y en alojamientos con disco efímero se perderían cuentas y perfiles. La capa PostgreSQL y Cloudinary está implementada pero debe probarse con proveedores reales; aún faltan migraciones versionadas, migración de datos SQLite y controles de operación antes de crecer. El limitador es local y se reinicia al reiniciar la instancia; no protege despliegues distribuidos ni sustituye controles a nivel de proxy.

Se implementaron verificación y recuperación mediante correo configurable, pero falta probar el proveedor real. No hay MFA, captcha, moderación, restricciones de registro, límites por usuario, auditoría administrativa ni gestión de abuso. Las imágenes se pueden cargar a Cloudinary con límites y control básico de acceso o usar enlaces remotos; SQLite se mantiene para pruebas locales. Falta verificar con Cloudinary real y ampliar las pruebas de seguridad. Antes de ofrecer el servicio al público, implementar y probar estas capacidades, definir políticas de privacidad, copias de seguridad probadas y restauración, observabilidad, protección contra abuso y retención automatizada. Las cuentas antiguas se marcan como no verificadas al migrar; en desarrollo sin proveedor se omite la verificación.

Para despliegues futuros, usar HTTPS; `NODE_ENV=production` activa cookies Secure. Debe haber almacenamiento persistente y copias seguras. Revisar la configuración del proxy y la detección de origen en el entorno de despliegue. No almacenar datos reales hasta completar estas medidas.

## Próximos módulos

1. Identidad: probar el proveedor de correo en producción, agregar MFA y gestión detallada de sesiones.
2. Medios: migrar los archivos a almacenamiento de objetos, decodificar y reprocesar imágenes y añadir protección ante archivos maliciosos.
3. Bloques: texto, video y galerías con contenido seguro y versionado.
4. Analítica: clics, agregación y limpieza automática; evitar recopilar información innecesaria.
5. Administración y moderación: permisos separados, reportes, límites de uso y auditoría.
6. Escala: PostgreSQL, migraciones reproducibles, limitador compartido, pruebas de carga y monitoreo.
7. Producto: accesibilidad, pruebas visuales móviles, recuperación de fallos y copia de seguridad.

La plataforma sigue siendo gratuita; no se han incorporado cobros ni planes.
