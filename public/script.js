document.addEventListener("DOMContentLoaded", () => {
    // Initialize all functionalities
    initSafariBookingForm();
    initGenericBookingForm();
    initVideoSlider();
    initHeaderNavbarLogic();
    initBlogSlider();
    initReviewForm();
    initNewsletterForm();
    initPesapalPayment();
});

// Function to initialize safari booking form submission
function initSafariBookingForm() {
    const safariBookingForm = document.getElementById('safariBookingForm');
    if (safariBookingForm) {
        safariBookingForm.addEventListener('submit', (e) => {
            handleFormSubmission(e, safariBookingForm, '/book-safari', 'Safari Booking Submitted Successfully');
        });
    }
}

// Function to initialize generic booking form submission
function initGenericBookingForm() {
    const genericBookingForm = document.getElementById('genericBookingForm');
    if (genericBookingForm) {
        genericBookingForm.addEventListener('submit', (e) => {
            handleFormSubmission(e, genericBookingForm, '/book', 'Booking Submitted Successfully');
        });
    }
}

// Generic function to handle form submissions
function handleFormSubmission(event, formElement, url, successMessage) {
    event.preventDefault();
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(() => {
        alert(successMessage);
        formElement.reset(); // Clear the form
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
    });
}

// Pesapal Payment Integration
function initPesapalPayment() {
    const pesapalForm = document.getElementById('pesapalPaymentForm');
    if (pesapalForm) {
        pesapalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePesapalPayment(pesapalForm);
        });
    }
}

// Function to handle Pesapal payment submission
function handlePesapalPayment(formElement) {
    const formData = new FormData(formElement);
    const paymentData = {
        amount: formData.get('amount'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        description: 'Payment for Service' // Adjust based on what you're selling
    };

    fetch('/create-pesapal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create Pesapal order');
        }
        return response.json();
    })
    .then(data => {
        if (data.redirectUrl) {
            // Redirect to Pesapal payment page
            window.location.href = data.redirectUrl;
        } else {
            alert('Failed to create Pesapal order: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating Pesapal order. Please try again.');
    });
}

// Function to handle payment method selection and submission
function selectPaymentMethod(paymentMethod) {
    const amount = document.getElementById('amount').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Validate input fields
    if (!amount || !email || !phone) {
        alert('Please fill in all the required fields.');
        return;
    }

    const paymentData = {
        amount: amount,
        description: "Payment for service",
        email: email,
        phone: phone,
        method: paymentMethod
    };

    fetch('/pesapal-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to initiate payment');
        }
        return response.json();
    })
    .then(data => {
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Redirect to the Pesapal payment page
        } else {
            alert('Payment failed: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error initiating payment. Please try again.');
    });
}

// Function to initialize video slider logic
function initVideoSlider() {
    const videoSlider = document.getElementById('video-slider');
    const videoButtons = document.querySelectorAll('.vid-btn');
    let currentIndex = 0;
    const slideInterval = 5000;

    function showNextVideo() {
        currentIndex = (currentIndex + 1) % videoButtons.length;
        updateVideoSlider(videoSlider, videoButtons, currentIndex);
    }

    setInterval(showNextVideo, slideInterval);

    videoButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentIndex = index;
            updateVideoSlider(videoSlider, videoButtons, currentIndex);
        });
    });
}

// Helper function to update video slider
function updateVideoSlider(videoSlider, videoButtons, index) {
    const newVideoSrc = videoButtons[index].getAttribute('data-src');
    videoSlider.src = newVideoSrc;
    document.querySelector('.vid-btn.active').classList.remove('active');
    videoButtons[index].classList.add('active');
}

// Function to initialize header, navbar, and login form logic
function initHeaderNavbarLogic() {
    const searchBtn = document.querySelector('#search-btn');
    const searchBar = document.querySelector('.search-bar-container');
    const formBtn = document.querySelector('#login-btn');
    const loginForm = document.querySelector('.login-form-container');
    const formClose = document.querySelector('#form-close');
    const menu = document.querySelector('#menu-bar');
    const navbar = document.querySelector('.navbar');

    window.onscroll = () => closeMenus([searchBtn, searchBar, menu, navbar, loginForm]);

    if (menu) {
        menu.addEventListener('click', () => {
            toggleActive(menu, navbar);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            toggleActive(searchBtn, searchBar);
        });
    }

    if (formBtn) {
        formBtn.addEventListener('click', () => {
            loginForm.classList.add('active');
        });
    }

    if (formClose) {
        formClose.addEventListener('click', () => {
            loginForm.classList.remove('active');
        });
    }
}

// Helper function to close all menus
function closeMenus(elements) {
    elements.forEach(element => element && element.classList.remove('active', 'fa-times'));
}

// Helper function to toggle active classes
function toggleActive(...elements) {
    elements.forEach(element => element && element.classList.toggle('active'));
}

// Function to initialize blog slider
function initBlogSlider() {
    const blogContents = document.querySelectorAll('.blog-content');
    let blogIndex = 0;

    setInterval(() => {
        blogContents[blogIndex].classList.remove('active');
        blogIndex = (blogIndex + 1) % blogContents.length;
        blogContents[blogIndex].classList.add('active');
    }, 5000);
}

// Function to initialize review form submission
function initReviewForm() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientName = document.getElementById('client-name').value;
            const clientReview = document.getElementById('client-review').value;
            const clientRating = document.getElementById('client-rating').value;

            const reviewData = { clientName, clientReview, clientRating };

            handleFormSubmission(e, reviewForm, '/submit-review', 'Review submitted successfully!');
        });
    }
}

// Function to initialize newsletter form submission
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            handleFormSubmission(e, newsletterForm, '/subscribe-newsletter', 'Subscription successful!');
        });
    }
}
