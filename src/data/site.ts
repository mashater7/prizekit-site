export const SITE = {
  botName: 'Приз_КитБот',
  // Реальная ссылка-открытие бота в MAX (подтверждена клиентом).
  botUrl: 'https://max.ru/id772975617249_bot',
  tagline: 'Розыгрыши и конкурсы в MAX — бесплатно',
};

export const NAV = [
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/randomizer', label: 'Рандомайзер' },
  { href: '/pricing', label: 'Тарифы' },
  { href: '/faq', label: 'FAQ' },
];

// Префиксует путь базовым URL сайта (для GitHub Pages project-page и кастомного домена).
export function withBase(path = '') {
  // Astro отдаёт BASE_URL без завершающего слэша (напр. '/prizekit-site' или '/'),
  // поэтому добавляем его перед склейкой, чтобы не получить '/prizekit-sitefaq'.
  const base = (import.meta.env.BASE_URL + '/').replace(/\/+$/, '/');
  return (base + String(path).replace(/^\/+/, '')).replace(/([^:]\/)\/+/g, '$1');
}

// Иконки — inline SVG (lucide-style), без эмодзи. Рендерятся через set:html в цветной плитке.
const ICON_TARGET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>';
const ICON_TREND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>';
const ICON_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>';

export const FEATURES = [
  { icon: ICON_TARGET, title: 'Честный розыгрыш', text: 'Победители выбираются случайно, бот проверяет подписку каждого участника.' },
  { icon: ICON_TREND, title: 'Рост канала', text: 'Реферальная система даёт билеты за друзей, мультиканальные розыгрыши приводят новых подписчиков.' },
  { icon: ICON_SHIELD, title: 'Полный контроль', text: 'Антибот, переразыгрыш, запрет участия админам, любое число победителей.' },
];
