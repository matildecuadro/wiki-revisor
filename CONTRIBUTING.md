# Contribuir a wiki-revisor

Gracias por el interés en el proyecto. Está en fase de prototipo (Módulo 1 únicamente), así que la forma más útil de contribuir ahora mismo depende de qué quieras aportar.

## Reportar un problema con el diagnóstico

Si usas el script y el diagnóstico te parece incorrecto, incompleto o confuso, abre un [Issue](../../issues) describiendo:

- El artículo sobre el que lo probaste (enlace).
- Qué esperabas ver y qué obtuviste.
- Si es posible, el texto completo del diagnóstico devuelto.

Esto es especialmente valioso mientras el Módulo 1 está en validación — no hace falta saber programar para aportar aquí.

## Sugerencias de funcionalidad

Abre un Issue describiendo el caso de uso, no solo la función en sí — ayuda a valorar si encaja con el principio de uso diagnóstico (nunca generativo) que sigue este proyecto.

## Colaboración técnica

Los Módulos 3 (detección de afirmaciones sin respaldo) y 4 (verificación de fuentes vía búsqueda web) todavía no están implementados y son los que más beneficio pueden sacar de colaboración externa — especialmente si tienes experiencia con:

- Integración de herramientas de búsqueda web en llamadas a la API de Anthropic.
- Definición de listas de fuentes de alta autoridad por dominio temático.

Si quieres colaborar en esto, abre un Issue para discutir el enfoque antes de escribir código — dado que el proyecto sigue el principio de diagnóstico (nunca generativo) como criterio no negociable, conviene alinear el enfoque antes de invertir tiempo en una implementación.

## Reportar un problema de seguridad

No uses un Issue público para esto. Consulta [SECURITY.md](./SECURITY.md).

## Estilo de código

El proyecto es, por ahora, un único archivo userscript sin build ni dependencias. Mantén ese criterio de simplicidad salvo que una funcionalidad nueva lo justifique claramente.
