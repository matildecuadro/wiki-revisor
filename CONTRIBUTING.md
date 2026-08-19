# Contribuir a wiki-revisor

Gracias por el interés en el proyecto. Está en fase de prototipo, así que la forma más útil de contribuir ahora mismo depende de qué quieras aportar.

## Reportar un problema con el diagnóstico

Si usas el script y el diagnóstico te parece incorrecto, incompleto o confuso, abre un [Issue](../../issues) describiendo:

- El artículo sobre el que lo probaste (enlace).
- Qué esperabas ver y qué obtuviste.
- Si es posible, el texto completo del diagnóstico devuelto.

Esto es especialmente valioso mientras wiki-revisor está en validación. No hace falta saber programar para aportar aquí.

## Sugerencias de funcionalidad

Abre un Issue describiendo el caso de uso, no solo la función en sí. Eso me ayudará a valorar si encaja con el principio de uso diagnóstico (nunca generativo) que sigue este proyecto.

## Colaboración técnica

Hay otros dos módulos (detección de afirmaciones sin respaldo y verificación de fuentes vía búsqueda web) que todavía no están implementados y son los que más beneficio pueden sacar de colaboración externa — especialmente si tienes experiencia con:

- Integración de herramientas de búsqueda web en llamadas a la API de Anthropic.
- Definición de listas de fuentes de alta autoridad por dominio temático.

Si quieres colaborar en esto, abre un Issue para discutir el enfoque antes de escribir código.

## Reportar un problema de seguridad

No uses un Issue público para esto. Consulta [SECURITY.md](./SECURITY.md).

## Estilo de código

El proyecto es, por ahora, un único archivo userscript sin build ni dependencias. Mantén ese criterio de simplicidad salvo que una funcionalidad nueva lo justifique claramente.
