# TESIS DISEÑO EDITORIAL · Tracker v2

Microapp personal **mobile-first** para seguimiento de la fase de diseño editorial de tesis.

## Archivos

- `index.html`: estructura semántica y contenedores de la app.
- `style.css`: diseño visual limpio, calmado y táctil (optimizado para iPhone).
- `script.js`: renderizado de capítulos, checklist por fases, notas y persistencia.

## Funcionalidades principales

- Índice completo de capítulos del **02 al 20**.
- Cada capítulo incluye **7 fases** (1 fase = 1 checkmark).
- Estado automático por capítulo:
  - `Pendiente`
  - `Completado`
- Barra de progreso global + porcentaje total + contador de bloques completados.
- Persistencia en `localStorage` de:
  - Fases completadas
  - Capítulos abiertos/cerrados
  - Notas por capítulo
  - Porcentaje global calculado
- Botón de reseteo con confirmación.
- Botón **Info IA** en:
  - Fase 2 → Notebook LM
  - Fase 3 → GPT
  - Fase 4 → GPT
  - Fase 6 → GPT

## Uso local

1. Abre `index.html` en tu navegador.
2. Marca fases y escribe notas por capítulo.
3. Recarga la página para comprobar que el avance persiste.

## Publicación en GitHub Pages

1. Sube estos archivos al repositorio.
2. Ve a **Settings → Pages**.
3. Selecciona la rama principal y carpeta raíz (`/root`).
4. Guarda y abre la URL generada.

## Personalización rápida

- Cambia colores en variables CSS (`:root`) dentro de `style.css`.
- Cambia capítulos/íconos en el arreglo `chapters` dentro de `script.js`.
- Cambia flujo de fases en el arreglo `phases` dentro de `script.js`.
