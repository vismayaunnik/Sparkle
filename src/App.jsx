import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import InteractiveNeuralVortex from './components/InteractiveNeuralVortex'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Clock, X, Terminal, ChevronRight, Shuffle, User, History, Flame, LogOut, Save, Mail, Lock, Sun, Moon, Play, Pause, Music, Volume2, VolumeX } from 'lucide-react'
import { supabase } from './supabaseClient'

// --- Context & Utils ---
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const jsonValue = localStorage.getItem(key)
      if (jsonValue != null) return JSON.parse(jsonValue)
    } catch (e) {
      console.error("Error reading localStorage", e)
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// --- Constants ---
const TOPICS = {
  "Core Memories": ["Childhood Highlights", "Turning Points", "Lost Items", "First Loves", "Forgotten Places", "A Perfect Day", "The Smell of Rain", "A Stranger's Face", "The Taste of Nostalgia", "A Faded Photograph"],
  "Relationships": ["Family Bonds", "Lost Friendships", "Silent Admirers", "Unspoken Words", "The Hardest Goodbye", "Unexpected Mentors", "The Art of Forgiveness", "Ties That Bind", "Echoes of Laughter", "A Shared Secret"],
  "Deep Thinking": ["The Future of Humanity", "The Nature of Reality", "Artificial Consciousness", "Life Beyond Earth", "The Concept of Time", "Ethics of Tomorrow", "The Illusion of Choice", "What is Consciousness?", "The End of the Universe", "The Architecture of Thought"],
  "Gratitude": ["The Small Things", "Unexpected Heroes", "Lessons from Failure", "Daily Miracles", "Strangers' Kindness", "Saved by Chance", "The Warmth of the Sun", "Overcoming the Impossible", "Quiet Mornings", "The Privilege of Aging"],
  "Self Reflection": ["Overcoming Fear", "My Hidden Flaws", "Moments of Pride", "Conversations with Past Self", "What Defines Me", "A Shift in Perspective", "The Face in the Mirror", "Forgiving Myself", "The Weight of Expectations", "Unlearning Toxicity"],
  "Dreams": ["Recurring Nightmares", "The Impossible City", "Flights of Fancy", "Waking Realizations", "A Life Unlived", "Lucid Architect", "The Infinite Staircase", "Conversations with the Dead", "The Forgotten Song", "Wings of Glass"]
}

const RANDOM_TOPIC_POOL = Object.values(TOPICS).flat()

const STORY_LINES = [
  "The light flickered, and suddenly...",
  "I never thought I'd see that face again.",
  "The silence was louder than the storm.",
  "Everything changed when the message arrived.",
  "They told me to stay away, but I couldn't.",
  "It was a day just like any other, until it wasn't.",
  "The key didn't fit, but the door opened anyway.",
  "I looked in the mirror and didn't recognize my own eyes.",
  "The wind carried a whisper that sounded like my name.",
  "The grandfather clock struck thirteen.",
  "I found a map tucked inside an old book, but the lands didn't exist.",
  "The stars were missing from the sky tonight.",
  "A single red rose was left on the doorstep of the abandoned house.",
  "The coffee hadn't even gone cold, yet the room was dusty.",
  "They said the island was deserted, but the smoke said otherwise.",
  "Every phone in the city started buzzing at the exact same second.",
  "I reached into my pocket and found a key I'd never seen before.",
  "The painting's expression had changed since I last looked at it.",
  "A child's laughter echoed from the forest where no one lived.",
  "The train didn't stop at my station, it just kept gaining speed.",
  "I woke up in a room with no doors and one small window.",
  "The rain tasted like ashes and regrets.",
  "A shadow detached itself from the wall and began to walk.",
  "I whispered the password, but the machine replied with a question.",
  "The old radio suddenly broadcasted a conversation I had yesterday.",
  "There was an extra moon in the sky, and nobody else noticed.",
  "The letters on the page started rearranging themselves.",
  "A voice in my head finally said, 'You're allowed to leave now.'",
  "The footprint in the snow matched my own, but I hadn't been there.",
  "I dug up the time capsule, but it was filled with things from tomorrow.",
  "The mirror shattered, and something stepped out."
]

const NEURAL_PATCHES = [
  { title: "Deep Vortex", type: "brownian" },
  { title: "Aether Drift", type: "sine" },
  { title: "Solar Rain", type: "white" },
  { title: "Lunar Echo", type: "fm" },
  { title: "Stellar Pulse", type: "triangle" }
]

// --- UI Components ---

const MusicController = ({ isPlaying, isLoading, currentTrack, volume, isMuted, onToggle, onTrackChange, onVolumeChange, onToggleMute }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 glass-morphism rounded-3xl p-6 w-72 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Vortex Soundscape</span>
                {isPlaying && (
                  <span className={`text-[8px] mt-1 uppercase tracking-widest ${isLoading ? 'text-amber-400 animate-pulse' : 'text-purple-400 animate-pulse'}`}>
                    {isLoading ? 'Synchronizing Stream...' : 'Neural Stream Active'}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {NEURAL_PATCHES.map((patch, idx) => (
                <button 
                  key={idx}
                  onClick={() => onTrackChange(idx)}
                  className={`w-full text-left p-2 rounded-lg transition-all text-xs flex items-center gap-3 ${currentTrack === idx ? 'bg-purple-500/20 text-purple-300' : 'text-white/40 hover:bg-white/5'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${currentTrack === idx ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-white/10'}`} />
                  {patch.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button onClick={onToggleMute} className="text-white/40 hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <button 
                onClick={onToggle}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm font-light text-white"
              >
                {isPlaying ? <><Pause className="w-4 h-4" /> Pause Audio</> : <><Play className="w-4 h-4" /> Play Soundscape</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-full glass-morphism border transition-all shadow-2xl relative ${isOpen ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 hover:border-white/30'}`}
      >
        <Music className={`w-6 h-6 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-white/40'}`} />
        {isPlaying && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#020202]" />}
      </motion.button>
    </div>
  )
}

const Sidebar = ({ isOpen, onClose, title, icon: Icon, children, side = "left" }) => (
  <motion.div 
    initial={{ x: side === "left" ? -350 : 350 }}
    animate={{ x: isOpen ? 0 : side === "left" ? -350 : 350 }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className={`fixed top-0 ${side === "left" ? 'left-0' : 'right-0'} h-full w-80 glass-morphism z-50 p-6 flex flex-col shadow-2xl`}
  >
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3 text-white/80">
        {Icon && <Icon className="w-5 h-5 text-purple-400" />}
        <span className="font-medium tracking-wide text-sm uppercase">{title}</span>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
      {children}
    </div>
  </motion.div>
)

const LoginSection = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login')
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8
    const hasUpper = /[A-Z]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const hasSpecial = /[!@#$%^&*]/.test(pass)
    return { 
      isValid: minLength && hasUpper && hasNumber && hasSpecial,
      checks: { minLength, hasUpper, hasNumber, hasSpecial }
    }
  }

  const { isValid: isPassStrong, checks: passChecks } = validatePassword(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (authMode === 'register') {
      if (!username || !password || !email) { setError("Please fill all fields"); setIsLoading(false); return; }
      if (!isPassStrong) { setError("Password does not meet safety requirements"); setIsLoading(false); return; }
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })

      if (signupError) { setError(signupError.message); setIsLoading(false); return; }

      setToastMessage("Registration successful! You can now log in.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
      setAuthMode('login')
      setPassword("")

    } else if (authMode === 'forgot') {
      if (!email) { setError("Please enter your email"); setIsLoading(false); return; }
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) { setError(resetError.message); setIsLoading(false); return; }

      setToastMessage("If an account exists, a reset link was sent to your email.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
      setAuthMode('login')

    } else {
      if (!email || !password) { setError("Please fill all fields"); setIsLoading(false); return; }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) { setError(loginError.message); setIsLoading(false); return; }
      onLogin(data.user)
    }

    setIsLoading(false)
  }

  const switchMode = (mode) => {
    setAuthMode(mode)
    setError("")
    setPassword("")
  }

  const renderPasswordStrength = () => (
    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-left px-2">
      <div className={`flex items-center gap-2 ${passChecks.minLength ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.minLength ? 'bg-green-400' : 'bg-white/20'}`} /> 8+ Characters
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasUpper ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasUpper ? 'bg-green-400' : 'bg-white/20'}`} /> Uppercase
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasNumber ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasNumber ? 'bg-green-400' : 'bg-white/20'}`} /> Number
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasSpecial ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasSpecial ? 'bg-green-400' : 'bg-white/20'}`} /> Special
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="z-10 max-w-md w-full glass-morphism rounded-[2rem] p-8 text-center max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col justify-center"
    >
      <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400" />
      <h1 className="text-4xl font-light mb-2 tracking-tight">Sparkle</h1>
      <p className="text-white/40 mb-6 font-light text-sm italic">Ignite your inner narrative.</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center"
          />
        </div>

        {authMode === 'register' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative">
            <input 
              type="text" 
              placeholder="Pick a Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center mt-3"
            />
          </motion.div>
        )}

        {authMode !== 'forgot' && (
          <div className="relative mt-3">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center"
            />
            {authMode === 'register' && password && renderPasswordStrength()}
          </div>
        )}

        {error && <p className="text-red-400/80 text-xs mt-2 font-light">{error}</p>}
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-medium outline-btn text-white flex items-center justify-center gap-3 group mt-6 shadow-xl disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : (authMode === 'register' ? 'Register' : authMode === 'forgot' ? 'Send Reset Link' : 'Enter the Vortex')}
          {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 px-6 py-3 glass-morphism rounded-full border border-purple-500/50 flex items-center gap-3 z-[100] max-w-sm w-max"
          >
            <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs font-light text-purple-200">System: {toastMessage}</span>

          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col gap-3 mt-6">
        <div className="flex justify-center gap-4">
          <button 
            type="button"
            onClick={() => switchMode(authMode === 'login' ? 'register' : 'login')}
            className="text-[11px] text-white/20 hover:text-white/50 transition-colors uppercase tracking-[0.2em]"
          >
            {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        
        {authMode === 'login' && (
          <>
            <button 
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-[11px] text-white/20 hover:text-white/50 transition-colors uppercase tracking-[0.2em]"
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              onClick={() => onLogin("Guest")}
              className="text-[10px] text-purple-400/40 hover:text-purple-400/80 transition-all uppercase tracking-[0.3em] mt-2"
            >
              Preview as Guest
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

const SelectionSection = ({ user, username, onSelectTopic, onLogout, openHistory, openStats, theme, toggleTheme }) => {
  const [mindInput, setMindInput] = useState("")
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [randomTopic, setRandomTopic] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)

  const handleRandomize = () => {
    setIsRandomizing(true)
    let count = 0
    const interval = setInterval(() => {
      setRandomTopic(RANDOM_TOPIC_POOL[Math.floor(Math.random() * RANDOM_TOPIC_POOL.length)])
      count++
      if (count > 25) {
        clearInterval(interval)
        const finalTopic = RANDOM_TOPIC_POOL[Math.floor(Math.random() * RANDOM_TOPIC_POOL.length)]
        setRandomTopic(finalTopic)
        setTimeout(() => {
          setIsRandomizing(false)
          onSelectTopic(finalTopic)
        }, 1500)
      }
    }, 80)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-10 w-full max-w-6xl px-6 h-screen overflow-hidden flex flex-col items-center justify-center text-center"
    >
      <div className="fixed top-8 right-8 flex items-center gap-4 z-50">
        <button onClick={openHistory} className="p-4 glass-morphism rounded-full hover:bg-white/10 transition-all group" title="History">
          <History className="w-5 h-5 text-white/50 group-hover:text-white" />
        </button>
        <button onClick={openStats} className="p-4 glass-morphism rounded-full hover:bg-white/10 transition-all group relative" title="Stats">
          <Flame className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
          <span className="absolute -top-1 -right-1 bg-purple-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#020202]">{user?.streak || 0}</span>
        </button>
        <button onClick={onLogout} className="p-4 glass-morphism rounded-full hover:bg-white/10 transition-all group" title="Logout">
          <LogOut className="w-5 h-5 text-red-400/50 group-hover:text-red-400" />
        </button>
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 w-full"
      >
        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-white/90">
          What's on <br className="md:hidden" /> your mind?
        </h1>
        <div className="max-w-xl mx-auto border-b border-white/10 mb-4 group focus-within:border-purple-500/50 transition-all relative">
          <textarea 
            placeholder="I'm feeling..."
            value={mindInput}
            onChange={(e) => setMindInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mindInput.trim()) {
                e.preventDefault();
                onSelectTopic(mindInput.trim());
              }
            }}
            className="w-full bg-transparent text-center text-xl font-light py-2 focus:outline-none resize-none h-12 placeholder:text-white/20 scrollbar-hide pt-1"
          />
          <AnimatePresence>
            {mindInput.trim() && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-purple-400/80 animate-pulse flex items-center"
              >
                Press Enter to dive deep <ChevronRight className="w-4 h-4 ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-2xl">
          {!activeCategory ? (
            Object.keys(TOPICS).map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className="px-8 py-3 rounded-full border border-white/5 hover:border-purple-400/40 hover:bg-purple-400/5 transition-all text-sm font-light text-white/40 hover:text-white"
              >
                {category}
              </button>
            ))
          ) : (
            <>
              <button 
                onClick={() => setActiveCategory(null)}
                className="px-5 py-3 rounded-full border border-white/5 hover:border-purple-400/40 transition-all text-sm font-light text-purple-400/70 hover:text-purple-400 flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back
              </button>
              {TOPICS[activeCategory].map(topic => (
                <button 
                  key={topic}
                  onClick={() => onSelectTopic(topic)}
                  className="px-8 py-3 rounded-full border border-purple-500/20 bg-purple-500/5 hover:border-purple-400/60 hover:bg-purple-400/10 transition-all text-sm font-light text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                >
                  {topic}
                </button>
              ))}
            </>
          )}
        </div>

        {!activeCategory && (
          <button 
            onClick={handleRandomize}
            disabled={isRandomizing}
            className="relative group mt-2"
          >
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl group-hover:bg-purple-500/60 transition-all" />
            <div className="w-20 h-20 rounded-full glass-morphism flex items-center justify-center relative hover:scale-110 transition-all active:scale-95 border border-white/5 group-hover:border-purple-500/50 shadow-2xl">
              <Shuffle className={`w-6 h-6 text-purple-300 ${isRandomizing ? 'animate-spin' : ''}`} />
            </div>
            <span className="block mt-2 text-[10px] uppercase tracking-[0.4em] text-white/20 group-hover:text-white/50 transition-all">Randomizer</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isRandomizing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-[#020202]/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-7xl font-light text-center text-purple-200 px-12 py-8 glass-morphism rounded-3xl"
            >
              {randomTopic}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const JournalSection = ({ topic, onExit, onSave }) => {
  const [time, setTime] = useState(15)
  const [customTime, setCustomTime] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(time * 60)
  const [prompt, setPrompt] = useState("")
  const [content, setContent] = useState("")
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [isInterrupted, setIsInterrupted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive && !isExiting) {
        setIsInterrupted(true)
      }
    };
    const handleBeforeUnload = (e) => {
      if (isActive && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handleContextMenu = (e) => {
      if (isActive) e.preventDefault();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [isActive, isExiting, timeLeft])

  useEffect(() => {
    let interval = null
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      clearInterval(interval)
      setIsActive(false)
      handleSave()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, isPaused])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    const finalTime = customTime ? parseInt(customTime) : time
    if (isNaN(finalTime) || finalTime <= 0) return
    setTimeLeft(finalTime * 60)
    setIsActive(true)
    document.documentElement.requestFullscreen().catch(() => {})
  }

  const handleSave = () => {
    if (!content.trim() || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      onSave(topic, content)
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setIsSaving(false)
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 3000)
    }, 1200)
  }

  const getNewPrompt = () => {
    setPrompt(STORY_LINES[Math.floor(Math.random() * STORY_LINES.length)])
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="z-10 w-full max-w-5xl h-screen flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {!isActive ? (
        <div className="glass-morphism rounded-[2.5rem] p-10 max-w-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 mt-2">Deep Learning Path</h2>
          <h1 className="text-3xl md:text-4xl font-light mb-8 italic tracking-tight line-clamp-2 px-2">"{topic}"</h1>
          
          <div className="mb-8">
            <label className="block text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">Select Duration</label>
            <div className="flex justify-center flex-wrap gap-4 mb-4">
              {[5, 10, 15, 30].map(t => (
                <button 
                  key={t}
                  onClick={() => { setTime(t); setCustomTime(""); }}
                  className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all text-xl font-light ${time === t && !customTime ? 'bg-purple-500/40 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-white/20 text-white/30'}`}
                >
                  {t}
                </button>
              ))}
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Custom"
                  value={customTime}
                  onChange={(e) => { setCustomTime(e.target.value); setTime(0); }}
                  className={`w-32 h-16 rounded-full border bg-transparent text-center focus:outline-none transition-all text-xl font-light ${customTime ? 'border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 text-white/30 group-hover:border-white/20'}`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={startSession}
              className="w-full py-4 rounded-xl font-medium outline-btn text-white flex items-center justify-center gap-3 group text-md"
            >
              Start Session
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
            </button>
            <button onClick={onExit} className="text-white/30 hover:text-white/70 text-[10px] uppercase tracking-[0.4em] transition-all pt-3 block w-full text-center">Go Back</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col w-full max-w-5xl relative animate-seq">
          <header className={`flex justify-between items-center mb-10 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 transition-all duration-700 hover:opacity-100 ${content.length > 50 ? 'opacity-0 -translate-y-4 hover:translate-y-0' : 'opacity-100'}`}>
            <div className="flex items-center gap-6">
              <div className="pl-6 pr-2 py-2 glass-morphism rounded-full text-2xl font-mono flex items-center gap-4 text-purple-300">
                <Clock className={`w-6 h-6 text-purple-400 ${isPaused ? 'opacity-50' : ''}`} />
                <span className={isPaused ? "text-purple-300/50" : ""}>{formatTime(timeLeft)}</span>
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className={`p-2 rounded-full transition-all border ${isPaused ? 'bg-purple-500/20 border-purple-400 hover:bg-purple-500/30 text-white' : 'hover:bg-white/10 border-transparent hover:border-white/20 text-white/50 hover:text-white'}`}
                  title={isPaused ? "Resume Session" : "Pause Session"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>
              <h1 className="text-white/20 font-light truncate max-w-md italic text-xl">"{topic}"</h1>
            </div>
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">{content.trim().split(/\s+/).filter(w=>w).length} Words</span>
              {lastSaved && <span className="text-[9px] text-purple-300/50 mt-1">Last saved at {lastSaved}</span>}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className={`px-6 py-3 glass-morphism rounded-full transition-all flex items-center gap-2 ${isSaving ? 'animate-pulse text-purple-400' : 'text-white/50 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent'}`}
                title="Save Entry"
              >
                {isSaving ? (
                  <span className="text-sm">Saving...</span>
                ) : showSavedToast ? (
                  <span className="text-sm">Saved ✅</span>
                ) : (
                  <><Save className="w-5 h-5" /> <span className="text-sm">Save</span></>
                )}
              </button>
              <button 
                onClick={() => setIsExiting(true)}
                className="p-4 glass-morphism hover:bg-red-500/20 hover:scale-105 active:scale-95 rounded-full transition-all text-white/30 hover:text-red-400"
                title="Exit Session"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </header>

          <textarea 
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
            className="flex-1 bg-transparent border border-transparent outline-none text-3xl font-light leading-relaxed resize-none p-12 placeholder:text-white/5 scrollbar-hide text-center selection:bg-purple-500/20 focus:bg-white/[0.02] focus:shadow-[0_0_40px_rgba(168,85,247,0.05)] transition-all rounded-3xl mx-4"
            placeholder="Let the stream of consciousness flow..."
          />

          <footer className={`mt-10 p-8 glass-morphism rounded-[2.5rem] relative group border border-white/5 transition-all duration-700 hover:opacity-100 ${content.length > 100 ? 'opacity-0 translate-y-4 hover:translate-y-0' : 'opacity-100'}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-lg italic text-purple-200/40 text-center md:text-left transition-colors group-hover:text-purple-200/60 leading-relaxed">
                {prompt || "Seeking a neural spark? Click the wand."}
              </div>
              <button 
                onClick={getNewPrompt}
                className="px-8 py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-2xl transition-all flex items-center gap-3 text-purple-300 group/wand"
              >
                <Sparkles className="w-5 h-5 group-hover/wand:rotate-12 transition-transform" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium">Inspire Me</span>
              </button>
            </div>
          </footer>
        </div>
      )}

      <AnimatePresence>
        {isInterrupted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020202]/90 backdrop-blur-2xl flex items-center justify-center p-8"
          >
            <div className="max-w-md w-full glass-morphism p-12 rounded-[3rem] text-center border-purple-500/30">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Terminal className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-3xl font-light mb-4 text-purple-200">Vortex Interrupted</h2>
              <p className="text-white/40 mb-8 font-light leading-relaxed">
                The immersive environment has been breached. Would you like to re-enter the deep focus state?
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setIsInterrupted(false);
                    document.documentElement.requestFullscreen();
                  }}
                  className="w-full py-5 bg-purple-600 rounded-2xl font-medium hover:bg-purple-500 transition-all text-white shadow-lg shadow-purple-500/20"
                >
                  Return to Focus
                </button>
                <button 
                  onClick={() => {
                    setIsInterrupted(false);
                    onExit();
                  }}
                  className="text-[10px] text-white/20 hover:text-white/40 uppercase tracking-[0.4em] py-2"
                >
                  Abandon Session
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020202]/80 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div className="max-w-sm w-full glass-morphism p-10 rounded-[2.5rem] text-center">
              <h2 className="text-2xl font-light mb-2">Preserve Spark?</h2>
              <p className="text-white/30 text-xs mb-8">Leaving now will pause your neural stream.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsExiting(false)}
                  className="flex-1 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm"
                >
                  Stay
                </button>
                <button 
                  onClick={onExit}
                  className="flex-1 py-4 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 px-8 py-4 glass-morphism text-purple-300 rounded-full border border-purple-500/50 flex items-center gap-3 shadow-2xl z-[60]"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Neural echo preserved in memory.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [userHistory, setUserHistory] = useState([])
  const [page, setPage] = useState('login')
  const [selectedTopic, setSelectedTopic] = useState("")
  const [sidebars, setSidebars] = useState({ history: false, stats: false })
  const [theme, setTheme] = useLocalStorage('sparkle_v2_theme', 'dark')

  // --- Audio State ---
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTrack: 0,
    volume: 0.8,
    isMuted: false
  })

  // --- Neural Audio Synthesis Engine ---
  const audioCtx = useRef(null)
  const masterGain = useRef(null)
  const currentNodes = useRef([])

  const initAudio = () => {
    try {
      if (!audioCtx.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        if (!AudioContextClass) {
          console.warn("AudioContext not supported in this browser.")
          return false
        }
        audioCtx.current = new AudioContextClass()
        masterGain.current = audioCtx.current.createGain()
        masterGain.current.connect(audioCtx.current.destination)
        masterGain.current.gain.value = audioState.isMuted ? 0 : audioState.volume
      }
      if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume()
      }
      return true
    } catch (e) {
      console.error("Failed to initialize audio engine", e)
      return false
    }
  }

  const stopCurrentPatch = () => {
    currentNodes.current.forEach(node => {
      try { node.stop() } catch(e) {}
      try { node.disconnect() } catch(e) {}
    })
    currentNodes.current = []
  }

  const playPatch = (idx) => {
    if (!initAudio()) return
    stopCurrentPatch()
    
    const patch = NEURAL_PATCHES[idx]
    const ctx = audioCtx.current
    
    if (patch.type === 'brownian' || patch.type === 'white') {
      const bufferSize = 2 * ctx.sampleRate
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let lastOut = 0.0
      
      for (let i = 0; i < bufferSize; i++) {
        if (patch.type === 'brownian') {
          const white = Math.random() * 2 - 1
          data[i] = (lastOut + (0.02 * white)) / 1.02
          lastOut = data[i]
          data[i] *= 3.5
        } else {
          data[i] = Math.random() * 2 - 1
        }
      }
      
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      
      const filter = ctx.createBiquadFilter()
      filter.type = patch.type === 'brownian' ? 'lowpass' : 'bandpass'
      filter.frequency.value = patch.type === 'brownian' ? 400 : 1000
      filter.Q.value = 1
      
      source.connect(filter)
      filter.connect(masterGain.current)
      source.start()
      currentNodes.current = [source, filter]
    } else {
      const osc = ctx.createOscillator()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      
      osc.type = patch.type === 'triangle' ? 'triangle' : 'sine'
      
      if (patch.type === 'sine') {
        // Aether Drift: Very slow pitch drift, ethereal
        osc.frequency.setValueAtTime(220, ctx.currentTime)
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime)
        lfoGain.gain.setValueAtTime(5, ctx.currentTime)
      } else if (patch.type === 'fm') {
        // Lunar Echo: Fast modulation for a "shimmering" or metallic sound
        osc.frequency.setValueAtTime(110, ctx.currentTime)
        lfo.type = 'square' 
        lfo.frequency.setValueAtTime(8, ctx.currentTime)
        lfoGain.gain.setValueAtTime(100, ctx.currentTime)
      } else if (patch.type === 'triangle') {
        // Stellar Pulse: Warm triangle with mid-speed pulse
        osc.frequency.setValueAtTime(82, ctx.currentTime)
        lfo.frequency.setValueAtTime(1.5, ctx.currentTime)
        lfoGain.gain.setValueAtTime(15, ctx.currentTime)
      }
      
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      osc.connect(masterGain.current)
      
      osc.start()
      lfo.start()
      currentNodes.current = [osc, lfo, lfoGain]
    }
  }

  useEffect(() => {
    if (masterGain.current) {
      masterGain.current.gain.setTargetAtTime(audioState.isMuted ? 0 : audioState.volume, audioCtx.current.currentTime, 0.1)
    }
  }, [audioState.volume, audioState.isMuted])

  useEffect(() => {
    if (audioState.isPlaying) {
      playPatch(audioState.currentTrack)
    } else {
      stopCurrentPatch()
    }
  }, [audioState.isPlaying, audioState.currentTrack])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null)
    }).catch(err => {
      console.error("Supabase connection failed:", err)
      setSession(null)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      setIsGuest(false)
      loadUserData(session.user.id)
      setPage('selection')
    } else if (isGuest) {
      setUserProfile({ username: 'NeuralGuest', streak: 0, last_login: new Date().toISOString() })
      setUserHistory([])
      setPage('selection')
    } else {
      setPage('login')
      setUserProfile(null)
      setUserHistory([])
    }
  }, [session, isGuest])

  const loadUserData = async (userId) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    const today = new Date().toISOString().split('T')[0]
    let updatedProfile = profile
    
    if (!profile) {
      const username = session?.user?.user_metadata?.username || "NeuralWalker"
      const { data: newProfile } = await supabase.from('profiles').insert([{ id: userId, username, streak: 1, last_login: today }]).select().single()
      updatedProfile = newProfile
    } else {
      const last = profile.last_login?.split('T')[0] || today
      if (today !== last) {
        const diff = Math.floor((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24))
        let newStreak = profile.streak
        if (diff === 1) newStreak += 1
        else if (diff > 1) newStreak = 1
        const { data: newProfile } = await supabase.from('profiles').update({ streak: newStreak, last_login: today }).eq('id', userId).select().single()
        updatedProfile = newProfile
      }
    }
    setUserProfile(updatedProfile)
    
    const { data: historyData } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (historyData) setUserHistory(historyData)
  }

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false)
    } else {
      await supabase.auth.signOut()
    }
    setSidebars({ history: false, stats: false })
  }

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic)
    setPage('journaling')
  }

  const handleSaveJournal = async (topic, content) => {
    if (isGuest) {
      setUserHistory(prev => [{ id: Date.now(), topic, content, created_at: new Date().toISOString() }, ...prev])
      return
    }
    if (!session) return
    const newEntry = { user_id: session.user.id, topic, content }
    
    const { data, error } = await supabase.from('journal_entries').insert([newEntry]).select().single()
    if (!error && data) {
      setUserHistory(prev => [data, ...prev])
    }
  }

  const toggleSidebar = (name) => {
    setSidebars(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="relative h-screen overflow-hidden w-full flex flex-col items-center justify-center bg-[#020202] text-white selection:bg-purple-500/40 font-sans tracking-wide">
      <InteractiveNeuralVortex theme={theme} />
      
      <MusicController 
        {...audioState}
        isLoading={false}
        onToggle={() => {
          initAudio()
          setAudioState(p => ({ ...p, isPlaying: !p.isPlaying }))
        }}
        onTrackChange={(idx) => {
          initAudio()
          setAudioState(p => ({ ...p, currentTrack: idx, isPlaying: true }))
        }}
        onVolumeChange={(v) => setAudioState(p => ({ ...p, volume: v, isMuted: v === 0 }))}
        onToggleMute={() => setAudioState(p => ({ ...p, isMuted: !p.isMuted }))}
      />


      <AnimatePresence mode="wait">
        {!session && !isGuest && <LoginSection key="login" onLogin={(v) => { if(v === 'Guest') setIsGuest(true) }} />}
        {(session || isGuest) && page === 'selection' && (
          <SelectionSection 
            key="selection" 
            user={userProfile}
            username={userProfile?.username || session?.user?.email || "Guest"}
            onSelectTopic={handleSelectTopic} 
            onLogout={handleLogout}
            openHistory={() => toggleSidebar('history')}
            openStats={() => toggleSidebar('stats')}
            theme={theme}
            toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          />
        )}
        {(session || isGuest) && page === 'journaling' && (
          <JournalSection 
            key="journal" 
            topic={selectedTopic} 
            onExit={() => setPage('selection')} 
            onSave={handleSaveJournal}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={sidebars.history} 
        onClose={() => toggleSidebar('history')} 
        title="Neural History" 
        icon={History}
        side="left"
      >
        <div className="space-y-4">
          {userHistory.map((entry) => (
            <div key={entry.id} className="p-5 glass-morphism rounded-3xl border-white/5 hover:border-purple-500/20 transition-all group">
              <div className="text-[10px] text-white/20 mb-2 uppercase tracking-widest">{new Date(entry.created_at).toLocaleString()}</div>
              <div className="text-sm font-medium text-purple-300 mb-3 italic">"{entry.topic}"</div>
              <div className="text-xs text-white/40 group-hover:text-white/60 line-clamp-3 leading-relaxed transition-colors font-light">{entry.content}</div>
            </div>
          ))}
          {userHistory.length === 0 && (
            <div className="text-center mt-32 text-white/20 italic font-light">No neural echoes found.</div>
          )}
        </div>
      </Sidebar>

      <Sidebar 
        isOpen={sidebars.stats} 
        onClose={() => toggleSidebar('stats')} 
        title="Neural Profile" 
        icon={User}
        side="right"
      >
        <div className="space-y-8">
          <div className="text-center p-10 glass-morphism rounded-[2.5rem] relative overflow-hidden group border border-white/5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <Flame className="w-16 h-16 text-orange-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <div className="text-6xl font-light mb-2">{userProfile?.streak || 0}</div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8">Day Streak</div>
            {userProfile?.streak > 0 && (
              <div className="text-xs text-orange-300/80 italic font-light animate-pulse">You're on a {userProfile?.streak}-day streak - keep going!</div>
            )}
          </div>
          
          <div className="p-8 glass-morphism rounded-[2rem] border border-white/5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-2">
              <Clock className="w-3 h-3" /> System Clock
            </div>
            <div className="text-xl font-light text-white/80">{new Date().toDateString()}</div>
          </div>

          <div className="p-8 glass-morphism rounded-[2rem] border border-white/5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6">Linked Account</div>
            <div className="text-sm font-light text-white/60 mb-1">{userProfile?.username || "NeuralWalker"}</div>
            <div className="text-xs font-light text-purple-400/50 italic">{session?.user?.email}</div>
          </div>
        </div>
      </Sidebar>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.8em]">SPARKLE // CORE_OS_V2.2</div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.4); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default App
