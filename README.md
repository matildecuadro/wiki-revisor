# wiki-revisor

Userscript de diagnóstico asistido por IA para artículos de Wikipedia en español sobre **arquitectura y patrimonio histórico-arquitectónico**, orientado a los criterios de artículo bueno (AB) y artículo destacado (AD).

**Uso exclusivamente diagnóstico.** El script señala problemas y los explica; en ningún caso redacta, sugiere ediciones directas ni genera contenido para el artículo. Esta distinción entre uso diagnóstico y uso generativo de IA es un principio central del proyecto para ser compatible con la política de es.wikipedia sobre uso de IA en la edición de artículos.

## Estado actual

Prototipo funcional. Publica únicamente el **Módulo 1 — Diagnóstico estructural**. El resto de módulos previstos (ver [Roadmap](#roadmap)) todavía no están implementados en esta versión pública.

### Módulo 1 — Diagnóstico estructural

Evalúa el wikitexto del artículo frente a los criterios estructurales típicos de AB/AD en patrimonio arquitectónico:

- Sección introductoria: extensión, identificación inequívoca del sujeto, respaldo de valoraciones, ausencia de expresiones temporales relativas.
- Jerarquía de secciones y títulos.
- Extensión y cobertura global del artículo.
- Tabla de contenidos.

Cada problema detectado indica si se basa en una política real de Wikipedia, en una regla técnica de la plataforma (MediaWiki), o en un criterio orientativo basado en la práctica observada en artículos destacados de referencia. Se distingue explícitamente para no presentar una recomendación como si fuera una norma obligatoria cuando no lo es.

El diagnóstico se genera a partir de un prompt calibrado con ejemplos de artículos destacados en Wikipedia en español de patrimonio arquitectónico (Archivo General de Simancas, Angkor Wat, Basílica de San Pedro, Basílica de San Isidoro de León).

**Alcance actual**: el corpus de referencia y los criterios están calibrados específicamente para patrimonio arquitectónico. No se recomienda su uso para evaluar artículos de otras temáticas en esta versión.

## Base de criterios

Este proyecto no reproduce contenido de Wikipedia (licenciado bajo CC BY-SA) dentro del repositorio. El prompt del Módulo 1 es una síntesis propia aplicada a los criterios definidos en:

- [Wikipedia:Sección introductoria](https://es.wikipedia.org/wiki/Wikipedia:Secci%C3%B3n_introductoria) (política)
- [Wikipedia:Manual de estilo](https://es.wikipedia.org/wiki/Wikipedia:Manual_de_estilo) (política)
- [Manual:Tabla de contenidos (MediaWiki)](https://www.mediawiki.org/wiki/Manual:Table_of_contents/es) (comportamiento técnico de la plataforma, no política editorial)
- [Wikipedia:Artículos buenos](https://es.wikipedia.org/wiki/Wikipedia:Artículos_buenos)
- [Wikipedia:Artículos destacados](https://es.wikipedia.org/wiki/Wikipedia:Artículos_destacados)

**Nota sobre extensión**: el criterio de extensión y cobertura (30.000-85.000 caracteres para AD de patrimonio) es orientativo, basado en la práctica observada en los artículos de referencia listados abajo, no en una política formal. 

Artículos destacados de patrimonio arquitectónico usados como referencia para calibrar el prompt:

- [Archivo General de Simancas](https://es.wikipedia.org/wiki/Archivo_General_de_Simancas)
- [Angkor Wat](https://es.wikipedia.org/wiki/Angkor_Wat)
- [Basílica de San Pedro](https://es.wikipedia.org/wiki/Basílica_de_San_Pedro)
- [Basílica de San Isidoro de León](https://es.wikipedia.org/wiki/Basílica_de_San_Isidoro_de_León)

## Cómo funciona

- Se instala como userscript (Tampermonkey).
- Añade un botón flotante en las páginas de artículo de es.wikipedia.org.
- Al pulsarlo, obtiene el wikitexto del artículo vía la API de MediaWiki y lo envía a la API de Anthropic (Claude) para el diagnóstico.
- El resultado se muestra en un panel dentro de la propia página.

Artículos de hasta ~400.000 caracteres de wikitexto se analizan en una sola llamada. Por encima de ese límite, el script avisa explícitamente de que el diagnóstico de extensión y cobertura puede ser parcial, en vez de truncar en silencio.

## Requisitos (BYOK — Bring Your Own Key)

Este script **no incluye ninguna clave de API ni depende de infraestructura propia**. Cada persona que lo usa necesita:

1. Una cuenta en [console.anthropic.com](https://console.anthropic.com/) y una clave de API propia.
2. [Tampermonkey](https://www.tampermonkey.net/) instalado en el navegador.

La clave se solicita la primera vez que se usa el script y se guarda localmente en el almacenamiento propio de Tampermonkey, aislado de la página web y de otros scripts. Nunca se envía a ningún servidor salvo `api.anthropic.com`.

Para el modelo de seguridad completo y recomendaciones sobre cómo configurar la clave de API, consulta [SECURITY.md](./SECURITY.md).

## Instalación

1. Instala Tampermonkey.
2. Instala el script desde [`src/wiki-revisor.user.js`](./src/wiki-revisor.user.js).
3. Visita cualquier artículo de es.wikipedia.org sobre arquitectura o patrimonio.
4. Pulsa el botón "wiki-revisor: diagnóstico".
5. Introduce tu clave de API de Anthropic cuando se te solicite.

## Roadmap

Módulos previstos, no incluidos en esta versión:

- **Módulo 2 — Revisión de texto**: detección de errores comunes de estilo enciclopédico (WP:MILLÓN) y desviaciones del estilo esperado en Wikipedia. A diferencia del Módulo 1, este módulo está pensado para generalizar razonablemente bien más allá de patrimonio arquitectónico, ya que los errores de estilo son en buena medida transversales al dominio del artículo.
- **Módulo 3 — Detección de afirmaciones sin respaldo**.
- **Módulo 4 — Verificación de fuentes**: mediante búsqueda web en vivo, restringida a fuentes de alta autoridad.

Se buscará colaboración técnica de la comunidad para los Módulos 3 y 4.

## Contribuir

*(Pendiente de CONTRIBUTING.md)*

## Licencia

Ver [LICENSE](./LICENSE).
