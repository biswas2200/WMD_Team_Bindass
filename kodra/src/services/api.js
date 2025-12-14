// API Service Layer for Kodra.ai - Real Backend Integration
// Fully updated to work with deployed Spring Boot backend

// Environment-based configuration
const SPRING_BOOT_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  constructor() {
    this.baseUrl = SPRING_BOOT_BASE_URL;
    console.log('🚀 Kodra.ai API Service initialized');
    console.log('📡 Spring Boot Backend:', this.baseUrl);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async apiFetch(endpoint, options = {}) {
    // Ensure endpoint starts with /
    const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${this.baseUrl}${safeEndpoint}`;

    // Merge headers with Auth
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    console.log(`📤 API Request: ${options.method || 'GET'} ${fullUrl}`);

    try {
      const response = await fetch(fullUrl, { ...options, headers });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const jsonError = JSON.parse(text);
          errorMessage = jsonError.message || jsonError.error || errorMessage;
        } catch (e) {
          // If not JSON, use text
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      // Return 204 No Content as null
      if (response.status === 204) return null;

      return response.json();
    } catch (error) {
      console.error(`❌ API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ---------------- Authentication ----------------
  async login(credentials) {
    return this.apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }).then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Store basic user info if present
        if (data.username) {
          localStorage.setItem('ka_user', JSON.stringify({ name: data.username, ...data }));
        }
      }
      return data;
    });
  }

  async register(userData) {
    return this.apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async studentRegister(studentData) {
    // Mapping "studentRegister" to normal register for now, 
    // or if you have a specific student endpoint, use it.
    // Based on docs, /auth/register is the main entry.
    return this.register(studentData);
  }

  async getCurrentUser() {
    return this.apiFetch('/users/profile');
  }

  async updateStudentProfile(userId, profileData) {
    // Assuming userId is ignored if using /users/profile which uses token
    return this.apiFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Alias for GitHubCallback.js (which expects this method name)
  async getStudentCombined(userId) {
    // We defer to the standard profile endpoint
    return this.apiFetch(`/users/profile`);
  }

  // ---------------- GitHub Integration ----------------
  async linkGitHub(userId, code) {
    // The backend expects query params: ?userId=...&code=...
    return this.apiFetch(`/github/link?userId=${userId}&code=${code}`, {
      method: 'POST'
    });
  }

  // Adapter method for GitHubCallback.js
  async loginWithGitHub(code) {
    // Check if user is already logged in (Linking Flow)
    const userId = localStorage.getItem('studentId');

    if (userId) {
      console.log("🔗 Linking GitHub to existing user:", userId);
      return this.linkGitHub(userId, code)
        .then(profile => {
          // Transform to LoginResponse format expected by GitHubCallback
          return {
            user: { id: userId, name: localStorage.getItem('studentEmail') }, // Minimal mock
            profile: profile, // The actual GitHub profile
            token: localStorage.getItem('authToken'),
            type: 'Bearer',
            isLinking: true // Flag for UI if needed
          };
        });
    }

    // Future: Implement actual GitHub Login (Auth) here if backend supports it
    // For now, throw helpful error
    throw new Error("Please log in with email/password first, then Connect GitHub from Dashboard.");
  }

  // ---------------- Missions ----------------
  async getMissions(userId) {
    return this.apiFetch(`/kodra/missions/${userId}`);
  }

  async startMission(missionId) {
    return this.apiFetch(`/kodra/missions/${missionId}/start`, {
      method: 'POST'
    });
  }

  // ---------------- Chat & AI Assistant (via Gateway) ----------------
  async sendChatMessage(message, profileData = null) {
    // Routes to Backend -> Python Service
    return this.apiFetch('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message })
      // Note: Backend adds profile/user context via token/DB lookup
    });
  }

  async getCareerAnalysis(profileData) {
    // This maps to "Assist" or a specific analysis endpoint.
    // If "Assist" is the generic Q&A:
    return this.apiFetch('/kodra/assist', {
      method: 'POST',
      body: JSON.stringify({
        question: "Analyze my career profile",
        context: {
          programmingLanguage: "N/A",
          fileContent: JSON.stringify(profileData)
        }
      })
    });
  }

  // ---------------- Kodra Specifics ----------------
  async getColleges() {
    // Placeholder or implement if backend has it
    return [];
  }

  async getMentors() {
    // Placeholder
    return [];
  }

  // ---------------- Health Checks ----------------
  async checkBackendHealth() {
    try {
      await this.apiFetch('/chat/health'); // Using chat health as it checks AI too
      return true;
    } catch (e) {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;
