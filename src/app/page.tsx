// app/page.js
'use client';

import { useEffect, useState } from 'react';
import { useBluetoothConnection } from '../hooks/useBluetoothConnection';
import { useSession } from 'next-auth/react';
import TopNavbar from '@/components/TopNavbar';

export default function Home() {
  const [gasLevel, setGasLevel] = useState<any>(0);
  const [latitude, setLatitude] = useState<any>(0);
  const [longitude, setLongitude] = useState<any>(0);
  const { connectToESP32, gasLevel: gl } = useBluetoothConnection();


  useEffect(() => {
    const coordinates = navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      return {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      }
    });

    setGasLevel(gl)
    // console.log("Coordinates:", coordinates);
  }, [gl]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = JSON.stringify({
      gas_level: parseFloat(gasLevel),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });
    const response = await fetch('/api', {
      body: data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  };

  return (
    <div className="flex flex-col h-full container mx-auto p-4 w-full sm:w-[500px] bg-[antiquewhite]">
      <TopNavbar />
      <h1 className="text-2xl font-bold mb-4">
        KSEF Gas Monitoring System
      </h1>
      <form onSubmit={handleSubmit} className="gap-3 w-full h-full flex flex-col">
        <input
          type="number"
          value={gasLevel}
          onChange={(e) => setGasLevel(e.target.value)}
          placeholder="Gas Level"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-red-500 font-bold text-3xl mx-auto my-auto text-white px-4 py-2 rounded-full w-32 h-32"
        >
          SOS
        </button>
      </form>

      {/* <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={report}
      >
        테스트 신고
      </button> */}
      <button
        onClick={connectToESP32}
        className="bg-blue-500 text-white mt-auto px-4 py-2 rounded mb-4"
      >
        Connect to ESP32
      </button>
    </div>
  );
}