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

export const FEATURES = [
  { icon: '🎯', title: 'Честный розыгрыш', text: 'Победители выбираются случайно, бот проверяет подписку каждого участника.' },
  { icon: '📈', title: 'Рост канала', text: 'Реферальная система даёт билеты за друзей, мультиканальные розыгрыши приводят новых подписчиков.' },
  { icon: '🛡️', title: 'Полный контроль', text: 'Антибот, переразыгрыш, запрет участия админам, любое число победителей.' },
];
