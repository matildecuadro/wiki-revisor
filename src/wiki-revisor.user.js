// ==UserScript==
// @name         wiki-revisor — Diagnóstico estructural (prototipo)
// @namespace    https://github.com/matildecuadro/wiki-revisor
// @version      0.5
// @description  Diagnóstico estructural de artículos de patrimonio arquitectónico según criterios de AB/AD. PROTOTIPO — usa tu propia clave de API de Anthropic (BYOK), nunca se envía a nadie más que a api.anthropic.com.
// @author       Matilde Cuadro (github.com/matildecuadro)
// @match        https://es.wikipedia.org/wiki/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @connect      api.anthropic.com
// ==/UserScript==

(function () {
  'use strict';

  // Recortado del documento original de instrucciones del proyecto.
  // Solo se incluye el Módulo 1 para este prototipo.
  //
  // Basado en los criterios de artículo bueno (AB) y artículo destacado (AD)
  // de Wikipedia en español, y en el Manual de Estilo. No se reproduce el
  // contenido de estas páginas (con licencia CC BY-SA) en este repositorio;
  // el texto de SYSTEM_PROMPT es una síntesis propia aplicada a esos criterios.
  // - https://es.wikipedia.org/wiki/Wikipedia:Artículos_buenos
  // - https://es.wikipedia.org/wiki/Wikipedia:Artículos_destacados
  // - https://es.wikipedia.org/wiki/Wikipedia:Manual_de_estilo
  //
  // Ejemplos de referencia (AD de patrimonio arquitectónico):
  // - https://es.wikipedia.org/wiki/Archivo_General_de_Simancas
  // - https://es.wikipedia.org/wiki/Angkor_Wat
  // - https://es.wikipedia.org/wiki/Basílica_de_San_Pedro
  // - https://es.wikipedia.org/wiki/Basílica_de_San_Isidoro_de_León
  const SYSTEM_PROMPT = `Actúas como asistente especializado en revisión enciclopédica para Wikipedia en español, con foco en arquitectura y patrimonio histórico-arquitectónico. Tu rol es asistir la revisión humana, no generar contenido autónomo.

Prohibiciones absolutas:
- No redactas artículos de Wikipedia desde cero.
- No sugieres ediciones directas a la plataforma.
- No usas Wikipedia como fuente de información bajo ninguna circunstancia.
- No incluyes afirmaciones sin respaldo en fuente concreta y verificable.
- No completas datos con lenguaje institucional o especulativo aunque suenen plausibles.

MÓDULO 1 — DIAGNÓSTICO ESTRUCTURAL

Evalúa, en este orden:

1. Sección introductoria (basado en Wikipedia:Sección introductoria — página de política; debe funcionar como avance condensado del contenido, estableciendo contexto, relevancia y puntos clave de forma equilibrada según su peso en el cuerpo del artículo; el primer párrafo debe definir el tema con claridad, incluyendo área temática y localización si aplica): ¿400-700 caracteres? ¿El primer párrafo identifica inequívocamente el sujeto (nombre oficial completo + localización + cronología básica)? ¿Las valoraciones o superlativas van respaldadas con cita inmediata? ¿Evita expresiones temporales relativas ("recientemente", "actualmente")?

2. Jerarquía de secciones (basado en Wikipedia:Manual de estilo — página de política; a partir de 4-5 párrafos largos se recomienda dividir en secciones; los títulos van en minúsculas salvo la primera letra y las excepciones ortográficas): ¿Existe sistema jerárquico de títulos? ¿Los títulos están en minúscula (salvo primera letra y nombres propios)? ¿Faltan secciones manifiestamente imprescindibles? ¿Alguna sección tiene menos de 3-4 párrafos sustanciales sin justificación?

3. Extensión y cobertura (criterio orientativo basado en la práctica observada en artículos destacados de referencia, NO en una política formal — Wikipedia:Tamaño de los artículos es un ensayo, no una política, y está marcado como desactualizado; no lo cites como norma vinculante): ¿Cubre todos los aspectos relevantes? Referencia orientativa para patrimonio arquitectónico destacado: 30.000-85.000 caracteres; por debajo de 20.000 solo aceptable para temas muy acotados.

4. Tabla de contenidos (basado en el comportamiento técnico de MediaWiki: se genera automáticamente a partir de 3 cabeceras de sección; puede ocultarse con __NOTOC__ o forzarse con __FORCETOC__ — no es una política editorial, es una regla técnica de la plataforma): ¿es sustancial pero no excesiva?

Formato de salida: lista numerada de problemas detectados. Para cada uno, indica entre paréntesis si se basa en una política de Wikipedia (cita el nombre exacto de la página), en una regla técnica de la plataforma, o en un criterio orientativo/práctica habitual — nunca presentes un criterio orientativo como si fuera una política obligatoria. No inventes ni completes de memoria atajos o nombres de página que no te haya proporcionado este prompt. Incluye siempre ejemplo textual de cada problema y propuesta de corrección. Si no hay problemas en alguna dimensión, indícalo brevemente y pasa a la siguiente.

Norma: ante cualquier ambigüedad, pregunta antes de proceder. No rellenes lagunas de información con lenguaje plausible. Cuando detectes un problema, cita siempre el fragmento exacto.`;

  // Límite de caracteres de wikitexto enviados a la API en una sola llamada.
  // 400.000 cubre con amplio margen tanto el rango de referencia del propio prompt
  // (30.000-85.000 para patrimonio arquitectónico destacado) como artículos
  // extensos reales (wikitexto bruto, con plantillas y referencias incluidas,
  // puede superar bastante la extensión de la prosa visible). Si aun así el
  // artículo lo supera, se avisa en el panel de resultado en vez de truncar
  // en silencio — red de seguridad para casos extremos, no el mecanismo principal.
  const MAX_WIKITEXT_CHARS = 400000;

  function getApiKey() {
    let key = GM_getValue('wiki_revisor_api_key', '');
    if (!key) {
      key = prompt(
        'wiki-revisor — introduce tu clave de API de Anthropic.\n' +
        'Se guarda solo en tu navegador (Tampermonkey), nunca se comparte con nadie más que con api.anthropic.com.\n' +
        'Consíguela en https://console.anthropic.com/settings/keys'
      );
      if (key) GM_setValue('wiki_revisor_api_key', key.trim());
    }
    return key;
  }

  function addButton() {
    if (document.getElementById('wiki-revisor-btn')) return; // evita duplicados
    const btn = document.createElement('button');
    btn.id = 'wiki-revisor-btn';
    btn.textContent = 'wiki-revisor: diagnóstico';
    btn.style.cssText =
      'position:fixed;bottom:20px;right:20px;z-index:9999;' +
      'background:#36c;color:#fff;border:none;border-radius:4px;' +
      'padding:10px 16px;font-size:13px;cursor:pointer;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.3);font-family:sans-serif;';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      runDiagnosis();
    });
    document.body.appendChild(btn);
    console.log('[wiki-revisor] botón añadido');
  }

  function getWikitext(callback) {
    const title = decodeURIComponent(location.pathname.replace(/^\/wiki\//, ''));
    const url =
      'https://es.wikipedia.org/w/api.php?action=parse&page=' +
      encodeURIComponent(title) +
      '&prop=wikitext&format=json&formatversion=2&origin=*';
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.parse && typeof data.parse.wikitext === 'string') {
          callback(data.parse.wikitext);
        } else {
          showPanel('No se pudo leer el wikitexto de este artículo:\n' + JSON.stringify(data));
        }
      })
      .catch(function (e) {
        showPanel('Error al leer el wikitexto: ' + e.message);
      });
  }

  function runDiagnosis() {
    const key = getApiKey();
    if (!key) return;
    showPanel('Analizando artículo… (prototipo, puede tardar)');
    getWikitext(function (wikitext) {
      const truncated = wikitext.length > MAX_WIKITEXT_CHARS;
      const payloadText = wikitext.slice(0, MAX_WIKITEXT_CHARS);

      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        data: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content:
                'Aplica el diagnóstico estructural a este artículo (wikitexto, puede incluir marcado):\n\n' +
                payloadText
            }
          ]
        }),
        onload: function (response) {
          try {
            const json = JSON.parse(response.responseText);
            if (json.error) {
              showPanel('Error de la API: ' + json.error.message);
              return;
            }
            const text = (json.content || []).map(function (b) { return b.text || ''; }).join('\n');
            const warning = truncated
              ? '⚠️ Aviso: el artículo tiene ' + wikitext.length.toLocaleString('es') +
                ' caracteres, por encima del límite de ' + MAX_WIKITEXT_CHARS.toLocaleString('es') +
                ' enviado en esta llamada. El diagnóstico de "extensión y cobertura" puede ser parcial.\n\n'
              : '';
            showPanel(warning + (text || 'Respuesta vacía.'));
          } catch (e) {
            showPanel('Error al leer la respuesta: ' + e.message);
          }
        },
        onerror: function () {
          showPanel('Error de red al contactar con la API de Anthropic.');
        }
      });
    });
  }

  let lastPanelContent = '';

  function showPanel(content) {
    lastPanelContent = content;
    let panel = document.getElementById('wiki-revisor-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'wiki-revisor-panel';
      panel.style.cssText =
        'position:fixed;top:60px;right:20px;width:420px;max-height:80vh;overflow:auto;' +
        'background:#fff;border:1px solid #a2a9b1;padding:14px;z-index:9999;' +
        'font-family:sans-serif;font-size:13px;line-height:1.5;white-space:pre-wrap;' +
        'box-shadow:0 2px 10px rgba(0,0,0,0.25);border-radius:4px;';

      const toolbar = document.createElement('div');
      toolbar.style.cssText =
        'display:flex;justify-content:flex-end;gap:12px;margin-bottom:8px;font-size:12px;';

      const copy = document.createElement('div');
      copy.textContent = '📋 copiar';
      copy.style.cssText = 'cursor:pointer;color:#36c;';
      copy.onclick = function () {
        GM_setClipboard(lastPanelContent);
        const original = copy.textContent;
        copy.textContent = '✓ copiado';
        setTimeout(function () { copy.textContent = original; }, 1500);
      };
      toolbar.appendChild(copy);

      const close = document.createElement('div');
      close.textContent = '✕ cerrar';
      close.style.cssText = 'cursor:pointer;color:#36c;';
      close.onclick = function () { panel.remove(); };
      toolbar.appendChild(close);

      panel.appendChild(toolbar);
      const body = document.createElement('div');
      body.id = 'wiki-revisor-panel-body';
      panel.appendChild(body);
      document.body.appendChild(panel);
    }
    document.getElementById('wiki-revisor-panel-body').textContent = content;
  }

  addButton();
})();
