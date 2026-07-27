const HistoryManager = {
  STORAGE_KEY: 'gom3u_history',

  add(channelId) {
    let history = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    history = history.filter(id => id !== channelId);
    history.unshift(channelId);
    if (history.length > 20) history.pop();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  },

  getHistory() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }
};
