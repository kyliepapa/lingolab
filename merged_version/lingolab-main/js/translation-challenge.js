(function () {
  const TOTAL_ROUNDS = 5;
  const GROUP_ORDER = ['dancing', 'turtle', 'apple', 'carrot'];

  const reportPanel = document.querySelector('.challenge-report-panel');
  const errorEl = document.querySelector('#challenge-error');
  const loadingEl = document.querySelector('#challenge-loading');
  const playEl = document.querySelector('#challenge-play');
  const scoreEl = document.querySelector('#challenge-score');
  const promptEl = document.querySelector('#challenge-prompt');
  const numberEl = document.querySelector('#challenge-number');
  const resultEl = document.querySelector('#challenge-result');
  const answerInput = document.querySelector('#challenge-answer');
  const inputWrap = document.querySelector('#challenge-input-wrap');
  const actionsEl = document.querySelector('#challenge-actions');
  const checkBtn = document.querySelector('#check-answer');
  const nextBtn = document.querySelector('#next-challenge');
  const revealEl = document.querySelector('#answer-reveal');
  const translationEl = document.querySelector('#challenge-translation');
  const scoreHeadline = document.querySelector('#score-headline');
  const scoreDetail = document.querySelector('#score-detail');
  const tryAgainBtn = document.querySelector('#try-again');

  let packageData = null;
  let queue = [];
  let roundIndex = 0;
  let correctCount = 0;
  let checkedCurrent = false;
  let booted = false;

  function getStore() {
    return window.LingoLabStore;
  }

  function pickRandom(arr) {
    if (!arr?.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildQueue(data) {
    const keys = ['intro'];
    GROUP_ORDER.forEach((group) => {
      const pick = pickRandom(data.groups?.[group]);
      if (pick) keys.push(pick);
    });
    return keys;
  }

  function showError(message) {
    if (loadingEl) loadingEl.hidden = true;
    if (playEl) playEl.hidden = true;
    if (scoreEl) scoreEl.hidden = true;
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.innerHTML = `
        <p><strong>Could not start the challenge.</strong> ${message}</p>
        <p>Run <code>python app.py</code> in the project folder, then retry.</p>
        <button type="button" class="challenge-next" id="challenge-retry">Retry</button>
      `;
      errorEl.querySelector('#challenge-retry')?.addEventListener('click', initChallenge);
    }
  }

  function resetRoundState() {
    checkedCurrent = false;
    if (answerInput) {
      answerInput.value = '';
      answerInput.disabled = false;
    }
    if (revealEl) revealEl.hidden = true;
    if (resultEl) {
      resultEl.textContent = '';
      resultEl.classList.remove('challenge-result--ok', 'challenge-result--miss');
    }
    if (checkBtn) checkBtn.hidden = false;
    if (nextBtn) nextBtn.hidden = true;
    if (inputWrap) inputWrap.hidden = false;
  }

  function showRound() {
    if (scoreEl) scoreEl.hidden = true;
    if (playEl) playEl.hidden = false;
    resetRoundState();

    const key = queue[roundIndex];
    if (promptEl) promptEl.textContent = packageData.english[key] || key;
    if (numberEl) numberEl.textContent = `Challenge ${roundIndex + 1} of ${TOTAL_ROUNDS}`;
    answerInput?.focus();
  }

  function onCheck() {
    if (checkedCurrent) return;
    const store = getStore();
    if (!store) return;

    const key = queue[roundIndex];
    const expected = packageData.translations[key] || '';
    const userNorm = store.normalizeAnswer(answerInput?.value);
    const expectedNorm = store.normalizeAnswer(expected);
    const ok = userNorm.length > 0 && userNorm === expectedNorm;

    checkedCurrent = true;
    if (answerInput) answerInput.disabled = true;
    if (inputWrap) inputWrap.hidden = false;
    if (checkBtn) checkBtn.hidden = true;
    if (revealEl) revealEl.hidden = !ok;
    if (translationEl) translationEl.textContent = expected;

    if (resultEl) {
      if (ok) {
        correctCount += 1;
        resultEl.textContent = 'Nice work!';
        resultEl.classList.add('challenge-result--ok');
      } else {
        resultEl.textContent = 'Not quite.';
        resultEl.classList.add('challenge-result--miss');
        if (revealEl) revealEl.hidden = false;
      }
    }

    if (nextBtn) {
      nextBtn.textContent = roundIndex >= TOTAL_ROUNDS - 1 ? 'See your score' : 'Next sentence';
      nextBtn.hidden = false;
    }
  }

  function onNext() {
    if (roundIndex >= TOTAL_ROUNDS - 1) {
      showScore();
      return;
    }
    roundIndex += 1;
    showRound();
  }

  function showScore() {
    if (playEl) playEl.hidden = true;
    if (scoreEl) scoreEl.hidden = false;
    const pct = Math.round((correctCount / TOTAL_ROUNDS) * 100);
    if (scoreHeadline) scoreHeadline.textContent = `You scored ${pct}%`;
    if (scoreDetail) scoreDetail.textContent = `${correctCount} of ${TOTAL_ROUNDS} translations matched.`;
  }

  function startRun() {
    roundIndex = 0;
    correctCount = 0;
    queue = buildQueue(packageData);
    if (queue.length < TOTAL_ROUNDS) {
      showError('Some sentence groups are missing from the server response.');
      return;
    }
    showRound();
  }

  async function initChallenge() {
    const store = getStore();
    const fetchSentencePackage = store?.fetchSentencePackage;
    if (!fetchSentencePackage) {
      showError('Language storage is not ready. Refresh and try again.');
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.innerHTML = '';
    }
    if (loadingEl) loadingEl.hidden = false;
    if (playEl) playEl.hidden = true;
    if (scoreEl) scoreEl.hidden = true;

    window.LingoLabReport?.renderReport(reportPanel, { variant: 'sidebar' });

    try {
      packageData = await fetchSentencePackage();
      if (loadingEl) loadingEl.hidden = true;
      startRun();
    } catch (err) {
      showError(err.message || 'Server unavailable');
    }
  }

  function boot() {
    if (booted) return;
    booted = true;
    checkBtn?.addEventListener('click', onCheck);
    answerInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !checkedCurrent) onCheck();
    });
    nextBtn?.addEventListener('click', onNext);
    tryAgainBtn?.addEventListener('click', startRun);
    initChallenge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('lingolab:store-ready', boot, { once: true });
})();