const VideoPlayer = {
  videoEl: null,
  hls: null,
  currentChannel: null,
  playlist: [],
  isOpen: false,

  init() {
    this.videoEl = document.getElementById('main-video-element');
  },

  playChannel(channel, contextPlaylist = []) {
    if (!channel || !this.videoEl) return;

    this.currentChannel = channel;
    this.playlist = contextPlaylist;
    this.isOpen = true;

    HistoryManager.add(channel.id);

    const modal = document.getElementById('player-modal');
    const titleEl = document.getElementById('player-channel-title');
    const groupEl = document.getElementById('player-channel-group');
    const logoEl = document.getElementById('player-channel-logo');

    if (titleEl) titleEl.textContent = channel.name;
    if (groupEl) groupEl.textContent = `${channel.group || 'General'} • ${channel.language || 'EN'}`;
    if (logoEl) logoEl.src = channel.logo || '';
    if (modal) modal.classList.add('active');

    this.loadStream(channel.stream_url, channel.stream_type);
  },

  loadStream(url, type) {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (type === 'hls' || url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        this.hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        this.hls.loadSource(url);
        this.hls.attachMedia(this.videoEl);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.videoEl.play().catch(e => console.warn("Autoplay prevented:", e));
        });
      } else if (this.videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoEl.src = url;
        this.videoEl.play();
      }
    } else {
      this.videoEl.src = url;
      this.videoEl.play().catch(e => console.warn("Autoplay prevented:", e));
    }
  },

  togglePlay() {
    if (!this.videoEl) return;
    if (this.videoEl.paused) this.videoEl.play();
    else this.videoEl.pause();
  },

  next() {
    if (!this.playlist.length || !this.currentChannel) return;
    const idx = this.playlist.findIndex(c => c.id === this.currentChannel.id);
    if (idx !== -1 && idx < this.playlist.length - 1) {
      this.playChannel(this.playlist[idx + 1], this.playlist);
    }
  },

  previous() {
    if (!this.playlist.length || !this.currentChannel) return;
    const idx = this.playlist.findIndex(c => c.id === this.currentChannel.id);
    if (idx > 0) {
      this.playChannel(this.playlist[idx - 1], this.playlist);
    }
  },

  toggleFullscreen() {
    const stage = document.getElementById('player-stage');
    if (!document.fullscreenElement) {
      stage.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  },

  close() {
    if (this.videoEl) {
      this.videoEl.pause();
      this.videoEl.src = '';
    }
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    this.isOpen = false;
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');
  }
};
