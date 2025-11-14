import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * IMPORTANT: PHYSICAL_DEVICE_IP is the IP address of the COMPUTER running the Django server,
 * NOT the IP of your mobile device. All devices (yours, teammates, etc.) should use the same IP.
 * 
 * For physical devices, set USE_PHYSICAL_DEVICE_IP to true and set PHYSICAL_DEVICE_IP 
 * to your computer's local IP address (where Django server is running).
 * 
 * You can find it by running:
 * - macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
 * - Windows: ipconfig
 * 
 * Note: All devices must be on the same WiFi network to connect to this IP.
 * 
 * Example: 'http://192.168.1.100:8000/api'
 */
const USE_PHYSICAL_DEVICE_IP = true; // Set to true if running on a physical device
const PHYSICAL_DEVICE_IP = '172.21.114.187'; // IP address of the computer running Django server

export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    // If using physical device IP, use it for all platforms
    if (USE_PHYSICAL_DEVICE_IP) {
      return `http://${PHYSICAL_DEVICE_IP}:8000/api`;
    }
    
    // For Android emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    // For iOS simulator
    if (Platform.OS === 'ios') {
      return 'http://localhost:8000/api';
    }
  }
  // Production URL (update when deploying)
  return 'http://localhost:8000/api';
};

