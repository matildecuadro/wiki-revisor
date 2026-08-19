# Seguridad

## Modelo BYOK (Bring Your Own Key)

`wiki-revisor` no tiene servidor propio ni almacena claves de API en ningún sitio gestionado por el proyecto. Cada persona usa su propia clave de API de Anthropic, que se queda en su propio navegador.

Este documento explica **qué protege ese diseño y qué no**, para que puedas decidir con información real cómo configurar tu clave.

## Cómo se guarda la clave

La clave se guarda mediante `GM_setValue`, en el almacenamiento propio de la extensión Tampermonkey, aislado por script — no es accesible desde el JavaScript de la propia página de Wikipedia ni desde otros userscripts que no compartan namespace. 

**Lo que este diseño no resuelve:**

- La clave se guarda **en texto plano** dentro de ese almacenamiento, no cifrada.
- Cualquier proceso con acceso de lectura al perfil del navegador en tu equipo (malware, otra persona con acceso físico al dispositivo, u otra extensión con permisos amplios sobre el almacenamiento de extensiones) puede en principio llegar a leerla.
- Ningún cambio en el propio userscript puede eliminar este límite por completo. Es una característica estructural de guardar información sensible del lado del cliente en un navegador, no un descuido específico de esta implementación.

Si tu equipo está comprometido por otra vía, ninguna medida en este script te protege. El riesgo real que puede mitigarse aquí es el de **una clave filtrada o mal utilizada**, no el de un equipo ya comprometido.

## Recomendación: usa una clave de API con presupuesto limitado

Para minimizar los riesgos, se recomienda establecer un límite de gasto en tu API de Claude.

En [console.anthropic.com](https://console.anthropic.com/), configura la clave que uses con `wiki-revisor` con un **límite de gasto bajo**, específico para esta clave y separado de cualquier otro uso que hagas de la API. Así, si la clave se filtrara por cualquier vía, el daño posible queda acotado a ese límite en vez de ser abierto.

No uses para este script una clave que compartas con otros proyectos o con un presupuesto elevado.

## Qué se envía y a dónde

- El wikitexto del artículo que estés viendo se envía a `api.anthropic.com` para el diagnóstico. No se envía a ningún otro servidor.
- La clave de API viaja únicamente en la cabecera de autenticación de esa misma llamada a `api.anthropic.com`.
- El proyecto no tiene backend propio: no hay ningún servidor intermedio que vea tu wikitexto ni tu clave.

## Reportar un problema de seguridad

Para reportar una vulnerabilidad, usa la pestaña Security → Report a vulnerability de este repositorio
