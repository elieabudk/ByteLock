import { useState } from "react";

export const PasswordGeneratorSeguro = () => {
  const [password, setPassword] = useState("");

  const generateSecurePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    const length = 16;
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const index = array[i] % charset.length;
      newPassword += charset.charAt(index);
    }

    setPassword(newPassword);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Generador de Contraseña Segura</h2>
      <button onClick={generateSecurePassword}>Generar contraseña</button>
      <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        {password && <p><strong>Contraseña:</strong> {password}</p>}
      </div>
    </div>
  );
};
