// Loading Animation Script
document.addEventListener('DOMContentLoaded', () => {
    
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--terminal-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;

    // Create terminal-style loading animation
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div class="terminal-window" style="min-width: 300px;">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <div class="terminal-button close"></div>
                    <div class="terminal-button minimize"></div>
                    <div class="terminal-button maximize"></div>
                </div>
                <div class="text-sm text-terminal-text flex-1 text-center">hawk@eye:~/system</div>
            </div>
            <div class="terminal-content p-6">
                <div class="terminal-prompt mb-4">
                    <span class="text-terminal-green">hawk@eye</span>
                    <span class="text-terminal-text">:</span>
                    <span class="text-terminal-blue">~/system</span>
                    <span class="text-terminal-text">$ loading...</span>
                </div>
                <div class="terminal-progress mb-4">
                    <div class="terminal-progress-bar" style="width: 0%"></div>
                </div>
                <div class="text-terminal-text text-sm text-center" id="loadingStatus">
                    Initializing security protocols...
                </div>
            </div>
        </div>
    `;

    overlay.appendChild(loader);
    document.body.appendChild(overlay);

    // Loading messages
    const loadingMessages = [
        'Initializing security protocols...',
        'Checking system integrity...',
        'Loading threat database...',
        'Establishing secure connection...',
        'Activating protection systems...'
    ];

    // Progress animation
    let progress = 0;
    const progressBar = loader.querySelector('.terminal-progress-bar');
    const statusText = loader.querySelector('#loadingStatus');
    let messageIndex = 0;

    const updateProgress = () => {
        if (progress < 100) {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (progress > messageIndex * 25) {
                messageIndex = Math.min(Math.floor(progress / 25), loadingMessages.length - 1);
                statusText.textContent = loadingMessages[messageIndex];
            }

            if (progress < 100) {
                setTimeout(updateProgress, 150 + Math.random() * 150);
            } else {
                setTimeout(() => {
                    statusText.textContent = 'System ready. Initializing interface...';
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.remove();
                        }, 500);
                    }, 500);
                }, 300);
            }
        }
    };

    // Start progress animation
    setTimeout(updateProgress, 300);
});