const App = {
  state: {
    channels: [],
    categories: [],
    playlists: [],
    settings: {},
    theme: {},
    ads: {},
    notices: [],
    activeTab: 'home',
    selectedCategory: 'cat-all',
    searchQuery: ''
  },

  async init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);

    this.bindEvents();
    SpatialNavigation.init();
    VideoPlayer.init();

    await this.loadData();

    // 30-Second Auto-Reload Sync Engine for Admin Integration
    setInterval(() => this.loadData(true), 30000);

    this.setupNetworkMonitor();
  },

  async loadData(isSilent = false) {
    if (!isSilent) this.renderSkeletons();

    const data = await API.loadAllData();
    this.state = { ...this.state, ...data };

    if (this.state.settings.maintenance_mode) {
      document.getElementById('maintenance-overlay').style.display = 'flex';
      return;
    } else {
      document.getElementById('maintenance-overlay').style.display = 'none';
    }

    ThemeManager.applyTheme(this.state.theme);
    NoticeManager.render(this.state.notices);
    AdManager.render(this.state.ads);

    this.renderCurrentView();
  },

  renderCurrentView() {
    this.renderCategories();
    if (this.state.activeTab === 'home') this.renderHomeTab();
    else if (this.state.activeTab === 'channels') this.renderChannelsTab();
    else if (this.state.activeTab === 'favorites') this.renderFavoritesTab();
    else if (this.state.activeTab === 'history') this.renderHistoryTab();
  },

  renderCategories() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    container.innerHTML = this.state.categories.map(cat => `
      <button class="nav-btn focusable ${this.state.selectedCategory === cat.id ? 'active' : ''}" 
              onclick="App.selectCategory('${cat.id}')">
        <i class="bi ${cat.icon || 'bi-tv'}"></i> ${cat.name}
      </button>
    `).join('');
  },

  selectCategory(catId) {
    this.state.selectedCategory = catId;
    this.renderCurrentView();
  },

  renderHomeTab() {
    const filtered = SearchEngine.filter(
      this.state.channels,
      this.state.searchQuery,
      this.state.selectedCategory,
      '',
      ''
    );

    const featured = filtered.slice(0, 4);
    const trending = filtered.slice(2, 8);

    const homeContainer = document.getElementById('tab-home');
    if (!homeContainer) return;

    homeContainer.innerHTML = `
      ${featured.length ? `
        <div class="section-title"><i class="bi bi-star-fill" style="color:var(--primary)"></i> Featured Feeds</div>
        <div class="card-grid">${featured.map(ch => this.createChannelCard(ch)).join('')}</div>
      ` : ''}
      <div class="section-title"><i class="bi bi-fire" style="color:var(--accent)"></i> Trending Now</div>
      <div class="card-grid">${trending.map(ch => this.createChannelCard(ch)).join('')}</div>
    `;
  },

  renderChannelsTab() {
    const filtered = SearchEngine.filter(
      this.state.channels,
      this.state.searchQuery,
      this.state.selectedCategory,
      '',
      ''
    );

    const container = document.getElementById('tab-channels');
    if (!container) return;

    container.innerHTML = `
      <div class="section-title"><i class="bi bi-grid-3x3-gap-fill"></i> All Channels (${filtered.length})</div>
      <div class="card-grid">${filtered.map(ch => this.createChannelCard(ch)).join('')}</div>
    `;
  },

  renderFavoritesTab() {
    const favIds = FavoriteManager.getFavorites();
    const favChannels = this.state.channels.filter(ch => favIds.includes(ch.id));

    const container = document.getElementById('tab-favorites');
    if (!container) return;

    container.innerHTML = `
      <div class="section-title"><i class="bi bi-heart-fill" style="color:#ef4444"></i> Favorite Channels</div>
      ${favChannels.length === 0 ? '<p style="color:var(--text-muted)">No favorite channels saved yet.</p>' : ''}
      <div class="card-grid">${favChannels.map(ch => this.createChannelCard(ch)).join('')}</div>
    `;
  },

  renderHistoryTab() {
    const historyIds = HistoryManager.getHistory();
    const historyChannels = historyIds.map(id => this.state.channels.find(ch => ch.id === id)).filter(Boolean);

    const container = document.getElementById('tab-history');
    if (!container) return;

    container.innerHTML = `
      <div class="section-title"><i class="bi bi-clock-history"></i> Recently Watched</div>
      ${historyChannels.length === 0 ? '<p style="color:var(--text-muted)">No viewing history recorded.</p>' : ''}
      <div class="card-grid">${historyChannels.map(ch => this.createChannelCard(ch)).join('')}</div>
    `;
  },

  createChannelCard(channel) {
    const isFav = FavoriteManager.isFavorite(channel.id);
    return `
      <div class="channel-card focusable" onclick="VideoPlayer.playChannel(App.getChannelById('${channel.id}'), App.state.channels)">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); App.toggleFav('${channel.id}')">
          <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
        </button>
        <div class="card-banner">
          <img class="card-logo" src="${channel.logo}" alt="${channel.name}" onerror="this.src='https://via.placeholder.com/150?text=TV'">
        </div>
        <div class="card-info">
          <div class="card-title">${Utils.sanitizeString(channel.name)}</div>
          <div class="card-meta">
            <span>${channel.group || 'Live'}</span>
            <span>${channel.country || 'INT'}</span>
          </div>
        </div>
      </div>
    `;
  },

  getChannelById(id) {
    return this.state.channels.find(ch => ch.id === id);
  },

  toggleFav(id) {
    FavoriteManager.toggle(id);
    this.renderCurrentView();
  },

  switchTab(tabName) {
    this.state.activeTab = tabName;
    document.querySelectorAll('.nav-link-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    const activeBtn = document.getElementById(`nav-btn-${tabName}`);
    const activePane = document.getElementById(`tab-${tabName}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');

    this.renderCurrentView();
  },

  bindEvents() {
    const searchInput = document.getElementById('app-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.state.searchQuery = e.target.value;
        this.renderCurrentView();
      }, 300));
    }
  },

  renderSkeletons() {
    const grid = document.getElementById('tab-home');
    if (!grid) return;
    grid.innerHTML = `
      <div class="card-grid">
        ${Array(8).fill('<div class="channel-card skeleton" style="height:170px;"></div>').join('')}
      </div>
    `;
  },

  updateClock() {
    const clockEl = document.getElementById('header-clock');
    if (clockEl) clockEl.textContent = Utils.formatTime(new Date());
  },

  setupNetworkMonitor() {
    const statusDot = document.getElementById('net-status-dot');
    const statusText = document.getElementById('net-status-text');

    const updateStatus = () => {
      if (navigator.onLine) {
        if (statusDot) statusDot.classList.remove('offline');
        if (statusText) statusText.textContent = 'ONLINE';
      } else {
        if (statusDot) statusDot.classList.add('offline');
        if (statusText) statusText.textContent = 'OFFLINE';
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
