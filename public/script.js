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
    const videoSlider = document.getElementById('video-slider');
    const videoButtons = document.querySelectorAll('.vid-btn');

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

    // Video Slider Logic
    
    let currentIndex = 0;
    const slideInterval = 5000; // 5 seconds

    function showNextVideo() {
        // Increment the index to move to the next video
        currentIndex = (currentIndex + 1) % videoButtons.length;
        
        // Update the video source based on the new index
        const newVideoSrc = videoButtons[currentIndex].getAttribute('data-src');
        videoSlider.src = newVideoSrc;
        
        // Update the active class on the video buttons
        document.querySelector('.vid-btn.active').classList.remove('active');
        videoButtons[currentIndex].classList.add('active');
    }

    // Set up the interval to automatically change the video
    setInterval(showNextVideo, slideInterval);

    // Manual video change
    videoButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Update the current index
            currentIndex = index;

            // Update the video source
            const newVideoSrc = btn.getAttribute('data-src');
            videoSlider.src = newVideoSrc;

            // Update the active class
            document.querySelector('.vid-btn.active').classList.remove('active');
            btn.classList.add('active');
        });
    });

    // Other existing JavaScript code for form handling, UI interactions, etc.

    let searchBtn = document.querySelector('#search-btn');
    let searchBar = document.querySelector('.search-bar-container');
    let formBtn = document.querySelector('#login-btn');
    let loginForm = document.querySelector('.login-form-container');
    let formClose = document.querySelector('#form-close');
    let menu = document.querySelector('#menu-bar');
    let navbar = document.querySelector('.navbar');

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

const blogCard = document.getElementById('blogCard');
const blogContents = document.querySelectorAll('.blog-content');
let currentIndex = 0;

function showNextBlog() {
  // Hide current blog content
  blogContents[currentIndex].classList.remove('active');
  
  // Move to the next blog content
  currentIndex = (currentIndex + 1) % blogContents.length;
  
  // Show the next blog content
  blogContents[currentIndex].classList.add('active');
}

// Transition to the next blog every 5 seconds
setInterval(showNextBlog, 5000);

function openPayment(method) {
    const paymentFrame = document.getElementById('payment-frame');

    if (method === 'pesapal') {
      // Call your backend server to generate the Pesapal iframe URL
      fetch('/create-pesapal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

  function closeModal() {
    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('payment-frame').src = ''; // Clear the iframe src to stop payment processing
  }