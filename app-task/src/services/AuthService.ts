// src/services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class AuthService {
  static async signup(email: string, password: string): Promise<void> {
    await axios.post(`${API_URL}/signup`, { email, password });
  }

  static async signin(email: string, password: string): Promise<string> {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data.token;
  }
}


export default AuthService;
