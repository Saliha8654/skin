import { useState, useRef } from 'react';
import { skinAnalysisAPI } from '../utils/api';
import ProductCard from './ProductCard';
import EmailCollector from './EmailCollector';

function SkinScanMode() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [products, setProducts] = useState([]);
  const [tips, setTips] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setProducts([]);
      setTips([]);
    }
  };

  // Open live camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera. Please allow camera permissions or use Upload Photo option.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        closeCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  // Close camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const response = await skinAnalysisAPI.analyze(selectedImage);
      
      setAnalysis(response.analysis);
      setProducts(response.products || []);
      setTips(response.tips || []);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setProducts([]);
    setTips([]);
    closeCamera();
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Camera View */}
      {isCameraOpen ? (
        <div className="p-6">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-primary mb-2">Take Your Photo</h3>
              <p className="text-sm text-gray-600">Position your face in the center</p>
            </div>
            
            {/* Live Camera Feed */}
            <div className="relative bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Camera Controls */}
            <div className="flex gap-3">
              <button
                onClick={capturePhoto}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{
                  borderColor: '#0c2e4d',
                  borderWidth: '3px',
                  borderStyle: 'solid'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capture Photo
              </button>
              <button
                onClick={closeCamera}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
                style={{
                  borderColor: '#0c2e4d',
                  borderWidth: '3px',
                  borderStyle: 'solid'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : !analysis ? (
        <div className="p-6">
          {/* Upload Section */}
          {!previewUrl ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-primary mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Scan Your Skin</h3>
                <p className="text-sm text-gray-600">Upload or take a photo for AI analysis</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white border-2 border-primary text-primary p-4 rounded-xl flex items-center justify-center gap-3"
                  style={{
                    borderColor: '#0c2e4d',
                    borderWidth: '3px',
                    borderStyle: 'solid'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Upload Photo</span>
                </button>

                <button
                  onClick={openCamera}
                  className="w-full bg-primary text-white p-4 rounded-xl font-medium flex items-center justify-center gap-3"
                  style={{
                    borderColor: '#0c2e4d',
                    borderWidth: '3px',
                    borderStyle: 'solid'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Take Photo</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  📸 For best results, take a clear, well-lit photo of your face without makeup
                </p>
              </div>
            </div>
          ) : (
            /* Preview & Analyze */
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: '#0c2e4d',
                    borderWidth: '3px',
                    borderStyle: 'solid'
                  }}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Skin'
                  )}
                </button>
                <button
                  onClick={resetScan}
                  disabled={isAnalyzing}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
                  style={{
                    borderColor: '#0c2e4d',
                    borderWidth: '3px',
                    borderStyle: 'solid'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Analysis Results */
        <div className="p-6 space-y-6">
          {/* Analysis Summary */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Your Skin Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Skin Type:</span>
                <span className="font-semibold capitalize">{analysis.skinType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Confidence:</span>
                <span className="font-semibold">{analysis.confidence}%</span>
              </div>
              {analysis.concerns && analysis.concerns.length > 0 && (
                <div>
                  <span className="text-secondary">Concerns:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysis.concerns.map((concern, idx) => (
                      <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skincare Tips */}
          {tips.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-3">💡 Skincare Tips:</h4>
              <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
                {tips.map((tip, idx) => (
                  <p key={idx} className="text-sm text-gray-700">{tip}</p>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-3">✨ Recommended Products:</h4>
              <div className="space-y-3">
                {products.map((product, idx) => (
                  <ProductCard key={idx} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Email Collector */}
          <EmailCollector preferences={{ skinType: analysis.skinType, concerns: analysis.concerns }} />

          {/* Rescan Button */}
          <button
            onClick={resetScan}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
            style={{
              borderColor: '#0c2e4d',
              borderWidth: '3px',
              borderStyle: 'solid'
            }}
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SkinScanMode;
