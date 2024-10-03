// app/page.js
'use client';

import { useEffect, useState } from 'react';
import { useBluetoothConnection } from '../hooks/useBluetoothConnection';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const [gasLevel, setGasLevel] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { connectToESP32, gasLevel: gl } = useBluetoothConnection();

  const { data, status } = useSession();


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


  const handleSubmit = async (e) => {
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

  const login = async () => {
    await signIn('kakao', {
      callbackUrl: `http://${process.env.NEXT_PUBLIC_REDIRECT_URI}/api/auth/callback/kakao`
    })
    // const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI as string)}&response_type=code`;
    // window.location.href = s?.url as string;
    // window.location.href = kakaoAuthUrl;
  }

  const logout = async () => {
    await signOut()
  }

  const report = async () => {

    console.log(data?.user)

    const response = await fetch('/api/sos', {
      body: JSON.stringify({
        userId: data?.user?.id
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await response.json()

    console.log(result)
  }

  const update = async () => {
    const response = await fetch('/api/account')

    const result = await response.json()

    console.log(result)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gas Sensor and GPS Data Collection</h1>
      <button
        onClick={connectToESP32}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Connect to ESP32
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Send Data
        </button>
      </form>
      <div className='mt-2'>
        {status == "authenticated" ? <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          로그아웃
        </button> : <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          카카오로 로그인
        </button>
        }
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={report}
      >
        테스트 신고
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={update}
      >
        동의 갱신
      </button>
    </div>
  );
}