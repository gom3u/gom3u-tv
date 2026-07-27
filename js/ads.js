const AdManager = {
  render(ads) {
    if (!ads) return;

    const bannerContainer = document.getElementById('ad-banner-container');
    const bannerImg = document.getElementById('ad-banner-img');

    if (ads.banner && ads.banner.enabled && bannerContainer && bannerImg) {
      bannerImg.src = ads.banner.image_url;
      bannerImg.alt = ads.banner.alt_text || 'Advertisement';
      bannerContainer.style.display = 'block';
      bannerContainer.onclick = () => {
        if (ads.banner.target_url && ads.banner.target_url !== '#') {
          window.open(ads.banner.target_url, '_blank');
        }
      };
    } else if (bannerContainer) {
      bannerContainer.style.display = 'none';
    }
  }
};
