(function () {
  function initChecklistProgress() {
    var doc = document.querySelector('.check-doc');
    if (!doc) return;

    var boxes = Array.prototype.slice.call(doc.querySelectorAll('.check-item input[type="checkbox"]'));
    if (!boxes.length) return;

    var summary = doc.querySelector('.check-summary');
    var statusGrid = doc.querySelector('.check-status-grid');
    var target = summary || statusGrid || doc.querySelector('.check-title');
    if (!target) return;

    var progress = document.createElement('div');
    progress.className = 'check-progress';
    progress.setAttribute('role', 'status');
    progress.setAttribute('aria-live', 'polite');
    progress.innerHTML = '<div class="check-progress-top"><span class="check-progress-label">Progress</span><span class="check-progress-count">0/' + boxes.length + ' complete</span></div><div class="check-progress-track"><span></span></div>';

    target.insertAdjacentElement(summary ? 'afterend' : 'beforebegin', progress);

    var count = progress.querySelector('.check-progress-count');
    var fill = progress.querySelector('.check-progress-track span');

    function updateProgress() {
      var done = boxes.filter(function (box) { return box.checked; }).length;
      var percent = Math.round((done / boxes.length) * 100);
      count.textContent = done + '/' + boxes.length + ' complete';
      fill.style.width = percent + '%';
      progress.classList.toggle('is-complete', done === boxes.length);
    }

    boxes.forEach(function (box) {
      box.addEventListener('change', updateProgress);
    });

    updateProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChecklistProgress);
  } else {
    initChecklistProgress();
  }
})();
