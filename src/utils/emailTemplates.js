// FILE: src/utils/emailTemplates.js
// =============================
export function resetPasswordTemplate({ name, link }) {
return `
<div style="font-family:Arial,Helvetica,sans-serif;">
<h2>Привіт${name ? ", " + name : ""}! 👋</h2>
<p>Ви запросили скидання паролю. Натисніть кнопку нижче (чинна 5 хвилин):</p>
<p><a href="${link}" style="display:inline-block;padding:12px 18px;text-decoration:none;border-radius:8px;border:1px solid #222">Скинути пароль</a></p>
<p>Або скопіюйте посилання вручну:<br><code>${link}</code></p>
<p>Якщо ви не надсилали запит — просто ігноруйте цього листа.</p>
</div>
`;
}