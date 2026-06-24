/* ==========================================================================
   BoardroomCost.com — Meeting Cost Calculator Engine
   Features: real-time taxi meter, shock factor, comparisons, export
   ========================================================================== */
(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────── */

  function fmt(n, decimals = 0) {
    if (isNaN(n) || !isFinite(n)) return '$0';
    return '$' + n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function fmtNum(n) {
    if (isNaN(n) || !isFinite(n)) return '0';
    return n.toLocaleString('en-US', { maximumFractionDigits: 1 });
  }

  function animateValue(el, newVal, prefix = '$') {
    if (!el) return;
    const formatted = prefix === '$'
      ? fmt(newVal)
      : fmtNum(newVal);
    if (el.textContent === formatted) return;
    el.textContent = formatted;
    el.classList.remove('animate');
    void el.offsetWidth; // reflow
    el.classList.add('animate');
  }

  /* ── Core calculation ─────────────────────────────────── */

  function calcMeetingCost(attendees, avgSalary, durationMins, freqCode) {
    if (!attendees || !avgSalary || !durationMins) {
      return { perMeeting: 0, perMonth: 0, perYear: 0, hoursPerYear: 0 };
    }

    // Cost per person per hour (fully loaded: salary × 1.3 for benefits/overhead)
    const loadedHourlyRate = (avgSalary / 52 / 40) * 1.3;
    const durationHours = durationMins / 60;
    const perMeeting = attendees * loadedHourlyRate * durationHours;

    // Meetings per year based on frequency
    const freqMap = {
      once: 1,
      daily: 260,       // 5 days × 52 weeks
      weekly: 52,
      biweekly: 26,
      monthly: 12,
      quarterly: 4,
    };
    const meetsPerYear = freqMap[freqCode] || 52;
    const meetsPerMonth = meetsPerYear / 12;

    return {
      perMeeting,
      perMonth: perMeeting * meetsPerMonth,
      perYear: perMeeting * meetsPerYear,
      hoursPerYear: (durationHours * meetsPerYear * attendees),
      meetsPerYear,
      loadedHourlyRate,
      durationHours,
    };
  }

  /* ── Shock phrase generator ───────────────────────────── */

  function shockPhrase(perYear, attendees, durationMins, freqCode) {
    if (!perYear) return '← Fill in the fields to reveal the real cost of your meetings';

    const freqLabel = {
      once: 'one-time',
      daily: 'daily',
      weekly: 'weekly',
      biweekly: 'bi-weekly',
      monthly: 'monthly',
      quarterly: 'quarterly',
    }[freqCode] || 'weekly';

    const options = [
      `This ${freqLabel} meeting costs your company ${fmt(perYear)} per year`,
      `Your team spends ${fmt(perYear)} annually on this single recurring meeting`,
      `Over 10 years, this meeting burns ${fmt(perYear * 10)} in salary costs`,
      `${attendees} people × ${durationMins} minutes = ${fmt(perYear)}/year in payroll`,
    ];

    return options[Math.floor(perYear / 1000) % options.length] || options[0];
  }

  /* ── Comparisons ──────────────────────────────────────── */

  function comparisons(perYear) {
    if (!perYear) return [];
    return [
      {
        icon: '👨‍💻',
        val: fmtNum(perYear / 55000),
        desc: 'junior developer salaries/year',
      },
      {
        icon: '💻',
        val: fmtNum(perYear / 1200),
        desc: 'MacBook Pros you could buy',
      },
      {
        icon: '🎓',
        val: fmtNum(perYear / 3500),
        desc: 'employee training courses',
      },
    ];
  }

  /* ── ROI Reducer ──────────────────────────────────────── */

  function calcROI(perYear, reductionPct) {
    return perYear * (reductionPct / 100);
  }

  /* ── DOM wiring ───────────────────────────────────────── */

  function getInputs() {
    return {
      attendees: parseInt(document.getElementById('attendees')?.value) || 0,
      avgSalary: parseFloat(document.getElementById('avgSalary')?.value) || 0,
      durationMins: parseInt(document.getElementById('durationMins')?.value) || 0,
      freqCode: document.getElementById('frequency')?.value || 'weekly',
      reductionPct: parseInt(document.getElementById('reductionPct')?.value) || 30,
    };
  }

  function updateUI(result, inputs) {
    // Main meter
    animateValue(document.getElementById('costPerMeeting'), result.perMeeting);
    animateValue(document.getElementById('costPerMonth'), result.perMonth);
    animateValue(document.getElementById('costPerYear'), result.perYear);

    // Hours burned
    const hrsEl = document.getElementById('hoursBurned');
    if (hrsEl) {
      hrsEl.textContent = fmtNum(result.hoursPerYear) + 'h';
      hrsEl.classList.remove('animate');
      void hrsEl.offsetWidth;
      hrsEl.classList.add('animate');
    }

    // Shock phrase
    const phraseEl = document.getElementById('shockPhrase');
    if (phraseEl) {
      phraseEl.textContent = shockPhrase(result.perYear, inputs.attendees, inputs.durationMins, inputs.freqCode);
    }

    // Comparisons
    const comps = comparisons(result.perYear);
    comps.forEach((c, i) => {
      const card = document.getElementById(`comp${i}`);
      if (!card) return;
      card.querySelector('.comparison-icon').textContent = c.icon;
      card.querySelector('.comparison-val').textContent = c.val;
      card.querySelector('.comparison-desc').textContent = c.desc;
    });

    // ROI
    const savings = calcROI(result.perYear, inputs.reductionPct);
    animateValue(document.getElementById('roiSavings'), savings);

    const roiLabel = document.getElementById('roiLabel');
    if (roiLabel) {
      roiLabel.textContent = `If you reduce meeting time by ${inputs.reductionPct}%, you save:`;
    }

    // Share text
    updateShareText(result, inputs);

    // Show results
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) resultsSection.classList.remove('hidden');
  }

  function updateShareText(result, inputs) {
    const shareMsg = document.getElementById('shareMessage');
    if (!shareMsg) return;
    if (!result.perYear) return;

    const freqLabel = { once:'one-time', daily:'daily', weekly:'weekly', biweekly:'bi-weekly', monthly:'monthly', quarterly:'quarterly' }[inputs.freqCode] || 'weekly';

    shareMsg.value = `📊 Meeting Cost Reality Check\n\nOur ${freqLabel} ${inputs.durationMins}-minute meeting with ${inputs.attendees} attendees costs:\n• Per meeting: ${fmt(result.perMeeting)}\n• Per month: ${fmt(result.perMonth)}\n• Per YEAR: ${fmt(result.perYear)}\n\nCalculated with BoardroomCost.com — should we reconsider our meeting cadence? 🤔`;
  }

  /* ── Event wiring ─────────────────────────────────────── */

  let debounceTimer;

  function onInputChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const inputs = getInputs();
      const result = calcMeetingCost(inputs.attendees, inputs.avgSalary, inputs.durationMins, inputs.freqCode);
      updateUI(result, inputs);
    }, 80);
  }

  function initRangeDisplay(rangeId, displayId, suffix = '%') {
    const range = document.getElementById(rangeId);
    const display = document.getElementById(displayId);
    if (!range || !display) return;
    display.textContent = range.value + suffix;
    range.addEventListener('input', () => {
      display.textContent = range.value + suffix;
      onInputChange();
    });
  }

  function initCalculator() {
    const ids = ['attendees', 'avgSalary', 'durationMins', 'frequency'];
    ids.forEach(id => {
      document.getElementById(id)?.addEventListener('input', onInputChange);
      document.getElementById(id)?.addEventListener('change', onInputChange);
    });

    initRangeDisplay('reductionPct', 'reductionPctVal', '%');

    // Attendee slider sync
    const attendeesInput = document.getElementById('attendees');
    const attendeesRange = document.getElementById('attendeesRange');
    if (attendeesInput && attendeesRange) {
      attendeesRange.addEventListener('input', () => {
        attendeesInput.value = attendeesRange.value;
        onInputChange();
      });
      attendeesInput.addEventListener('input', () => {
        attendeesRange.value = attendeesInput.value;
      });
    }

    // Duration presets
    document.querySelectorAll('.duration-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.duration-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dur = document.getElementById('durationMins');
        if (dur) { dur.value = btn.dataset.mins; onInputChange(); }
      });
    });

    // Calculate button (also triggers animation)
    document.getElementById('calcBtn')?.addEventListener('click', () => {
      const inputs = getInputs();
      const result = calcMeetingCost(inputs.attendees, inputs.avgSalary, inputs.durationMins, inputs.freqCode);

      // Dramatic explosion animation on the main number
      const mainNum = document.getElementById('costPerYear');
      if (mainNum && result.perYear > 0) {
        mainNum.style.transition = 'transform 0.1s ease, color 0.1s ease';
        mainNum.style.transform = 'scale(1.3)';
        mainNum.style.color = '#FF2222';
        setTimeout(() => {
          mainNum.style.transform = 'scale(1)';
          mainNum.style.color = '';
        }, 300);
      }

      updateUI(result, inputs);

      // Scroll to results
      document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Copy share message
    document.getElementById('copyShareBtn')?.addEventListener('click', () => {
      const msg = document.getElementById('shareMessage');
      if (!msg) return;
      navigator.clipboard.writeText(msg.value).then(() => {
        const btn = document.getElementById('copyShareBtn');
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      });
    });

    // Email to manager
    document.getElementById('emailManagerBtn')?.addEventListener('click', () => {
      const msg = document.getElementById('shareMessage');
      if (!msg) return;
      const subject = encodeURIComponent('Meeting Cost Analysis — Should We Reconsider?');
      const body = encodeURIComponent(msg.value);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    });

    // Export CSV
    document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
      const inputs = getInputs();
      const result = calcMeetingCost(inputs.attendees, inputs.avgSalary, inputs.durationMins, inputs.freqCode);
      const rows = [
        ['Meeting Cost Report — BoardroomCost.com', ''],
        ['Generated', new Date().toLocaleDateString()],
        [''],
        ['Input', 'Value'],
        ['Attendees', inputs.attendees],
        ['Average Salary (Annual)', inputs.avgSalary],
        ['Meeting Duration (minutes)', inputs.durationMins],
        ['Frequency', inputs.freqCode],
        [''],
        ['Result', 'Amount'],
        ['Cost per Meeting', result.perMeeting.toFixed(2)],
        ['Cost per Month', result.perMonth.toFixed(2)],
        ['Cost per Year', result.perYear.toFixed(2)],
        ['Total Attendee-Hours per Year', result.hoursPerYear.toFixed(1)],
        [''],
        ['ROI Opportunity', ''],
        [`Savings at ${inputs.reductionPct}% reduction`, calcROI(result.perYear, inputs.reductionPct).toFixed(2)],
      ];
      const csv = rows.map(r => r.map(c => {
        const s = String(c ?? '');
        return s.includes(',') ? `"${s}"` : s;
      }).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'meeting-cost-report.csv';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    });

    // Print
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());

    // Trigger initial calculation with default values
    onInputChange();
  }

  document.addEventListener('DOMContentLoaded', initCalculator);
  window.BoardroomCalc = { calcMeetingCost, fmt, fmtNum };
})();
