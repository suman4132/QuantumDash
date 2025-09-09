# VS Code Setup Guide

## Running the Quantum Dashboard in VS Code

### 1. Prerequisites
- Node.js installed (v18 or later)
- Git installed  
- VS Code with extensions:
  - TypeScript and JavaScript Language Features
  - REST Client (optional, for testing APIs)

### 2. Clone and Setup
```bash
git clone <your-repo-url>
cd quantum-dashboard
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# IBM Quantum API Key (get from https://quantum.ibm.com/account)
IBM_QUANTUM_API_TOKEN=your_ibm_quantum_api_key_here

# OpenAI API Key (get from https://platform.openai.com/api-keys)  
OPENAI_API_KEY=your_openai_api_key_here

# Database URL (Neon PostgreSQL - optional, uses in-memory by default)
DATABASE_URL=your_database_url_here
```

### 4. Get Your IBM Quantum API Key
1. Go to [IBM Quantum Platform](https://quantum.ibm.com/account)
2. Sign in or create an account
3. Navigate to "Account Settings" 
4. Copy your API Token
5. Paste it in your `.env` file as `IBM_QUANTUM_API_TOKEN`

### 5. Running the Application

#### Option 1: Standard Development Mode
```bash
npm run dev
```

#### Option 2: VS Code Specific Mode  
```bash
npm run dev:vscode
```

#### Option 3: Local Start (alias for dev)
```bash
npm run start:local
```

The application will be available at: http://localhost:5000

### 6. Features That Work
- ✅ **Real IBM Quantum Data**: Fetches live jobs and backend information
- ✅ **AI Assistant**: Floating chat bot with OpenAI integration
- ✅ **Dashboard**: Live quantum computing job management
- ✅ **Analytics**: Real-time quantum job statistics and trends
- ✅ **VS Code Compatible**: Full development support in VS Code

### 7. Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages  
│   │   └── lib/          # Utilities and API client
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── ibm-quantum.ts    # IBM Quantum service
│   └── openai-service.ts # AI chat service
└── shared/               # Shared types and schemas
```

### 8. Development Tips

#### Hot Reloading
Changes to both frontend and backend will automatically reload.

#### Debugging
- Backend logs appear in the terminal
- Frontend logs appear in browser DevTools
- Use VS Code debugger with Node.js configuration

#### API Testing
The REST API is available at `http://localhost:5000/api/`

Main endpoints:
- `GET /api/jobs` - List quantum jobs
- `GET /api/backends` - List quantum backends  
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/analytics/stats` - Get analytics

### 9. Common Issues

#### IBM Quantum API Not Working
- Verify your API key is correct in `.env`
- Check that you have access to IBM Quantum Platform
- Ensure your account has appropriate permissions

#### OpenAI Chat Not Working  
- Verify your OpenAI API key in `.env`
- Check that you have credits in your OpenAI account
- Ensure API key has proper permissions

#### Port Already in Use
```bash
# Kill process using port 5000
npx kill-port 5000
# Or use a different port
PORT=3000 npm run dev
```

### 10. Deployment
For deployment to production, use:
```bash
npm run build
npm start
```

### 11. Support
If you encounter issues:
1. Check the console logs for errors
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed (`npm install`)
4. Try restarting the development server

## IBM Quantum 2025 API Updates
The application uses the latest IBM Quantum REST API endpoints:
- Base URL: `https://quantum.cloud.ibm.com/api/v1/`
- Authentication: Bearer tokens generated from API keys
- Compatible with IBM Cloud Identity and Access Management (IAM)