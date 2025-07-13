import { jwtDecode } from "jwt-decode";
import { API_URLS } from '../../config/api.js';

export async function authGoogle(credentialResponse) {
  const token = credentialResponse.credential;
  const userInfo = jwtDecode(token); // contiene nombre, email, picture

  console.log("Información del usuario es esta si:", userInfo);

  // ENVÍAS EL TOKEN AL BACKEND
  const response = await fetch(API_URLS.GOOGLE_AUTH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });
  
  const data = await response.json();
  console.log("Respuesta del backend:", data);

  if (response.ok) {
    localStorage.setItem("token", data.token);
    
    window.location.href = "/dashboard";
  } else {
    console.error("Error al iniciar sesión:", data.message);
  }
  return data;
}
