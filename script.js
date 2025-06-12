// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 15, 8, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 15, 8, 0.95)';
        }
    }
});

// URL parameters handling for booking page
function getURLParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Pre-select room based on URL parameter
window.addEventListener('DOMContentLoaded', () => {
    const roomParam = getURLParameter('room');
    const roomSelect = document.getElementById('room');
    
    if (roomParam && roomSelect) {
        roomSelect.value = roomParam;
        // Trigger change event to update price
        const event = new Event('change');
        roomSelect.dispatchEvent(event);
    }
});

// Booking form functionality
const bookingForm = document.getElementById('bookingForm');
const roomSelect = document.getElementById('room');
const playersSelect = document.getElementById('players');
const totalPriceElement = document.getElementById('totalPrice');

// Room prices
const roomPrices = {
    'egypt': 25,
    'zombie': 30,
    'alcatraz': 22,
    'space': 28
};

// Calculate total price
function calculateTotal() {
    const selectedRoom = roomSelect.value;
    const numberOfPlayers = parseInt(playersSelect.value) || 0;
    
    if (selectedRoom && numberOfPlayers) {
        const roomPrice = roomPrices[selectedRoom];
        const total = roomPrice * numberOfPlayers;
        totalPriceElement.textContent = `Συνολικό Κόστος: €${total}`;
        totalPriceElement.style.display = 'block';
    } else {
        totalPriceElement.textContent = 'Συνολικό Κόστος: €0';
        totalPriceElement.style.display = 'block';
    }
}

// Add event listeners for price calculation
roomSelect.addEventListener('change', calculateTotal);
playersSelect.addEventListener('change', calculateTotal);

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = tomorrow.toISOString().split('T')[0];

// Form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'room', 'players'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!data[field]) {
            isValid = false;
            document.getElementById(field).style.borderColor = '#ff4757';
        } else {
            document.getElementById(field).style.borderColor = '#e1e1e1';
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
        document.getElementById('email').style.borderColor = '#ff4757';
        alert('Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.');
        return;
    }
    
    // Phone validation (simple Greek phone number)
    const phoneRegex = /^(69|21|22|23|24|25|26|27|28)\d{8}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
        isValid = false;
        document.getElementById('phone').style.borderColor = '#ff4757';
        alert('Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου.');
        return;
    }
    
    if (isValid) {
        // Calculate total for confirmation
        const roomPrice = roomPrices[data.room];
        const total = roomPrice * parseInt(data.players);
        
        // Create confirmation message
        const roomNames = {
            'egypt': 'Μυστήριο Αιγύπτου',
            'zombie': 'Zombie Apocalypse',
            'alcatraz': 'Φυλακή Alcatraz',
            'space': 'Διαστημική Αποστολή'
        };
        
        const confirmationMessage = `
Επιβεβαίωση Κράτησης:

Όνομα: ${data.name}
Email: ${data.email}
Τηλέφωνο: ${data.phone}
Ημερομηνία: ${data.date}
Ώρα: ${data.time}
Δωμάτιο: ${roomNames[data.room]}
Αριθμός Παικτών: ${data.players}
Συνολικό Κόστος: €${total}

Θα θέλατε να προχωρήσετε με την κράτηση;
        `;
        
        if (confirm(confirmationMessage)) {
            alert('Η κράτησή σας έχει καταχωρηθεί! Θα επικοινωνήσουμε μαζί σας σύντομα για επιβεβαίωση.');
            this.reset();
            totalPriceElement.textContent = 'Συνολικό Κόστος: €0';
        }
    } else {
        alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
    }
});

// Contact form functionality
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Αποστολή...';
        submitBtn.disabled = true;
        
        // Simulate server delay
        setTimeout(() => {
            alert('Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.');
            
            // Reset form
            this.reset();
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.room-card, .feature, .gallery-item, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Gallery modal functionality (optional enhancement)
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${this.src}" alt="${this.alt}">
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
        `;
        
        const modalImg = modal.querySelector('img');
        modalImg.style.cssText = `
            width: 100%;
            height: auto;
            border-radius: 10px;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console welcome message
console.log('%c🔒 Welcome to No Way Out! 🔒', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
console.log('%cReady for the ultimate escape room experience?', 'color: #2c1810; font-size: 14px;');
