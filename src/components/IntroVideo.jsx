import React, { useState, useEffect, useRef } from 'react';
import { Download, Loader2, X, Volume2, VolumeX } from 'lucide-react';
import introImg from '../assets/into img.png';
import introVideo1Url from '../assets/AIDA intro.mp4';
import introVideo2Url from '../assets/AIDA intro 2.mp4';

const VIDEO_1_BYTES = 2672652; // ~2.67 MB
const VIDEO_2_BYTES = 8423929; // ~8.42 MB

export default function IntroVideo() {
  const [isDesktop, setIsDesktop] = useState(false);
  // status: 'initial' | 'downloading' | 'downloaded' | 'playing' | 'completed'
  const [status, setStatus] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('aida_intro_seen') === 'true') {
      return 'completed';
    }
    return 'initial';
  });
  const [selectedVideo, setSelectedVideo] = useState(1); // 1 or 2
  const [activeDownloading, setActiveDownloading] = useState(null); // 1 or 2
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(VIDEO_1_BYTES);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const videoRef = useRef(null);
  const xhrRef = useRef(null);

  // Store in sessionStorage and notify app when intro completes
  useEffect(() => {
    if (status === 'completed' && typeof window !== 'undefined') {
      sessionStorage.setItem('aida_intro_seen', 'true');
      window.dispatchEvent(new CustomEvent('intro-video-finished'));
    }
  }, [status]);

  // Check if PC view (min-width: 768px)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Strict scroll locking and intro-active class: ONLY enabled once status reaches 'completed'
  useEffect(() => {
    if (isDesktop && status !== 'completed') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('intro-active');
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('intro-active');
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('intro-active');
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
      const targetUrl = videoBlobUrl || (selectedVideo === 2 ? introVideo2Url : introVideo1Url);
      videoRef.current.src = targetUrl;
      
      // Video 2 has sound audio track -> play sound automatically (muted = false)
      if (selectedVideo === 2) {
        videoRef.current.muted = false;
      } else {
        videoRef.current.muted = false; // allow audio if present
      }

      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.log('Video play error:', err);
        // Fallback for strict browser autoplay policies
        if (videoRef.current && selectedVideo === 2) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [status, videoBlobUrl, selectedVideo]);

  // If mobile or completed, do not render anything
  if (!isDesktop || status === 'completed') {
    return null;
  }

  const handleStartDownload = (e, videoChoice) => {
    e.stopPropagation();
    if (status !== 'initial') return;

    setSelectedVideo(videoChoice);
    setActiveDownloading(videoChoice);
    setStatus('downloading');
    setDownloadProgress(0);

    const targetUrl = videoChoice === 2 ? introVideo2Url : introVideo1Url;
    const knownBytes = videoChoice === 2 ? VIDEO_2_BYTES : VIDEO_1_BYTES;

    setTotalBytes(knownBytes);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open('GET', targetUrl, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      let total = event.total && event.total > 0 ? event.total : knownBytes;
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

        setTimeout(() => {
          setStatus('downloaded');
          // Automatically play after download completes
          setStatus('playing');
        }, 300);
      } else {
        setVideoBlobUrl(targetUrl);
        setDownloadProgress(100);
        setStatus('playing');
      }
    };

    xhr.onerror = () => {
      setVideoBlobUrl(targetUrl);
      setDownloadProgress(100);
      setStatus('playing');
    };

    xhr.send();
  };

  const handleScreenClick = () => {
    if (status === 'downloaded') {
      setStatus('playing');
    }
  };

  // Monitor time update to gradually fade out volume & opacity during the last 1.5 seconds of video
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;

    if (duration > 0 && !isNaN(duration)) {
      const timeLeft = duration - currentTime;
      if (timeLeft <= 1.5) {
        const ratio = Math.max(0, timeLeft / 1.5);
        setFadeOpacity(ratio);
        try {
          videoRef.current.volume = Math.max(0, Math.min(1, ratio));
        } catch (e) {
          // Ignore volume setting errors
        }
      } else {
        setFadeOpacity(1);
        try {
          videoRef.current.volume = 1;
        } catch (e) {}
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
      {/* Background Content: Initial Preview Image vs Active Playing Video */}
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
            src={videoBlobUrl || (selectedVideo === 2 ? introVideo2Url : introVideo1Url)}
            preload="auto"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Top-Right Skip/Close Icon Button (Visible ONLY before video starts playing) */}
      {status !== 'playing' && status !== 'completed' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (xhrRef.current) xhrRef.current.abort();
            setStatus('completed');
          }}
          aria-label="Close intro video"
          className="fixed top-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center bg-neutral-950/80 border border-red-900/50 hover:border-red-500 text-white hover:text-red-500 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      )}

      {/* Bottom-Right 2 Stacked Download Buttons (One below the other) */}
      {(status === 'initial' || status === 'downloading') && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
          {/* Button 1: Intro Video 1 (Standard / No Audio) */}
          <button
            type="button"
            onClick={(e) => handleStartDownload(e, 1)}
            disabled={status === 'downloading'}
            className={`group relative overflow-hidden flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none backdrop-blur-xl w-72 sm:w-80 ${
              activeDownloading === 1
                ? 'bg-neutral-950/90 border-red-500/70 shadow-[0_0_30px_rgba(229,9,20,0.4)]'
                : 'bg-neutral-950/85 hover:bg-neutral-900 border-neutral-700/80 hover:border-red-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.15)] hover:shadow-[0_10px_40px_rgba(229,9,20,0.35)]'
            } ${status === 'downloading' && activeDownloading !== 1 ? 'opacity-40 pointer-events-none' : ''}`}
          >
            {/* Background Fill Progress Bar */}
            {activeDownloading === 1 && (
              <div
                className="absolute inset-0 bg-red-600/30 transition-all duration-200 ease-out"
                style={{ width: `${downloadProgress}%` }}
              />
            )}

            {/* Left Icon Area */}
            <div className="relative z-10 w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {activeDownloading === 1 ? (
                <Loader2 size={18} className="text-red-500 animate-spin" />
              ) : (
                <VolumeX size={18} className="text-red-500 group-hover:translate-y-0.5 transition-transform" />
              )}
            </div>

            {/* Text & Detailed Progress Info */}
            <div className="relative z-10 text-left flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {activeDownloading === 1 ? `DOWNLOADING ${downloadProgress}%` : 'DOWNLOAD INTRO 1'}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">NO SOUND</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {activeDownloading === 1 ? (
                  <span>
                    {formatMB(loadedBytes)} / {formatMB(totalBytes)} MB
                  </span>
                ) : (
                  <span>AIDA intro.mp4 (2.67 MB)</span>
                )}
              </div>
            </div>
          </button>

          {/* Button 2: Intro Video 2 (With Sound Audio Track) */}
          <button
            type="button"
            onClick={(e) => handleStartDownload(e, 2)}
            disabled={status === 'downloading'}
            className={`group relative overflow-hidden flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none backdrop-blur-xl w-72 sm:w-80 ${
              activeDownloading === 2
                ? 'bg-neutral-950/90 border-red-500/70 shadow-[0_0_30px_rgba(229,9,20,0.4)]'
                : 'bg-neutral-950/85 hover:bg-neutral-900 border-neutral-700/80 hover:border-red-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.15)] hover:shadow-[0_10px_40px_rgba(229,9,20,0.35)]'
            } ${status === 'downloading' && activeDownloading !== 2 ? 'opacity-40 pointer-events-none' : ''}`}
          >
            {/* Background Fill Progress Bar */}
            {activeDownloading === 2 && (
              <div
                className="absolute inset-0 bg-red-600/30 transition-all duration-200 ease-out"
                style={{ width: `${downloadProgress}%` }}
              />
            )}

            {/* Left Icon Area */}
            <div className="relative z-10 w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {activeDownloading === 2 ? (
                <Loader2 size={18} className="text-red-500 animate-spin" />
              ) : (
                <Volume2 size={18} className="text-red-500 group-hover:translate-y-0.5 transition-transform" />
              )}
            </div>

            {/* Text & Detailed Progress Info */}
            <div className="relative z-10 text-left flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {activeDownloading === 2 ? `DOWNLOADING ${downloadProgress}%` : 'DOWNLOAD INTRO 2'}
                </span>
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase">★ WITH SOUND</span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {activeDownloading === 2 ? (
                  <span>
                    {formatMB(loadedBytes)} / {formatMB(totalBytes)} MB
                  </span>
                ) : (
                  <span>AIDA intro 2.mp4 (8.42 MB)</span>
                )}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
