const API = {
  async fetchJSON(endpoint) {
    try {
      const response = await fetch(`${endpoint}?t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`[API] Failed to fetch ${endpoint}:`, error);
      return null;
    }
  },

  async loadAllData() {
    const [channels, categories, playlists, settings, theme, ads, notices] = await Promise.all([
      this.fetchJSON('./data/channels.json'),
      this.fetchJSON('./data/categories.json'),
      this.fetchJSON('./data/playlists.json'),
      this.fetchJSON('./data/settings.json'),
      this.fetchJSON('./data/theme.json'),
      this.fetchJSON('./data/ads.json'),
      this.fetchJSON('./data/notices.json')
    ]);

    return {
      channels: channels || [],
      categories: categories || [],
      playlists: playlists || [],
      settings: settings || {},
      theme: theme || {},
      ads: ads || {},
      notices: notices || []
    };
  }
};
