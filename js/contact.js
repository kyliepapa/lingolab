const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

// Replace this with the inbox that should receive LingoLab messages.
const contactRecipient = 'hello@lingolab.com';

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = `LingoLab message from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailto = `mailto:${contactRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  contactStatus.textContent = 'Opening your email app…';
  window.location.href = mailto;
});
