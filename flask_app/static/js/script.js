document.addEventListener('DOMContentLoaded', function () {
    const apiBtn = document.getElementById('api-btn');
    const apiResult = document.getElementById('api-result');
    const systemInfoTable = document.querySelector('.system-info');
    const statusIndicator = document.querySelector('.status-indicator');
    const refreshInterval = 1000; // Update every second

    // Function to update system info
    function updateSystemInfo() {
        fetch('/api/system-info')
            .then(response => response.json())
            .then(data => {
                // Update connectivity status
                if (statusIndicator) {
                    if (data.online) {
                        statusIndicator.textContent = 'Connected';
                        statusIndicator.className = 'status-indicator connected';
                    } else {
                        statusIndicator.textContent = 'Disconnected';
                        statusIndicator.className = 'status-indicator disconnected';
                    }
                }

                // Update each row in the system info table
                if (systemInfoTable) {
                    Object.keys(data).forEach(key => {
                        // Skip non-display fields
                        if (key === 'online' || key === 'last_update') return;

                        // Find the row for this key
                        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const rows = Array.from(systemInfoTable.querySelectorAll('tr'));
                        const row = rows.find(r => r.cells[0].textContent.includes(formattedKey));

                        if (row) {
                            // Format WiFi signal strength with visual indicator
                            if (key === 'rssi' && data[key] !== 'Unknown') {
                                const rssiValue = parseInt(data[key]);
                                let signalClass = '';

                                if (rssiValue > -65) signalClass = 'signal-strong';
                                else if (rssiValue > -80) signalClass = 'signal-medium';
                                else signalClass = 'signal-weak';

                                row.cells[1].innerHTML = `<span class="${signalClass}">${data[key]}</span>`;
                            } else {
                                row.cells[1].textContent = data[key];
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching system info:', error);
                if (statusIndicator) {
                    statusIndicator.textContent = 'Connection Error';
                    statusIndicator.className = 'status-indicator error';
                }
            });
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
