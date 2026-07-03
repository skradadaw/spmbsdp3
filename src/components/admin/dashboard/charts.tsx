"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock Data
const PROGRAM_DATA = [
  { name: "Reguler", value: 65, color: "#10b981" },
  { name: "Tahfidz", value: 45, color: "#f59e0b" },
  { name: "Bilingual", value: 35, color: "#3b82f6" },
];

const GENDER_DATA = [
  { name: "Laki-laki", value: 80, color: "#3b82f6" },
  { name: "Perempuan", value: 65, color: "#ec4899" },
];

const REGISTRATION_TREND = [
  { date: "1 Jul", reguler: 12, tahfidz: 5, bahasa: 4 },
  { date: "2 Jul", reguler: 15, tahfidz: 8, bahasa: 6 },
  { date: "3 Jul", reguler: 10, tahfidz: 12, bahasa: 8 },
  { date: "4 Jul", reguler: 18, tahfidz: 10, bahasa: 9 },
  { date: "5 Jul", reguler: 10, tahfidz: 10, bahasa: 8 },
];

export function DashboardCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 flex items-center justify-center">Memuat grafik...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Program Distribution */}
      <div className="bg-white p-6 rounded-xl border border-[var(--color-border-light)] shadow-sm">
        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
          Distribusi Program Kelas
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PROGRAM_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {PROGRAM_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registration Trend */}
      <div className="bg-white p-6 rounded-xl border border-[var(--color-border-light)] shadow-sm">
        <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
          Tren Pendaftaran Harian
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REGISTRATION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="reguler" name="Reguler" stackId="a" fill="#10b981" />
              <Bar dataKey="tahfidz" name="Tahfidz" stackId="a" fill="#f59e0b" />
              <Bar dataKey="bahasa" name="Bilingual" stackId="a" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
