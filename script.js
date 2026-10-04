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

const loanSelect = document.querySelector('#loan-type');
const loanDetailsTemplate = document.querySelector('#loan-details-template');
let expandedLoanCard = null;
const loanDocuments = {
  'Personal Loan': ['PAN और पहचान/पता प्रमाण', 'हाल की salary slips या ITR', 'पिछले 6 महीने का bank statement', 'पासपोर्ट साइज़ फोटो'],
  'Home Loan': ['PAN और पहचान/पता प्रमाण', 'आय प्रमाण और bank statements', 'Property allotment/sale papers', 'पासपोर्ट साइज़ फोटो'],
  'Loan Against Property (LAP)': ['PAN और पहचान/पता प्रमाण', 'आय प्रमाण और bank statements', 'Property ownership/title papers'],
  'Business Loan': ['PAN और पहचान/पता प्रमाण', 'Business proof जैसे GST/Udyam (यदि लागू हो)', 'ITR और bank statements', 'Financial statements (यदि उपलब्ध हों)'],
  'Vehicle Loan': ['PAN और पहचान/पता प्रमाण', 'आय प्रमाण और bank statements', 'Vehicle quotation/proforma invoice'],
  'Education Loan': ['Student और co-applicant का KYC', 'Admission letter और fee structure', 'Academic records', 'Co-applicant का आय प्रमाण और bank statements'],
  'Gold Loan': ['PAN और पहचान/पता प्रमाण', 'Valuation के लिए गिरवी रखा जाने वाला सोना'],
  'Agriculture / Kisan Loan': ['पहचान/पता प्रमाण', 'जमीन के रिकॉर्ड (जहां लागू हों)', 'फसल/योजना से जुड़े कागज़', 'Bank account details lender को सुरक्षित तरीके से'],
  'Microfinance / Small Loan': ['पहचान/पता प्रमाण', 'आय या काम का प्रमाण', 'पते और household details से जुड़े कागज़'],
  'Credit Card Loan': ['PAN और पहचान/पता प्रमाण', 'Credit card statement', 'आय प्रमाण या bank statement (यदि मांगा जाए)']
};

document.querySelectorAll('[data-loan]').forEach((button) => button.addEventListener('click', () => {
  const card = button.closest('.loan');
  if (expandedLoanCard === card) {
    card.querySelector('.loan-inline-details').remove();
    button.setAttribute('aria-expanded', 'false');
    expandedLoanCard = null;
    return;
  }

  if (expandedLoanCard) {
    expandedLoanCard.querySelector('.loan-inline-details').remove();
    expandedLoanCard.querySelector('[data-loan]').setAttribute('aria-expanded', 'false');
  }

  const loan = button.dataset.loan;
  loanSelect.value = loan;
  button.before(loanDetailsTemplate.content.cloneNode(true));
  button.setAttribute('aria-expanded', 'true');
  expandedLoanCard = card;

  const documentList = card.querySelector('.loan-documents');
  (loanDocuments[loan] || ['PAN और पहचान/पता प्रमाण', 'आय प्रमाण और bank statements']).forEach((documentName) => {
    const item = document.createElement('li');
    item.textContent = documentName;
    documentList.append(item);
  });

  card.querySelector('.loan-details-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const details = new FormData(event.currentTarget);
    const message = [
      'Namaste Vihan Fincrop, mujhe loan ke baare mein jaankari chahiye.',
      `Loan: ${loan}`,
      `Naam: ${details.get('name')}`,
      `Phone: ${details.get('phone')}`,
      `Loan amount: ₹${Number(details.get('amount')).toLocaleString('en-IN')}`,
      `Requested tenure: ${details.get('tenure')} saal`,
      details.get('city') ? `City: ${details.get('city')}` : '',
      details.get('work') ? `Kaam: ${details.get('work')}` : '',
      details.get('income') ? `Monthly income: ${details.get('income')}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/919785208658?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
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
