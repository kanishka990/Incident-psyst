import { useState } from "react";
import api from "../services/api";

export default function Register() {

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/auth/register", form);

    alert("Registered successfully");
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        placeholder="Email"
        onChange={(e)=>
          setForm({...form,email:e.target.value})
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>
          setForm({...form,password:e.target.value})
        }
      />

      <select
        onChange={(e)=>
          setForm({...form,role:e.target.value})
        }
      >
        <option value="customer">Customer</option>
        <option value="developer">Developer</option>
      </select>

      <button>Register</button>

    </form>
  );
}
