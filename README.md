# NEXO

Base inicial para una plataforma gratuita de páginas personales configurables. La aplicación incluida es una **demostración local**, no un servicio multiusuario: no registra cuentas, no publica páginas y no sincroniza datos entre dispositivos. La foto, dominios y enlaces del ejemplo son ilustrativos.

## Ejecutar

Requiere Node.js 20 o superior; no necesita instalar dependencias.

```sh
npm start
```

Abrir http://localhost:3000. Los datos de demostración se guardan en `localStorage` únicamente al pulsar «Guardar cambios». Para ejecutar las pruebas: `npm test`. El servidor incluido es solo para desarrollo local, no está preparado para producción.

## Organización

- `src/model.js`: valores iniciales, normalización, validación y persistencia local.
- `src/preview.js`: representación segura de la vista previa.
- `src/app.js`: editor y eventos de interacción.
- `src/styles.css`: diseño adaptable a distintos tamaños de pantalla.
- `tests/`: pruebas de los límites de seguridad y del modelo.
- `docs/`: arquitectura, referencias y tareas pendientes.

No introducir credenciales ni datos sensibles en el navegador de demostración.
