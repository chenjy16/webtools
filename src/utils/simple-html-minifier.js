/**
 * 简单的 HTML 压缩函数
 * @param {string} html HTML 代码
 * @returns {string} 压缩后的 HTML
 */
export function minifyHtml(html) {
  return html
    // 移除注释
    .replace(/<!--[\s\S]*?-->/g, '')
    // 移除 HTML 标签之间的空白
    .replace(/>\s+</g, '><')
    // 移除行首和行尾的空白
    .replace(/^\s+|\s+$/gm, '')
    // 将多个空白字符替换为单个空格
    .replace(/\s{2,}/g, ' ');
}