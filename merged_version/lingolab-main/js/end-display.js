(function () {
  const OPTGROUPS = [
    { label: 'Introduction', keys: ['intro'] },
    { label: 'Dancing', group: 'dancing' },
    { label: 'Turtles', group: 'turtle' },
    { label: 'Apples', group: 'apple' },
    { label: 'Carrots', group: 'carrot' },
  ];

  const errorEl = document.querySelector('#end-display-error');
  const loadingEl = document.querySelector('#end-display-loading');
  const cardEl = document.querySelector('#end-display-card');
  const selectEl = document.querySelector('#sentence-select');
  const englishEl = document.querySelector('#sentence-english');
  const translationEl = document.querySelector('#sentence-translation');

  let packageData = null;

  function getStore() {
    return window.LingoLabStore;
  }

  function showError(message) {
    if (loadingEl) loadingEl.hidden = true;
    if (cardEl) cardEl.hidden = true;
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.innerHTML = `
        <p><strong>Could not load translations.</strong> ${message}</p>
        <p>Start the translation server from this project folder:</p>
        <p><code>python app.py</code></p>
        <button type="button" class="challenge-next" id="end-display-retry">Retry</button>
      `;
      errorEl.querySelector('#end-display-retry')?.addEventListener('click', loadSentences);
    }
  }

  function fillSelect(data) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    OPTGROUPS.forEach((section) => {
      const group = document.createElement('optgroup');
      group.label = section.label;
      const keys = section.keys || (data.groups?.[section.group] || []);
      keys.forEach((key) => {
        if (!data.english?.[key]) return;
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.english[key];
        group.appendChild(option);
      });
      if (group.children.length) selectEl.appendChild(group);
    });
    selectEl.value = 'intro';
    updatePair();
  }

  function updatePair() {
    if (!packageData || !selectEl) return;
    const key = selectEl.value;
    if (englishEl) englishEl.textContent = packageData.english[key] || '';
    if (translationEl) translationEl.textContent = packageData.translations[key] || '';
  }

  async function loadSentences() {
    const fetchSentencePackage = getStore()?.fetchSentencePackage;
    if (!fetchSentencePackage) {
      showError('Language storage is not ready. Refresh and try again.');
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.innerHTML = '';
    }
    if (loadingEl) loadingEl.hidden = false;
    if (cardEl) cardEl.hidden = true;

    try {
      packageData = await fetchSentencePackage();
      if (loadingEl) loadingEl.hidden = true;
      if (cardEl) cardEl.hidden = false;
      fillSelect(packageData);
    } catch (err) {
      showError(err.message || 'Is the server running?');
    }
  }

  function boot() {
    selectEl?.addEventListener('change', updatePair);
    loadSentences();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('lingolab:store-ready', boot, { once: true });
})();