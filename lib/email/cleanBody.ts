export function cleanLegacyEmailBody(value: unknown) {
  if (typeof value !== 'string') return value;

  return value
    .replace(
      /<a\s+href=["'][^"']+["']\s+style=["']background-color:\s*#007bff;[^"']*["']>[\s\S]*?<\/a>/gi,
      '',
    )
    .replace(
      /You can also copy the following link and paste in your browser if you were unable to click the above button\.[\s\S]*?Link:\s*<div>[\s\S]*?<\/div>\s*<br\s*\/?>/gi,
      '',
    )
    .replace(/Link:\s*<div>[\s\S]*?<\/div>\s*<br\s*\/?>/gi, '')
    .replace(
      /See you inside\.<br\s*\/?><br\s*\/?>\s*<b>Tochukwu Nkwocha<\/b><br\s*\/?>\s*<i>CEO,\s*Spreadit Limited<\/i>/gi,
      '',
    )
    .replace(/(<br\s*\/?>\s*){4,}/gi, '<br /><br />')
    .trim();
}
