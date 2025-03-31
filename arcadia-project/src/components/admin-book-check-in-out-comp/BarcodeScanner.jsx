import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSnapshotTaken, setIsSnapshotTaken] = useState(false);
  const [snapshotURL, setSnapshotURL] = useState(""); // Stores the snapshot image

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const takeSnapshot = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    // Set fixed dimensions (same as video)
    const WIDTH = 640;
    const HEIGHT = 480;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  
    // Capture frame from video
    context.drawImage(videoRef.current, 0, 0, WIDTH, HEIGHT);
  
    // Convert to Image URL
    const imageDataURL = canvas.toDataURL("image/png");
    setSnapshotURL(imageDataURL);
    setIsSnapshotTaken(true);
    setIsCameraActive(false);

    decodeBarcode(imageDataURL);
  };
  

  const decodeBarcode = async (imageSrc) => {
    console.log("Decoding barcode...");

    try {
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeFromImage(undefined, imageSrc);

      console.log("Barcode result:", result.text);
      onScan(result.text);
    } catch (err) {
      console.warn("Barcode decoding failed:", err);
    }
  };

  const retakePhoto = () => {
    setIsSnapshotTaken(false);
    setIsCameraActive(true);
    setSnapshotURL("");
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Camera or Snapshot */}
      {isSnapshotTaken && snapshotURL ? (
        <img src={snapshotURL} className="w-[640px] h-[480px] rounded-lg object-cover" alt="Snapshot preview" />
      ) : isCameraActive ? (
        <video ref={videoRef} autoPlay playsInline className="w-[640px] h-[480px] rounded-lg object-cover"></video>
      ) : (
        <div className="w-[640px] h-[480px] bg-grey rounded-lg flex items-center justify-center">
          <p className="text-black">Camera is off</p>
        </div>
      )}


      {/* Action Buttons */}
      {!isSnapshotTaken ? (
        isCameraActive ? (
          <button
            onClick={takeSnapshot}
            className="px-3 py-1 text-arcadia-red bg-white bg-opacity-50 rounded-lg border border-arcadia-red hover:bg-arcadia-red hover:text-white transition absolute top-3/4"
          >
            Take Snapshot
          </button>
        ) : (
          <button
            onClick={() => setIsCameraActive(true)}
            className="px-3 py-1 text-black rounded-lg border hover:bg-dark-grey hover:border-dark-grey hover:text-white transition absolute top-3/4"
          >
            Open Camera
          </button>
        )
      ) : (
        <button
          onClick={retakePhoto}
          className="px-3 py-1 text-arcadia-red bg-white bg-opacity-50 rounded-lg border border-arcadia-red hover:bg-arcadia-red hover:text-white transition absolute top-3/4"
          >
          Retake Photo
        </button>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>

    </div>
  );
};

export default BarcodeScanner;
