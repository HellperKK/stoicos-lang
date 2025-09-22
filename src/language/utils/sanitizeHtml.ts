export function sanitizeHtml(content: string) {
    return content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}