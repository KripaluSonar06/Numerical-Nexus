import { useEffect, useCallback, useRef } from 'react';

export const useButtonSound = (volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/click.mp3');
    audioRef.current.volume = volume;
  }, [volume]);

  const playClick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume * (0.9 + Math.random() * 0.2);
      audioRef.current.playbackRate = 0.9 + Math.random() * 0.2;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return playClick;
};
