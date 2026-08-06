/* koind — shared site behavior */

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "chapters.html", label: "Chapters" },
  { href: "vocabulary.html", label: "Vocabulary" },
  { href: "grammar.html", label: "Grammar" },
  { href: "sentences.html", label: "Daily Sentences" },
  { href: "contact.html", label: "Contact" },
];

function currentPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  return path;
}

function renderNav() {
  const mount = document.getElementById("site-nav");
  if (!mount) return;
  const page = currentPage();
  mount.innerHTML = `
    <div class="wrap">
      <a href="index.html" class="wordmark">koind<span class="dot">.</span></a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <ul class="nav-links" id="nav-links">
        ${NAV_LINKS.map(
          (l) => `<li><a href="${l.href}" class="${l.href === page ? "active" : ""}">${l.label}</a></li>`
        ).join("")}
      </ul>
    </div>
  `;
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  mount.innerHTML = `
    <div class="wrap">
      <div class="footer-top">
        <div>
          <div class="footer-wordmark">koind<span style="color:var(--red)">.</span></div>
          <p style="max-width:32ch;color:rgba(246,240,228,0.6);font-size:0.9rem;">Korean सीखें हिंदी में — a Hindi-first Korean course, built lesson by lesson.</p>
        </div>
        <div class="footer-cols">
          <div class="footer-col">
            <h4>Learn</h4>
            <a href="chapters.html">Chapters</a>
            <a href="vocabulary.html">Vocabulary</a>
            <a href="grammar.html">Grammar</a>
            <a href="sentences.html">Daily Sentences</a>
          </div>
          <div class="footer-col">
            <h4>Site</h4>
            <a href="index.html">Home</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} koind. All content written from scratch for Hindi-speaking learners.</span>
        <span>ज्ञान • अभ्यास • प्रगति</span>
      </div>
    </div>
  `;
}

function initChrome() {
  renderNav();
  renderFooter();
}

/* ---------------- Accordion helper ---------------- */

function toggleAccordion(headerEl) {
  const item = headerEl.closest(".acc-item");
  const wasOpen = item.classList.contains("open");
  item.classList.toggle("open", !wasOpen);
  headerEl.setAttribute("aria-expanded", String(!wasOpen));
}

function toggleLessonDetail(el) {
  const detail = el.nextElementSibling;
  if (detail && detail.classList.contains("lesson-detail")) {
    detail.classList.toggle("open");
  }
}

/* ---------------- Simple localStorage helpers (bookmarks) ---------------- */

const STORE_KEY = "koind_bookmarks_v1";

function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isBookmarked(id) {
  return getBookmarks().some((b) => b.id === id);
}

function toggleBookmarkStore(bookmark) {
  const list = getBookmarks();
  const idx = list.findIndex((b) => b.id === bookmark.id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(bookmark);
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
  return list;
}

/* ---------------- Quiz engine ---------------- */

function buildQuiz(container, lesson) {
  let index = 0;
  let score = 0;
  const total = lesson.quiz.length;

  function renderQuestion() {
    if (index >= total) {
      container.innerHTML = `
        <div class="quiz-result">
          <div class="eyebrow">अभ्यास पूरा हुआ · Practice complete</div>
          <div class="big">${score} / ${total}</div>
          <p style="color:var(--ink-soft);margin-top:10px;">
            ${score === total ? "बहुत बढ़िया! सभी सही। (Perfect score!)" : "अच्छा प्रयास! दोबारा कोशिश करें।"}
          </p>
          <button class="btn btn-ink" onclick="(function(){ window.__restartQuiz_${lesson.id}(); })()">फिर से शुरू करें (Restart)</button>
        </div>
      `;
      return;
    }
    const q = lesson.quiz[index];
    container.innerHTML = `
      <div class="quiz-progress">प्रश्न ${index + 1} / ${total}</div>
      <div class="quiz-question">
        <div class="ko">${q.question}</div>
      </div>
      <div class="quiz-options">
        ${q.options
          .map((opt, i) => `<button class="quiz-option" data-i="${i}">${opt}</button>`)
          .join("")}
      </div>
      <div class="quiz-hi" id="quiz-hi-${lesson.id}" style="min-height:1.4em;"></div>
    `;
    const buttons = container.querySelectorAll(".quiz-option");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = Number(btn.dataset.i);
        buttons.forEach((b) => (b.disabled = true));
        if (chosen === q.answerIndex) {
          btn.classList.add("correct");
          score++;
        } else {
          btn.classList.add("wrong");
          buttons[q.answerIndex].classList.add("correct");
        }
        const hiEl = document.getElementById(`quiz-hi-${lesson.id}`);
        if (hiEl) hiEl.textContent = q.hi || "";
        setTimeout(() => {
          index++;
          renderQuestion();
        }, 1100);
      });
    });
  }

  window[`__restartQuiz_${lesson.id}`] = function () {
    index = 0;
    score = 0;
    renderQuestion();
  };

  renderQuestion();
}

document.addEventListener("DOMContentLoaded", initChrome);
