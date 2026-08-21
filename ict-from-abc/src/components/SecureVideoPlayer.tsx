import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize2 } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SecureVideoPlayerProps {
  videoId: string;
  lessonId: string;
  userId?: string;
  onVideoStart?: () => void;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoId,
  lessonId,
  userId,
  onVideoStart,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube embed URL with privacy-enhanced mode and restrictions
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&enablejsapi=1&iv_load_policy=3&controls=1&autoplay=${isPlaying ? 1 : 0}`;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const recordView = async () => {
    if (!hasStarted && lessonId) {
      setHasStarted(true);
      
      try {
        const lessonRef = doc(db, 'lessons', lessonId);
        await updateDoc(lessonRef, {
          viewCount: increment(1),
        });

        // Record analytics in videoAnalytics collection
        if (userId) {
          const analyticsRef = doc(db, 'videoAnalytics', `${lessonId}_${userId}_${Date.now()}`);
          await updateDoc(analyticsRef, {
            lessonId,
            userId,
            watchedAt: new Date(),
          }).catch(() => {
            // Document might not exist, create it
          });
        }

        if (onVideoStart) {
          onVideoStart();
        }
      } catch (error) {
        console.error('Error recording video view:', error);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && !hasStarted) {
      recordView();
    }
  }, [isPlaying]);

  return (
    <div 
      ref={playerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
      onContextMenu={handleContextMenu}
    >
      {/* Transparent overlay to prevent clicking YouTube title/links */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-auto"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
      />
      
      {/* Video Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-4 bg-gradient-to-t from-black/80 to-transparent">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white hover:text-[#E63A12] transition-colors p-2"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <div className="flex items-center gap-3">
          <button className="text-white hover:text-[#E63A12] transition-colors p-2" aria-label="Volume">
            <Volume2 size={20} />
          </button>
          <button className="text-white hover:text-[#E63A12] transition-colors p-2" aria-label="Fullscreen">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Protected Iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Lesson Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        onLoad={() => {
          // Track when video loads
        }}
      />

      {/* Additional protection layer */}
      <style>{`
        iframe {
          pointer-events: auto;
        }
        .secure-video-container {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};
