import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import introImg from '../assets/into img.png';
import introVideoUrl from '../assets/AIDA intro.mp4';

const TOTAL_KNOWN_BYTES = 2672652; // ~2.67 MB

export default function IntroVideo() {
  const [isDesktop, setIsDesktop] = useState(false);
  // status: 'initial' | 'downloading' | 'downloaded' | 'playing' | 'completed'
  const [status, setStatus] = useState('initial');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(TOTAL_KNOWN_BYTES);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const videoRef = useRef(null);
  const xhrRef = useRef(null);

  // Check if PC view (min-width: 768px)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Strict scroll locking: ONLY enabled once status reaches 'completed' (Hero section)
  useEffect(() => {
    if (isDesktop && status !== 'completed') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isDesktop, status]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
      }
      if (xhrRef.current) {
        xhrRef.current.abort();
      }
    };
  }, [videoBlobUrl]);

  // Reliable play trigger once video element is rendered in DOM
  useEffect(() => {
    if (status === 'playing' && videoRef.current) {
      if (videoBlobUrl) {
        videoRef.current.src = videoBlobUrl;
      }
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => console.log('Video play error:', err));
    }
  }, [status, videoBlobUrl]);

  // If mobile or completed, do not render anything
  if (!isDesktop || status === 'completed') {
    return null;
  }

  const handleStartDownload = (e) => {
    e.stopPropagation();
    if (status !== 'initial') return;

    setStatus('downloading');
    setDownloadProgress(0);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open('GET', introVideoUrl, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      let total = event.total && event.total > 0 ? event.total : TOTAL_KNOWN_BYTES;
      let loaded = event.loaded;
      let percent = Math.min(100, Math.round((loaded / total) * 100));

      setLoadedBytes(loaded);
      setTotalBytes(total);
      setDownloadProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 0) {
        const blob = xhr.response;
        const blobUrl = URL.createObjectURL(blob);
        setVideoBlobUrl(blobUrl);
        setDownloadProgress(100);

        // Preload complete in memory; transition to downloaded (no file saving to disk)
        setTimeout(() => {
          setStatus('downloaded');
        }, 300);
      } else {
        setVideoBlobUrl(introVideoUrl);
        setDownloadProgress(100);
        setStatus('downloaded');
      }
    };

    xhr.onerror = () => {
      // Fallback on network error
      setVideoBlobUrl(introVideoUrl);
      setDownloadProgress(100);
      setStatus('downloaded');
    };

    xhr.send();
  };

  const handleScreenClick = () => {
    if (status === 'downloaded') {
      setStatus('playing');
    }
  };

  // Monitor time update to gradually fade out during the last 1 second of video
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;

    if (duration > 0 && !isNaN(duration)) {
      const timeLeft = duration - currentTime;
      if (timeLeft <= 1.0) {
        // Linear fade from 1.0 down to 0.0 during the last 1 second
        const opacity = Math.max(0, timeLeft / 1.0);
        setFadeOpacity(opacity);
      } else {
        setFadeOpacity(1);
      }
    }
  };

  const handleVideoEnded = () => {
    setFadeOpacity(0);
    setStatus('completed');
  };

  const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

  return (
    <div
      onClick={handleScreenClick}
      style={{ opacity: status === 'playing' ? fadeOpacity : status === 'completed' ? 0 : 1 }}
      className={`fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center select-none overflow-hidden transition-opacity duration-300 ease-linear ${
        status === 'completed' ? 'pointer-events-none' : ''
      }`}
    >
      {/* Background Content: Initial Image vs Video */}
      <div className="absolute inset-0 w-full h-full">
        {status !== 'playing' ? (
          <img
            src={introImg}
            alt="Intro Preview"
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoBlobUrl || introVideoUrl}
            preload="auto"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Pure Video Experience: NO text overlays, NO buttons, NO writing over the video or preview */}

      {/* Bottom-Right Preload Button (Visible ONLY in initial & downloading states) */}
      {(status === 'initial' || status === 'downloading') && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            type="button"
            onClick={handleStartDownload}
            disabled={status === 'downloading'}
            className={`group relative overflow-hidden flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none backdrop-blur-xl ${
              status === 'downloading'
                ? 'bg-neutral-950/90 border-red-500/70 shadow-[0_0_30px_rgba(229,9,20,0.4)]'
                : 'bg-neutral-950/85 hover:bg-neutral-900 border-neutral-700/80 hover:border-red-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.15)] hover:shadow-[0_10px_40px_rgba(229,9,20,0.35)]'
            }`}
          >
            {/* Background Fill Progress Bar */}
            {status === 'downloading' && (
              <div
                className="absolute inset-0 bg-red-600/30 transition-all duration-200 ease-out"
                style={{ width: `${downloadProgress}%` }}
              />
            )}

            {/* Left Icon Area */}
            <div className="relative z-10 w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {status === 'downloading' ? (
                <Loader2 size={18} className="text-red-500 animate-spin" />
              ) : (
                <Download size={18} className="text-red-500 group-hover:translate-y-0.5 transition-transform" />
              )}
            </div>

            {/* Text & Detailed Progress Info */}
            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {status === 'downloading' ? `DOWNLOADING ${downloadProgress}%` : 'DOWNLOAD INTRO'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5 flex items-center gap-1.5">
                {status === 'downloading' ? (
                  <span>
                    {formatMB(loadedBytes)} / {formatMB(totalBytes)} MB
                  </span>
                ) : (
                  <span>AIDA intro.mp4 (2.67 MB)</span>
                )}
              </div>
            </div>

            {/* Minute Progress Percentage Badge */}
            {status === 'downloading' && (
              <div className="relative z-10 ml-2 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold tracking-tighter">
                {downloadProgress}%
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
