import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { loadUsers, saveUsers, loadSession, saveSession, createSalt, createId, hashPassword } from "../utils/auth";

export default function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [sessionId, setSessionId] = useState(loadSession);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveSession(sessionId);
  }, [sessionId]);

  const account = users.find((u) => u.id === sessionId);
  const user = account ? { id: account.id, name: account.name, email: account.email, phone: account.phone } : null;

  const signup = async ({ name, email, phone, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, field: "email", error: "An account with this email already exists." };
    }

    try {
      const salt = createSalt();
      const passwordHash = await hashPassword(password, salt);
      const newAccount = {
        id: createId(),
        name: name.trim(),
        email: cleanEmail,
        phone: phone.replace(/[\s-]/g, ""),
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [...prev, newAccount]);
      setSessionId(newAccount.id);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not create the account. Please use a secure (https) connection." };
    }
  };

  const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const invalid = { ok: false, error: "Incorrect email or password." };
    const found = users.find((u) => u.email === cleanEmail);

    if (!found) return invalid;

    try {
      const hash = await hashPassword(password, found.salt);
      if (hash !== found.passwordHash) return invalid;
      setSessionId(found.id);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not log in. Please use a secure (https) connection." };
    }
  };

  const logout = () => {
    setSessionId(null);
  };

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}