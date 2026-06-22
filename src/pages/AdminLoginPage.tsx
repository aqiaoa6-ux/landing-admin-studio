import { useState, type FormEvent } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, authStorage } from "../lib/api";

export function AdminLoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.login(username, password);
      authStorage.setToken(result.token);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card-surface">
        <span className="login-kicker">Landing Admin Studio</span>
        <h1>后台登录</h1>
        <p>登录后即可修改联系方式、邀请码、品牌和佣金案例内容。</p>

        <form autoComplete="off" className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>账号</span>
            <div className="input-shell">
              <UserRound size={16} />
              <input
                autoComplete="off"
                name="admin-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </label>

          <label>
            <span>密码</span>
            <div className="input-shell">
              <LockKeyhole size={16} />
              <input
                autoComplete="new-password"
                name="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </label>

          {error ? <div className="error-inline">{error}</div> : null}
          <button className="primary-button login-button" disabled={loading} type="submit">
            {loading ? "登录中..." : "进入后台"}
          </button>
        </form>
      </div>
    </div>
  );
}
