import { useState } from "react";
import api from "../../services/api";

export default function AuthForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, { username, password });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data || err.message;
      setError(
        typeof msg === "string"
          ? msg
          : "İşlem başarısız. Bilgileri kontrol edin.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "0 auto", marginTop: 40 }}>
      <h2>{isRegister ? "Kayıt Ol" : "Giriş Yap"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            background: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          {loading ? "İşleniyor..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", textAlign: "center" }}>{error}</p>
      )}

      <p style={{ marginTop: 16, textAlign: "center" }}>
        {isRegister ? "Hesabın var mı?" : "Hesabın yok mu?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#0066cc",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isRegister ? "Giriş yap" : "Kayıt ol"}
        </button>
      </p>
    </div>
  );
}
