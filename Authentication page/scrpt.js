// ====================================================================
// AUTHENTICATION PAGE — Panel switching logic
// Handles: welcome -> login -> signup transitions with directional
// slide animations, plus basic (non-networked) form submit handling.
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Element references ----------
  const welcomePanel = document.getElementById('welcomePanel');
  const loginPanel   = document.getElementById('loginPanel');
  const signupPanel  = document.getElementById('signupPanel');

  const showLoginBtn  = document.getElementById('showLoginBtn');
  const showSignupBtn = document.getElementById('showSignupBtn');
  const navLoginBtn   = document.getElementById('navLoginBtn');

  const loginBackBtn  = document.getElementById('loginBackBtn');
  const signupBackBtn = document.getElementById('signupBackBtn');

  const toSignupLink = document.getElementById('toSignupLink');
  const toLoginLink  = document.getElementById('toLoginLink');

  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  /**
   * Swap the visible panel with a directional slide-in animation.
   * Step 1: the current panel fades out completely (everything disappears).
   * Step 2: only once that fade-out animation actually finishes, the new
   * panel is revealed and slides in from the requested screen edge.
   * Using the 'animationend' event (instead of a guessed setTimeout delay)
   * keeps the two steps perfectly in sync no matter the CSS duration.
   * @param {HTMLElement} hidePanel - panel currently visible
   * @param {HTMLElement} showPanel - panel to reveal
   * @param {'left'|'right'} direction - which screen edge showPanel enters from
   */
  function switchPanel(hidePanel, showPanel, direction) {
    // Fade the current panel out
    hidePanel.classList.remove('anim-fade-in', 'anim-slide-left', 'anim-slide-right');
    hidePanel.classList.add('anim-fade-out');

    function onFadeOutEnd(evt) {
      if (evt.target !== hidePanel) return; // ignore bubbled child animations
      hidePanel.removeEventListener('animationend', onFadeOutEnd);

      // Fully hide the old panel now that it has faded out
      hidePanel.classList.add('d-none');
      hidePanel.classList.remove('anim-fade-out');

      // Reveal the new panel and trigger its slide-in animation
      showPanel.classList.remove('d-none', 'anim-slide-left', 'anim-slide-right', 'anim-fade-in');
      void showPanel.offsetWidth; // force reflow so the animation replays every time
      showPanel.classList.add(direction === 'right' ? 'anim-slide-right' : 'anim-slide-left');
    }

    hidePanel.addEventListener('animationend', onFadeOutEnd);
  }

  // ---------- Welcome → Login (slides right to left) ----------
  function goToLogin() {
    switchPanel(welcomePanel, loginPanel, 'right');
  }

  // ---------- Welcome → Sign Up (slides left to right) ----------
  function goToSignup() {
    switchPanel(welcomePanel, signupPanel, 'left');
  }

  // ---------- Login → Sign Up ----------
  function loginToSignup() {
    switchPanel(loginPanel, signupPanel, 'left');
  }

  // ---------- Sign Up → Login ----------
  function signupToLogin() {
    switchPanel(signupPanel, loginPanel, 'right');
  }

  // ---------- Back to welcome from either form ----------
  function backToWelcome(fromPanel) {
    switchPanel(fromPanel, welcomePanel, fromPanel === loginPanel ? 'left' : 'right');
  }

  // ---------- Event bindings ----------
  showLoginBtn.addEventListener('click', goToLogin);
  navLoginBtn.addEventListener('click', goToLogin);
  showSignupBtn.addEventListener('click', goToSignup);

  toSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginToSignup();
  });

  toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupToLogin();
  });

  loginBackBtn.addEventListener('click', () => backToWelcome(loginPanel));
  signupBackBtn.addEventListener('click', () => backToWelcome(signupPanel));

  // ---------- Form submit handling (placeholder — no backend wired) ----------
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: wire up to your authentication endpoint
    console.log('Login submitted:', {
      email: document.getElementById('loginEmail').value,
      remember: document.getElementById('rememberMe').checked
    });
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('signupPassword').value;
    const confirm   = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }

    // TODO: wire up to your registration endpoint
    console.log('Sign up submitted:', {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('signupEmail').value
    });
  });

});