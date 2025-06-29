import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2, 
  X,
  Info,
  Settings,
  Maximize,
  RotateCw
} from 'lucide-react';

interface ARViewProps {
  productId: string;
  productName: string;
  productImage: string;
  isOpen: boolean;
  onClose: () => void;
}

const ARViewComponent: React.FC<ARViewProps> = ({
  productId,
  productName,
  productImage,
  isOpen,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [roomType, setRoomType] = useState('living-room');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const roomBackgrounds = {
    'living-room': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'bedroom': 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'dining': 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'office': 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1920'
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setTimeout(() => setIsLoading(false), 2000);
    } catch (error) {
      console.error('Camera access denied:', error);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Add product overlay
        const productImg = new Image();
        productImg.onload = () => {
          const productWidth = (canvas.width * scale) / 4;
          const productHeight = (productImg.height * productWidth) / productImg.width;
          const x = (position.x / 100) * canvas.width - productWidth / 2;
          const y = (position.y / 100) * canvas.height - productHeight / 2;
          
          ctx.save();
          ctx.translate(x + productWidth / 2, y + productHeight / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.drawImage(productImg, -productWidth / 2, -productHeight / 2, productWidth, productHeight);
          ctx.restore();
          
          // Download the image
          const link = document.createElement('a');
          link.download = `${productName}-ar-view.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        productImg.src = productImage;
      }
    }
  };

  const resetPosition = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 50, y: 50 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">AR View</h2>
              <p className="text-gray-300 text-sm">{productName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main AR View */}
      <div className="flex-1 relative overflow-hidden">
        {/* Camera Feed or Room Background */}
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Initializing AR Camera...</p>
              <p className="text-gray-400 text-sm mt-2">Please allow camera access</p>
            </div>
          </div>
        ) : (
          <>
            {/* Fallback Room Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${roomBackgrounds[roomType]})` }}
            />
            
            {/* Camera Video (if available) */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />

            {/* Product Overlay */}
            <div
              className="absolute cursor-move"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={productImage}
                alt={productName}
                className="w-48 h-auto drop-shadow-2xl pointer-events-none"
                draggable={false}
              />
              
              {/* Product Info Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                {productName}
              </div>
            </div>
          </>
        )}

        {/* Hidden Canvas for Photo Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      {showControls && !isLoading && (
        <div className="relative z-10 bg-black/80 backdrop-blur-sm p-4">
          {/* Room Selection */}
          <div className="mb-4">
            <p className="text-white text-sm mb-2">Room Type:</p>
            <div className="flex space-x-2">
              {Object.entries(roomBackgrounds).map(([key, _]) => (
                <button
                  key={key}
                  onClick={() => setRoomType(key)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                    roomType === key 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {key.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Scale Controls */}
            <div className="space-y-2">
              <p className="text-white text-xs">Size</p>
              <div className="flex space-x-1">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  className="flex-1 bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ZoomOut className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  className="flex-1 bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ZoomIn className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-2">
              <p className="text-white text-xs">Rotate</p>
              <div className="flex space-x-1">
                <button
                  onClick={() => setRotation(rotation - 15)}
                  className="flex-1 bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setRotation(rotation + 15)}
                  className="flex-1 bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <RotateCw className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Reset */}
            <div className="space-y-2">
              <p className="text-white text-xs">Reset</p>
              <button
                onClick={resetPosition}
                className="w-full bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mx-auto" />
              </button>
            </div>

            {/* Capture */}
            <div className="space-y-2">
              <p className="text-white text-xs">Capture</p>
              <button
                onClick={capturePhoto}
                className="w-full bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Download className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-white text-xs">
                <p className="font-semibold mb-1">How to use AR View:</p>
                <ul className="space-y-1 text-gray-300">
                  <li>• Drag the furniture to move it around</li>
                  <li>• Use size controls to scale the furniture</li>
                  <li>• Rotate to find the perfect angle</li>
                  <li>• Capture and save your AR view</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARViewComponent;
