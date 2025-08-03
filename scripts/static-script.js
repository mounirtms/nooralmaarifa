document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Mobile navigation toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced Contact Form Handler
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending... | جاري الإرسال';
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language
            };

            try {
                // For now, we'll use a simple email service or store locally
                // In the future, this will connect to Firebase
                await submitToFirebase(formData);
                
                // Show success message
                showFormStatus('success', 'Message sent successfully! We will get back to you soon. | تم إرسال الرسالة بنجاح! سنتواصل معك قريباً');
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('error', 'Failed to send message. Please try again. | فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Form status display function
    function showFormStatus(type, message) {
        if (formStatus) {
            formStatus.innerHTML = `<div class="${type}-message">${message}</div>`;
            formStatus.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Firebase submission function
    async function submitToFirebase(formData) {
        try {
            // Check if Firebase is available
            if (typeof window.db !== 'undefined' && window.db) {
                // Submit to Firebase Firestore
                const docRef = await window.db.collection('contact-messages').add({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || '',
                    message: formData.message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'new',
                    userAgent: formData.userAgent,
                    language: formData.language
                });
                return { success: true, id: docRef.id };
            } else {
                // Fallback: store in localStorage for development
                const messages = JSON.parse(localStorage.getItem('contact-messages') || '[]');
                const newMessage = {
                    ...formData,
                    id: 'msg_' + Date.now(),
                    status: 'new'
                };
                messages.push(newMessage);
                localStorage.setItem('contact-messages', JSON.stringify(messages));
                console.log('Message stored locally:', newMessage);
                return { success: true, id: newMessage.id };
            }
        } catch (error) {
            console.error('Firebase submission error:', error);
            throw error;
        }
    }

    // Product card animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card, .about-card, .service-card').forEach(card => {
        observer.observe(card);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize gallery (placeholder for future Firebase integration)
    initializeGallery();

    function initializeGallery() {
        // This function will be enhanced to load images from Firebase Storage
        const galleryItems = document.querySelectorAll('.gallery-item img');
        
        galleryItems.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                img.src = 'images/placeholder.jpg'; // Fallback image
            });
        });
    }

    // Performance optimization: Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
