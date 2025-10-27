// Expose auth functions to global scope
window.createAuthModal = function(type) {
    return `
    <div id="authModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="terminal-window max-w-md w-full" style="min-width: 320px;">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <div class="terminal-button close" onclick="closeAuthModal()"></div>
                    <div class="terminal-button minimize"></div>
                    <div class="terminal-button maximize"></div>
                </div>
                <div class="text-sm text-terminal-text flex-1 text-center">hawk@eye:~/${type}</div>
            </div>
            <div class="terminal-content p-6">
                <div class="terminal-prompt mb-6">
                    <span class="text-terminal-green">hawk@eye</span>
                    <span class="text-terminal-text">:</span>
                    <span class="text-terminal-blue">~</span>
                    <span class="text-terminal-text">$ ${type === 'login' ? 'authenticate --user' : 'create-user --new'}</span>
                </div>

            <form id="${type}Form" class="space-y-4">
                ${type === 'signup' ? `
                <div class="mb-4">
                    <div class="terminal-prompt">Username:</div>
                    <input type="text" id="signupUsername" required 
                        class="w-full px-4 py-2 bg-terminal-bg border border-terminal-border text-terminal-text focus:border-terminal-cyan focus:outline-none mt-2">
                </div>` : ''}
                <div class="mb-4">
                    <div class="terminal-prompt">Email:</div>
                    <input type="email" id="${type}Email" required 
                        class="w-full px-4 py-2 bg-terminal-bg border border-terminal-border text-terminal-text focus:border-terminal-cyan focus:outline-none mt-2">
                </div>
                <div class="mb-4">
                    <div class="terminal-prompt">Password:</div>
                    <input type="password" id="${type}Password" required 
                        class="w-full px-4 py-2 bg-terminal-bg border border-terminal-border text-terminal-text focus:border-terminal-cyan focus:outline-none mt-2">
                </div>
                <div id="${type}Message" class="text-terminal-red hidden terminal-text"></div>
                <button type="submit" class="terminal-btn w-full py-2 px-4 hover:bg-terminal-cyan hover:text-terminal-bg transition-all mt-4">
                    ${type === 'login' ? '> Execute Login' : '> Create Account'}
                </button>
                <div class="text-center text-terminal-text text-sm mt-4">
                    ${type === 'login' 
                        ? "Type 'signup' or <button type='button' onclick=\"showAuthModal('signup')\" class='text-terminal-blue hover:text-terminal-cyan'>click here</button> to create account"
                        : "Type 'login' or <button type='button' onclick=\"showAuthModal('login')\" class='text-terminal-blue hover:text-terminal-cyan'>click here</button> to authenticate"
                    }
                </div>
            </form>
            <div class="mt-4 terminal-cursor"></div>
            </div>
            <button class="mt-4 text-gray-400 hover:text-white" onclick="closeAuthModal()">Close</button>
        </div>
    </div>
    `;
}

// Show modal function
window.showAuthModal = function(type) {
    // Remove existing modal if any
    closeAuthModal();
    
    // Create and append new modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = createAuthModal(type);
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add form submit handler
    const form = document.getElementById(`${type}Form`);
    form.addEventListener('submit', (e) => handleAuth(e, type));

    // Focus the first input field
    const firstInput = type === 'signup' ? 
        document.getElementById('signupUsername') : 
        document.getElementById(`${type}Email`);
    if (firstInput) firstInput.focus();
}

// Switch between login and signup
function switchAuthMode(newType) {
    // Save any entered values
    const currentEmail = document.querySelector('input[type="email"]')?.value || '';
    const currentPassword = document.querySelector('input[type="password"]')?.value || '';
    
    // Show new modal
    showAuthModal(newType);
    
    // Restore entered values
    const newEmailInput = document.querySelector('input[type="email"]');
    const newPasswordInput = document.querySelector('input[type="password"]');
    if (newEmailInput) newEmailInput.value = currentEmail;
    if (newPasswordInput) newPasswordInput.value = currentPassword;
}

// Close modal function
function closeAuthModal() {
    const existingModal = document.getElementById('authModal');
    if (existingModal) {
        existingModal.remove();
    }
}

// Handle authentication
async function handleAuth(e, type) {
    e.preventDefault();
    
    const form = e.target;
    const messageEl = document.getElementById(`${type}Message`);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⌛</span> Processing...';
    
    try {
        // Prepare form data
        const formData = {
            email: document.getElementById(`${type}Email`).value,
            password: document.getElementById(`${type}Password`).value
        };
        
        if (type === 'signup') {
            formData.username = document.getElementById('signupUsername').value;
        }
        
        // Send request to backend
        const response = await fetch(`/api/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message
            messageEl.textContent = data.message;
            messageEl.classList.remove('text-red-500', 'hidden');
            messageEl.classList.add('text-green-500');
            
            // Close modal after success
            // Store user info
            const userData = {
                email: formData.email,
                username: type === 'signup' ? formData.username : data.username || formData.email.split('@')[0]
            };
            localStorage.setItem('user', JSON.stringify(userData));

            setTimeout(() => {
                closeAuthModal();
                updateUIForLoggedInUser(userData);
            }, 1500);
        } else {
            throw new Error(data.message || 'Authentication failed');
        }
    } catch (error) {
        // Show error message
        messageEl.textContent = error.message || 'An error occurred';
        messageEl.classList.remove('hidden');
        messageEl.classList.add('text-red-500');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// Add click handlers when document loads
// Function to update UI for logged-in user
function updateUIForLoggedInUser(userData) {
    // Show dashboard section
    const dashboardSection = document.getElementById('userDashboard');
    if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
        // Update username in dashboard
        const usernameDisplay = dashboardSection.querySelector('.username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = userData.username;
        }
    }

    // Update desktop menu
    const desktopMenu = document.querySelector('.md\\:flex.items-center.space-x-8');
    if (desktopMenu) {
        // Remove login/signup buttons
        const authButtons = desktopMenu.querySelectorAll('.login-btn, .signup-btn');
        authButtons.forEach(btn => btn.remove());

        // Add user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'relative';
        userMenu.innerHTML = `
            <button id="userMenuBtn" class="flex items-center space-x-2 bg-gray-800 text-cyan-400 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all">
                <span class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    ${userData.username.charAt(0).toUpperCase()}
                </span>
                <span>${userData.username}</span>
            </button>
            <div id="userDropdown" class="hidden absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                <a href="#dashboard" class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                    <span class="mr-2">📊</span>
                    Dashboard
                </a>
                <a href="#settings" class="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                    <span class="mr-2">⚙️</span>
                    Settings
                </a>
                <button onclick="handleLogout()" class="w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-700">
                    <span class="mr-2">🚪</span>
                    Logout
                </button>
            </div>
        `;
        desktopMenu.appendChild(userMenu);

        // Toggle dropdown
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    // Update mobile menu
    const mobileMenu = document.querySelector('#mobileMenu .px-4.py-2');
    if (mobileMenu) {
        // Remove login/signup buttons
        const mobileAuthButtons = mobileMenu.querySelectorAll('.login-btn, .signup-btn');
        mobileAuthButtons.forEach(btn => btn.remove());

        // Add mobile user menu items
        const mobileUserMenu = document.createElement('div');
        mobileUserMenu.className = 'border-t border-gray-700 mt-2 pt-2';
        mobileUserMenu.innerHTML = `
            <div class="flex items-center space-x-2 py-2 text-cyan-400">
                <span class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    ${userData.username.charAt(0).toUpperCase()}
                </span>
                <span>${userData.username}</span>
            </div>
            <a href="#dashboard" class="block py-2 text-gray-300 hover:text-cyan-400">Dashboard</a>
            <a href="#settings" class="block py-2 text-gray-300 hover:text-cyan-400">Settings</a>
            <button onclick="handleLogout()" class="block w-full text-left py-2 text-red-400 hover:text-red-300">Logout</button>
        `;
        mobileMenu.appendChild(mobileUserMenu);
    }

    // Add personalized welcome section
    const heroSection = document.querySelector('section.pt-24');
    if (heroSection) {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto mb-8 border border-gray-700';
        welcomeMsg.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">Welcome back, ${userData.username}! 🚀</h3>
                <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Premium Member</span>
            </div>
            <div class="grid md:grid-cols-3 gap-4 text-gray-300">
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="text-2xl font-bold text-cyan-400 mb-1">0</div>
                    <div class="text-sm">Scans Today</div>
                </div>
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="text-2xl font-bold text-purple-400 mb-1">0</div>
                    <div class="text-sm">Threats Blocked</div>
                </div>
                <div class="bg-gray-700/30 rounded-lg p-4">
                    <div class="text-2xl font-bold text-emerald-400 mb-1">100%</div>
                    <div class="text-sm">Protection Status</div>
                </div>
            </div>
        `;
        heroSection.querySelector('.max-w-7xl').insertBefore(welcomeMsg, heroSection.querySelector('.text-center'));
    }
}

// Logout handler
function handleLogout() {
    // Hide dashboard
    const dashboardSection = document.getElementById('userDashboard');
    if (dashboardSection) {
        dashboardSection.classList.add('hidden');
    }
    localStorage.removeItem('user');
    window.location.reload();
}

// Check for logged-in user on page load
document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        updateUIForLoggedInUser(JSON.parse(userData));
    } else {
        // Add click handlers to login buttons
        const loginButtons = document.querySelectorAll('button.login-btn');
        loginButtons.forEach(button => {
            button.addEventListener('click', () => showAuthModal('login'));
        });
    }
});