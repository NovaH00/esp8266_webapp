from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Path for storing system information
SYSTEM_INFO_FILE = os.path.join(os.path.dirname(__file__), 'system_info.json')

# Default system info
default_system_info = {
    "chip_id": "Unknown",
    "cpu_frequency": "Unknown",
    "free_heap": "Unknown",
    "sketch_size": "Unknown",
    "flash_chip_size": "Unknown",
    "flash_chip_speed": "Unknown",
    "sdk_version": "Unknown",
    "reset_reason": "Unknown"
}

def get_system_info():
    """Get stored system information or return defaults"""
    if os.path.exists(SYSTEM_INFO_FILE):
        try:
            with open(SYSTEM_INFO_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return default_system_info
    return default_system_info

def save_system_info(data):
    """Save system information to file"""
    with open(SYSTEM_INFO_FILE, 'w') as f:
        json.dump(data, f)

@app.route('/')
def home():
    system_info = get_system_info()
    return render_template('index.html', title='System Monitor', system_info=system_info)

@app.route('/api/hello')
def hello_api():
    return jsonify({"message": "Hello from Flask!"})

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
            "reset_reason": request.form.get('reset_reason', default_system_info['reset_reason'])
        }
        save_system_info(data)
        return jsonify({"status": "success", "message": "System information updated"})

if __name__ == '__main__':
    app.run(debug=True)
