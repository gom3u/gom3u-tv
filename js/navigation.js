const SpatialNavigation = {
  init() {
    document.addEventListener('keydown', (e) => {
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'];
      if (!keys.includes(e.key)) return;

      document.body.classList.add('tv-mode');
      const focusables = Array.from(document.querySelectorAll('.focusable, button, input, select, .channel-card'));
      let current = document.activeElement;

      if (!focusables.includes(current) && focusables.length > 0) {
        focusables[0].focus();
        return;
      }

      const index = focusables.indexOf(current);

      if (e.key === 'ArrowRight' && index < focusables.length - 1) {
        focusables[index + 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        focusables[index - 1].focus();
      } else if (e.key === 'ArrowDown' && index + 4 < focusables.length) {
        focusables[index + 4].focus();
      } else if (e.key === 'ArrowUp' && index - 4 >= 0) {
        focusables[index - 4].focus();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (typeof VideoPlayer !== 'undefined' && VideoPlayer.isOpen) {
          VideoPlayer.close();
        }
      }
    });
  }
};
