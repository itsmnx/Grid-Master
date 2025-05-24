document.addEventListener('DOMContentLoaded', function() {
    // Select the fixed hamburger menu icon
    const fixedHamburger = document.querySelector('.fixed-hamburger-menu');
    // Select the sidebar element
    const sidebar = document.querySelector('.sidebar');
    // Select the close button inside the sidebar
    const closeBtn = document.querySelector('.sidebar .close-btn');

    // Check if all necessary elements exist before adding event listeners
    if (fixedHamburger && sidebar && closeBtn) {
        // Event listener for opening the sidebar when the fixed hamburger is clicked
        fixedHamburger.addEventListener('click', function() {
            sidebar.style.width = '250px'; // Set the width to reveal the sidebar
        });

        // Event listener for closing the sidebar when the close button is clicked
        closeBtn.addEventListener('click', function() {
            sidebar.style.width = '0'; // Set the width back to 0 to hide it
        });

        // Optional: Close sidebar if clicking anywhere outside of it
        document.addEventListener('click', function(event) {
            // Check if the sidebar is open AND
            // if the click was NOT inside the sidebar AND
            // if the click was NOT on the fixed hamburger menu itself
            if (sidebar.style.width === '250px' &&
                !sidebar.contains(event.target) &&
                !fixedHamburger.contains(event.target)) {
                sidebar.style.width = '0'; // Close the sidebar
            }
        });
    } else {
        // Log an error if any of the required elements are missing
        console.error("One or more elements (fixed-hamburger-menu, sidebar, close-btn) not found. Check your HTML and class names.");
    }
});
