/* BoardroomCost.com — AdSense slots placeholder
   REPLACE WITH YOUR ADSENSE CODE once approved.
   See each .adsense-slot div with data-slot attributes throughout the HTML.
   
   Once approved:
   1. Paste your <script async src="https://pagead2.googlesyndication.com/..."> in each page <head>
   2. Replace each .adsense-slot div content with your <ins class="adsbygoogle"> unit */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.adsense-slot').forEach(slot => {
      if (!slot.textContent.trim()) {
        slot.textContent = `Ad · ${slot.dataset.slot || ''} · ${slot.dataset.size || 'responsive'}`;
      }
    });
  });
})();
