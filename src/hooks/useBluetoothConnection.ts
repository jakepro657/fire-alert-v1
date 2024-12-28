import { useState } from "react";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function useBluetoothConnection() {
  const [device, setDevice] = useState(null);
  const [gasLevel, setGasLevel] = useState(0);

  const connectToESP32 = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ name: "ESP32_Gas_Sensor" }],
        optionalServices: [SERVICE_UUID],
        acceptAllDevices: true,
      });

      setDevice(device);

      const server = await device.gatt.connect(); // Connect to the device
      const service = await server.getPrimaryService(SERVICE_UUID); // Get the service
      const characteristic = await service.getCharacteristic(
        // Get the characteristic (data)
        CHARACTERISTIC_UUID
      );

      const value = await characteristic.readValue(); // Read the value
      const dataView = new DataView(value.buffer); // Convert the value to a DataView
      const gasLevel = dataView.getInt32(0, true); // Get the integer value
      setGasLevel(gasLevel);
      console.log("Received integer value:", gasLevel);
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
    }
  };

  return { connectToESP32, gasLevel };
}
