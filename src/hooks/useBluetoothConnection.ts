import { useState } from "react";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function useBluetoothConnection() {
  const [device, setDevice] = useState(null);
  const [gasLevel, setGasLevel] = useState(0);

  const connectToESP32 = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ESP32_Gas_Sensor" }],
        optionalServices: [SERVICE_UUID],
        // acceptAllDevices: true,
      });

      setDevice(device);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(
        CHARACTERISTIC_UUID
      );

      const value = await characteristic.readValue();
      const dataView = new DataView(value.buffer);
      const gasLevel = dataView.getInt32(0, true);
      setGasLevel(gasLevel);
      console.log("Received integer value:", gasLevel);
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
    }
  };

  return { connectToESP32, gasLevel };
}
