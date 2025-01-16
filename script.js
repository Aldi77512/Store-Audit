// DOM Elements
const form = document.getElementById("audit-form");
const summarySection = document.createElement("section");
summarySection.id = "summary";
document.body.appendChild(summarySection);

// Save Audit Data
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const auditData = {};
    formData.forEach((value, key) => {
        auditData[key] = value;
    });

    // Add timestamp to audit
    auditData.timestamp = new Date().toISOString();

    // Save to localStorage
    const existingAudits = JSON.parse(localStorage.getItem("audits")) || [];
    existingAudits.push(auditData);
    localStorage.setItem("audits", JSON.stringify(existingAudits));

    alert("Audit submitted successfully!");

    // Reset form
    event.target.reset();

    // Update Summary
    displaySummary();
});

// Calculate Averages
function calculateAverages() {
    const audits = JSON.parse(localStorage.getItem("audits")) || [];
    const today = new Date();
    const daily = [];
    const weekly = [];
    const monthly = [];

    audits.forEach((audit) => {
        const auditDate = new Date(audit.timestamp);

        // Daily: Same day
        if (isSameDay(today, auditDate)) daily.push(audit);

        // Weekly: Within the same week
        if (isSameWeek(today, auditDate)) weekly.push(audit);

        // Monthly: Same month and year
        if (isSameMonth(today, auditDate)) monthly.push(audit);
    });

    return {
        daily: calculateCompletionRate(daily),
        weekly: calculateCompletionRate(weekly),
        monthly: calculateCompletionRate(monthly),
    };
}

// Helper Functions for Time Comparisons
function isSameDay(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

function isSameWeek(date1, date2) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.abs(date1 - date2) < oneWeek;
}

function isSameMonth(date1, date2) {
    return (
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

// Calculate Completion Rate
function calculateCompletionRate(audits) {
    if (audits.length === 0) return 0;

    const totalChecks = audits.length * form.elements.length; // Number of audits * number of questions
    const completeChecks = audits.reduce((total, audit) => {
        return (
            total +
            Object.values(audit).filter((value) => value === "Complete").length
        );
    }, 0);

    return Math.round((completeChecks / totalChecks) * 100);
}

// Display Summary
function displaySummary() {
    const averages = calculateAverages();
    summarySection.innerHTML = `
        <h2>Audit Summary</h2>
        <p>Daily Completion Rate: ${averages.daily}%</p>
        <p>Weekly Completion Rate: ${averages.weekly}%</p>
        <p>Monthly Completion Rate: ${averages.monthly}%</p>
    `;
}

// Show summary on page load
displaySummary();