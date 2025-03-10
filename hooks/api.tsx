import API_BASE_URL from '../constants/apiConfig';
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
export const getUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
export const registerUser = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include', // Include cookies
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  export const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/protected`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });
  
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error checking session:', error);
      throw error;
    }
  };
  
  export const logoutUser = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  export interface UploadResponse {
    success: boolean;
    message: string;
    data?: any;
    uri: string;
  }
  
  export async function uploadFiles(formData: FormData): Promise<any> {
    try {
      const response = await fetch('${API_BASE_URL}/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  export interface UploadResponse {
    success: boolean;
    message: string;
    data?: any;
    uri: string;
  }
  
  export async function uploadFile(formData: FormData): Promise<UploadResponse> {
    const response = await fetch('${API_BASE_URL}/api/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('File upload failed');
    }
  
    return response.json();
  }
  export const fetchTestTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test types:', error);
      throw error;
    }
  };
  
  // Fetch test names by type
  export const fetchTestNames = async (type: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test-names`, { params: { type } });
      return response.data;
    } catch (error) {
      console.error('Error fetching test names:', error);
      throw error;
    }
  };
  
  // Submit test results
  export const submitTestResults = async (results: any[]) => {
    try {
      await Promise.all(
        results.map((result) =>
          axios.post(`${API_BASE_URL}/api/lab-tests`, {
            test_name_id: result.test_name_id,
            value: parseFloat(result.value),
            date: result.date,
            notes: result.notes,
          })
        )
      );
    } catch (error) {
      console.error('Error submitting test results:', error);
      throw error;
    }
  };
  export const logSymptom = async (userId: number, symptomName: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/symptoms`, { userId, symptomName });
      return response.data;
    } catch (error) {
      console.error('Error logging symptom:', error);
      throw error;
    }
  };
  
  