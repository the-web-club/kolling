document.addEventListener('astro:page-load', () => {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const knop = document.querySelector<HTMLElement>('[data-menu-knop]');

  menu?.addEventListener('toggle', () => {
    const isOpen = menu.matches(':popover-open');
    knop?.setAttribute('aria-expanded', String(isOpen));
    document.querySelectorAll('main, footer').forEach((deel) => {
      deel.toggleAttribute('inert', isOpen);
    });

    const doel = isOpen ? menu.querySelector('a') : knop;
    if (doel instanceof HTMLElement) {
      doel.focus();
    }
  });
});
