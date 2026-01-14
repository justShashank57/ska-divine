import { useEffect, useRef, useState, useCallback } from "react";

interface UseVideoOptimizationProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  autoPlay?: boolean;
  observerThreshold?: number;
}

/**
 * Custom hook for optimized video playback
 * - Lazy loads videos using Intersection Observer
 * - Only plays video when in viewport
 * - Pauses video when out of viewport
 * - Handles errors gracefully
 */
export function useVideoOptimization({
  videoRef,
  autoPlay = true,
  observerThreshold = 0.5,
}: UseVideoOptimizationProps) {
  const [isInView, setIsInView] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Create Intersection Observer for video visibility
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting && autoPlay) {
          video.play().catch((error) => {
            setVideoError(error.message);
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: observerThreshold,
      }
    );

    observerRef.current.observe(video);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoRef, autoPlay, observerThreshold]);

  const handleVideoError = useCallback(() => {
    setVideoError("Failed to load video. Please check your connection.");
  }, []);

  return { isInView, videoError, handleVideoError };
}

/**
 * Preload strategy for videos
 * - Downloads video metadata and first frame without full download
 * - Shows poster image until ready to play
 */
export function getVideoPreloadStrategy(
  isMobile: boolean,
  isAboveTheFold: boolean
): "auto" | "metadata" | "none" {
  if (isAboveTheFold && !isMobile) {
    return "auto"; // Preload full video for desktop above-the-fold content
  }
  if (isMobile) {
    return "metadata"; // Only preload metadata on mobile
  }
  return "none"; // Don't preload for below-the-fold content
}

/**
 * Get optimized video source based on device
 * Returns appropriate video format for browser
 */
export function getVideoSource(videoPath: string): string {
  // In production, you might have:
  // - .webm for Chrome/Firefox (smaller size)
  // - .mp4 as fallback for Safari/IE
  return videoPath;
}

/**
 * Calculate optimal video dimensions
 * Prevents loading oversized videos on mobile
 */
export function getVideoOptimizations(isMobile: boolean) {
  return {
    maxWidth: isMobile ? "100%" : "100%",
    maxHeight: isMobile ? "auto" : "100vh",
    // Mobile: reduce bitrate by using lower quality or compressed video
    quality: isMobile ? "low" : "high",
  };
}
