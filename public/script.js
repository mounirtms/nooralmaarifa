document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    // Bilingual messages
    const messages = {
        en: {
            sending: 'Sending...',
            success: 'Thank you! Your message has been sent successfully.',
            error: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
            nameRequired: 'Name is required',
            emailRequired: 'Email is required',
            emailInvalid: 'Please enter a valid email address',
            messageRequired: 'Message is required'
        },
        ar: {
            sending: 'جارٍ الإرسال...',
            success: 'شكراً لك! تم إرسال رسالتك بنجاح.',
            error: 'عذراً، حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.',
            nameRequired: 'الاسم مطلوب',
            emailRequired: 'البريد الإلكتروني مطلوب',
            emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
            messageRequired: 'الرسالة مطلوبة'
        }
    };
    
    // Simple validation function
    function validateForm(name, email, message) {
        const errors = [];
        
        if (!name.trim()) {
            errors.push({ field: 'name', en: messages.en.nameRequired, ar: messages.ar.nameRequired });
        }
        
        if (!email.trim()) {
            errors.push({ field: 'email', en: messages.en.emailRequired, ar: messages.ar.emailRequired });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push({ field: 'email', en: messages.en.emailInvalid, ar: messages.ar.emailInvalid });
        }
        
        if (!message.trim()) {
            errors.push({ field: 'message', en: messages.en.messageRequired, ar: messages.ar.messageRequired });
        }
        
        return errors;
    }

    // Mobile navigation toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });

    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Clear previous errors
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        
        // Validate form
        const validationErrors = validateForm(name, email, message);
        
        if (validationErrors.length > 0) {
            // Show validation errors
            validationErrors.forEach(error => {
                const field = document.getElementById(error.field);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.innerHTML = `<span class="error-en">${error.en}</span><span class="error-ar">${error.ar}</span>`;
                field.parentNode.appendChild(errorDiv);
                field.classList.add('error');
            });
            return;
        }
        
        // Remove error styling
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = `<span>${messages.en.sending}</span><span class="ar-text">${messages.ar.sending}</span>`;
        submitButton.disabled = true;
        
        try {
            // Send to Firebase
            await db.collection('contact-messages').add({
                name: name,
                email: email,
                phone: phone,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'new'
            });
            
            // Show success message
            formStatus.innerHTML = `<div class="success-message">
                <span class="success-en">${messages.en.success}</span>
                <span class="success-ar">${messages.ar.success}</span>
            </div>`;
            formStatus.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Show error message
            formStatus.innerHTML = `<div class="error-message">
                <span class="error-en">${messages.en.error}</span>
                <span class="error-ar">${messages.ar.error}</span>
            </div>`;
            formStatus.style.display = 'block';
        }
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Hide status message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    });
});
