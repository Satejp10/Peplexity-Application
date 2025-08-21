// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon = document.querySelector('.toggle-icon');

// Check for saved theme or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update toggle icon based on theme
function updateToggleIcon(theme) {
  toggleIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

updateToggleIcon(currentTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
});

// Skim Mode Toggle
const skimToggle = document.getElementById('skim-toggle');
let isSkimMode = false;

skimToggle.addEventListener('click', () => {
  isSkimMode = !isSkimMode;
  document.body.classList.toggle('skim-mode', isSkimMode);
  skimToggle.innerHTML = isSkimMode ? '📚 Deep dive' : '📖 60-second skim';
  
  // Smooth scroll to top when toggling
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Copy 400-word answer functionality
const copyButton = document.getElementById('copy-answer');
const answerText = document.querySelector('.answer-text').innerText;

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(answerText);
    
    // Visual feedback
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '✅ Copied!';
    copyButton.classList.add('copy-success');
    
    setTimeout(() => {
      copyButton.innerHTML = originalText;
      copyButton.classList.remove('copy-success');
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = answerText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '✅ Copied!';
    copyButton.classList.add('copy-success');
    
    setTimeout(() => {
      copyButton.innerHTML = originalText;
      copyButton.classList.remove('copy-success');
    }, 2000);
  }
});

// Smooth scroll to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Keyboard navigation enhancements
document.addEventListener('keydown', (e) => {
  // Toggle theme with Ctrl/Cmd + T
  if ((e.ctrlKey || e.metaKey) && e.key === 't') {
    e.preventDefault();
    themeToggle.click();
  }
  
  // Toggle skim mode with Ctrl/Cmd + S
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    skimToggle.click();
  }
});

// Add hover effects for cards
const cards = document.querySelectorAll('.criteria-card, .sample-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.transform = 'translateY(-2px)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Print optimization
window.addEventListener('beforeprint', () => {
  // Ensure we're in deep dive mode for printing
  if (isSkimMode) {
    document.body.classList.remove('skim-mode');
  }
});

window.addEventListener('afterprint', () => {
  // Restore skim mode if it was active
  if (isSkimMode) {
    document.body.classList.add('skim-mode');
  }
});

// Enhanced accessibility announcements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Announce mode changes
skimToggle.addEventListener('click', () => {
  const mode = isSkimMode ? 'skim mode' : 'detailed mode';
  announceToScreenReader(`Switched to ${mode}`);
});

// Announce successful copy
copyButton.addEventListener('click', () => {
  setTimeout(() => {
    announceToScreenReader('Answer copied to clipboard');
  }, 100);
});
