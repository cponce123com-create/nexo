# Arquitectura y siguiente etapa

## Estado actual

El editor funciona en un navegador y sus datos se almacenan localmente. No ofrece autenticación, almacenamiento remoto, publicación real, subida de imágenes, estadísticas, moderación ni separación entre cuentas. No utilizar para datos reales ni desplegar como plataforma multiusuario.

## Módulos previstos

1. Identidad: registro, verificación de correo, recuperación y sesiones seguras mediante proveedor probado.
2. Perfiles: un propietario por página, nombre de usuario único y reservado, estados borrador/publicado.
3. Bloques: tipos versionados (enlace, texto, imagen, video), orden, visibilidad y validación del lado del servidor.
4. Apariencia: temas y tokens validados; vista pública y editor comparten el mismo modelo.
5. Medios: proveedor de archivos externo, límites, validación de tipo/tamaño y borrado.
6. Analítica: eventos mínimos y agregados, con política de retención y privacidad.
7. Administración: permisos separados, reportes, auditoría y límites de uso.

## Modelo propuesto

User → Page → Block. Cada página pertenece a un usuario, cada bloque a una página, y el servidor comprueba la propiedad en cada lectura privada y mutación. Añadir índices únicos para usuarios y nombres de página, y claves foráneas. Mantener borrador y publicación separados para que cambios sin publicar no afecten la página pública. Las métricas y archivos deben aislarse por página. Las URLs públicas se deben validar y escapar; evitar permitir HTML o scripts arbitrarios.

## Infraestructura propuesta

Aplicación TypeScript, servidor con controles de autorización, PostgreSQL y Prisma, almacenamiento de objetos y proveedor de correo. Diseñar interfaces para poder cambiar proveedores. Antes de habilitar registro público: recuperación y verificación de cuenta, protección frente a abuso, límites de carga, moderación, respaldos probados, políticas de privacidad y seguimiento de errores. El coste de alojamiento sigue existiendo aunque el servicio sea gratuito.

## Verificación previa a lanzamiento

Pruebas de aislamiento entre dos cuentas, acceso a borradores, validación de bloques, intentos XSS, URLs inseguras, conflictos de edición, recuperación y cierre de sesión; accesibilidad y geometría en móvil y escritorio; pruebas de fallos de almacenamiento y recuperación de copias. No se ha ejecutado ninguna de estas pruebas de servidor, pues aún no existe.
