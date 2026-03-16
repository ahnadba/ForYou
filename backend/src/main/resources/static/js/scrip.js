// This script handles the 'Action' on your website

// 1. Wait until the HTML is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript is successfully linked to ForYou Store!");

    // Simple interaction: Change the navbar color when scrolling
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-sm');
        } else {
            nav.classList.remove('shadow-sm');
        }
    });
});

// 2. This function triggers a popup when 'View Item' is clicked
function handleViewItem(productName) {
    alert("✨ Excellent Choice! ✨\n\nYou are viewing the '" + productName + "'. \n\nThis item is currently one of our top-rated pieces.");
}