/**
 * HawkEye - Main JavaScript File
 * Core functionality for website interactivity:
 * - Navigation and UI controls
 * - Security scanning features
 * - Dynamic content generation
 * - Form handling and validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Setup
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  const menuIcons = {
    open: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>`,
    closed: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>`
  };

  if (menuToggle && mobileMenu) {
    menuToggle.innerHTML = menuIcons.closed;
    menuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', (!isOpen).toString());
      menuToggle.innerHTML = isOpen ? menuIcons.closed : menuIcons.open;
    });
  }

  // Threat Counter Animation
  const threatEl = document.getElementById('threatCount');
  if (threatEl) {
    let count = 2847293;
    threatEl.textContent = count.toLocaleString();
    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      threatEl.textContent = count.toLocaleString();
    }, 3000);
  }

  // Scan Mode Switching
  const scanElements = {
    file: {
      btn: document.getElementById('btnFileMode'),
      mode: document.getElementById('fileMode'),
      styles: ['bg-gradient-to-r', 'from-cyan-500', 'to-blue-500', 'text-white', 'shadow-lg', 'shadow-cyan-500/25']
    },
    url: {
      btn: document.getElementById('btnUrlMode'),
      mode: document.getElementById('urlMode'),
      styles: ['bg-gradient-to-r', 'from-purple-500', 'to-violet-500', 'text-white', 'shadow-lg', 'shadow-purple-500/25']
    }
  };

  const switchMode = (activeType, inactiveType) => {
    const active = scanElements[activeType];
    const inactive = scanElements[inactiveType];
    
    if (active.mode) active.mode.classList.remove('hidden');
    if (inactive.mode) inactive.mode.classList.add('hidden');
    if (active.btn) active.btn.classList.add(...active.styles);
    if (inactive.btn) inactive.btn.classList.remove(...inactive.styles);
  };

  scanElements.file.btn?.addEventListener('click', () => switchMode('file', 'url'));
  scanElements.url.btn?.addEventListener('click', () => switchMode('url', 'file'));

  // Scanner Interface
  const scannerElements = {
    file: {
      input: document.getElementById('fileUpload'),
      ready: document.getElementById('fileReady'),
      name: document.getElementById('fileName'),
      button: document.getElementById('btnStartFileScan')
    },
    url: {
      input: document.getElementById('urlInput'),
      button: document.getElementById('btnAnalyzeUrl')
    }
  };

  const loadingSpinner = '<svg class="animate-spin w-5 h-5 mr-2 inline-block" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>';

  // File scanning setup
  const { input: fileInput, ready: fileReady, name: fileName, button: scanButton } = scannerElements.file;
  
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file && fileName && fileReady) {
      fileName.textContent = `Ready to scan: ${file.name}`;
      fileReady.classList.remove('hidden');
    } else if (fileReady) {
      fileReady.classList.add('hidden');
    }
  });

  scanButton?.addEventListener('click', () => {
    const simulateScan = async (button, duration = 1200) => {
      button.disabled = true;
      const originalContent = button.innerHTML;
      button.innerHTML = loadingSpinner + 'Scanning...';
      
      await new Promise(resolve => setTimeout(resolve, duration));
      
      button.disabled = false;
      button.innerHTML = originalContent;
      alert('Scan complete: No threats found.');
    };

    simulateScan(scanButton);
  });

  // URL scanning setup
  const { input: urlInput, button: analyzeButton } = scannerElements.url;
  
  urlInput?.addEventListener('input', () => {
    if (analyzeButton) analyzeButton.disabled = !urlInput.value.trim();
  });

  analyzeButton?.addEventListener('click', () => {
    const simulateAnalysis = async (button, duration = 1000) => {
      button.disabled = true;
      const originalContent = button.innerHTML;
      button.innerHTML = loadingSpinner + 'Analyzing...';
      
      await new Promise(resolve => setTimeout(resolve, duration));
      
      button.disabled = false;
      button.innerHTML = originalContent;
      alert('URL is safe to visit.');
    };

    simulateAnalysis(analyzeButton);
  });

  // Feature Cards Generation
  const features = [
    {
      title: 'File Scanner',
      description: 'Upload and scan files for malware, viruses, and suspicious content with advanced heuristic analysis.',
      theme: { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' }
    },
    {
      title: 'URL Analyzer',
      description: 'Check websites and links for phishing attempts, malicious redirects, and unsafe content.',
      theme: { gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
    },
    {
      title: 'Macro Viewer',
      description: 'Safely inspect hidden scripts and macros in Word documents, PDFs, and other files.',
      theme: { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
    },
    {
      title: 'Email Scam Checker',
      description: 'Analyze emails for phishing attempts, suspicious attachments, and social engineering.',
      theme: { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
    },
    {
      title: 'Dark Web Scanner',
      description: 'Monitor if your personal data has been compromised and leaked on dark web marketplaces.',
      theme: { gradient: 'from-red-500 to-pink-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
    },
    {
      title: 'Bulk Scanner',
      description: 'Scan multiple files and URLs simultaneously for comprehensive threat analysis.',
      theme: { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
    }
  ];

  const featureGrid = document.getElementById('featureGrid');
  if (featureGrid) {
    const createFeatureCard = ({ title, description, theme }) => {
      const card = document.createElement('div');
      card.className = `group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border ${theme.border} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${theme.bg}`;
      card.innerHTML = `
        <div class="inline-flex p-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white mb-6 group-hover:scale-110 transition-transform shadow-lg"></div>
        <h3 class="text-xl font-semibold text-white mb-4">${title}</h3>
        <p class="text-gray-300 leading-relaxed mb-4">${description}</p>
        <button class="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center transition-colors">Learn More</button>
      `;
      return card;
    };

    features.forEach(feature => featureGrid.appendChild(createFeatureCard(feature)));
  }

  // --- Contact & Newsletter handlers (from user-provided code) ---
  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');
  const closeModalX = document.getElementById('closeModalX');

  if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
  if (closeModalX) closeModalX.addEventListener('click', hideModal);

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);

  // Add input animations for contact form fields
  const formInputs = document.querySelectorAll('.input-group input, .input-group select, .input-group textarea');
  formInputs.forEach(input => {
    if (!input) return;
    const parent = input.parentElement;
    input.addEventListener('focus', () => { if (parent) parent.classList.add('focused'); });
    input.addEventListener('blur', () => {
      if (parent) parent.classList.remove('focused');
      if (input.value.trim() !== '' && parent) parent.classList.add('filled'); else if (parent) parent.classList.remove('filled');
    });
    if (input.value.trim() !== '' && parent) parent.classList.add('filled');
  });
});

// SECTION: Form Handling Functions
/**
 * Handles the submission of the contact form
 * Validates all fields and shows appropriate feedback
 * @param {Event} e - The form submission event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const interestInput = form.querySelector('#interest');
  const messageInput = form.querySelector('#message');
  const submitBtn = form.querySelector('button[type="submit"]');

  resetValidation(form);
  let isValid = true;
  if (!validateName(nameInput)) isValid = false;
  if (!validateEmail(emailInput)) isValid = false;
  if (phoneInput && phoneInput.value && !validatePhone(phoneInput)) isValid = false;
  if (!validateRequired(interestInput, 'Please select your interest')) isValid = false;
  if (!validateRequired(messageInput, 'Please enter your message')) isValid = false;

  if (isValid) {
    if (submitBtn) {
      submitBtn.disabled = true;
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div><span>Sending...</span>`;
      setTimeout(() => {
        if (form.reset) form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        showModal();
      }, 1500);
    }
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const submitBtn = document.getElementById('newsletterBtn');
  if (!emailInput || !emailInput.value.trim()) return;
  if (!submitBtn) return;
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Subscribing...';
  setTimeout(() => {
    submitBtn.textContent = 'Subscribed!';
    submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    submitBtn.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-500', 'hover:from-cyan-600', 'hover:to-blue-600');
    emailInput.value = '';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
      submitBtn.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-500', 'hover:from-cyan-600', 'hover:to-blue-600');
    }, 3000);
  }, 1000);
}

// SECTION: Modal Dialog Controls
/**
 * Shows the success modal with animation
 */
function showModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('opacity-0', 'invisible');
    modal.classList.add('opacity-100', 'visible');
    const modalContent = modal.querySelector('.bg-gradient-to-br');
    if (modalContent) {
      modalContent.classList.remove('translate-y-5');
      modalContent.classList.add('translate-y-0');
    }
  }
}

function hideModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    const modalContent = modal.querySelector('.bg-gradient-to-br');
    if (modalContent) {
      modalContent.classList.add('translate-y-5');
      modalContent.classList.remove('translate-y-0');
    }
    setTimeout(() => {
      modal.classList.add('opacity-0', 'invisible');
      modal.classList.remove('opacity-100', 'visible');
    }, 150);
  }
}

// Form Validation
const validators = {
  resetValidation: (form) => {
    if (!form) return;
    form.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('error');
      const input = group.querySelector('input, select, textarea');
      const error = group.querySelector('.error-message');
      
      if (input) {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-600');
      }
      if (error) {
        error.textContent = '';
        error.classList.add('hidden');
      }
    });
  },

  showError: (input, message) => {
    if (!input) return false;
    const group = input.parentElement;
    if (!group) return false;

    group.classList.add('error');
    input.classList.remove('border-gray-600');
    input.classList.add('border-red-500');

    const error = group.querySelector('.error-message');
    if (error) {
      error.textContent = message;
      error.classList.remove('hidden');
    }
    return false;
  },

  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  },

  validate: {
    required: (input, message) => 
      !input || input.value.trim() === '' ? 
        validators.showError(input, message) : true,

    name: (input) => {
      if (!input) return false;
      const value = input.value.trim();
      if (!value) return validators.showError(input, 'Please enter your name');
      if (value.length < 2) return validators.showError(input, 'Name must be at least 2 characters');
      return true;
    },

    email: (input) => {
      if (!input) return false;
      const value = input.value.trim();
      if (!value) return validators.showError(input, 'Please enter your email');
      if (!validators.patterns.email.test(value)) {
        return validators.showError(input, 'Please enter a valid email address');
      }
      return true;
    },

    phone: (input) => {
      if (!input || !input.value.trim()) return true;
      if (!validators.patterns.phone.test(input.value.trim())) {
        return validators.showError(input, 'Please enter a valid phone number');
      }
      return true;
    }
  }
};

