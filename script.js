const amount = document.querySelector('#amount');
const rate = document.querySelector('#rate');
const years = document.querySelector('#years');
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function updateEstimate() {
  const principal = Number(amount.value);
  const monthlyRate = Number(rate.value) / 1200;
  const months = Number(years.value) * 12;
  const growth = (1 + monthlyRate) ** months;
  const emi = monthlyRate === 0 ? principal / months : principal * monthlyRate * growth / (growth - 1);
  const total = emi * months;
  const progress = (principal - Number(amount.min)) / (Number(amount.max) - Number(amount.min)) * 100;

  document.querySelector('#amount-view').textContent = money.format(principal);
  document.querySelector('#emi').textContent = money.format(emi);
  document.querySelector('#total').textContent = money.format(total);
  document.querySelector('#interest').textContent = money.format(total - principal);
  amount.style.background = `linear-gradient(to right, #4f7b5f ${progress}%, #e1e8df ${progress}%)`;
}

[amount, rate, years].forEach((input) => input.addEventListener('input', updateEstimate));
updateEstimate();

const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('#nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}));

document.querySelectorAll('[data-loan]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#loan-type').value = button.dataset.loan;
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}));

document.querySelector('#inquiry').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const message = [
    'Namaste Vihan Fincrop, mujhe loan ke baare mein jaankari chahiye.',
    `Naam: ${form.get('name')}`,
    `Phone: ${form.get('phone')}`,
    `Loan: ${form.get('loan')}`
  ].join('\n');
  document.querySelector('#status').textContent = 'WhatsApp khul raha hai. Bhejne se pehle apna message dekh lein.';
  window.open(`https://wa.me/919785208658?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('#year').textContent = new Date().getFullYear();

const loader = document.querySelector('#loader');
if (loader) {
  const loaderStarted = performance.now();
  let loaderHidden = false;

  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const remaining = Math.max(0, 850 - (performance.now() - loaderStarted));
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 500);
    }, remaining);
  }

  window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 2400);
}
