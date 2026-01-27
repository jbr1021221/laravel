/**
 * Countdown Timer Script
 * Handles countdown calculations, progress updates, and count-up after target date
 */

// Constants
const CIRCUMFERENCE = 2 * Math.PI * 72;
const TARGET_DATE = new Date('May 1, 2026 00:00:00').getTime();
const JOURNEY_START = new Date('January 26, 2026 00:00:00').getTime();

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

    // Clamp car position between 8% and 92% to keep visible
    const carPosition = Math.max(8, Math.min(92, progressPercent));

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

// Initialize countdown and start interval
document.addEventListener('DOMContentLoaded', function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
