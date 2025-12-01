# Article Text-to-Speech Narrator Feature

## ✨ What's New

A beautiful AI narrator has been added to every article page! She will:
- Read the entire article with a natural, warm female voice
- Summarize and explain key points as she goes
- Add natural transitions between sections
- Provide an introduction and conclusion

## 🎯 Features

- **Natural Voice**: Uses Google's `en-US-Journey-F` voice (warm, professional female)
- **Smart Summarization**: Converts markdown to natural speech with explanations
- **Sticky Player**: Stays at the top while you read
- **Play/Pause Controls**: Full playback control
- **Mute Option**: Toggle audio on/off
- **Loading States**: Clear feedback while generating
- **Auto-cleanup**: Properly manages audio resources

## 🔧 Setup

### 1. Get Google API Key

The same Google API key works for both AI chat and text-to-speech:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create or select a project
3. Click **Create Credentials** → **API Key**
4. Enable **Cloud Text-to-Speech API**:
   - Go to https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
   - Click **Enable**
5. Copy your API key

### 2. Add to Environment Variables

In `frontend/.env`:
```env
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 3. Restart Dev Server

```bash
cd frontend
npm run dev
```

Or restart Docker:
```bash
docker-compose down
docker-compose up -d --build
```

## 🎨 User Experience

### On Article Page:
1. **Sticky narrator bar** appears at the top
2. Shows "Article Narrator" with a purple/pink gradient icon
3. Click **"Listen"** button to start
4. Audio generates (takes 2-5 seconds)
5. Natural voice narration begins
6. **Pause** button appears while playing
7. **Mute** button available during playback
8. Visual equalizer shows audio is playing

### What the AI Narrator Says:
```
"Hello, I'm your wellness guide. Today, I'll be sharing insights about: 
[Article Title]. [Excerpt if available]. Let's dive into the key points.

[Natural summary of article sections with transitions]

I hope you found these insights valuable. Remember to consult with 
healthcare professionals for personalized advice. Thank you for listening!"
```

## 🎵 Voice Details

**Voice Model**: `en-US-Journey-F`
- Gender: Female
- Tone: Warm, professional, friendly
- Speed: 0.95x (slightly slower for clarity)
- Optimized for: Headphones/speakers

## 🔧 Technical Details

### How It Works:
1. User clicks "Listen" button
2. Article content is cleaned (markdown → plain text)
3. AI creates a narrative with:
   - Natural introduction
   - Section summaries
   - Smooth transitions
   - Professional conclusion
4. Text sent to Google Text-to-Speech API
5. Returns MP3 audio as base64
6. Converts to blob and plays in browser
7. Cleans up resources on unmount

### API Used:
- **Endpoint**: `https://texttospeech.googleapis.com/v1/text:synthesize`
- **Voice**: `en-US-Journey-F` (Neural voice)
- **Format**: MP3
- **Quality**: Headphone-optimized

### Performance:
- First generation: 2-5 seconds
- Audio cached in memory
- Automatic cleanup on page leave
- No backend needed (all client-side)

## 🎨 UI Components

### Sticky Bar:
- Semi-transparent white background
- Backdrop blur effect
- Sticks to top while scrolling
- Smooth animations

### Controls:
- **Listen/Pause**: Gradient purple-to-pink button
- **Mute**: Gray circular button (appears when playing)
- **Loading**: Spinner animation
- **Playing**: Animated equalizer bars

### States:
- **Idle**: "Listen to this article"
- **Loading**: "Generating..." with spinner
- **Playing**: "Playing..." with equalizer
- **Error**: Red error message box

## 📱 Responsive Design

- **Mobile**: Icon + "Listen" text visible
- **Desktop**: Full controls with labels
- **All sizes**: Smooth animations and transitions

## 🚀 Future Enhancements

Possible additions:
- [ ] Speed control (0.5x - 2x)
- [ ] Progress bar showing playback position
- [ ] Download audio option
- [ ] Multiple voice options
- [ ] Language selection
- [ ] Highlight text as it's being read
- [ ] Keyboard shortcuts (space to pause, etc.)

## 💡 Cost Considerations

Google Text-to-Speech pricing:
- First 1 million characters/month: **FREE**
- After: $4 per 1 million characters
- Average article: ~2,000 characters
- **500 narrations per month free**

## 🎯 User Benefits

1. **Accessibility**: Helps users with visual impairments
2. **Multitasking**: Listen while doing other things
3. **Learning**: Some people learn better by listening
4. **Convenience**: Great for commuting or exercising
5. **Engagement**: Increases time on page

## 🔍 Testing

Test on an article:
1. Navigate to any article (e.g., `/blog/healthy-eating-tips`)
2. Look for the narrator bar at the top
3. Click "Listen"
4. Wait for generation (2-5 seconds)
5. Verify natural voice playback
6. Test pause/resume
7. Test mute/unmute

---

Enjoy your new AI narrator! 🎙️✨
