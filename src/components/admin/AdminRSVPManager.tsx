"use client";

import { useState, useTransition } from "react";
import { getRSVPs, getRSVPStats, updateRSVP, deleteRSVP } from "@/app/actions/admin-rsvp";
import Button from "@/components/ui/Button";

interface RSVP {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  attending: boolean | null;
  dietary_restrictions: string;
  allergies: string;
  message: string;
  created_at: string;
}

/**
 * COMPOSANT : ADMIN RSVP MANAGEMENT
 */
export function AdminRSVPManager() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState({ total: 0, attending: 0, notAttending: 0, pending: 0, attendanceRate: 0 });
  const [isLoading, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleLoadRSVPs = () => {
    startTransition(async () => {
      const [rsvpResult, statsResult] = await Promise.all([
        getRSVPs(),
        getRSVPStats(),
      ]);

      if (rsvpResult.success && rsvpResult.data) {
        setRsvps(rsvpResult.data);
      }
      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr ? Cette action est irréversible.")) {
      startTransition(async () => {
        const result = await deleteRSVP(id);
        if (result.success) {
          handleLoadRSVPs();
        }
      });
    }
  };

  const handleUpdateAttendance = (id: string, attending: boolean) => {
    const data = new FormData();
    data.append("attending", attending.toString());

    startTransition(async () => {
      const result = await updateRSVP(id, data);
      if (result.success) {
        handleLoadRSVPs();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des RSVPs</h2>
        <Button onClick={handleLoadRSVPs} disabled={isLoading}>
          Charger les RSVPs
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Présents</p>
          <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Absents</p>
          <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Taux de présence</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.attendanceRate}%</p>
        </div>
      </div>

      {/* Liste des RSVPs */}
      <div className="space-y-3">
        {rsvps.map((rsvp) => (
          <div
            key={rsvp.id}
            className="bg-white p-4 rounded-lg border"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{rsvp.guest_name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rsvp.attending === true
                        ? "bg-green-100 text-green-800"
                        : rsvp.attending === false
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {rsvp.attending === true
                      ? "✓ Présent"
                      : rsvp.attending === false
                      ? "✗ Absent"
                      : "? En attente"}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p>📧 {rsvp.guest_email}</p>
                  {rsvp.guest_phone && <p>📱 {rsvp.guest_phone}</p>}
                  {rsvp.dietary_restrictions && (
                    <p>🍽️ Régime: {rsvp.dietary_restrictions}</p>
                  )}
                  {rsvp.allergies && <p>⚠️ Allergies: {rsvp.allergies}</p>}
                  {rsvp.message && <p className="italic">💬 {rsvp.message}</p>}
                </div>
              </div>

              <div className="space-x-2 ml-4">
                <Button
                  onClick={() => handleUpdateAttendance(rsvp.id, true)}
                  variant={rsvp.attending === true ? "primary" : "secondary"}
                  size="sm"
                >
                  Présent
                </Button>
                <Button
                  onClick={() => handleUpdateAttendance(rsvp.id, false)}
                  variant={rsvp.attending === false ? "accent" : "secondary"}
                  size="sm"
                >
                  Absent
                </Button>
                <Button
                  onClick={() => handleDelete(rsvp.id)}
                  variant="accent"
                  size="sm"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
