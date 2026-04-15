// API Configuration
// Change this to your computer's IP address when testing from mobile
// Example: "http://192.168.1.100:5000"
// 
// To find your IP:
// - Windows: Run `ipconfig` in CMD, look for IPv4 Address
// - Mac/Linux: Run `ifconfig` or `ip addr`, look for inet address
//
// Make sure your Flask server is running with: flask run --host=0.0.0.0

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
