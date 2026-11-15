'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { VisitDTO } from '@/components/MapView';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function Admin() {
  const [visits, setVisits] = useState<VisitDTO[] | null>(null);

  useEffect(() => {
    const key = prompt('Admin key') ?? '';
    fetch('/api/visits', { headers: { 'x-admin-key': key } }).then(async res => {
      if (!res.ok) return alert('Wrong key');
      setVisits(await res.json());
    });
  }, []);

  return visits ? <MapView visits={visits} /> : <p style={{ padding: 32 }}>Locked 🔒</p>;
}