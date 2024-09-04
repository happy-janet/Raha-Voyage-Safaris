document.addEventListener("DOMContentLoaded", () => {
    // Safari Booking Form
    const safariBookingForm = document.getElementById('safariBookingForm');
    if (safariBookingForm) {
        safariBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(safariBookingForm);
            const data = Object.fromEntries(formData);

            fetch('/book-safari', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
            const data = Object.fromEntries(formData);

            fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

    // Other existing JavaScript code for form handling, UI interactions, etc.

    let searchBtn = document.querySelector('#search-btn');
    let searchBar = document.querySelector('.search-bar-container');
    let formBtn = document.querySelector('#login-btn');
    let loginForm = document.querySelector('.login-form-container');
    let formClose = document.querySelector('#form-close');
    let menu = document.querySelector('#menu-bar');
    let navbar = document.querySelector('.navbar');
    let videoBtn = document.querySelectorAll('.vid-btn');

    window.onscroll = () => {
        if (searchBtn) searchBtn.classList.remove('fa-times');
        if (searchBar) searchBar.classList.remove('active');
        if (menu) menu.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('active');
        if (loginForm) loginForm.classList.remove('active');
    }

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

    videoBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeControl = document.querySelector('.controls .active');
            if (activeControl) activeControl.classList.remove('active');
            btn.classList.add('active');
            const src = btn.getAttribute('data-src');
            const videoSlider = document.querySelector('#video-slider');
            if (videoSlider) videoSlider.src = src;
        });
    });

    // Review Form Submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const rating = document.getElementById('rating').value;
            const review = document.getElementById('review').value.trim();

            // Form validation
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

            // Create a new review box
            const newReview = document.createElement('div');
            newReview.classList.add('box');

            const starHTML = `<i class="fas fa-star"></i>`.repeat(rating) +
                `<i class="far fa-star"></i>`.repeat(5 - rating);

            newReview.innerHTML = `
                <img src="default-avatar.jpg" alt="">
                <h3>${name}</h3>
                <p>${review}</p>
                <div class="stars">
                    ${starHTML}
                </div>
            `;

            // Append the new review to the slider
            const reviewSliderWrapper = document.querySelector('.review-slider .wrapper');
            if (reviewSliderWrapper) reviewSliderWrapper.appendChild(newReview);

            // Clear the form
            reviewForm.reset();
        });
    }
});
