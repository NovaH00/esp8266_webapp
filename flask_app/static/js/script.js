document.addEventListener('DOMContentLoaded', function () {
    const apiBtn = document.getElementById('api-btn');
    const apiResult = document.getElementById('api-result');
    const systemInfoTable = document.querySelector('.system-info');
    const refreshInterval = 1000; // Update every 10 seconds

    // Function to update system info
    function updateSystemInfo() {
        fetch('/api/system-info')
            .then(response => response.json())
            .then(data => {
                // Update each row in the system info table
                if (systemInfoTable) {
                    Object.keys(data).forEach(key => {
                        const row = systemInfoTable.querySelector(`tr td:first-child:contains("${key.replace('_', ' ')}:")`);
                        if (row) {
                            row.nextElementSibling.textContent = data[key];
                        }
                    });
                }
            })
            .catch(error => console.error('Error fetching system info:', error));
    }

    // Add selector function for text content matching
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if (!document.querySelector(':contains')) {
        document.querySelector = (function (querySelector) {
            return function (selector) {
                if (selector.includes(':contains')) {
                    const parts = selector.split(':contains(');
                    const textToMatch = parts[1].slice(0, -1);
                    const elements = document.querySelectorAll(parts[0]);
                    for (const el of elements) {
                        if (el.textContent.includes(textToMatch)) {
                            return el;
                        }
                    }
                    return null;
                }
                return querySelector.call(this, selector);
            };
        })(document.querySelector);
    }

    // Start periodic updates
    setInterval(updateSystemInfo, refreshInterval);

    // Initial update
    updateSystemInfo();

    if (apiBtn) {
        apiBtn.addEventListener('click', function () {
            fetch('/api/hello')
                .then(response => response.json())
                .then(data => {
                    apiResult.textContent = JSON.stringify(data);
                    apiResult.style.display = 'block';
                })
                .catch(error => {
                    apiResult.textContent = 'Error: ' + error.message;
                    apiResult.style.display = 'block';
                });
        });
    }
});
