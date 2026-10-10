'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  });
});

document.getElementById('year').textContent = String(new Date().getFullYear());

const form = document.querySelector('#contact-form');
const fields = ['name', 'email', 'interest'];
const validators = {
  name: element => element.value.trim().length >= 2 ? '' : 'Введите имя (не меньше 2 символов).',
  email: element => element.validity.valid && element.value.trim() ? '' : 'Введите корректный email.',
  interest: element => element.value ? '' : 'Выберите направление.'
};

function validateField(key) {
  const element = document.getElementById(key);
  const message = validators[key](element);
  document.getElementById(`${key}-error`).textContent = message;
  element.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

fields.forEach(key => {
  const element = document.getElementById(key);
  element.addEventListener('blur', () => validateField(key));
  element.addEventListener('input', () => {
    if (element.getAttribute('aria-invalid') === 'true') validateField(key);
  });
  element.addEventListener('change', () => validateField(key));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  let valid = true;
  for (const key of fields) if (!validateField(key)) valid = false;

  const consent = document.getElementById('consent');
  document.getElementById('consent-error').textContent = consent.checked ? '' : 'Подтвердите согласие с условиями демо-формы.';
  if (!consent.checked) valid = false;

  const status = document.getElementById('form-message');
  if (!valid) {
    status.textContent = 'Проверьте заполнение полей.';
    status.style.color = '#bf3547';
    const firstInvalid = form.querySelector('[aria-invalid="true"]') || (!consent.checked ? consent : null);
    firstInvalid?.focus();
    return;
  }

  const name = document.getElementById('name').value.trim();
  status.style.color = '#397825';
  status.textContent = `Спасибо, ${name}! Это демонстрация: заявка проверена, но никуда не отправлена.`;
  form.reset();
  fields.forEach(key => document.getElementById(key).removeAttribute('aria-invalid'));
});
