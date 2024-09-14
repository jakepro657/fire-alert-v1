// app/api/data/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { gas_level, latitude, longitude } = await request.json();

  console.log(
    `Received data: Gas Level: ${gas_level}, Lat: ${latitude}, Long: ${longitude}`
  );

  if (gas_level > 100) {
    try {
      await sendSOSMessage(latitude, longitude);
      return NextResponse.json(
        { message: "SOS sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending SOS:", error);
      return NextResponse.json(
        { error: "Failed to send SOS" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Data received, no SOS needed" },
      { status: 200 }
    );
  }
}

async function sendSOSMessage(latitude, longitude) {
  console.log(`Sending SOS to 119 for location: ${latitude}, ${longitude}`);
  // Simulated API call to emergency services
  // In a real-world scenario, you'd implement the actual API call here
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call delay
  console.log("SOS message sent successfully");
}
