import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Fingerprint } from 'lucide-react';

interface BiometricCaptureProps {
  onCapture: (data: string) => void;
  type: 'face' | 'fingerprint';
}

const BiometricCapture: React.FC<BiometricCaptureProps> = ({ onCapture, type }) => {
  const [capturing, setCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    setCapturing(true);
    
    // Simulate biometric processing
    setTimeout(() => {
      if (type === 'face' && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          onCapture(imageSrc);
        }
      } else if (type === 'fingerprint') {
        // Simulate fingerprint capture with a placeholder data
        const fingerprintData = `fingerprint-${Date.now()}`;
        onCapture(fingerprintData);
      }
      
      setCapturing(false);
    }, 2000);
  }, [onCapture, type]);

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">
        {type === 'face' ? 'Facial Recognition' : 'Fingerprint Scan'}
      </h3>
      
      <div className="flex flex-col items-center justify-center">
        {type === 'face' ? (
          // Face recognition
          <>
            {capturedImage ? (
              <div className="relative w-full max-w-md h-64 bg-neutral-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={capturedImage} 
                  alt="Captured face" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-md h-64 bg-neutral-100 rounded-lg overflow-hidden mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "user"
                  }}
                  className="w-full h-full object-cover"
                />
                {capturing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-lg animate-pulse">Processing...</div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => {
                setCapturedImage(null);
                handleCapture();
              }}
              disabled={capturing}
              className="btn-primary flex items-center mt-4"
            >
              <Camera className="mr-2 h-5 w-5" />
              {capturedImage ? 'Retake Photo' : 'Capture Face'}
            </button>
          </>
        ) : (
          // Fingerprint scan
          <>
            <div className="w-48 h-48 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
              <Fingerprint 
                className={`h-24 w-24 text-primary-600 ${capturing ? 'animate-pulse-slow' : ''}`} 
              />
            </div>
            
            <button
              onClick={handleCapture}
              disabled={capturing}
              className="btn-primary flex items-center mt-4"
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              {capturing ? 'Scanning...' : 'Scan Fingerprint'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BiometricCapture;