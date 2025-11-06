// import axios from 'axios';

// const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: backendUrl,
// });

// export default api;

// src/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000", // ⚙️ change to your backend URL
// });

// export default api;

// import axios from "axios";

// // Change this if your backend runs on a different host or port
// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // ✅ includes `/api`
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ Correct backend URL
});

export default api;

// ---------------------------------------------
// 🌐 Axios API Setup (Frontend)
// ---------------------------------------------
// import axios from "axios";

// const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const api = axios.create({
//   baseURL: backendUrl,
// });

// export default api;



