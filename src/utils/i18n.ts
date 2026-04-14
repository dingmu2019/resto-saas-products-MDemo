export function getTranslatedField(item: any, field: string, language: string): string {
  if (!item) return '';
  if (item.translations && item.translations[language] && item.translations[language][field]) {
    return item.translations[language][field];
  }
  return item[field] || '';
}
