document.addEventListener("DOMContentLoaded", () => {
    // Safari Booking Form
    const safariBookingForm = document.getElementById('safariBookingForm');
    if (safariBookingForm) {
        safariBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(safariBookingForm);
            const data = Object.fromEntries(formData.entries());

            fetch('/book-safari', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(result => {
                alert('Safari Booking Submitted Successfully');
                safariBookingForm.reset(); // Clear the form
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting booking. Please try again.');
            });
        });
    }

    // Generic Booking Form
    const genericBookingForm = document.getElementById('genericBookingForm');
    if (genericBookingForm) {
        genericBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(genericBookingForm);
            const data = Object.fromEntries(formData.entries());

            fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(result => {
                alert('Booking Submitted Successfully');
                genericBookingForm.reset(); // Clear the form
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting booking. Please try again.');
            });
        });
    }

    // Video Slider Logic
    const videoSlider = document.getElementById('video-slider');
    const videoButtons = document.querySelectorAll('.vid-btn');
    let currentIndex = 0;
    const slideInterval = 5000;

    function showNextVideo() {
        currentIndex = (currentIndex + 1) % videoButtons.length;
        const newVideoSrc = videoButtons[currentIndex].getAttribute('data-src');
        videoSlider.src = newVideoSrc;
        document.querySelector('.vid-btn.active').classList.remove('active');
        videoButtons[currentIndex].classList.add('active');
    }

    setInterval(showNextVideo, slideInterval);

    videoButtons.forEach((btn, index) => {
        btn.addEventListener('click', function () {
            currentIndex = index;
            const newVideoSrc = btn.getAttribute('data-src');
            videoSlider.src = newVideoSrc;
            document.querySelector('.vid-btn.active').classList.remove('active');
            btn.classList.add('active');
        });
    });

    // Header, Navbar, and Login Form Logic
    const searchBtn = document.querySelector('#search-btn');
    const searchBar = document.querySelector('.search-bar-container');
    const formBtn = document.querySelector('#login-btn');
    const loginForm = document.querySelector('.login-form-container');
    const formClose = document.querySelector('#form-close');
    const menu = document.querySelector('#menu-bar');
    const navbar = document.querySelector('.navbar');

    window.onscroll = () => {
        if (searchBtn) searchBtn.classList.remove('fa-times');
        if (searchBar) searchBar.classList.remove('active');
        if (menu) menu.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('active');
        if (loginForm) loginForm.classList.remove('active');
    };

    if (menu) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchBtn.classList.toggle('fa-times');
            searchBar.classList.toggle('active');
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

    // Review Form Submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const rating = document.getElementById('rating').value;
            const review = document.getElementById('review').value.trim();

            if (name === '' || review === '' || rating === '') {
                alert('Please fill out all fields.');
                return;
            }

            if (name.length < 3) {
                alert('Name must be at least 3 characters long.');
                return;
            }

            if (review.length < 10) {
                alert('Review must be at least 10 characters long.');
                return;
            }

            const newReview = document.createElement('div');
            newReview.classList.add('box');

            const starHTML = `<i class="fas fa-star"></i>`.repeat(rating) +
                `<i class="far fa-star"></i>`.repeat(5 - rating);

            newReview.innerHTML = `
                <img src="default-avatar.jpg" alt="">
                <h3>${name}</h3>
                <p>${review}</p>
                <div class="stars">${starHTML}</div>
            `;

            const reviewSliderWrapper = document.querySelector('.review-slider .wrapper');
            if (reviewSliderWrapper) reviewSliderWrapper.appendChild(newReview);
            reviewForm.reset();
        });
    }

    // Blog Slider
    const blogContents = document.querySelectorAll('.blog-content');
    let blogIndex = 0;

    function showNextBlog() {
        blogContents[blogIndex].classList.remove('active');
        blogIndex = (blogIndex + 1) % blogContents.length;
        blogContents[blogIndex].classList.add('active');
    }

    setInterval(showNextBlog, 5000);

});

// Function to handle payment method selection and submission
function selectPaymentMethod(paymentMethod) {
    const amount = document.getElementById('amount').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

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
    .then(response => response.json())
    .then(data => {
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Redirect to Pesapal payment page
        } else {
            alert('Payment failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to open the payment modal with a specific method
function openPayment(method) {
    const paymentFrame = document.getElementById('payment-frame');

    if (method === 'pesapal') {
        fetch('/create-pesapal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000 }) // Replace with actual amount and data
        })
        .then(response => response.json())
        .then(data => {
            if (data.paymentUrl) {
                paymentFrame.src = data.paymentUrl;
                document.getElementById('payment-modal').style.display = 'block';
            } else {
                alert('Failed to create payment request.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Function to close the payment modal
function closeModal() {
    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('payment-frame').src = ''; // Clear the iframe src to stop payment processing
}
