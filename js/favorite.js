const FavoriteManager = {
  STORAGE_KEY: 'gom3u_favorites',

  getFavorites() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  isFavorite(id) {
    return this.getFavorites().includes(id);
  },

  toggle(id) {
    let favs = this.getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(favId => favId !== id);
    } else {
      favs.push(id);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
    return favs.includes(id);
  }
};
