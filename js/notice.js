const NoticeManager = {
  render(notices) {
    if (!Array.isArray(notices)) return;

    const tickerWrap = document.getElementById('notice-ticker');
    const tickerContent = document.getElementById('notice-ticker-content');

    const activeTicker = notices.find(n => n.type === 'ticker' && n.active);
    if (activeTicker && tickerWrap && tickerContent) {
      tickerContent.textContent = activeTicker.message;
      tickerWrap.style.display = 'flex';
    } else if (tickerWrap) {
      tickerWrap.style.display = 'none';
    }

    const activePopup = notices.find(n => n.type === 'popup' && n.active);
    if (activePopup) {
      const popupKey = `notice_dismissed_${activePopup.id}`;
      if (!sessionStorage.getItem(popupKey)) {
        alert(`${activePopup.title}\n\n${activePopup.message}`);
        sessionStorage.setItem(popupKey, 'true');
      }
    }
  }
};
