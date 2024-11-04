// app/page.js
'use client';

import { use, useEffect, useLayoutEffect, useState } from 'react';
import { useBluetoothConnection } from '../hooks/useBluetoothConnection';
import { useSession } from 'next-auth/react';
import TopNavbar from '@/components/TopNavbar';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import Script from 'next/script';
import KakaoMap from '@/components/KakaoMap';

export default function Home() {

  const [gasLevel, setGasLevel] = useState<any>(0);
  const [latitude, setLatitude] = useState<any>(0);
  const [longitude, setLongitude] = useState<any>(0);
  const { connectToESP32, gasLevel: gl } = useBluetoothConnection();

  const [friendAccordion, setFriendAccordion] = useState(false);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const [friends, setFriends] = useState<any>([]);

  const [sosFriends, setSosFriends] = useState<any>([]);

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

  const searchFriendPrevious = async () => {

    if (offset === 0) {
      return;
    }

    setOffset(offset - limit);

    const fetchFriends = async () => {
      const response = await fetch('/api/account/friend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: offset,
            limit: limit
          })
        }
      );
      const data = await response.json();

      console.log("Data:", data);
      setFriends(data.elements);
    };

    fetchFriends();
  }

  const searchFriendNext = async () => {
    setOffset(offset + limit);

    const fetchFriends = async () => {
      const response = await fetch('/api/account/friend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            offset: offset,
            limit: limit
          })
        }
      );
      const data = await response.json();
      console.log("Data:", data);
      setFriends(data.elements);
    };

    fetchFriends();
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = JSON.stringify({
      gas_level: parseFloat(gasLevel),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      receiver_uuids: [sosFriends]
    });
    const response = await fetch('/api/sos/friend', {
      body: data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await response.json();

    console.log("Result:", result);
  };

  return (
    <div className='h-full overflow-y-scroll'>
      <Map
        id='map'
        className='mx-auto'
        center={{ lat: latitude, lng: longitude }}
        style={{ width: "500px", height: "360px", }}
      >
        <MapMarker position={{ lat: latitude, lng: longitude }}>
          <div style={{ color: "#000" }}>SOS</div>
        </MapMarker>
      </Map>
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
            disabled
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
        <button
          onClick={connectToESP32}
          className="bg-blue-500 text-white mt-auto px-4 py-2 rounded mb-4"
        >
          Connect to ESP32
        </button>

        <div className="flex flex-col gap-2">
          <button onClick={() => setFriendAccordion((p) => !p)} className="text-xl font-bold">Friends Accordion</button>
          {friendAccordion && <>
            <button onClick={searchFriendPrevious}>
              Previous
            </button>
            <button onClick={searchFriendNext}>
              Next
            </button>
            {friends.map((friend: any) => (
              <div key={friend.id} className="flex flex-col gap-1">
                <h3>{friend.profile_nickname}</h3>
                <p>{friend.uuid}</p>
                <button
                  onClick={() => setSosFriends([...sosFriends, friend.uuid])}
                  className="bg-slate-600 text-white px-4 py-2 rounded"
                >
                  Be SOS Friend
                </button>
              </div>
            ))}
          </>}

        </div>
      </div>
    </div>
  );
}