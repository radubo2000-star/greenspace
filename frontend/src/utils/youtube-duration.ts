/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get video duration using YouTube IFrame Player API
 */
export const getVideoDuration = async (videoId: string): Promise<string | null> => {
  console.log('🎥 [getVideoDuration] Starting for videoId:', videoId);

  try {
    // Load YouTube IFrame API if not already loaded
    if (!(window as any).YT) {
      console.log('📦 [getVideoDuration] Loading YouTube IFrame API...');
      await loadYouTubeAPI();
    }

    // Create player and get duration
    const duration = await createPlayerAndGetDuration(videoId);
    
    if (duration && duration > 0) {
      const formatted = formatDuration(duration);
      console.log('✅ [getVideoDuration] Success:', formatted);
      return formatted;
    }

    console.log('❌ [getVideoDuration] Invalid duration:', duration);
    return null;
  } catch (error) {
    console.error('❌ [getVideoDuration] Error:', error);
    return null;
  }
};

/**
 * Load YouTube IFrame API
 */
const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      resolve();
      return;
    }

    // Set up callback
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('✅ [loadYouTubeAPI] API loaded');
      resolve();
    };

    // Load script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = () => reject(new Error('Failed to load YouTube API'));
    
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!(window as any).YT) {
        reject(new Error('YouTube API load timeout'));
      }
    }, 10000);
  });
};

/**
 * Create a hidden YouTube player and get video duration
 */
const createPlayerAndGetDuration = (videoId: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '1px';
    container.style.height = '1px';
    container.id = `yt-player-${videoId}-${Date.now()}`;
    document.body.appendChild(container);

    console.log('🎮 [createPlayerAndGetDuration] Creating player for:', videoId);

    let player: any = null;
    let resolved = false;

    // Timeout
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.log('⏰ [createPlayerAndGetDuration] Timeout');
        cleanup();
        reject(new Error('Timeout'));
      }
    }, 15000);

    const cleanup = () => {
      clearTimeout(timeout);
      if (player && player.destroy) {
        try {
          player.destroy();
        } catch (e) {
          console.warn('⚠️ [cleanup] Error destroying player:', e);
        }
      }
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    };

    try {
      player = new (window as any).YT.Player(container.id, {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: (event: any) => {
            console.log('✅ [createPlayerAndGetDuration] Player ready');
            try {
              const duration = event.target.getDuration();
              console.log('⏱️ [createPlayerAndGetDuration] Duration:', duration);
              
              if (!resolved) {
                resolved = true;
                cleanup();
                resolve(duration);
              }
            } catch (error) {
              console.error('❌ [createPlayerAndGetDuration] Error getting duration:', error);
              if (!resolved) {
                resolved = true;
                cleanup();
                reject(error);
              }
            }
          },
          onError: (event: any) => {
            console.error('❌ [createPlayerAndGetDuration] Player error:', event.data);
            if (!resolved) {
              resolved = true;
              cleanup();
              reject(new Error(`YouTube player error: ${event.data}`));
            }
          },
        },
      });
    } catch (error) {
      console.error('❌ [createPlayerAndGetDuration] Error creating player:', error);
      cleanup();
      reject(error);
    }
  });
};
