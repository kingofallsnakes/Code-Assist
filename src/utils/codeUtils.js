export function normalizeLineEndings(text) {
  return typeof text === 'string' ? text.replace(/\r\n|\r/g, '\n') : '';
}
export function extractCodeOnly(text) {
  if (!text || typeof text !== 'string') return '';
  const normalized = normalizeLineEndings(text);
  const regex = /```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
  const matches = [...normalized.matchAll(regex)];
  if (matches.length === 0) return normalized.trim();
  return matches.map(m => m[1]).join('\n').trim();
}
export function extractCleanCode(text) {
  if (!text || typeof text !== 'string') return '';
  let code = normalizeLineEndings(text);
  code = code.replace(/```[a-zA-Z]*\s*\n([\s\S]*?)```/g, '$1');
  code = code.replace(/\*\*|__|\*/g, '');
  code = code.replace(/^#{1,6}\s.*$/gm, '');
  code = code.replace(/^([-*_]){3,}\s*$/gm, '');
  code = code.replace(/\n{3,}/g, '\n\n');
  return code.trim();
}
