const ThemeManager = {
  applyTheme(config) {
    if (!config) return;
    const root = document.documentElement;

    if (config.primary_color) root.style.setProperty('--primary', config.primary_color);
    if (config.accent_color) root.style.setProperty('--accent', config.accent_color);
    if (config.background_dark) root.style.setProperty('--bg-dark', config.background_dark);
    if (config.text_primary) root.style.setProperty('--text-main', config.text_primary);

    if (config.logo_url) {
      const logoEl = document.getElementById('app-brand-logo');
      if (logoEl) logoEl.src = config.logo_url;
    }

    if (config.app_name) {
      const titleEl = document.getElementById('app-brand-title');
      if (titleEl) titleEl.textContent = config.app_name;
      document.title = `${config.app_name} – Live TV Web Player`;
    }
  },

  setMode(mode) {
    if (mode === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem('gom3u_theme_mode', mode);
  }
};
