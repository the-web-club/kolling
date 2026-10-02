document.addEventListener('astro:page-load', () => {
  const menu = document.querySelector<HTMLElement>('[data-menu]');

  menu?.addEventListener('toggle', () => {
    const isOpen = menu.matches(':popover-open');
    document.querySelectorAll('main, footer').forEach((deel) => {
      deel.toggleAttribute('inert', isOpen);
    });

    const doel = isOpen ? menu.querySelector('a') : document.querySelector('[data-menu-knop]');
    if (doel instanceof HTMLElement) {
      doel.focus();
    }
  });
});
