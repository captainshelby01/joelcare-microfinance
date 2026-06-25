document.addEventListener('DOMContentLoaded', () => {
  
  // Client Constants
  const WHATSAPP_NUMBER = '2348123184067';
  const MONTHLY_INTEREST_RATE = 0.05; // 5% flat interest rate per month

  /* ==========================================================================
     HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  if (menuToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      
      if (isOpen) {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock page scroll
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = ''; // Unlock page scroll
      }
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  /* ==========================================================================
     ACTIVE NAVIGATION HIGH-LIGHTER ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktop-nav a');

  const highlightNav = () => {
    let scrollPosition = window.scrollY + 150; // offset header height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ==========================================================================
     SCROLL-TO-TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     STATS COUNTERUP ANIMATION
     ========================================================================== */
  const counters = document.querySelectorAll('.stat-num');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out formula
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(ease * target);
      
      el.textContent = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    requestAnimationFrame(updateCounter);
  };

  // Run on intersection
  if ('IntersectionObserver' in window && counters.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(c => observer.observe(c));
  } else {
    // Fallback if IntersectionObserver is not supported
    counters.forEach(c => {
      const target = c.getAttribute('data-count');
      const suffix = c.getAttribute('data-suffix') || '';
      c.textContent = target + suffix;
    });
  }

  /* ==========================================================================
     INTERACTIVE LOAN CALCULATOR
     ========================================================================== */
  const loanAmountInput = document.getElementById('loan-amount');
  const loanTermInput = document.getElementById('loan-term');
  
  const amountDisplay = document.getElementById('amount-display');
  const termDisplay = document.getElementById('term-display');
  
  const installmentDisplay = document.getElementById('installment-display');
  const frequencyLabel = document.getElementById('frequency-label');
  
  const calcPrincipal = document.getElementById('calc-principal');
  const calcInterest = document.getElementById('calc-interest');
  const calcTotal = document.getElementById('calc-total');
  
  const freqButtons = document.querySelectorAll('.freq-btn');
  const calcApplyBtn = document.getElementById('calculator-apply-btn');

  let currentFrequency = 'weekly'; // default frequency

  if (loanAmountInput && loanTermInput) {
    
    // Repayment Calculation Formula
    const calculateRepayments = () => {
      const principal = parseInt(loanAmountInput.value, 10);
      const months = parseInt(loanTermInput.value, 10);
      
      // Flat Rate calculations
      const totalInterest = Math.round(principal * MONTHLY_INTEREST_RATE * months);
      const totalRepayable = principal + totalInterest;
      
      let installment = 0;
      if (currentFrequency === 'weekly') {
        // Flat weeks (4 per month in typical local microfinance cycles)
        const totalWeeks = months * 4;
        installment = Math.round(totalRepayable / totalWeeks);
        frequencyLabel.textContent = 'per week';
      } else {
        installment = Math.round(totalRepayable / months);
        frequencyLabel.textContent = 'per month';
      }

      // Format displays
      amountDisplay.textContent = '₦' + principal.toLocaleString();
      termDisplay.textContent = months + (months === 1 ? ' Month' : ' Months');
      
      calcPrincipal.textContent = '₦' + principal.toLocaleString();
      calcInterest.textContent = '₦' + totalInterest.toLocaleString();
      calcTotal.textContent = '₦' + totalRepayable.toLocaleString();
      
      installmentDisplay.textContent = '₦' + installment.toLocaleString();

      // Update WhatsApp URL
      const frequencyText = currentFrequency === 'weekly' ? 'weekly' : 'monthly';
      const messageText = `Hi Joel Care, I calculated a loan estimate using your website:
- Loan Amount: ₦${principal.toLocaleString()}
- Repayment Duration: ${months} month(s)
- Repayment Frequency: ${frequencyText}
- Estimated Installment: ₦${installment.toLocaleString()} per ${currentFrequency === 'weekly' ? 'week' : 'month'}

I would like to enquire about starting my application.`;

      calcApplyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
    };

    // Sliders Event Listeners
    loanAmountInput.addEventListener('input', calculateRepayments);
    loanTermInput.addEventListener('input', calculateRepayments);

    // Frequency Toggle Event Listeners
    freqButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        freqButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFrequency = btn.getAttribute('data-freq');
        calculateRepayments();
      });
    });

    // Run initial calculation
    calculateRepayments();
  }

  /* ==========================================================================
     FAQ ACCORDION
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = header.nextElementSibling;
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        
        const body = item.querySelector('.faq-body');
        body.style.maxHeight = '0px';
        body.setAttribute('aria-hidden', 'true');
      });

      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        faqBody.setAttribute('aria-hidden', 'false');
        
        // Set dynamic scrollHeight for smooth transition height
        faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     WHATSAPP CONTACT FORM SUBMISSION
     ========================================================================== */
  const whatsappForm = document.getElementById('whatsapp-form');

  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const loanType = document.getElementById('contact-loan-type').value;
      const details = document.getElementById('contact-message').value.trim();

      if (!name || !phone || !loanType) {
        alert('Please fill out all required fields.');
        return;
      }

      // Format custom message text
      let formMessage = `Hi Joel Care, I'm submitting an enquiry from your website contact form:
- Full Name: ${name}
- Phone Number: ${phone}
- Loan Interest: ${loanType}`;

      if (details) {
        formMessage += `\n- Details: ${details}`;
      }

      // Generate API URL
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formMessage)}`;
      
      // Open in a new window/tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
});