import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Pause, Play, Loader2 } from "lucide-react";

interface ArticleNarratorProps {
  title: string;
  content: string;
  excerpt?: string | null;
}

export function ArticleNarrator({ title, content, excerpt }: ArticleNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Get API key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Clean markdown to plain text for narration
  const cleanMarkdown = (text: string): string => {
    return text
      // Remove markdown headers
      .replace(/#{1,6}\s+/g, '')
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove horizontal rules
      .replace(/---+/g, '')
      // Remove bullet points
      .replace(/^\s*[-*+]\s+/gm, '')
      // Remove numbered lists
      .replace(/^\s*\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n\n+/g, '\n\n')
      .trim();
  };

  // Create narrative summary of the article
  const createNarrative = (): string => {
    const cleanContent = cleanMarkdown(content);
    
    // Create a natural introduction
    let narrative = `Hello, I'm your wellness guide. Today, I'll be sharing insights about: ${title}. `;
    
    // Add excerpt if available
    if (excerpt) {
      narrative += `${excerpt}. `;
    }
    
    // Add a brief pause marker and introduction to main content
    narrative += `Let's dive into the key points. `;
    
    // Split content into sections and summarize
    const sections = cleanContent.split('\n\n').filter(s => s.trim().length > 0);
    
    sections.forEach((section, index) => {
      // Add natural transitions
      if (index > 0 && index < sections.length) {
        const transitions = [
          'Moving on, ',
          'Additionally, ',
          'Another important point: ',
          'Here\'s something interesting: ',
          'Furthermore, ',
          'It\'s also worth noting that ',
        ];
        narrative += transitions[index % transitions.length];
      }
      
      narrative += `${section.substring(0, 400)}. `;
    });
    
    // Add conclusion
    narrative += `I hope you found these insights valuable. Remember to consult with healthcare professionals for personalized advice. Thank you for listening!`;
    
    return narrative;
  };

  // Generate speech using Google Gemini TTS API
  const generateSpeech = async () => {
    if (!apiKey) {
      console.error("ArticleNarrator: Google API key not configured");
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const narrative = createNarrative();
      
      // Use Google Text-to-Speech API
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: narrative },
            voice: {
              languageCode: 'en-US',
              name: 'en-US-Journey-F', // Natural, warm female voice
              ssmlGender: 'FEMALE'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              pitch: 0,
              speakingRate: 0.95, // Slightly slower for clarity
              volumeGainDb: 0,
              effectsProfileId: ['headphone-class-device']
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ArticleNarrator: TTS API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate speech');
      }

      const data = await response.json();
      
      // Convert base64 audio to blob and create URL
      const audioData = atob(data.audioContent);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Clean up old audio URL if exists
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = audioUrl;

      // Create and configure audio element
      const audio = new Audio(audioUrl);
      audio.volume = isMuted ? 0 : 1;
      
      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = (e) => {
        console.error("ArticleNarrator: Audio playback error:", e);
        setHasError(true);
        setIsPlaying(false);
      };

      audioRef.current = audio;
      
      // Start playing
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error('ArticleNarrator: Failed to generate speech:', err);
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  // Handle play/pause
  const togglePlayback = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current && !isPlaying) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Generate new audio
      await generateSpeech();
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0;
    }
    setIsMuted(!isMuted);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  // Don't show if no API key or if there's an error
  if (!apiKey || hasError) {
    return null;
  }

  // Show button when not active, show sticky bar when active
  if (!isLoading && !isPlaying) {
    return (
      <motion.div
        className="max-w-[680px] mx-auto px-4 sm:px-6 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={togglePlayback}
          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">Listen to this article</div>
            <div className="text-xs opacity-90">Natural AI narration</div>
          </div>
          <Play className="w-5 h-5 flex-shrink-0" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="sticky top-20 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Narrator Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">
                Article Narrator
              </div>
              <div className="text-xs text-gray-500">
                {isPlaying ? "Playing..." : "Generating..."}
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayback}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              aria-label={isPlaying ? "Pause narration" : "Play narration"}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">
                {isLoading ? "Loading..." : isPlaying ? "Pause" : "Listen"}
              </span>
            </button>

            {/* Mute Button */}
            {isPlaying && (
              <motion.button
                onClick={toggleMute}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Now Playing Indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="mt-3 flex items-center gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                    animate={{
                      height: ["8px", "16px", "8px"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">Natural voice narration powered by AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
