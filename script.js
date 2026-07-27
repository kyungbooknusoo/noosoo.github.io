document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 모바일 메뉴 토글 ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 맨 위로 버튼 ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 500);
  });
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 상담 신청 폼 검증 ---------- */
  const form = document.getElementById('consultForm');
  const successMsg = document.getElementById('formSuccess');

  const rules = {
    name: v => v.trim().length > 0 || '이름을 입력해주세요.',
    phone: v => /^[0-9\-]{9,14}$/.test(v.trim()) || '올바른 연락처를 입력해주세요.',
    email: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || '이메일 형식을 확인해주세요.',
    service: v => v.trim().length > 0 || '상담 분야를 선택해주세요.'
  };

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    const result = rule(field.value);
    const row = field.closest('.form-row');
    const errorEl = form.querySelector(`.error-msg[data-for="${field.name}"]`);

    if (result === true) {
      row.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    } else {
      row.classList.add('invalid');
      if (errorEl) errorEl.textContent = result;
      return false;
    }
  }

  ['name', 'phone', 'email', 'service'].forEach(name => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-row').classList.contains('invalid')) {
          validateField(field);
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');

    let isValid = true;
    ['name', 'phone', 'email', 'service'].forEach(name => {
      const field = form.elements[name];
      if (field && !validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('.form-row.invalid input, .form-row.invalid select');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 실제 서버 연동 시 이 부분에 fetch()로 API 호출을 추가하세요.
    successMsg.classList.add('show');
    form.reset();
  });

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  const revealTargets = document.querySelectorAll('.work-card, .about-card, .contact-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
