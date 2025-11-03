import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Home() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
       if (session) fetchUsers();
    }, [session]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users");
            setUsers(response.data);
        }
        catch (err) {
            console.error("Error fetching users:", err);
        }
    };
    
    const addUser = async () => {
        try {
            setError("");
            const response = await axios.post("/api/users", { name, email });
            setUsers([...users, response.data]);
            setName("");
            setEmail("");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Error adding user");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error adding user");
            }
        }
    };
    return (
  <div style={{ padding: "20px" }}>
    <h1>User Management</h1>

    {/* Sessão do usuário */}
    {session ? (
      <div style={{ marginBottom: "20px" }}>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()} style={{ marginTop: "5px", padding: "5px 10px", backgroundColor: "red", color: "white", borderRadius: "4px" }}>
          Sair
        </button>
      </div>
    ) : (
      <div style={{ marginBottom: "20px" }}>
        <p>Not signed in</p>
        <button onClick={() => signIn("google")} style={{ marginTop: "5px", padding: "5px 10px", backgroundColor: "blue", color: "white", borderRadius: "4px" }}>
          Entrar Com Google
        </button>
      </div>
    )}

    {/* Conteúdo protegido: formulário + lista */}
    {session && (
      <>
        {/* Formulário para adicionar usuário */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={addUser}>Add User</button>
        </div>

        {/* Mensagem de erro */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Lista de usuários */}
        <h2>Users List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name ? `${user.name} - ` : ""}{user.email}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);
}