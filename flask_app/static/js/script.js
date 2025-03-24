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
                        statusIndicator.textContent = 'Đã Kết Nối';
                        statusIndicator.className = 'status-indicator connected';
                    } else {
                        statusIndicator.textContent = 'Mất Kết Nối';
                        statusIndicator.className = 'status-indicator disconnected';
                    }
                }

                // Update each row in the system info table
                if (systemInfoTable) {
                    Object.keys(data).forEach(key => {
                        // Skip non-display fields
                        if (key === 'online' || key === 'last_update') return;

                        // Find the row for this key based on the Vietnamese translation
                        const rows = Array.from(systemInfoTable.querySelectorAll('tr'));
                        let row = null;

                        // Match rows by key-specific text
                        switch (key) {
                            case 'chip_id': row = rows.find(r => r.cells[0].textContent.includes('ID Chip')); break;
                            case 'cpu_frequency': row = rows.find(r => r.cells[0].textContent.includes('Tần Số CPU')); break;
                            case 'free_heap': row = rows.find(r => r.cells[0].textContent.includes('Bộ Nhớ Heap')); break;
                            case 'sketch_size': row = rows.find(r => r.cells[0].textContent.includes('Kích Thước Sketch')); break;
                            case 'flash_chip_size': row = rows.find(r => r.cells[0].textContent.includes('Kích Thước Chip Flash')); break;
                            case 'flash_chip_speed': row = rows.find(r => r.cells[0].textContent.includes('Tốc Độ Chip Flash')); break;
                            case 'sdk_version': row = rows.find(r => r.cells[0].textContent.includes('Phiên Bản SDK')); break;
                            case 'reset_reason': row = rows.find(r => r.cells[0].textContent.includes('Lý Do Khởi Động Lại')); break;
                            case 'rssi': row = rows.find(r => r.cells[0].textContent.includes('Tín Hiệu WiFi')); break;
                            case 'uptime': row = rows.find(r => r.cells[0].textContent.includes('Thời Gian Hoạt Động')); break;
                            case 'temperature': row = rows.find(r => r.cells[0].textContent.includes('Nhiệt Độ')); break;
                            case 'ip_address': row = rows.find(r => r.cells[0].textContent.includes('Địa Chỉ IP')); break;
                            case 'mac_address': row = rows.find(r => r.cells[0].textContent.includes('Địa Chỉ MAC')); break;
                            case 'random_value': row = rows.find(r => r.cells[0].textContent.includes('Giá Trị Ngẫu Nhiên')); break;
                        }

                        if (row) {
                            // Format WiFi signal strength with visual indicator
                            if (key === 'rssi' && data[key] !== 'Không Xác Định') {
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
                console.error('Lỗi khi tải thông tin hệ thống:', error);
                if (statusIndicator) {
                    statusIndicator.textContent = 'Lỗi Kết Nối';
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
                    apiResult.textContent = 'Lỗi: ' + error.message;
                    apiResult.style.display = 'block';
                });
        });
    }
});
