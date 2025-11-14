import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * For physical devices, replace 'YOUR_COMPUTER_IP' with your computer's local IP address.
 * You can find it by running:
 * - macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
 * - Windows: ipconfig
 * 
 * Example: 'http://192.168.1.100:8000/api'
 */
const PHYSICAL_DEVICE_IP = 'YOUR_COMPUTER_IP'; // Replace with your computer's IP

export const getApiBaseUrl = (): string => {
  if (__DEV__) {
    // For Android emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    // For iOS simulator
    if (Platform.OS === 'ios') {
      return 'http://localhost:8000/api';
    }
    // For physical devices - update PHYSICAL_DEVICE_IP above
    if (PHYSICAL_DEVICE_IP !== 'YOUR_COMPUTER_IP') {
      return `http://${PHYSICAL_DEVICE_IP}:8000/api`;
    }
  }
  // Production URL (update when deploying)
  return 'http://localhost:8000/api';
};

