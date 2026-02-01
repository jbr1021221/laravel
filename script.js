/**
 * Countdown Timer Script
 * Handles countdown calculations, progress updates, and count-up after target date
 */

// Constants
const CIRCUMFERENCE = 2 * Math.PI * 72;
const TARGET_DATE = new Date('May 1, 2026 00:00:00').getTime();
const JOURNEY_START = new Date('January 26, 2026 00:00:00').getTime();

// =====================================================
// YOUTUBE API SETTINGS - REAL-TIME DATA!
// =====================================================
const YOUTUBE_API_KEY = 'AIzaSyDMEhpuiMn1zj9QAn2DgcTKzZDf_0xKPpo';
const YOUTUBE_CHANNEL_ID = 'UC_4-9w-BOmQlw3KvPtqmdEA';
const YOUTUBE_GOAL_SUBS = 50000;  // <-- UPDATE THIS with your goal
const YOUTUBE_FALLBACK_SUBS = 36900;  // Fallback if API fails

/**
 * Format date to long format (e.g., "January 26, 2026")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format date to short format (e.g., "Jan 26, 2026")
 * @param {Date} date - The date to format
 * @returns {string} Formatted short date string
 */
function formatShortDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Update the circular progress indicator
 * @param {string} elementId - The ID of the circle element
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 */
function updateCircle(elementId, current, max) {
    const circle = document.getElementById(elementId);
    if (circle) {
        const progress = current / max;
        const offset = CIRCUMFERENCE * (1 - progress);
        circle.style.strokeDashoffset = offset;
    }
}

/**
 * Update car progress animation
 * @param {number} progressPercent - Progress percentage (0-100)
 * @param {number} totalRemainingSeconds - Total remaining seconds to display
 */
function updateProgress(progressPercent, totalRemainingSeconds) {
    const car = document.getElementById('progressCar');
    const fill = document.getElementById('progressFill');
    const percentDisplay = document.getElementById('progressPercent');
    const carSeconds = document.getElementById('carSeconds');
    const startSeconds = document.getElementById('startSeconds');

    // Car indicates PROGRESS (elapsed time), positioned at the end of the blue fill bar
    // Clamp between 5% and 95% to keep it visible within the container
    const carPosition = Math.max(5, Math.min(95, progressPercent));

    if (car) {
        car.style.left = carPosition + '%';
    }

    if (fill) {
        fill.style.width = Math.min(100, progressPercent) + '%';
    }

    if (percentDisplay) {
        percentDisplay.textContent = Math.round(progressPercent) + '%';
    }

    // Update total remaining seconds display above car
    if (carSeconds && totalRemainingSeconds !== undefined) {
        carSeconds.textContent = totalRemainingSeconds.toLocaleString();
    }

    // Update start marker with total journey seconds
    if (startSeconds) {
        const totalJourneySeconds = Math.floor((TARGET_DATE - JOURNEY_START) / 1000);
        startSeconds.textContent = totalJourneySeconds.toLocaleString();
    }
}

/**
 * Main countdown/countup update function
 * Counts down to target date, then counts up elapsed time after
 */
function updateCountdown() {
    const now = new Date();
    const difference = TARGET_DATE - now.getTime();

    // Update current date display
    const currentDateEl = document.getElementById('currentDate');
    const startDateEl = document.getElementById('startDate');

    if (currentDateEl) {
        currentDateEl.textContent = formatDate(now);
    }

    if (startDateEl) {
        startDateEl.textContent = formatShortDate(now);
    }

    if (difference > 0) {
        // COUNTDOWN MODE: Still counting down to target
        updateCountdownMode(difference, now);
    } else {
        // COUNT UP MODE: Target reached, count elapsed time
        updateCountUpMode(Math.abs(difference));
    }
}

/**
 * Update display in countdown mode (before target date)
 * @param {number} difference - Time remaining in milliseconds
 * @param {Date} now - Current date
 */
function updateCountdownMode(difference, now) {
    // Calculate time units
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Calculate total values
    const totalSeconds = Math.floor(difference / 1000);
    const totalMinutes = Math.floor(difference / (1000 * 60));
    const totalHours = Math.floor(difference / (1000 * 60 * 60));

    // Calculate progress percentage
    const totalDuration = TARGET_DATE - JOURNEY_START;
    const elapsed = now.getTime() - JOURNEY_START;
    const progressPercent = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

    // Update countdown numbers
    updateElement('months', String(months).padStart(2, '0'));
    updateElement('days', String(days).padStart(2, '0'));
    updateElement('hours', String(hours).padStart(2, '0'));
    updateElement('minutes', String(minutes).padStart(2, '0'));
    updateElement('seconds', String(seconds).padStart(2, '0'));

    // Update circles
    updateCircle('monthsCircle', months, 12);
    updateCircle('daysCircle', days, 30);
    updateCircle('hoursCircle', hours, 24);
    updateCircle('minutesCircle', minutes, 60);
    updateCircle('secondsCircle', seconds, 60);

    // Update progress with total remaining seconds
    updateProgress(progressPercent, totalSeconds);

    // Update footer totals
    updateElement('totalHours', totalHours.toLocaleString());
    updateElement('totalMinutes', totalMinutes.toLocaleString());
    updateElement('totalSeconds', totalSeconds.toLocaleString());
}

/**
 * Update display in count-up mode (after target date reached)
 * Shows elapsed time since target date
 * @param {number} elapsed - Time elapsed since target in milliseconds
 */
function updateCountUpMode(elapsed) {
    // Calculate elapsed time units
    const years = Math.floor(elapsed / (1000 * 60 * 60 * 24 * 365.25));
    const remainingAfterYears = elapsed % (1000 * 60 * 60 * 24 * 365.25);

    const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44));
    const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);

    const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    // Calculate total values
    const totalSeconds = Math.floor(elapsed / 1000);
    const totalMinutes = Math.floor(elapsed / (1000 * 60));
    const totalHours = Math.floor(elapsed / (1000 * 60 * 60));

    // Update countdown numbers (now showing elapsed time)
    // If years > 0, show years in months position
    if (years > 0) {
        updateElement('months', String(years).padStart(2, '0'));
    } else {
        updateElement('months', String(months).padStart(2, '0'));
    }
    updateElement('days', String(days).padStart(2, '0'));
    updateElement('hours', String(hours).padStart(2, '0'));
    updateElement('minutes', String(minutes).padStart(2, '0'));
    updateElement('seconds', String(seconds).padStart(2, '0'));

    // Update circles - use modulo to keep circles animated
    updateCircle('monthsCircle', months % 12, 12);
    updateCircle('daysCircle', days % 30, 30);
    updateCircle('hoursCircle', hours, 24);
    updateCircle('minutesCircle', minutes, 60);
    updateCircle('secondsCircle', seconds, 60);

    // Progress is 100% complete, show elapsed seconds above car
    updateProgress(100, totalSeconds);

    // Update footer totals (showing elapsed time)
    updateElement('totalHours', totalHours.toLocaleString());
    updateElement('totalMinutes', totalMinutes.toLocaleString());
    updateElement('totalSeconds', totalSeconds.toLocaleString());
}

/**
 * Helper function to safely update element text content
 * @param {string} elementId - The ID of the element
 * @param {string} value - The value to set
 */
function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// =====================================================
// EVENT MANAGEMENT SYSTEM
// =====================================================

// Global variable to store events
let customEvents = [];
let currentEditingEventId = null;

/**
 * Initialize the event management system
 */
function initializeEventSystem() {
    // Load events from localStorage
    loadCustomEvents();

    // Set up event listeners
    setupEventListeners();

    // Render events list
    renderEventsList();

    // Check if we should show any celebration modals
    checkAndShowCelebrations();
}

/**
 * Load custom events from localStorage
 */
function loadCustomEvents() {
    const storedEvents = localStorage.getItem('customEvents');
    if (storedEvents) {
        customEvents = JSON.parse(storedEvents);
    }
}

/**
 * Set up all event listeners for the settings system
 */
function setupEventListeners() {
    const settingsBtn = document.getElementById('settingsBtn');
    const eventForm = document.getElementById('eventForm');
    const eventTypeSelect = document.getElementById('eventType');
    const cancelBtn = document.getElementById('cancelEventBtn');
    const passwordForm = document.getElementById('passwordForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('passwordInput');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Open password modal when settings button is clicked
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function () {
            const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
            passwordModal.show();
            // Clear password input and error
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordError').style.display = 'none';
        });
    }

    // Password form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            verifyPassword();
        });
    }

    // Password toggle (show/hide)
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;

            // Update icon
            const eyeIcon = document.getElementById('eyeIcon');
            if (type === 'text') {
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
            }
        });
    }

    // Event type change - show/hide custom message field
    if (eventTypeSelect) {
        eventTypeSelect.addEventListener('change', function () {
            const customMessageGroup = document.getElementById('customMessageGroup');
            if (this.value === 'custom') {
                customMessageGroup.style.display = 'block';
            } else {
                customMessageGroup.style.display = 'none';
            }
        });
    }

    // Form submission
    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveEvent();
        });
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            resetForm();
        });
    }

    // Change password form submission
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            changePassword();
        });
    }

    // Fix celebration modal scroll issue
    const celebrationBtn = document.getElementById('celebrationBtn');
    if (celebrationBtn) {
        celebrationBtn.addEventListener('click', function () {
            closeCelebrationModal();
        });
    }

    // Also fix when modal is closed via backdrop or ESC key
    const celebrationModalEl = document.getElementById('celebrationModal');
    if (celebrationModalEl) {
        celebrationModalEl.addEventListener('hidden.bs.modal', function () {
            restoreBodyScroll();
        });
    }
}

/**
 * Properly close celebration modal and restore scroll
 */
function closeCelebrationModal() {
    const celebrationModal = bootstrap.Modal.getInstance(document.getElementById('celebrationModal'));
    if (celebrationModal) {
        celebrationModal.hide();
    }
    restoreBodyScroll();
}

/**
 * Restore body scroll after modal close
 */
function restoreBodyScroll() {
    // Remove modal-open class
    document.body.classList.remove('modal-open');

    // Remove padding-right that Bootstrap adds
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';

    // Remove any leftover backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
}

/**
 * Get the stored password (default: admin123)
 */
function getStoredPassword() {
    const storedPassword = localStorage.getItem('settingsPassword');
    return storedPassword || 'admin123';
}

/**
 * Verify the entered password
 */
function verifyPassword() {
    const enteredPassword = document.getElementById('passwordInput').value;
    const storedPassword = getStoredPassword();
    const passwordError = document.getElementById('passwordError');

    if (enteredPassword === storedPassword) {
        // Password correct - hide password modal and show settings modal
        const passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
        passwordModal.hide();

        // Show settings modal
        setTimeout(() => {
            const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
            settingsModal.show();
        }, 300);
    } else {
        // Password incorrect - show error
        passwordError.style.display = 'flex';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

/**
 * Change the password
 */
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const storedPassword = getStoredPassword();

    // Validate current password
    if (currentPassword !== storedPassword) {
        alert('Current password is incorrect!');
        return;
    }

    // Validate new password length
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long!');
        return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    // Save new password
    localStorage.setItem('settingsPassword', newPassword);

    // Clear form and show success
    document.getElementById('changePasswordForm').reset();
    alert('Password changed successfully! ✓');
}

/**
 * Save or update an event
 */
function saveEvent() {
    const name = document.getElementById('eventName').value.trim();
    const type = document.getElementById('eventType').value;
    const date = document.getElementById('eventDate').value;
    const customMessage = document.getElementById('customMessage').value.trim();

    if (!name || !type || !date) {
        alert('Please fill in all required fields!');
        return;
    }

    const event = {
        id: currentEditingEventId || Date.now().toString(),
        name: name,
        type: type,
        date: date,
        customMessage: customMessage,
        active: currentEditingEventId ?
            (customEvents.find(e => e.id === currentEditingEventId)?.active ?? true) :
            true // New events are active by default
    };

    if (currentEditingEventId) {
        // Update existing event
        const index = customEvents.findIndex(e => e.id === currentEditingEventId);
        if (index !== -1) {
            customEvents[index] = event;
        }
    } else {
        // Add new event
        customEvents.push(event);
    }

    localStorage.setItem('customEvents', JSON.stringify(customEvents));
    renderEventsList();
    resetForm();
}

/**
 * Toggle event active status
 */
function toggleEventStatus(eventId) {
    const event = customEvents.find(e => e.id === eventId);
    if (event) {
        event.active = !event.active;
        localStorage.setItem('customEvents', JSON.stringify(customEvents));
        renderEventsList();
    }
}

/**
 * Render the events list
 */
function renderEventsList() {
    const eventsList = document.getElementById('eventsList');

    if (customEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events added yet. Add your first event above!</p>';
        return;
    }

    eventsList.innerHTML = customEvents.map(event => {
        const eventIcon = getEventIcon(event.type);
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const isActive = event.active !== false; // Default to true if not set
        const inactiveClass = isActive ? '' : 'event-inactive';

        return `
            <div class="event-card ${inactiveClass}">
                <div class="event-card-icon">${eventIcon}</div>
                <div class="event-card-info">
                    <h5>${event.name}</h5>
                    <p>${getEventTypeLabel(event.type)}</p>
                </div>
                <div class="event-card-date">${formattedDate}</div>
                <div class="event-card-actions">
                    <label class="toggle-switch" title="${isActive ? 'Active - Click to disable' : 'Inactive - Click to enable'}">
                        <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleEventStatus('${event.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="btn-event-action btn-edit" onclick="editEvent('${event.id}')" title="Edit Event">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-event-action btn-delete" onclick="deleteEvent('${event.id}')" title="Delete Event">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Edit an event
 */
function editEvent(eventId) {
    const event = customEvents.find(e => e.id === eventId);

    if (!event) return;

    // Set editing mode
    currentEditingEventId = eventId;

    // Populate form
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventType').value = event.type;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('customMessage').value = event.customMessage || '';

    // Show/hide custom message field
    const customMessageGroup = document.getElementById('customMessageGroup');
    customMessageGroup.style.display = event.type === 'custom' ? 'block' : 'none';

    // Update form title and button
    document.getElementById('formTitle').textContent = 'Edit Event';
    document.getElementById('submitEventBtn').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 5px;">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Update Event
    `;

    // Scroll to form
    document.querySelector('.event-form-container').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Delete an event
 */
function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    customEvents = customEvents.filter(e => e.id !== eventId);
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
    renderEventsList();
}

/**
 * Reset the event form
 */
function resetForm() {
    currentEditingEventId = null;
    document.getElementById('eventForm').reset();
    document.getElementById('formTitle').textContent = 'Add New Event';
    document.getElementById('customMessageGroup').style.display = 'none';
    document.getElementById('submitEventBtn').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 5px;">
            <path d="M12 5v14m-7-7h14"></path>
        </svg>
        Add Event
    `;
}

/**
 * Get event icon based on type
 */
function getEventIcon(type) {
    const icons = {
        'birthday': '🎂',
        'anniversary': '💑',
        'work-anniversary': '💼',
        'custom': '🎉'
    };
    return icons[type] || icons['custom'];
}

/**
 * Get event type label
 */
function getEventTypeLabel(type) {
    const labels = {
        'birthday': 'Birthday',
        'anniversary': 'Anniversary',
        'work-anniversary': 'Work Anniversary',
        'custom': 'Custom'
    };
    return labels[type] || 'Custom';
}

/**
 * Check if we should show any celebration modals today
 * Only shows modals for ACTIVE events
 */
function checkAndShowCelebrations() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Find ACTIVE events that match today's date
    const todaysEvents = customEvents.filter(event => {
        const eventDate = new Date(event.date);
        const eventDateString = eventDate.toISOString().split('T')[0];
        const isActive = event.active !== false; // Default to true if not set
        return eventDateString === todayString && isActive;
    });

    // Show modal for each event (with a delay between each)
    todaysEvents.forEach((event, index) => {
        setTimeout(() => {
            showCelebrationModal(event);
        }, index * 1000); // 1 second delay between each modal
    });
}

/**
 * Show celebration modal for an event
 */
function showCelebrationModal(event) {
    const icons = {
        'birthday': '🎂',
        'anniversary': '💑',
        'work-anniversary': '💼',
        'custom': '🎉'
    };

    const titles = {
        'birthday': 'Happy Birthday',
        'anniversary': 'Happy Anniversary',
        'work-anniversary': 'Work Anniversary',
        'custom': 'Celebration Time'
    };

    const defaultMessages = {
        'birthday': 'Wishing you a spectacular year ahead filled with success and happiness!',
        'anniversary': 'Celebrating your love and commitment. May your bond grow stronger with each passing year!',
        'work-anniversary': 'Congratulations on another amazing year! Your dedication and hard work inspire us all!',
        'custom': 'Today is special! Let\'s celebrate this wonderful occasion together!'
    };

    // Update modal content
    document.getElementById('celebrationIcon').textContent = icons[event.type] || icons['custom'];
    document.getElementById('celebrationTitle').textContent = titles[event.type] || titles['custom'];
    document.getElementById('celebrationName').textContent = event.name + '!';

    const message = event.customMessage || defaultMessages[event.type] || defaultMessages['custom'];
    document.getElementById('celebrationMessage').textContent = message;

    // Show modal
    const celebrationModal = new bootstrap.Modal(document.getElementById('celebrationModal'));
    celebrationModal.show();
}

/**
 * Fetch and update YouTube subscriber progress display
 * Uses YouTube Data API v3 for real-time data
 */
async function updateYouTubeProgress() {
    const goalSubs = YOUTUBE_GOAL_SUBS;
    let currentSubs = YOUTUBE_FALLBACK_SUBS;
    let isLive = false;

    // Show loading state
    const currentSubsEl = document.getElementById('currentSubs');
    const liveIndicator = document.getElementById('liveIndicator');

    if (currentSubsEl) {
        currentSubsEl.innerHTML = '<span style="opacity: 0.5;">Loading...</span>';
    }

    try {
        // Fetch real-time data from YouTube API
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                currentSubs = parseInt(data.items[0].statistics.subscriberCount, 10);
                isLive = true;
                console.log('✅ YouTube API: Live subscriber count fetched:', currentSubs);
            }
        } else {
            console.warn('⚠️ YouTube API: Using fallback value. Status:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ YouTube API: Using fallback value. Error:', error.message);
    }

    // Update live indicator
    if (liveIndicator) {
        if (isLive) {
            liveIndicator.classList.add('active');
        } else {
            liveIndicator.classList.remove('active');
        }
    }

    // Calculate values
    const remaining = Math.max(0, goalSubs - currentSubs);
    const progressPercent = Math.min(100, (currentSubs / goalSubs) * 100);

    // Update stat cards
    updateElement('currentSubs', currentSubs.toLocaleString());
    updateElement('goalSubs', goalSubs.toLocaleString());
    updateElement('remainingSubs', remaining.toLocaleString());

    // Update progress bar with animation
    const progressFill = document.getElementById('ytProgressFill');
    if (progressFill) {
        // Small delay for smooth animation
        setTimeout(() => {
            progressFill.style.width = progressPercent + '%';
        }, 100);
    }

    // Update progress percentage display
    updateElement('ytProgressPercent', progressPercent.toFixed(1) + '%');

    // Update goal label with formatted number
    const goalLabel = document.getElementById('ytGoalLabel');
    if (goalLabel) {
        if (goalSubs >= 1000000) {
            goalLabel.textContent = (goalSubs / 1000000).toFixed(1) + 'M';
        } else if (goalSubs >= 1000) {
            goalLabel.textContent = (goalSubs / 1000).toFixed(0) + 'K';
        } else {
            goalLabel.textContent = goalSubs.toString();
        }
    }
}

// Initialize countdown and start interval
document.addEventListener('DOMContentLoaded', function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initialize YouTube subscriber progress
    updateYouTubeProgress();

    // COMMENTED OUT - Event Management System disabled
    // Uncomment the line below to enable password protection, settings button, and event modals
    // initializeEventSystem();
});

// Auto-refresh YouTube stats every 5 minutes
setInterval(updateYouTubeProgress, 5 * 60 * 1000);
