window.addEventListener('load', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Admin elements
    const adminSignInBtn = document.getElementById('adminSignInBtn');
    const userInfo = document.getElementById('userInfo');
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const adminSection = document.getElementById('adminSection');

    // Modal elements
    const adminLoginModal = document.getElementById('adminLoginModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const loginError = document.getElementById('loginError');

    // Gallery management elements
    const imageUploadForm = document.getElementById('imageUploadForm');
    const imageFiles = document.getElementById('imageFiles');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadStatus = document.getElementById('uploadStatus');
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryLoading = document.getElementById('galleryLoading');
    const noImagesMessage = document.getElementById('noImagesMessage');

    // Image modal elements
    const imageModal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');
    const modalAdminActions = document.getElementById('modalAdminActions');
    const deleteImageBtn = document.getElementById('deleteImageBtn');

    // Admin login elements
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('adminPassword');
    const adminLoginError = document.getElementById('adminLoginError');
    const passwordToggle = document.getElementById('passwordToggle');
    const adminLoginSubmit = document.getElementById('adminLoginSubmit');
    
    // Messages management elements
    const messagesLoading = document.getElementById('messagesLoading');
    const messagesTable = document.getElementById('messagesTable');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const noMessages = document.getElementById('noMessages');
    const totalMessages = document.getElementById('totalMessages');
    const newMessages = document.getElementById('newMessages');
    const repliedMessages = document.getElementById('repliedMessages');

    let currentUser = null;
    let selectedImageData = null;
    let allMessages = [];
    let currentFilter = 'all';

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

    // Contact form submission handler
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
            // Check if Firebase is available
            if (typeof db !== 'undefined' && db) {
                await db.collection('contact-messages').add({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'new'
                });
            } else {
                throw new Error('Firebase not available');
            }

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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });

    // Function to check user sign-in status and update UI accordingly
    function updateUIForUser(user) {
        if (user) {
            currentUser = user;
const headerSignInBtn = document.getElementById('adminSignInBtn');
            if (headerSignInBtn) headerSignInBtn.style.display = 'none';
            const headerUserInfo = document.getElementById('userInfo');
            const headerUserPhoto = document.getElementById('userPhoto');
            const headerUserName = document.getElementById('userName');
            if (headerUserInfo) headerUserInfo.style.display = 'flex';
            if (headerUserPhoto) headerUserPhoto.src = user.photoURL || '';
            if (headerUserName) headerUserName.textContent = user.displayName || '';

            if (window.isAdmin && window.isAdmin(user)) {
                if (adminSection) adminSection.style.display = 'block';
                if (adminPanelBtn) adminPanelBtn.style.display = 'block';
            } else {
                if (adminSection) adminSection.style.display = 'none';
                if (adminPanelBtn) adminPanelBtn.style.display = 'none';
            }
        } else {
            currentUser = null;
            const headerSignInBtn = document.getElementById('adminSignInBtn');
            const headerUserInfo = document.getElementById('userInfo');
            if (headerSignInBtn) headerSignInBtn.style.display = 'block';
            if (headerUserInfo) headerUserInfo.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
            if (adminPanelBtn) adminPanelBtn.style.display = 'none';
        }
    }

    // Set up an observer for authentication state
    if (window.auth) {
        auth.onAuthStateChanged(updateUIForUser);
    }

    // Password visibility toggle
    passwordToggle.addEventListener('click', () => {
        if (adminPassword.type === 'password') {
            adminPassword.type = 'text';
            passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            adminPassword.type = 'password';
            passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    // Admin login submission
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Loading state
        adminLoginSubmit.querySelector('.btn-text').style.display = 'none';
        adminLoginSubmit.querySelector('.btn-loading').style.display = 'inline-flex';

        try {
            const userCredential = await auth.signInWithEmailAndPassword(adminEmail.value, adminPassword.value);
            updateUIForUser(userCredential.user);
            adminLoginError.style.display = 'none';
            adminLoginSection.style.display = 'none';
            adminSection.style.display = 'block';
        } catch (error) {
            adminLoginError.textContent = error.message;
            adminLoginError.style.display = 'block';
        }

        // Reset loading state
        adminLoginSubmit.querySelector('.btn-text').style.display = 'inline-flex';
        adminLoginSubmit.querySelector('.btn-loading').style.display = 'none';
    });

    // Sign Out (handled in firebase-config.js for header)

    // Handle image uploads - Admin only
    if (imageUploadForm) {
        imageUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentUser || !window.isAdmin(currentUser)) {
                alert('You must be an admin to upload images. | يجب أن تكون مديرًا لتحميل الصور.');
                return;
            }

            const files = imageFiles.files;
            if (files.length > 5) {
                alert('You can upload a maximum of 5 images at once. | يمكنك تحميل ما يصل إلى 5 صور في المرة الواحدة.');
                return;
            }

            // Check if total gallery images would exceed 30
            const totalImages = await checkTotalImages();
            if (totalImages + files.length > 30) {
                alert(`Gallery limit is 30 images. You can upload ${30 - totalImages} more images. | الحد الأقصى للمعرض 30 صورة. يمكنك رفع ${30 - totalImages} صورة إضافية.`);
                return;
            }

            uploadProgress.style.display = 'block';
            let uploadPromises = [];

            Array.from(files).forEach((file, index) => {
                if (file.size > 5242880) {
                    alert(`File ${file.name} exceeds 5MB limit and will be skipped. | الملف ${file.name} يتجاوز الحد الأقصى 5 ميغابايت وسيتم تخطيه.`);
                    return;
                }

                const storageRef = window.storage.ref().child(`gallery/${Date.now()}-${file.name}`);
                let uploadTask = storageRef.put(file);

                uploadPromises.push(new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            uploadProgress.querySelector('.progress-fill').style.width = progress + '%';
                        },
                        (error) => {
                            console.error('Upload failed:', error);
                            reject(error);
                        },
                        async () => {
                            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            db.collection('gallery').add({
                                url: downloadURL,
                                title: imageTitle.value,
                                description: imageDescription.value,
                                uploadedBy: currentUser.email,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            resolve();
                        }
                    );
                }));
            });

            try {
                await Promise.all(uploadPromises);
                uploadStatus.textContent = 'Images uploaded successfully! | تم تحميل الصور بنجاح!';
                loadGalleryImages();
            } catch (error) {
                uploadStatus.textContent = 'Some images failed to upload. | فشل تحميل بعض الصور.';
            }

            uploadProgress.style.display = 'none';
        });
    }

    // Function to load gallery images
    function loadGalleryImages() {
        galleryLoading.style.display = 'block';
        noImagesMessage.style.display = 'none';
        galleryGrid.innerHTML = '';

        db.collection('gallery').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
            galleryLoading.style.display = 'none';
            if (querySnapshot.empty) {
                noImagesMessage.style.display = 'block';
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const imageItem = document.createElement('div');
                imageItem.classList.add('gallery-item');
                imageItem.innerHTML = `
                    <img src="${data.url}" alt="${data.title || 'Gallery Image'}" class="gallery-img">
                    <h4>${data.title || ''}</h4>
                    <p>${data.description || ''}</p>
                `;
                imageItem.addEventListener('click', () => {
                    openImageModal(data, doc.id);
                });
                galleryGrid.appendChild(imageItem);
            });
        }).catch((error) => {
            console.error('Error loading gallery images:', error);
        });
    }

    // Function to open image modal
    function openImageModal(data, id) {
        selectedImageData = { data, id };
        modalImage.src = data.url;
        modalTitle.textContent = data.title || 'Gallery Image';
        modalDescription.textContent = data.description || '';
        modalDate.textContent = `Uploaded on ${new Date(data.timestamp.toDate()).toLocaleString()}`;
        imageModal.style.display = 'block';

        if (window.isAdmin(currentUser)) {
            modalAdminActions.style.display = 'block';
        } else {
            modalAdminActions.style.display = 'none';
        }
    }

    // Close modal
    modalClose.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    // Delete Image
    deleteImageBtn.addEventListener('click', () => {
        if (!selectedImageData || !window.isAdmin(currentUser)) return;

        const { id } = selectedImageData;
        db.collection('gallery').doc(id).delete().then(() => {
            loadGalleryImages();
            imageModal.style.display = 'none';
            alert('Image deleted successfully! | تم حذف الصورة بنجاح!');
        }).catch((error) => {
            console.error('Error deleting image:', error);
        });
    });

    // Function to check total number of images in gallery
    async function checkTotalImages() {
        try {
            const snapshot = await db.collection('gallery').get();
            return snapshot.size;
        } catch (error) {
            console.error('Error checking total images:', error);
            return 0;
        }
    }

    // Load Gallery Images on Init
    loadGalleryImages();

    // Function to load contact messages
    function loadContactMessages() {
        if (!currentUser || !window.isAdmin(currentUser)) return;
        messagesLoading.style.display = 'block';
        messagesTable.style.display = 'none';
        noMessages.style.display = 'none';

        // Fetch messages from Firestore
        db.collection('contact-messages').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
            messagesLoading.style.display = 'none';
            if (querySnapshot.empty) {
                noMessages.style.display = 'block';
                return;
            }
            // Resetting the messages array before populating
            allMessages = [];
            totalMessages.textContent = querySnapshot.size;
            newMessages.textContent = 0;
            repliedMessages.textContent = 0;
            messagesTableBody.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allMessages.push({ ...data, id: doc.id });

                const messageRow = document.createElement('div');
                messageRow.classList.add('table-row');
                messageRow.innerHTML = `
                    <div class="table-cell">${data.name}</div>
                    <div class="table-cell">${data.email}</div>
                    <div class="table-cell">${data.phone || '-'}</div>
                    <div class="table-cell">${data.message}</div>
                    <div class="table-cell">${new Date(data.timestamp.toDate()).toLocaleString()}</div>
                    <div class="table-cell">${data.status}</div>
                    <div class="table-cell">
                        <button class="btn btn-secondary btn-small mark-replied" data-id="${doc.id}">
                            <i class="fas fa-reply"></i> Mark Replied
                        </button>
                    </div>
                `;
                messagesTableBody.appendChild(messageRow);

                if (data.status === 'new') {
                    newMessages.textContent = parseInt(newMessages.textContent) + 1;
                } else if (data.status === 'replied') {
                    repliedMessages.textContent = parseInt(repliedMessages.textContent) + 1;
                }
            });

            if (querySnapshot.empty) {
                noMessages.style.display = 'block';
            } else {
                messagesTable.style.display = 'block';
                setupMessageActions();
            }
        }).catch((error) => {
            console.error('Error loading messages:', error);
        });
    }

    // Function to handle mark as replied action
    function setupMessageActions() {
        const markRepliedButtons = document.querySelectorAll('.mark-replied');
        markRepliedButtons.forEach(button => {
            button.addEventListener('click', () => {
                const messageId = button.getAttribute('data-id');
                db.collection('contact-messages').doc(messageId).update({
                    status: 'replied'
                }).then(() => {
                    loadContactMessages();
                    alert('Message marked as replied! | تم تحديد الرسالة كتم الرد عليها!');
                }).catch(error => {
                    console.error('Error updating message:', error);
                });
            });
        });
    }

    // Filter messages based on status
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMessages();
        });
    });

    function filterMessages() {
        messagesTableBody.innerHTML = '';
        let filteredMessages = allMessages;
        switch (currentFilter) {
            case 'new':
                filteredMessages = allMessages.filter(m => m.status === 'new');
                break;
            case 'replied':
                filteredMessages = allMessages.filter(m => m.status === 'replied');
                break;
        }

        if (filteredMessages.length === 0) {
            noMessages.style.display = 'block';
            messagesTable.style.display = 'none';
        } else {
            noMessages.style.display = 'none';
            messagesTable.style.display = 'block';
            filteredMessages.forEach(data => {
                const messageRow = document.createElement('div');
                messageRow.classList.add('table-row');
                messageRow.innerHTML = `
                    <div class="table-cell">${data.name}</div>
                    <div class="table-cell">${data.email}</div>
                    <div class="table-cell">${data.phone || '-'}</div>
                    <div class="table-cell">${data.message}</div>
                    <div class="table-cell">${new Date(data.timestamp.toDate()).toLocaleString()}</div>
                    <div class="table-cell">${data.status}</div>
                    <div class="table-cell">
                        <button class="btn btn-secondary btn-small mark-replied" data-id="${data.id}">
                            <i class="fas fa-reply"></i> Mark Replied
                        </button>
                    </div>
                `;
                messagesTableBody.appendChild(messageRow);
            });
            setupMessageActions();
        }
    }

    // Admin tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            // Add active class to clicked button and show corresponding content
            button.classList.add('active');
            document.getElementById(targetTab + 'Tab').style.display = 'block';

            // Load messages when switching to messages tab
            if (targetTab === 'messages') {
                loadContactMessages();
            }
        });
    });

    // Load contact messages on Init
    loadContactMessages();
});
