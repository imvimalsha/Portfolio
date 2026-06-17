// ==========================================================================
// THEME SWITCHER
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from storage (default to light)
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme) {
  htmlElement.setAttribute('data-theme', savedTheme);
} else {
  htmlElement.setAttribute('data-theme', 'light');
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
});

// ==========================================================================
// TYPEWRITER EFFECT
// ==========================================================================
const typewriterElement = document.getElementById('typewriter');
const words = ["Analytical Modelling Manager", "Fintech Risk Analyst", "Decision Scientist", "Agentic AI Architect"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentWord = words[wordIdx];
  
  if (isDeleting) {
    typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    typingSpeed = 50; // faster deleting
  } else {
    typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    typingSpeed = 120; // normal typing
  }
  
  // Word fully typed
  if (!isDeleting && charIdx === currentWord.length) {
    isDeleting = true;
    typingSpeed = 2000; // pause at end of word
  } 
  // Word fully deleted
  else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typingSpeed = 500; // pause before typing next
  }
  
  setTimeout(typeEffect, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  if (typewriterElement) {
    setTimeout(typeEffect, 1000);
  }
});

// ==========================================================================
// INTERSECTION OBSERVER FOR SCROLL REVEAL
// ==========================================================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); // Trigger only once
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ==========================================================================
// ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
// ==========================================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activeId = entry.target.getAttribute('id');
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.35,
  rootMargin: '-80px 0px -30% 0px'
});

sections.forEach(section => sectionObserver.observe(section));

// ==========================================================================
// INTERACTIVE RISK MATRIX CALCULATOR
// ==========================================================================
const probSlider = document.getElementById('probability-slider');
const impactSlider = document.getElementById('impact-slider');
const probValDisplay = document.getElementById('probability-val');
const impactValDisplay = document.getElementById('impact-val');
const riskRatingDisplay = document.getElementById('risk-rating');
const riskScoreDisplay = document.getElementById('risk-score');
const riskStrategyDisplay = document.getElementById('risk-strategy');
const gaugeFill = document.getElementById('gauge-fill');
const matrixMarker = document.getElementById('matrix-marker');
const gridCells = document.querySelectorAll('.grid-cell');

const probabilityLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
const impactLabels = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];

// Strategy mappings based on total risk score
const strategies = {
  low: {
    rating: "Low Risk",
    class: "badge-low",
    strategy: "Acceptable risk level. Monitor periodically during regular feature lifecycle reviews. No immediate changes needed."
  },
  medium: {
    rating: "Medium Risk",
    class: "badge-med",
    strategy: "Manageable risk. Formulate standard mitigation rules, verify analytics tracking, and alert product operations on launch."
  },
  high: {
    rating: "High Risk",
    class: "badge-high",
    strategy: "Requires immediate mitigation steps. Implement multi-factor fallbacks or pre-launch security reviews. Obtain leadership approval."
  },
  critical: {
    rating: "Critical Risk",
    class: "badge-crit",
    strategy: "Deploy emergency stop mechanisms. Rollback features or block release until security vulnerability, fraud leak, or compliance gap is fully mitigated."
  }
};

// Initialize the 5x5 grid cell static colors
function initMatrixGrid() {
  gridCells.forEach(cell => {
    const p = parseInt(cell.getAttribute('data-p'));
    const i = parseInt(cell.getAttribute('data-i'));
    const score = p * i;
    
    // Classify cells by risk score
    if (score <= 4) {
      cell.classList.add('green');
    } else if (score <= 8) {
      cell.classList.add('yellow');
    } else if (score <= 15) {
      cell.classList.add('orange');
    } else {
      cell.classList.add('red');
    }
  });
}

function updateRiskAssessment() {
  const prob = parseInt(probSlider.value);
  const impact = parseInt(impactSlider.value);
  
  // Update slider display text
  probValDisplay.textContent = `${prob} / 5 (${probabilityLabels[prob - 1]})`;
  impactValDisplay.textContent = `${impact} / 5 (${impactLabels[impact - 1]})`;
  
  // Compute score (1 to 25)
  const score = prob * impact;
  riskScoreDisplay.textContent = score;
  
  // Determine risk category
  let category = 'low';
  if (score <= 4) {
    category = 'low';
  } else if (score <= 9) {
    category = 'medium';
  } else if (score <= 15) {
    category = 'high';
  } else {
    category = 'critical';
  }
  
  const strategyData = strategies[category];
  
  // Update UI Elements
  riskRatingDisplay.textContent = strategyData.rating;
  riskRatingDisplay.className = `status-badge ${strategyData.class}`;
  riskStrategyDisplay.textContent = strategyData.strategy;
  
  // Update Gauge SVG Meter (Stroke length is 251.2 for semicircular gauge)
  // Percent calculated from score / 25
  const percent = (score - 1) / 24; // map 1..25 to 0..1
  const strokeOffset = 251 - (251 * percent);
  gaugeFill.style.strokeDashoffset = strokeOffset;
  
  // Update marker position inside the 5x5 mini-grid
  // The grid is 100% width, height. Columns/rows are 20% each.
  // Left: (probability - 1) * 20% + 10%
  // Top: (5 - impact) * 20% + 10%
  const xPercent = (prob - 1) * 20 + 10;
  const yPercent = (5 - impact) * 20 + 10;
  matrixMarker.style.left = `${xPercent}%`;
  matrixMarker.style.top = `${yPercent}%`;
  
  // Apply visual highlights to cells
  gridCells.forEach(cell => {
    const cp = parseInt(cell.getAttribute('data-p'));
    const ci = parseInt(cell.getAttribute('data-i'));
    
    if (cp === prob && ci === impact) {
      cell.style.opacity = "1";
      cell.style.transform = "scale(1.05)";
      cell.style.boxShadow = "0 0 10px rgba(255,255,255,0.4)";
    } else {
      cell.style.opacity = "0.4";
      cell.style.transform = "scale(1)";
      cell.style.boxShadow = "none";
    }
  });
}

// Add event listeners for sliders
if (probSlider && impactSlider) {
  initMatrixGrid();
  probSlider.addEventListener('input', updateRiskAssessment);
  impactSlider.addEventListener('input', updateRiskAssessment);
  updateRiskAssessment(); // initial call
}

// ==========================================================================
// CONTACT FORM SUBMISSION HANDLING
// ==========================================================================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit-btn');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // UI states during loading
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;
    formFeedback.style.display = 'none';
    
    // Gather form inputs
    const formData = {
      name: document.getElementById('form-name').value,
      email: document.getElementById('form-email').value,
      _subject: `New Portfolio Message: ${document.getElementById('form-subject').value}`,
      message: document.getElementById('form-message').value
    };
    
    // Real submission to FormSubmit.co
    fetch("https://formsubmit.co/ajax/vimal2014sharma@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      if (response.ok) {
        formFeedback.textContent = "Message sent successfully! (Note: Check spam if you don't receive it, or verify activation on the first submission)";
        formFeedback.className = "form-feedback-message success";
        formFeedback.style.display = 'block';
        contactForm.reset();
        
        // Reset Risk matrix sliders
        if (probSlider && impactSlider) {
          probSlider.value = 3;
          impactSlider.value = 4;
          updateRiskAssessment();
        }
      } else {
        formFeedback.textContent = "Oops! There was a problem sending your message. Please try again.";
        formFeedback.className = "form-feedback-message error";
        formFeedback.style.display = 'block';
      }
      setTimeout(() => { formFeedback.style.display = 'none'; }, 8000);
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      formFeedback.textContent = "Network error. Please check your connection and try again.";
      formFeedback.className = "form-feedback-message error";
      formFeedback.style.display = 'block';
      setTimeout(() => { formFeedback.style.display = 'none'; }, 8000);
    });
  });
}

// ==========================================================================
// CREDENTIALS TABS SWITCHER
// ==========================================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons && tabContents) {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      // Hide all contents
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Show target content
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}
