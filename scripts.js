function loadYouTubeVideos() {
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        const videoId = container.getAttribute('data-video-id');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
    });
}

// Call the function when the page loads
window.addEventListener('load', loadYouTubeVideos);

// Show forms based on selection

function showForm(formId) {
    const forms = ['Home', 'loginForm', 'signupForm', 'reportForm', 'adminLoginForm', 'reportList'];
    forms.forEach(form => {
        document.getElementById(form).style.display = form === formId ? 'block' : 'none';
    });
    document.getElementById(formId).classList.add('fade-in');
}

// Show the report submission form for signed-in users
function showReportForm() {
    showForm('reportForm');
}

// Display the list of reports for admin access
function showReportList() {
    showForm('reportList');
    displayReports();
}

// Handle Signup: Save the user data to localStorage
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(user => user.email === email)) {
        alert('Email already exists. Please sign in.');
    } else {
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign up successful! Please sign in.');
        showForm('loginForm');
    }
});

// Handle Login: Check if the user exists and log them in
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showReportForm();
        updateNavButtons(true);
    } else {
        alert('Invalid credentials');
    }
});

// Handle Report Submission: Users can upload photos and report drug issues
document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const photo = document.getElementById('photo').files[0];
    const place = document.getElementById('place').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;
    const district = document.getElementById('district').value;

    const reader = new FileReader();
    reader.onloadend = function() {
        const report = {
            photo: reader.result, // Save the Base64 image
            place, city, pincode, district,
            timestamp: new Date().toISOString()
        };
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('Report submitted successfully!');
        document.getElementById('reportForm').reset();
    }
    if (photo) {
        reader.readAsDataURL(photo);
    } else {
        alert('Please select a photo');
    }
});

// Handle Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (password === 'sanjana') { // Admin password (you can change this)
        showReportList();
    } else {
        alert('Invalid admin password');
    }
});

// Display reports for admin
function displayReports() {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const reportsContainer = document.getElementById('reports');
    reportsContainer.innerHTML = ''; // Clear previous reports

    reports.forEach(report => {
        const reportElement = document.createElement('div');
        reportElement.className = 'report fade-in';
        reportElement.innerHTML = `
            <img src="${report.photo}" alt="Report Photo" style="max-width: 100%; height: auto;">
            <p><strong>Place:</strong> ${report.place}</p>
            <p><strong>City:</strong> ${report.city}</p>
            <p><strong>Pincode:</strong> ${report.pincode}</p>
            <p><strong>District:</strong> ${report.district}</p>
            <p><strong>Reported on:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        `;
        reportsContainer.appendChild(reportElement);
    });
}

// Update the navigation buttons to show or hide the Logout button
function updateNavButtons(loggedIn) {
    document.querySelector('.nav-buttons').style.display = loggedIn ? 'flex' : 'none';
}

// Handle Logout: Clear the current session and redirect to home
function logout() {
    localStorage.removeItem('currentUser');
    updateNavButtons(false);
    showForm('Home');
}

// Check if a user is already logged in when the page loads
if (localStorage.getItem('currentUser')) {
    updateNavButtons(true);
    showReportForm();
} else {
    showForm('Home');
}