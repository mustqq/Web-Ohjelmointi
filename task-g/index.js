// index.js
// Author: Glen-Henrik Mustonen
// Date: 2025-11-07

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('regForm');
  const tsInput = document.getElementById('timestamp');
  const fullname = document.getElementById('fullname');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const birthdate = document.getElementById('birthdate');
  const terms = document.getElementById('terms');
  const tbody = document.querySelector('#timetable tbody');

  const errs = {
    fullname: document.getElementById('err-fullname'),
    email: document.getElementById('err-email'),
    phone: document.getElementById('err-phone'),
    birthdate: document.getElementById('err-birthdate'),
    terms: document.getElementById('err-terms'),
  };

  function clearErrors() {
    Object.values(errs).forEach(e => e.textContent = '');
  }

  function validate() {
    clearErrors();
    let valid = true;

    const nameVal = fullname.value.trim();
    const nameParts = nameVal.split(/\s+/).filter(Boolean);
    if (!nameVal) {
      errs.fullname.textContent = 'Anna koko nimi (etu- ja sukunimi).';
      valid = false;
    } else if (nameParts.length < 2 || nameParts.some(p => p.length < 2)) {
      errs.fullname.textContent = 'Tarvitaan ainakin kaksi nimeä (yli kaksi kirjainta).';
      valid = false;
    }

    const emailVal = email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      errs.email.textContent = 'Anna sähköpostiosoite';
      valid = false;
    } else if (!emailRe.test(emailVal)) {
      errs.email.textContent = 'Väärä sähköpostiosoite (nimi@esimerkki.com)';
      valid = false;
    }

    const phoneVal = phone.value.trim();
    const phoneRe = /^(\+358|0)\d{7,12}$/;
    if (!phoneVal) {
      errs.phone.textContent = 'Anna puhelinnumero';
      valid = false;
    } else if (!phoneRe.test(phoneVal.replace(/\s+/g, ''))) {
      errs.phone.textContent = 'Puhelinnumeron täytyy alkaa +358 tai 0. Vain numeroita (esimerkiksi +358440941904 tai 0440941904';
      valid = false;
    }

    const bdVal = birthdate.value;
    if (!bdVal) {
      errs.birthdate.textContent = '';
      valid = false;
    } else {
      const bd = new Date(bdVal);
      const now = new Date();
      if (bd > now) {
        errs.birthdate.textContent = 'Syntymäaika ei voi olla tulevaisuudessa';
        valid = false;
      } else {
        const age = now.getFullYear() - bd.getFullYear() - ((now.getMonth() < bd.getMonth() || (now.getMonth() === bd.getMonth() && now.getDate() < bd.getDate())) ? 1 : 0);
        if (age < 13) {
          errs.birthdate.textContent = 'Sinun täytyy olla vähintään 13-vuotias rekistöröitymiseen';
          valid = false;
        }
      }
    }

    if (!terms.checked) {
      errs.terms.textContent = '// Sinun on hyväksyttävä käyttäjäehdot';
      valid = false;
    }

    return valid;
  }

  function formatTimestamp(d = new Date()) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const now = new Date();
    tsInput.value = now.toISOString();

    const tr = document.createElement('tr');

    const cells = [
      formatTimestamp(now),
      fullname.value.trim(),
      email.value.trim(),
      phone.value.trim(),
      birthdate.value,
      terms.checked ? 'Yes' : 'No'
    ];

    cells.forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);

    form.reset();
    clearErrors();
  });
});