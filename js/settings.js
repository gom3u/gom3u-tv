const SettingsManager = {
  STORAGE_KEY: 'gom3u_user_settings',

  get() {
    const defaults = {
      themeMode: 'dark',
      gridSize: 'medium',
      animations: true
    };
    return { ...defaults, ...JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}') };
  },

  save(newSettings) {
    const current = this.get();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
