const API_CONFIG = {
  login: 'https://auypct-portal-backend.onrender.com/api/users/login',
  dashboard: 'https://auypct-portal-backend.onrender.com/api/applications/dashboard',
  applicationDetails: 'https://auypct-portal-backend.onrender.com/api/applications/application',
  statusUpdate: 'https://auypct-portal-backend.onrender.com/api/applications/application'

  // login: 'api/users/login',
  // dashboard: 'api/applications/dashboard',
  // applicationDetails: 'api/applications/application',
  // statusUpdate: 'api/applications/application'
};

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (token && userRole === 'admin') showDashboard();

  const container = document.querySelector('.container');
  container.style.opacity = '0';
  container.style.transform = 'translateY(30px)';
  setTimeout(() => {
    container.style.transition = 'all 0.6s ease';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 100);
});

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const button = document.querySelector('button');
  const validationSummary = document.getElementById('validation-summary');
  const validationList = document.getElementById('validation-list');

  document.querySelectorAll('.field-error').forEach(field => field.classList.remove('field-error'));
  document.querySelectorAll('.validation-error').forEach(error => error.remove());
  validationSummary.style.display = 'none';

  const errors = [];
  if (!username.trim()) {
    errors.push('Username is required');
    document.getElementById('username').classList.add('field-error');
  }
  if (!password.trim()) {
    errors.push('Password is required');
    document.getElementById('password').classList.add('field-error');
  }

  if (errors.length > 0) {
    validationList.innerHTML = '';
    errors.forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      validationList.appendChild(li);
    });
    validationSummary.style.display = 'block';
    validationSummary.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const originalText = button.innerHTML;
  button.innerHTML = '<span style="opacity: 0.7;">Logging in...</span>';
  button.disabled = true;

  fetch(API_CONFIG.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        if (data.role === 'admin') {
          button.innerHTML = '<span>✓ Login Successful!</span>';
          button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
          button.classList.add('success-animation');
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            button.classList.remove('success-animation');
            button.disabled = false;
            showDashboard();
          }, 2000);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          button.innerHTML = originalText;
          button.disabled = false;
          validationList.innerHTML = '<li>Access denied: Not an admin</li>';
          validationSummary.style.display = 'block';
        }
      } else {
        button.innerHTML = originalText;
        button.disabled = false;
        validationList.innerHTML = `<li>${data.error || 'Login failed'}</li>`;
        validationSummary.style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      button.innerHTML = originalText;
      button.disabled = false;
      validationList.innerHTML = '<li>Login error, please try again</li>';
      validationSummary.style.display = 'block';
    });
}

async function showDashboard() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  try {
    const res = await fetch(API_CONFIG.dashboard, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    if (res.status === 401 || res.status === 403) {
      logout();
      return;
    }
    const { overview } = await res.json();
    if (!overview) throw new Error('No applications found');
    let html = '';
    for (const app of overview) {
      try {
        const detailRes = await fetch(`${API_CONFIG.applicationDetails}/${app.trackingId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const detailData = await detailRes.json();
        console.log(`Detail response for ${app.trackingId}:`, detailData);
        if (!detailRes.ok) {
          console.warn(`Failed to fetch details for ${app.trackingId}: ${detailRes.status}`);
          continue;
        }
        const { details } = detailData;
        const photo = details.photo ? `<img src="${details.photo}" alt="Applicant Photo" class="applicant-photo">` : '';
        const orderedDetails = Object.entries(details.applicantDetails)
          .map(([key, value]) => `<tr><td>${key}</td><td>${value || ''}</td></tr>`)
          .join('');
        html += `
          <div class="card mb-3 col-md-12">
            <div class="card-header">
              ${photo}
              <strong>Id:</strong> ${details.trackingId} | 
              <strong>Status:</strong> ${details.status.charAt(0).toUpperCase() + details.status.slice(1).toLowerCase()} | 
              <strong>Applicant Name:</strong> <span style="margin-left: 10px;">${details.applicantDetails['Applicant Name'] || ''}</span> | 
              <strong>Application Date:</strong> ${details.submittedDate}
              <button onclick="toggleDetails('${details.trackingId}')" class="btn btn-primary btn-sm" style="margin-left: 10px; padding: 4px 12px;">View</button>
            </div>
            <div id="details_${details.trackingId}" class="details-section">
              <div class="card-body">
                <h5>Applicant Details</h5>
                <table class="table table-bordered">
                  <thead><tr><th>Field</th><th>Value</th></tr></thead>
                  <tbody>${orderedDetails}</tbody>
                </table>
                <h5>Documents</h5>
                <table class="table table-bordered">
                  <thead><tr><th>Document</th><th>Link</th></tr></thead>
                  <tbody>${details.documents.length ? details.documents.map(doc => `<tr><td>${doc.name}</td><td><a href="${doc.path}" target="_blank">View</a></td></tr>`).join('') : '<tr><td colspan="2">No Documents</td></tr>'}</tbody>
                </table>
                <select class="form-select mb-2" onchange="updateStatus('${details.trackingId}', this.value)">
                  <option value="Submitted" ${details.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                  <option value="Under Review" ${details.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                  <option value="Eligible" ${details.status === 'Eligible' ? 'selected' : ''}>Eligible</option>
                  <option value="Rejected" ${details.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                  <option value="Funds Transferred" ${details.status === 'Funds Transferred' ? 'selected' : ''}>Funds Transferred</option>
                </select>
                ${details.status === 'Eligible' ? `
                  <input id="bank_${details.trackingId}" placeholder="Bank Details" class="form-control mb-2">
                  <button onclick="addBank('${details.trackingId}')" class="btn btn-success btn-sm">Add Bank</button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      } catch (detailErr) {
        console.error(`Error processing ${app.trackingId}:`, detailErr);
        continue;
      }
    }
    document.getElementById('appsList').innerHTML = html || '<p>No applications found.</p>';
  } catch (err) {
    console.error('Dashboard error:', err);
    alert('Error loading dashboard: ' + err.message);
    logout();
  }
}

function toggleDetails(trackingId) {
  const detailsSection = document.getElementById(`details_${trackingId}`);
  detailsSection.classList.toggle('active');
}

async function updateStatus(trackingId, status) {
  try {
    if (!status) throw new Error('Status value is missing');
    const statusMap = {
      'under review': 'Under Review',
      underreview: 'Under Review',
      under_review: 'Under Review',
      'funds transferred': 'Funds Transferred',
      fundstransferred: 'Funds Transferred',
      funds_transferred: 'Funds Transferred',
      submitted: 'Submitted',
      eligible: 'Eligible',
      rejected: 'Rejected'
    };
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, ' ').trim();
    const formattedStatus = statusMap[normalizedStatus] || status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    const allowedStatuses = ['Submitted', 'Under Review', 'Eligible', 'Rejected', 'Funds Transferred'];
    if (!allowedStatuses.includes(formattedStatus)) {
      throw new Error(`Invalid status value: ${status} (formatted as ${formattedStatus})`);
    }
    console.log(`Sending status update for ${trackingId}: ${formattedStatus}`);
    const res = await fetch(`${API_CONFIG.statusUpdate}/${trackingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: formattedStatus, reviewedBy: 'Admin' })
    });
    const data = await res.json();
    if (data.success) {
      showDashboard();
      alert('Status updated successfully!');
    } else {
      console.error(`Update failed for ${trackingId}:`, data.error);
      alert(data.error || 'Update failed. Please try again.');
    }
  } catch (err) {
    console.error(`Error updating status for ${trackingId}:`, err);
    alert('Error updating status: ' + err.message);
    showDashboard();
  }
}

async function addBank(trackingId) {
  const bankDetails = document.getElementById(`bank_${trackingId}`).value;
  if (!bankDetails.trim()) {
    alert('Please enter bank details');
    return;
  }
  try {
    const res = await fetch(`${API_CONFIG.statusUpdate}/${trackingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: 'Funds Transferred', bankDetails: { details: bankDetails }, reviewedBy: 'Admin' })
    });
    const data = await res.json();
    if (data.success) {
      showDashboard();
      alert('Bank details added and funds marked as transferred!');
    } else {
      alert(data.error || 'Update failed');
    }
  } catch (err) {
    alert('Error adding bank details: ' + err.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  location.reload();
}

document.querySelectorAll('.form-group input').forEach(input => {
  input.addEventListener('focus', function() {
    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.querySelectorAll('input[required]').forEach(input => {
  input.addEventListener('blur', function() {
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
});