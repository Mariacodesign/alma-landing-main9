const revealElements = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion) {
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

const inPageLinks = document.querySelectorAll('a[href^="#"]');
inPageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const guideList = document.querySelector('#learn .guide-list');
const guideItems = document.querySelectorAll('#learn .guide-item');

if (guideList && guideItems.length) {
  if (reducedMotion) {
    guideItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    guideItems.forEach((item) => {
      item.classList.add('is-pending');
      item.style.transitionDelay = '0ms';
    });

    const guideObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          guideItems.forEach((item, index) => {
            window.setTimeout(() => {
              item.classList.add('is-visible');
            }, index * 180);
          });
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    guideObserver.observe(guideList);
  }
}

const form = document.querySelector('.lead-form');
const feedback = document.querySelector('.form-feedback');

if (form && feedback) {
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const submitButton = form.querySelector('button[type="submit"]');

  const setFieldState = (input, state) => {
    input.classList.remove('is-valid', 'is-invalid');

    if (state) {
      input.classList.add(state);
    }
  };

  const validateForm = ({ showMessages = false } = {}) => {
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const emailIsValid = emailInput.validity.valid && emailValue !== '';
    const formIsValid = nameValue !== '' && emailIsValid;

    setFieldState(nameInput, nameValue ? 'is-valid' : '');

    if (emailValue === '') {
      setFieldState(emailInput, showMessages ? 'is-invalid' : '');
    } else {
      setFieldState(emailInput, emailIsValid ? 'is-valid' : 'is-invalid');
    }

    emailInput.setAttribute('aria-invalid', String(emailValue !== '' && !emailIsValid));
    submitButton.disabled = !formIsValid;

    if (!showMessages) {
      feedback.textContent = emailIsValid ? 'Email valido. Ya puedes recibir la guia.' : '';
      feedback.classList.remove('is-error', 'is-success');

      if (emailIsValid) {
        feedback.classList.add('is-success');
      }

      return formIsValid;
    }

    feedback.classList.remove('is-error', 'is-success');

    if (!nameValue && !emailValue) {
      feedback.textContent = 'Completa tu nombre y tu email para recibir la guia.';
      feedback.classList.add('is-error');
      return false;
    }

    if (!nameValue) {
      feedback.textContent = 'Escribe tu nombre para continuar.';
      feedback.classList.add('is-error');
      return false;
    }

    if (!emailValue) {
      feedback.textContent = 'Escribe tu email para recibir la guia.';
      feedback.classList.add('is-error');
      return false;
    }

    if (!emailIsValid) {
      feedback.textContent = 'Introduce un email valido.';
      feedback.classList.add('is-error');
      return false;
    }

    feedback.textContent = 'Perfecto. Tu guia ya viene en camino a tu email.';
    feedback.classList.add('is-success');
    return true;
  };

  form.addEventListener('input', () => {
    validateForm();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForm({ showMessages: true })) {
      return;
    }

    form.reset();
    setFieldState(nameInput, '');
    setFieldState(emailInput, '');
    emailInput.setAttribute('aria-invalid', 'false');
    submitButton.disabled = true;
  });

  validateForm();
}
