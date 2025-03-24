from flask import Flask, render_template, jsonify, request
import json
import os
import time

app = Flask(__name__)

# Path for storing system information
SYSTEM_INFO_FILE = os.path.join(os.path.dirname(__file__), 'system_info.json')

# Default system info
default_system_info = {
    "chip_id": "Không Xác Định",
    "cpu_frequency": "Không Xác Định",
    "free_heap": "Không Xác Định",
    "sketch_size": "Không Xác Định",
    "flash_chip_size": "Không Xác Định",
    "flash_chip_speed": "Không Xác Định",
    "sdk_version": "Không Xác Định",
    "reset_reason": "Không Xác Định",
    # New fields
    "rssi": "Không Xác Định",
    "uptime": "Không Xác Định",
    "temperature": "Không Xác Định",
    "ip_address": "Không Xác Định",
    "mac_address": "Không Xác Định",
    "random_value": "Không Xác Định",
    # Status tracking
    "last_update": 0,
    "online": False
}

# Time in seconds after which the ESP is considered offline
OFFLINE_THRESHOLD = 10

def get_system_info():
    """Get stored system information or return defaults"""
    if os.path.exists(SYSTEM_INFO_FILE):
        try:
            with open(SYSTEM_INFO_FILE, 'r') as f:
                data = json.load(f)
                
                # Check if the data is stale
                current_time = time.time()
                if current_time - data.get('last_update', 0) > OFFLINE_THRESHOLD:
                    data['online'] = False
                    # When offline, set values to Unknown
                    for key in default_system_info:
                        if key not in ['last_update', 'online']:
                            data[key] = "Không Xác Định"
                
                return data
        except Exception:
            return default_system_info
    return default_system_info

def save_system_info(data):
    """Save system information to file"""
    # Add timestamp and set as online
    data['last_update'] = time.time()
    data['online'] = True
    
    with open(SYSTEM_INFO_FILE, 'w') as f:
        json.dump(data, f)

@app.route('/')
def home():
    system_info = get_system_info()
    return render_template('index.html', title='Giám Sát Hệ Thống', system_info=system_info)

@app.route('/api/hello')
def hello_api():
    return jsonify({"message": "Xin chào từ Flask!"})

@app.route('/api/system-info')
def system_info_api():
    """API endpoint to return current system information as JSON"""
    system_info = get_system_info()
    return jsonify(system_info)

@app.route('/update', methods=['POST'])
def update_system_info():
    """Endpoint to receive and store system information"""
    if request.method == 'POST':
        data = {
            "chip_id": request.form.get('chip_id', default_system_info['chip_id']),
            "cpu_frequency": request.form.get('cpu_frequency', default_system_info['cpu_frequency']),
            "free_heap": request.form.get('free_heap', default_system_info['free_heap']),
            "sketch_size": request.form.get('sketch_size', default_system_info['sketch_size']),
            "flash_chip_size": request.form.get('flash_chip_size', default_system_info['flash_chip_size']),
            "flash_chip_speed": request.form.get('flash_chip_speed', default_system_info['flash_chip_speed']),
            "sdk_version": request.form.get('sdk_version', default_system_info['sdk_version']),
            "reset_reason": request.form.get('reset_reason', default_system_info['reset_reason']),
            # New fields
            "rssi": request.form.get('rssi', default_system_info['rssi']),
            "uptime": request.form.get('uptime', default_system_info['uptime']),
            "temperature": request.form.get('temperature', default_system_info['temperature']),
            "ip_address": request.form.get('ip_address', default_system_info['ip_address']),
            "mac_address": request.form.get('mac_address', default_system_info['mac_address']),
            "random_value": request.form.get('random_value', default_system_info['random_value'])
        }
        save_system_info(data)
        return jsonify({"status": "success", "message": "Thông tin hệ thống đã được cập nhật"})

if __name__ == '__main__':
    app.run(debug=True)
