import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Pause, Play, Loader2, RotateCcw } from "lucide-react";

interface ArticleNarratorProps {
  title: string;
  content: string;
}

export function ArticleNarrator({ title, content }: ArticleNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isGeneratingRef = useRef(false);

  // Get API key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // Clean markdown and enhance with SSML for natural speech
  const cleanMarkdown = (text: string): string => {
    return text
      // Remove markdown headers
      .replace(/#{1,6}\s+/g, '')
      // Preserve bold/italic as emphasis markers (will convert to SSML later)
      .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
      .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
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

  // Convert text to SSML for natural prosody and pauses
  const enhanceWithSSML = (text: string): string => {
    return `<speak>
      <prosody rate="medium" pitch="+1st">
        ${text
          // Paragraph breaks (800ms pause)
          .replace(/\n\n/g, '<break time="800ms"/>\n\n')
          // Period pauses (500ms)
          .replace(/\./g, '.<break time="500ms"/>')
          // Question/exclamation pauses (600ms)
          .replace(/\?/g, '?<break time="600ms"/>')
          .replace(/!/g, '!<break time="600ms"/>')
          // Comma pauses (300ms)
          .replace(/,/g, ',<break time="300ms"/>')
          // Colon/semicolon pauses (400ms)
          .replace(/:/g, ':<break time="400ms"/>')
          .replace(/;/g, ';<break time="400ms"/>')
          // Convert emphasis markers to SSML
          .replace(/<strong>(.*?)<\/strong>/g, '<emphasis level="strong">$1</emphasis>')
          .replace(/<em>(.*?)<\/em>/g, '<emphasis level="moderate">$1</emphasis>')
        }
      </prosody>
    </speak>`;
  };

  // Stop and reset audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Clean up chunk queue
    audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
    audioQueueRef.current = [];
    
    setIsPlaying(false);
    setCurrentChunk(0);
    setTotalChunks(0);
    isGeneratingRef.current = false;
  };

  // Split text into optimal chunks (500-800 chars per chunk for faster streaming)
  const splitIntoChunks = (text: string, chunkSize: number = 800): string[] => {
    const chunks: string[] = [];
    // Split by paragraphs first (semantic boundaries)
    const paragraphs = text.split(/\n\n+/);

    let currentChunk = '';

    for (const paragraph of paragraphs) {
      // If adding this paragraph exceeds chunk size and we have content, push current chunk
      if ((currentChunk + paragraph).length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  };

  // Generate audio for a single chunk with SSML support
  const generateChunkAudio = async (text: string): Promise<string> => {
    // Convert text to SSML for natural speech
    const ssmlText = enhanceWithSSML(text);

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { ssml: ssmlText }, // Use SSML instead of plain text
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Studio-O', // Studio voice - most natural Gen 3 voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: 0,
            speakingRate: 1.0, // Normal pace - SSML handles pauses
            volumeGainDb: 2.0, // Slightly louder for clarity
            effectsProfileId: ['large-home-entertainment-class-device'] // Richer audio
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

    // Convert base64 audio to blob URL
    const audioData = atob(data.audioContent);
    const audioArray = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      audioArray[i] = audioData.charCodeAt(i);
    }
    const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
    return URL.createObjectURL(audioBlob);
  };

  // Play next chunk in queue
  const playNextChunk = async () => {
    if (audioQueueRef.current.length === 0) {
      setIsPlaying(false);
      setCurrentChunk(0);
      return;
    }

    const audioUrl = audioQueueRef.current.shift()!;
    
    // Clean up old audio URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    audioUrlRef.current = audioUrl;

    // Create and configure audio element
    const audio = new Audio(audioUrl);
    audio.volume = isMuted ? 0 : 1;
    
    audio.onended = () => {
      setCurrentChunk(prev => prev + 1);
      playNextChunk();
    };

    audio.onerror = (e) => {
      console.error("ArticleNarrator: Audio playback error:", e);
      setHasError(true);
      setIsPlaying(false);
    };

    audioRef.current = audio;
    
    try {
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error('ArticleNarrator: Playback error:', err);
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Generate speech with streaming approach
  const generateSpeech = async () => {
    if (!apiKey) {
      console.error("ArticleNarrator: Google API key not configured");
      setHasError(true);
      return;
    }

    if (isGeneratingRef.current) {
      return;
    }

    isGeneratingRef.current = true;
    setIsLoading(true);
    setHasError(false);
    setCurrentChunk(0);

    try {
      // Clean and split the content
      const cleanedText = cleanMarkdown(content);
      const fullText = `${title}. ${cleanedText}`;
      const chunks = splitIntoChunks(fullText);

      setTotalChunks(chunks.length);
      audioQueueRef.current = [];

      // Stream generation: generate and queue chunks progressively
      const generateAndQueue = async () => {
        for (let i = 0; i < chunks.length; i++) {
          try {
            const chunkUrl = await generateChunkAudio(chunks[i]);
            audioQueueRef.current.push(chunkUrl);

            // Start playing as soon as first chunk is ready
            if (i === 0) {
              playNextChunk();
            }
          } catch (err) {
            console.error(`ArticleNarrator: Error generating chunk ${i}:`, err);
            // Continue with remaining chunks even if one fails
          }
        }
        isGeneratingRef.current = false;
      };

      // Start streaming generation (non-blocking)
      generateAndQueue();

    } catch (err) {
      console.error('ArticleNarrator: Failed to generate speech:', err);
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
      isGeneratingRef.current = false;
    }
  };



  // Handle play/pause/restart
  const togglePlayback = async () => {
    try {
      if (isPlaying && audioRef.current) {
        // Pause current playback
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (audioRef.current && !audioRef.current.ended) {
        // Resume paused audio
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Generate new audio (first time or after audio ended)
        await generateSpeech();
      }
    } catch (error) {
      console.error('ArticleNarrator: Playback error:', error);
      setHasError(true);
      setIsPlaying(false);
    }
  };

  // Handle restart
  const handleRestart = async () => {
    stopAudio();
    await generateSpeech();
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
      // Clean up chunk queue
      audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
      audioQueueRef.current = [];
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
                {isPlaying && totalChunks > 1 
                  ? `Part ${currentChunk + 1} of ${totalChunks}` 
                  : isPlaying 
                  ? "Playing..." 
                  : "Generating..."}
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

            {/* Restart Button */}
            {isPlaying && (
              <motion.button
                onClick={handleRestart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Restart narration"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}

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
