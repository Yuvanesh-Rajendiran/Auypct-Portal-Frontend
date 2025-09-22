const API_CONFIG = {
  track: 'https://auypct-portal-backend.onrender.com/api/applications/track'
  // track: 'api/applications/track'
};

async function trackApp() {
  const trackingId = document.getElementById('trackingId').value.trim();
  const statusDiv = document.getElementById('status');

  if (!trackingId) {
    statusDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid Tracking ID</div>';
    statusDiv.classList.add('success-animation');
    setTimeout(() => statusDiv.classList.remove('success-animation'), 600);
    return;
  }

  try {
    const response = await fetch(`${API_CONFIG.track}/${trackingId}`);
    const data = await response.json();
    if (data.error) {
      statusDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
      statusDiv.classList.add('success-animation');
      setTimeout(() => statusDiv.classList.remove('success-animation'), 600);
    } else {
      const html = `
        <div class="alert alert-info">
          <h4>Application Status: ${data.status}</h4>
        </div>
      `;
      statusDiv.innerHTML = html;
      statusDiv.classList.add('success-animation');
      setTimeout(() => statusDiv.classList.remove('success-animation'), 600);
    }
  } catch (err) {
    statusDiv.innerHTML = `<div class="alert alert-danger">Error fetching application status: ${err.message}</div>`;
    statusDiv.classList.add('success-animation');
    setTimeout(() => statusDiv.classList.remove('success-animation'), 600);
  }
}

// Auto-fill tracking ID from URL
const urlParams = new URLSearchParams(window.location.search);
const trackingId = urlParams.get('trackingId');
if (trackingId) {
  document.getElementById('trackingId').value = trackingId;
  trackApp();
}

// Navigation active state handling
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (this.getAttribute('href') === '/index.html#apply-section') {
        e.preventDefault();
        window.location.href = '/index.html#apply-section';
      }
    });
  });
  // Set active link for current page
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// Form feedback on blur
document.getElementById('trackingId').addEventListener('blur', function() {
  if (!this.value.trim()) {
    this.style.borderColor = '#e53e3e';
    this.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
  } else {
    this.style.borderColor = '#48bb78';
    this.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
    setTimeout(() => {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    }, 2000);
  }
});