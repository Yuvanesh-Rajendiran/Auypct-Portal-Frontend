// Backend API endpoint - Change this variable to update the fetch URL
const BACKEND_API_URL = 'https://auypct-portal-backend.onrender.com/api/applications/submit';
// const BACKEND_API_URL = 'api/applications/submit';

// Set today's date in the level1_application_date input
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toLocaleDateString('en-CA');
    document.getElementById('level1_application_date').value = today;
});

// Progress bar functionality
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateProgressBar);

// Enhanced photo upload functionality
document.getElementById('passport_photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const photoUpload = document.querySelector('.photo-upload');
    const previewImage = document.getElementById('preview_image');
    const uploadText = document.getElementById('upload-text');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            photoUpload.classList.add('has-image');
            uploadText.style.display = 'none';
            
            // Add success animation
            photoUpload.classList.add('success-animation');
            setTimeout(() => photoUpload.classList.remove('success-animation'), 600);
        };
        reader.readAsDataURL(file);
    }
});

// Input validation functions
function validatePhone(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    const errorDiv = input.nextElementSibling && input.nextElementSibling.classList.contains('validation-error') ? input.nextElementSibling : null;
    if (input.value.length !== 10) {
        input.classList.add('field-error');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'validation-error';
            div.innerHTML = '⚠️ Must be exactly 10 digits';
            input.parentNode.insertBefore(div, input.nextSibling);
        }
    } else {
        input.classList.remove('field-error');
        if (errorDiv) errorDiv.remove();
    }
}

function validateAadhaar(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
    const errorDiv = input.nextElementSibling && input.nextElementSibling.classList.contains('validation-error') ? input.nextElementSibling : null;
    if (input.value.length !== 12) {
        input.classList.add('field-error');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'validation-error';
            div.innerHTML = '⚠️ Must be exactly 12 digits';
            input.parentNode.insertBefore(div, input.nextSibling);
        }
    } else {
        input.classList.remove('field-error');
        if (errorDiv) errorDiv.remove();
    }
}

function validateNumber(input) {
    let currentValue = input.value;
    let previousValue = input.dataset.previousValue || '';
    console.log('Current value:', currentValue, 'Previous value:', previousValue);
    let value = currentValue.replace(/[^0-9]/g, '');
    if (value.length > 6) {
        value = value.slice(0, 6);
    }
    if (value !== previousValue || value !== currentValue) {
        input.value = value;
        input.dataset.previousValue = value;
    }
    const errorDiv = input.nextElementSibling && input.nextElementSibling.classList.contains('validation-error') ? input.nextElementSibling : null;
    if (value === '' || !/^\d*$/.test(value)) {
        input.classList.add('field-error');
        if (!errorDiv) {
            const div = document.createElement('div');
            div.className = 'validation-error';
            div.innerHTML = '⚠️ Must be a whole number';
            input.parentNode.insertBefore(div, input.nextSibling);
        }
    } else {
        input.classList.remove('field-error');
        if (errorDiv) errorDiv.remove();
    }
    console.log('Final value set to:', input.value);
}

// Initialize dataset for existing inputs
document.querySelectorAll('#requested_amount, #confirmed_amount').forEach(input => {
    input.dataset.previousValue = input.value || '';
});

// Enhanced form interactions
function toggleDetails() {
    const type = document.getElementById('applicant_type').value;
    const educationSection = document.getElementById('education_details_section');
    const workingSection = document.getElementById('working_details_section');
    const feeSection = document.getElementById('fee_payment_section');
    const otherSection = document.getElementById('other_details_section');

    [educationSection, workingSection, feeSection, otherSection].forEach(section => {
        section.style.display = 'none';
        section.style.opacity = '0';
        section.style.transform = 'translateY(-10px)';
    });

    setTimeout(() => {
        if (type === 'student') {
            educationSection.style.display = 'block';
            feeSection.style.display = 'block';
            setTimeout(() => {
                educationSection.style.opacity = '1';
                educationSection.style.transform = 'translateY(0)';
                feeSection.style.opacity = '1';
                feeSection.style.transform = 'translateY(0)';
            }, 50);
        } else if (type === 'working_profession') {
            workingSection.style.display = 'block';
            setTimeout(() => {
                workingSection.style.opacity = '1';
                workingSection.style.transform = 'translateY(0)';
            }, 50);
        } else if (type === 'others') {
            otherSection.style.display = 'block';
            setTimeout(() => {
                otherSection.style.opacity = '1';
                otherSection.style.transform = 'translateY(0)';
            }, 50);
        }
    }, 150);
}

function toggleDocuments() {
    const category = document.getElementById('request_category').value;
    const docSections = document.querySelectorAll('.doc-section');
    
    docSections.forEach(section => {
        section.classList.remove('active');
    });
    
    if (category) {
        const targetSection = document.getElementById(`${category}_docs`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
}

// Enhanced amount validation
document.getElementById('confirmed_amount').addEventListener('input', function() {
    const highAmountSection = document.getElementById('high_amount_section');
    if (this.value > 10000) {
        highAmountSection.style.display = 'block';
        setTimeout(() => {
            highAmountSection.style.opacity = '1';
            highAmountSection.style.transform = 'translateY(0)';
        }, 50);
    } else {
        highAmountSection.style.opacity = '0';
        highAmountSection.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            highAmountSection.style.display = 'none';
        }, 300);
    }
});

// Generate random character-based CAPTCHA on load
function generateCaptcha() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let captcha = '';
    captcha += uppercase[Math.floor(Math.random() * uppercase.length)];
    captcha += uppercase[Math.floor(Math.random() * uppercase.length)];
    captcha += lowercase[Math.floor(Math.random() * lowercase.length)];
    captcha += lowercase[Math.floor(Math.random() * lowercase.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];
    captcha = captcha.split('').sort(() => Math.random() - 0.5).join('');
    document.getElementById('captcha-question').textContent = captcha;
    return captcha;
}

// Store correct answer globally
let correctCaptchaAnswer = generateCaptcha();

// Update CAPTCHA on refresh or error
function refreshCaptcha() {
    correctCaptchaAnswer = generateCaptcha();
    document.getElementById('captcha-answer').value = '';
    const captchaError = document.getElementById('captcha-error');
    if (captchaError) captchaError.style.display = 'none';
}

// Enhanced form submission with validation
function submitForm() {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        return false;
    }
    
    const validationSummary = document.getElementById('validation-summary');
    if (validationSummary) validationSummary.style.display = 'none';
    
    const button = document.querySelector('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span style="opacity: 0.7;">Processing...</span>';
    button.style.transform = 'scale(0.95)';
    button.disabled = true;
    
    const formData = new FormData();
    
    document.querySelectorAll('input:not([type="file"]), textarea, select').forEach(field => {
        if (field.type === 'radio') {
            if (field.checked) {
                formData.append(field.name, field.value);
            }
        } else {
            formData.append(field.name, field.value);
        }
    });
    
    document.querySelectorAll('input[type="file"]').forEach(input => {
        if (input.files.length > 0) {
            for (let file of input.files) {
                formData.append(input.name, file);
            }
        }
    });
    
    // Use the variable for fetch URL
    fetch(BACKEND_API_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            button.innerHTML = '<span>Submitted</span>';
            button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            button.style.transform = 'scale(1)';
            button.classList.add('success-animation');
            
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #48bb78; color: white; padding: 15px 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; display: flex; align-items: center; gap: 10px; animation: slideIn 0.5s ease;">
                    <span>✅ Application Submitted Successfully!</span>
                    <span>Tracking ID: ${data.trackingId}</span>
                    <button onclick="navigator.clipboard.writeText('${data.trackingId}');this.textContent='Copied!';setTimeout(() => this.textContent='Copy ID', 2000);" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Copy ID</button>
                </div>
                <style>
                    @keyframes slideIn {
                        from { top: -50px; opacity: 0; }
                        to { top: 20px; opacity: 1; }
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 10000);
        } else {
            throw new Error(data.error || 'Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        button.innerHTML = originalText;
        button.style.transform = 'scale(1)';
        button.disabled = false;
        alert('⚠️ Error submitting application: ' + error.message);
        refreshCaptcha();
    });
}    

function validateForm() {
    const errors = [];
    
    document.querySelectorAll('.field-error').forEach(field => {
        field.classList.remove('field-error');
    });
    document.querySelectorAll('.validation-error').forEach(error => {
        error.remove();
    });
    
    const requiredFields = [
        { id: 'level1_application_date', label: 'Application Date' },
        { id: 'applicant_name', label: 'Applicant Name' },
        { id: 'applicant_type', label: 'Applicant Type' },
        { id: 'dob', label: 'Date of Birth' },
        { id: 'contact_number', label: 'Contact Number' },
        { id: 'email_id', label: 'Email ID' },
        { id: 'aadhaar_number', label: 'Aadhaar Number' },
        { id: 'referral', label: 'Referral Information' },
        { id: 'scheme_awareness', label: 'Scheme Awareness' },
        { id: 'family_income_source', label: 'Family Income Source' },
        { id: 'father_occupation', label: 'Father\'s Occupation' },
        { id: 'mother_occupation', label: 'Mother\'s Occupation' },
        { id: 'scholarship_justification', label: 'Scholarship Justification' },
        { id: 'fee_breakup', label: 'Fee Breakup' },
        { id: 'requested_amount', label: 'Requested Amount' },
        { id: 'confirmed_amount', label: 'Confirmed Amount' },
        { id: 'request_category', label: 'Request Category' },
        { id: 'captcha-answer', label: 'CAPTCHA Answer' }
    ];
    
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    if (!genderChecked) {
        errors.push('Gender selection is required');
    }
    
    const photoInput = document.getElementById('passport_photo');
    if (!photoInput.files || photoInput.files.length === 0) {
        errors.push('Passport photo is required');
        photoInput.closest('.photo-upload').style.borderColor = '#e53e3e';
    }
    
    const declaration = document.getElementById('declaration');
    if (!declaration.checked) {
        errors.push('You must agree to the declaration');
        declaration.style.outline = '2px solid #e53e3e';
    } else {
        declaration.style.outline = 'none';
    }
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && (!element.value || element.value.trim() === '')) {
            errors.push(field.label + ' is required');
            element.classList.add('field-error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.innerHTML = '⚠️ This field is required';
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
        }
    });
    
    const applicantType = document.getElementById('applicant_type').value;
    
    if (applicantType === 'student') {
        const studentFields = [
            { id: 'class_degree', label: 'Class/Degree' },
            { id: 'school_college_name', label: 'School/College Name' },
            { id: 'medium', label: 'Medium' },
            { id: 'last_year_payment', label: 'Last Year Payment Method' },
            { id: 'payment_issue', label: 'Payment Issue Explanation' }
        ];
        
        studentFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element && (!element.value || element.value.trim() === '')) {
                errors.push(field.label + ' is required for students');
                element.classList.add('field-error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error';
                errorDiv.innerHTML = '⚠️ Required for student applicants';
                element.parentNode.insertBefore(errorDiv, element.nextSibling);
            }
        });
    } else if (applicantType === 'working_profession') {
        const workingFields = [
            { id: 'working_role', label: 'Working Role' },
            { id: 'organisation_name', label: 'Organisation Name' },
            { id: 'organisation_location', label: 'Organisation Location' }
        ];
        
        workingFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element && (!element.value || element.value.trim() === '')) {
                errors.push(field.label + ' is required for working professionals');
                element.classList.add('field-error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'validation-error';
                errorDiv.innerHTML = '⚠️ Required for working professionals';
                element.parentNode.insertBefore(errorDiv, element.nextSibling);
            }
        });
    } else if (applicantType === 'others') {
        const element = document.getElementById('other_details');
        if (!element.value || element.value.trim() === '') {
            errors.push('Other details are required');
            element.classList.add('field-error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.innerHTML = '⚠️ Please provide details about yourself';
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
        }
    }
    
    const captchaInput = document.getElementById('captcha-answer').value.trim().toLowerCase();
    if (captchaInput !== correctCaptchaAnswer.toLowerCase()) {
        errors.push('Incorrect CAPTCHA code');
        document.getElementById('captcha-answer').classList.add('field-error');
        const captchaError = document.getElementById('captcha-error');
        if (captchaError) captchaError.style.display = 'block';
    }
    
    const email = document.getElementById('email_id').value;
    if (email && !isValidEmail(email)) {
        errors.push('Please enter a valid email address');
        document.getElementById('email_id').classList.add('field-error');
    }
    
    const phone = document.getElementById('contact_number').value;
    if (phone && !isValidPhone(phone)) {
        errors.push('Please enter a valid 10-digit phone number');
        document.getElementById('contact_number').classList.add('field-error');
    }
    
    const aadhaar = document.getElementById('aadhaar_number').value;
    if (aadhaar && !isValidAadhaar(aadhaar)) {
        errors.push('Please enter a valid 12-digit Aadhaar number');
        document.getElementById('aadhaar_number').classList.add('field-error');
    }
    
    const requestedAmount = document.getElementById('requested_amount').value;
    if (requestedAmount && !/^\d*\.?\d*$/.test(requestedAmount)) {
        errors.push('Requested Amount must be a valid number');
        document.getElementById('requested_amount').classList.add('field-error');
    }
    
    const confirmedAmount = document.getElementById('confirmed_amount').value;
    if (confirmedAmount && !/^\d*\.?\d*$/.test(confirmedAmount)) {
        errors.push('Confirmed Amount must be a valid number');
        document.getElementById('confirmed_amount').classList.add('field-error');
    }
    
    return errors;
}

function showValidationErrors(errors) {
    const validationSummary = document.getElementById('validation-summary');
    const validationList = document.getElementById('validation-list');
    
    if (validationSummary && validationList) {
        validationList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            validationList.appendChild(li);
        });
        
        validationSummary.style.display = 'block';
        validationSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        validationSummary.style.animation = 'none';
        setTimeout(() => {
            validationSummary.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

function isValidAadhaar(aadhaar) {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
}

// Modified focus event to prevent auto-scroll
document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', function() {
        // Do not scroll into view automatically
    });
});

// Add form validation feedback
document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
    field.addEventListener('blur', function() {
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced AU Trust Application Form loaded');
    
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });

    const captchaSection = document.getElementById('captcha-section');
    const refreshLink = document.createElement('a');
    refreshLink.href = '#';
    refreshLink.textContent = 'Refresh CAPTCHA';
    refreshLink.style.color = '#667eea';
    refreshLink.style.marginLeft = '10px';
    refreshLink.style.cursor = 'pointer';
    refreshLink.onclick = (e) => {
        e.preventDefault();
        refreshCaptcha();
    };
    captchaSection.appendChild(refreshLink);
});

// Add file upload feedback
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.files.length > 0) {
            this.style.borderColor = '#48bb78';
            this.style.backgroundColor = 'rgba(72, 187, 120, 0.05)';
            
            const indicator = document.createElement('span');
            indicator.innerHTML = '✓ File selected';
            indicator.style.color = '#48bb78';
            indicator.style.fontSize = '0.9rem';
            indicator.style.marginLeft = '10px';
            
            const existingIndicator = this.parentNode.querySelector('.file-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            indicator.className = 'file-indicator';
            this.parentNode.appendChild(indicator);
        }
    });
});