export function formatAsHtml(content) {
  if (!content) return '';
  let html = content;
  html = html.replace(/\r\n|\r/g, '\n');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const classAttr = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${classAttr}>${escapedCode}</code></pre>`;
  });
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<code>${escaped}</code>`;
  });
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  function wrapListItems(htmlContent, listTag) {
    const regex = new RegExp(`((?:<li>.*?</li>\\s*){2,})`, 'g');
    return htmlContent.replace(regex, match => `<${listTag}>${match}</${listTag}>`);
  }
  html = wrapListItems(html, 'ul');
  html = wrapListItems(html, 'ol');
  html = html.replace(/<li>\s*<\/li>/g, '');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  html = html.replace(/^(?!<(h\d|ul|ol|pre|code|li|\/ul|\/ol|\/pre|\/code|\/li)).+$/gm, line => {
    if (line.trim() === '') return '';
    return `<p>${line.trim()}</p>`;
  });
  html = html.replace(/(<p><\/p>)+/g, '');
  return `
    <article style="font-family: 'Times New Roman', serif; font-size: 16px; line-height: 1.6; color: inherit;">
      ${html.trim()}
    </article>
  `;
}
