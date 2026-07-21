import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ShieldAlert, KeyRound, UserRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const navigate = useNavigate();

  // Mode: "admin" | "patient" | "register" | "patient-register"
  const [mode, setMode] = useState("admin");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [patientId, setPatientId] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [registeredMRN, setRegisteredMRN] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid Email or Password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register account");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/patient-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, phone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid Patient ID or Phone Number");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/patient-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender, phone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register patient account");
      }

      setRegisteredMRN(data.patientId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background gradients for premium aesthetic */}
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan/10 blur-[100px]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 z-10">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan shadow-glow mb-3">
            <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Kowshi Hospitals
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Care Operations & Patient Portal
          </p>
        </div>

        {registeredMRN ? (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mx-auto border border-emerald-500/20">
              <Activity className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-white">Registration Successful!</h2>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <p className="text-xs text-slate-400">Your generated Patient ID (MRN ID) is:</p>
              <p className="text-xl font-mono font-bold text-cyan tracking-wider">{registeredMRN}</p>
              <p className="text-[10px] text-slate-500">Please write down or save this ID. You will need it and your phone number to sign back into the Patient Portal.</p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full bg-cyan hover:bg-cyan/90 text-slate-950 font-semibold gap-1.5 mt-2">
              Go to Patient Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Tab Switcher (hide if in register mode) */}
            {mode !== "register" && mode !== "patient-register" && (
              <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/60">
                <button
                  onClick={() => { setMode("admin"); setError(""); }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    mode === "admin" 
                      ? "bg-slate-900 text-white shadow-sm border border-slate-800/50" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Staff Login
                </button>
                <button
                  onClick={() => { setMode("patient"); setError(""); }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    mode === "patient" 
                      ? "bg-slate-900 text-white shadow-sm border border-slate-800/50" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Patient Portal
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg mb-4">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Admin Login Form */}
            {mode === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="admin@kowshi.com"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 mt-2" disabled={loading}>
                  {loading ? "Authenticating..." : "Sign In to Console"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setError(""); }}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Create a new staff user account
                  </button>
                </div>
              </form>
            )}

            {/* Admin Registration Form */}
            {mode === "register" && (
              <form onSubmit={handleAdminRegister} className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-sm font-semibold text-white">Create Staff Account</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Register a new console credentials login</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Dr. Sathya Kumar"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="sathya@kowshi.com"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Create strong password"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 mt-2" disabled={loading}>
                  {loading ? "Registering..." : "Generate Staff Credentials"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("admin"); setError(""); }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Back to Staff Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Patient Login Form */}
            {mode === "patient" && (
              <form onSubmit={handlePatientLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Patient ID (MRN ID)</label>
                  <Input
                    type="text"
                    placeholder="e.g. MRN-84213"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Registered Phone Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. +91 98400 12345"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-cyan hover:bg-cyan/90 text-slate-950 font-semibold mt-2" disabled={loading}>
                  {loading ? "Accessing Portal..." : "Enter Patient Portal"}
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setMode("patient-register"); setError(""); setName(""); setPhone(""); setAge(""); }}
                    className="text-xs text-cyan hover:text-cyan/80 font-medium transition-colors"
                  >
                    Create a new patient account (Register Online)
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/50 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-white">Demo Patient Access Credentials:</p>
                  <p>• ID: <span className="text-cyan font-mono">MRN-84213</span></p>
                  <p>• Phone: <span className="text-cyan font-mono">+91 98400 12345</span></p>
                  <p className="text-[10px] text-slate-500 italic mt-1">Use these credentials to view the specialized patient medical records view.</p>
                </div>
              </form>
            )}

            {/* Patient Registration Form */}
            {mode === "patient-register" && (
              <form onSubmit={handlePatientRegister} className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-sm font-semibold text-white">Create Patient Account</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Register a new patient record online</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Arjun Menon"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Age</label>
                    <Input
                      type="number"
                      placeholder="35"
                      className="bg-slate-950/60 border-slate-800 text-sm text-white"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Gender</label>
                    <select
                      className="w-full h-9 rounded-md bg-slate-950 px-3 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Phone Number</label>
                  <Input
                    type="text"
                    placeholder="e.g. +91 98400 12345"
                    className="bg-slate-950/60 border-slate-800 text-sm text-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-cyan hover:bg-cyan/90 text-slate-950 font-bold mt-2" disabled={loading}>
                  {loading ? "Registering..." : "Register & Sign In"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("patient"); setError(""); }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Back to Patient Sign In
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}