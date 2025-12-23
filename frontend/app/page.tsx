"use client";

import { useEffect, useState } from "react";

type Status = "UP" | "DOWN" | "DEGRADED";

type Service = {
  id: number;
  name: string;
  url: string;
  status: Status;
  last_checked: string | null;
  latency_ms: number | null;
  http_status: number | null;
  error: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function statusPillClasses(status: Status) {
  if (status === "UP") return "bg-green-200 text-green-900";
  if (status === "DEGRADED") return "bg-yellow-200 text-yellow-900";
  return "bg-red-200 text-red-900";
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchServices() {
    setErrorMsg(null);
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error("Failed to load services");
    const data = (await res.json()) as Service[];
    setServices(data);
  }

  async function runChecks() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/services/check`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to run checks");
      const data = (await res.json()) as Service[];
      setServices(data);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices().catch((e) => setErrorMsg(e.message));
  }, []);

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });
      if (!res.ok) throw new Error("Failed to add service");
      setName("");
      setUrl("");
      await fetchServices();
    } catch (e: any) {
      setErrorMsg(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">Network Operations Dashboard</h1>
          <p className="text-gray-800">
            Real API health monitoring: checks public endpoints and reports status, latency, and errors.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold">Run Health Checks</h2>
              <p className="text-sm text-gray-700">
                Click to ping each service URL and update status.
              </p>
            </div>
            <button
              disabled={loading}
              onClick={runChecks}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
            >
              {loading ? "Checking..." : "Run Checks"}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Add Service</h2>
          <form onSubmit={addService} className="grid gap-2 md:grid-cols-3">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Service name (e.g., OpenAI Status)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60 md:col-span-3"
            >
              Add Service
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Services</h2>
            <button
              disabled={loading}
              onClick={() => fetchServices().catch((e) => setErrorMsg(e.message))}
              className="text-sm underline disabled:opacity-60"
            >
              Refresh
            </button>
          </div>

          {errorMsg && (
            <div className="mb-3 text-sm text-red-700">
              {errorMsg} (is backend running on port 8000?)
            </div>
          )}

          <ul className="space-y-2">
            {services.map((s) => (
              <li
                key={s.id}
                className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-700 break-all">{s.url}</div>
                  <div className="text-xs text-gray-700">
                    Last checked:{" "}
                    {s.last_checked ? new Date(s.last_checked).toLocaleString() : "—"}
                  </div>
                  {s.error && (
                    <div className="text-xs text-red-700">
                      Error: {s.error}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${statusPillClasses(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>

                  <div className="text-sm">
                    <span className="font-semibold">Latency:</span>{" "}
                    {s.latency_ms !== null ? `${s.latency_ms} ms` : "—"}
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold">HTTP:</span>{" "}
                    {s.http_status !== null ? s.http_status : "—"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-xs text-gray-700">
          Stack: Next.js + TypeScript + TailwindCSS • FastAPI microservice • Real HTTP health checks
        </footer>
      </div>
    </main>
  );
}
