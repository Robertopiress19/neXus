import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XMarkIcon, VideoCameraIcon } from './Icons';

interface LibrasRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (videoBlob: Blob) => void;
}

const LibrasRecordingModal: React.FC<LibrasRecordingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const setupCamera = useCallback(async () => {
    if (stream) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      setError("Não foi possível acessar a câmera. Por favor, verifique as permissões do seu navegador.");
    }
  }, [stream]);

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      setupCamera();
    } else {
      cleanupCamera();
      setRecordedBlob(null);
      setIsRecording(false);
    }
    
  }, [isOpen]);

  const handleStartRecording = () => {
    if (!stream) return;
    setRecordedBlob(null);
    recordedChunksRef.current = [];
    
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      onSubmit(recordedBlob);
    }
  };
  
  const handleReset = () => {
      setRecordedBlob(null);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="libras-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 id="libras-modal-title" className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <VideoCameraIcon className="w-6 h-6 text-purple-600"/>
            Abrir Chamado em Libras
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100" aria-label="Fechar modal">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative">
                <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${recordedBlob ? 'hidden' : 'block'}`}></video>
                {recordedBlob && (
                    <video src={URL.createObjectURL(recordedBlob)} controls className="w-full h-full object-cover"></video>
                )}
                {isRecording && <div className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>}
            </div>
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
            <p className="text-sm text-slate-500 mt-3 text-center">Posicione-se em frente à câmera e grave um vídeo curto descrevendo seu problema.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-slate-50 rounded-b-xl">
            {!recordedBlob ? (
                 <button 
                    onClick={isRecording ? handleStopRecording : handleStartRecording} 
                    disabled={!!error}
                    className={`w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors disabled:bg-slate-400 ${
                        isRecording ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500' : 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500'
                    }`}
                >
                    {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
                </button>
            ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleReset} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-md">Gravar Novamente</button>
                    <button onClick={handleSubmit} className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md">Enviar Vídeo</button>
                </div>
            )}
            <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-md">
                Cancelar
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default LibrasRecordingModal;
