// ============================================
// VILLA PAGE FUNCTIONS
// ============================================

// Image Gallery
function changeImage(src) {
    document.getElementById('mainGalleryImage').src = src;
}

// Guest counter
let currentGuests = 2;
const MAX_GUESTS = 8;

function changeGuests(delta) {
    let newCount = currentGuests + delta;
    if (newCount >= 1 && newCount <= MAX_GUESTS) {
        currentGuests = newCount;
        document.getElementById('guestCount').innerText = currentGuests;
        updatePrice();
    }
}

// Date selection and price calculation
let checkInDate = null;
let checkOutDate = null;

// Initialize flatpickr if available
if (typeof flatpickr !== 'undefined') {
    flatpickr("#checkIn", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {
            checkInDate = dateStr;
            updatePrice();
        }
    });
    
    flatpickr("#checkOut", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {
            checkOutDate = dateStr;
            updatePrice();
        }
    });
}

function updatePrice() {
    if (checkInDate && checkOutDate) {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
            const pricePerNight = 12000;
            const cleaningFee = 3500;
            const subtotal = nights * pricePerNight;
            const total = subtotal + cleaningFee;
            
            document.getElementById('nightsCount').innerText = nights;
            document.getElementById('subtotal').innerText = subtotal.toLocaleString('en-IN');
            document.getElementById('totalPrice').innerText = total.toLocaleString('en-IN');
        }
    }
}

// Booking Modal
function openBookingModal() {
    if (!checkInDate || !checkOutDate) {
        alert('Please select check-in and check-out dates first');
        return;
    }
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total = (nights * 12000) + 3500;
    
    document.getElementById('modalDates').innerText = `${checkInDate} to ${checkOutDate} (${nights} nights)`;
    document.getElementById('modalGuests').innerText = currentGuests;
    document.getElementById('modalTotal').innerText = total.toLocaleString('en-IN');
    
    document.getElementById('bookingModal').style.display = 'flex';
}

// Close modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        document.getElementById('bookingModal').style.display = 'none';
        document.getElementById('bookingDetailModal').style.display = 'none';
    };
});

// Booking form submission
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Payment gateway will open here.\n\nIn production, this would integrate with Razorpay for UPI/Card/Netbanking payments.');
    document.getElementById('bookingModal').style.display = 'none';
});

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Initialize dashboard tabs
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        switchTab(tab);
    });
});

// Calendar generation
let currentDate = new Date(2024, 2); // March 2024

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').innerText = `${monthNames[month]} ${year}`;
    
    let calendarHTML = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day" style="font-weight: 700; color: #6b7280;">${day}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += `<div class="calendar-day"></div>`;
    }
    
    // Days of the month
    const bookedDates = [5, 6, 7, 12, 13, 14, 15, 20, 21, 22];
    const blockedDates = [10, 11];
    
    for (let day = 1; day <= totalDays; day++) {
        let statusClass = 'available';
        
        if (bookedDates.includes(day)) {
            statusClass = 'booked';
        } else if (blockedDates.includes(day)) {
            statusClass = 'blocked';
        }
        
        calendarHTML += `<div class="calendar-day ${statusClass}" onclick="selectDate(${day})">${day}</div>`;
    }
    
    document.getElementById('calendarGrid').innerHTML = calendarHTML;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

function selectDate(day) {
    alert(`Date ${day} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()} selected.\n\nYou can block/unblock this date from the calendar.`);
}

function blockDates() {
    alert('In production, you could select a date range and block it for maintenance or personal use.');
}

// Charts
if (document.getElementById('revenueChart')) {
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [{
                label: 'Revenue (₹)',
                data: [65000, 72000, 85000, 110000, 95000, 125000, 102500],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

if (document.getElementById('bookingChart')) {
    const bookingCtx = document.getElementById('bookingChart').getContext('2d');
    new Chart(bookingCtx, {
        type: 'bar',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [{
                label: 'Bookings',
                data: [5, 6, 7, 9, 8, 10, 8],
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

if (document.getElementById('monthlyRevenueChart')) {
    const monthlyCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Revenue (₹)',
                data: [85000, 92000, 102500, 110000, 95000, 88000, 78000, 95000, 105000, 125000, 135000, 150000],
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// View booking details
function viewBooking() {
    document.getElementById('bookingDetailModal').style.display = 'flex';
}

function cancelBooking() {
    if (confirm('Are you sure you want to cancel this booking? Refund will be processed according to cancellation policy.')) {
        alert('Booking cancelled successfully!');
    }
}

// Initialize calendar on page load
if (document.getElementById('calendarGrid')) {
    generateCalendar();
}

// ============================================
// GENERAL FUNCTIONS
// ============================================

// Login button
document.querySelectorAll('#loginBtn, #loginBtn2').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Demo credentials:\n\nEmail: owner@villarental.com\nPassword: demo123\n\nThis is a demo. In production, this would redirect to login page.');
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Mobile menu toggle
document.querySelector('.mobile-menu')?.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('show');
    document.querySelector('.dashboard-sidebar')?.classList.toggle('open');
});

// Calculate savings calculator
const calcMonthlyBookings = document.querySelector('.calc-item:first-child strong');
if (calcMonthlyBookings) {
    // Animation for savings calculator
    const numbers = document.querySelectorAll('.stat-value');
    numbers.forEach(num => {
        const value = num.innerText;
        if (value.includes('₹')) {
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
            // Animate counting
        }
    });
}

console.log('Villa Rental System Ready!');