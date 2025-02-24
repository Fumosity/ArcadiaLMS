import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    // Set scanning format to CODE_39
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39]);
    codeReader.current.hints = hints;

    const startScanner = async () => {
      try {
        const videoInputDevices = await codeReader.current.getVideoInputDevices();
        console.log("Video devices:", videoInputDevices);

        if (videoInputDevices.length === 0) {
          console.warn("No video input devices found.");
          return;
        }

        const firstDeviceId = videoInputDevices[0].deviceId;
        console.log("Using device:", firstDeviceId);

        const constraints = {
          video: {
            deviceId: firstDeviceId ? { exact: firstDeviceId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        codeReader.current.decodeFromVideoDevice(
          firstDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              console.log("CODE_39 barcode detected:", result.text);
              alert(`Scanned CODE_39 barcode: ${result.text}`);
            }
            if (err && err.name !== "NotFoundException") {
              console.warn("Scan error:", err);
            }
          }
        );
      } catch (error) {
        console.error("Error initializing scanner:", error);
      }
    };

    startScanner();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
      <h2>CODE_39 Barcode Scanner</h2>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Video Feed */}
        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: "10px" }}></video>

        {/* Scanning Box Overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "250px",
            height: "100px",
            border: "4px solid red",
            transform: "translate(-50%, -50%)",
            boxShadow: "0px 0px 15px rgba(255, 0, 0, 0.5)",
            zIndex: 2,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
