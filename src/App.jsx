import React, { useState, useEffect, createContext, useContext } from 'react'
import InteractiveNeuralVortex from './components/InteractiveNeuralVortex'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Clock, X, Terminal, ChevronRight, Shuffle, User, History, Flame, LogOut, Save, Mail, Lock } from 'lucide-react'
import emailjs from '@emailjs/browser'

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
  "Core Memories": ["Childhood Highlights", "Turning Points", "Lost Items", "First Loves", "Forgotten Places", "A Perfect Day"],
  "Relationships": ["Family Bonds", "Lost Friendships", "Silent Admirers", "Unspoken Words", "The Hardest Goodbye", "Unexpected Mentors"],
  "Deep Thinking": ["The Future of Humanity", "The Nature of Reality", "Artificial Consciousness", "Life Beyond Earth", "The Concept of Time", "Ethics of Tomorrow"],
  "Gratitude": ["The Small Things", "Unexpected Heroes", "Lessons from Failure", "Daily Miracles", "Strangers' Kindness", "Saved by Chance"],
  "Self Reflection": ["Overcoming Fear", "My Hidden Flaws", "Moments of Pride", "Conversations with Past Self", "What Defines Me", "A Shift in Perspective"],
  "Dreams": ["Recurring Nightmares", "The Impossible City", "Flights of Fancy", "Waking Realizations", "A Life Unlived", "Lucid Architect"]
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

// --- UI Components ---

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
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgot'
  const [authStep, setAuthStep] = useState('input') // 'input', 'verifying', 'reset'
  const [generatedCode, setGeneratedCode] = useState("")
  const [verificationInput, setVerificationInput] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('sparkle_v2_users') || '{}')
    
    if (authMode === 'register') {
      if (authStep === 'input') {
        if (!username || !password || !email) return setError("Please fill all fields")
        if (!isPassStrong) return setError("Password does not meet safety requirements")
        if (users[username]) return setError("Username already exists")
        if (!email.includes('@')) return setError("Invalid email address")
        const emailExists = Object.values(users).some(u => u.email === email)
        if (emailExists) return setError("Email already registered. Please login.")

        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setGeneratedCode(code)
        setAuthStep('verifying')
        setToastMessage(`Verification code sent to ${email}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
        console.log(`[SPARKLE OS] VERIFICATION CODE FOR ${email}: ${code}`)
        emailjs.send("service_sparkle", "template_wnchqd7", {
          to_email: email,
          code: code
        }, "46Fx4YBs1fJoSuazP").catch(err => console.error("EmailJS config error:", err));
      } else if (authStep === 'verifying') {
        if (verificationInput !== generatedCode) return setError("Incorrect verification code")
        
        users[username] = { 
          email, 
          password, 
          history: [], 
          streak: 1, 
          lastLogin: new Date().toDateString() 
        }
        localStorage.setItem('sparkle_v2_users', JSON.stringify(users))
        onLogin(username)
      }
    } else if (authMode === 'forgot') {
      if (authStep === 'input') {
        if (!username) return setError("Please enter your username")
        if (!users[username]) return setError("User not found")
        
        const userEmail = users[username].email
        if (!userEmail) return setError("No email linked to this account")
        
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setGeneratedCode(code)
        setEmail(userEmail)
        setAuthStep('verifying')
        setToastMessage(`Code sent to linked email: ${userEmail.replace(/(.{2})(.*)(?=@)/, "$1***")}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
        console.log(`[SPARKLE OS] RESET CODE FOR ${userEmail}: ${code}`)
        emailjs.send("service_sparkle", "template_wnchqd7", {
          to_email: userEmail,
          code: code
        }, "46Fx4YBs1fJoSuazP").catch(err => console.error("EmailJS config error:", err));
      } else if (authStep === 'verifying') {
        if (verificationInput !== generatedCode) return setError("Incorrect verification code")
        setAuthStep('reset')
        setPassword("")
      } else if (authStep === 'reset') {
        if (!password) return setError("Please enter a new password")
        if (!isPassStrong) return setError("Password does not meet safety requirements")
        
        users[username].password = password
        localStorage.setItem('sparkle_v2_users', JSON.stringify(users))
        setToastMessage("Password successfully reset")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
        setAuthMode('login')
        setAuthStep('input')
        setPassword("")
      }
    } else {
      if (!username || !password) return setError("Please fill all fields")
      if (!users[username]) return setError("User not found")
      if (users[username].password !== password) return setError("Incorrect password")
      onLogin(username)
    }
  }

  const switchMode = (mode) => {
    setAuthMode(mode)
    setAuthStep('input')
    setError("")
    setPassword("")
    setVerificationInput("")
  }

  const renderPasswordStrength = () => (
    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-left px-2">
      <div className={`flex items-center gap-2 ${passChecks.minLength ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.minLength ? 'bg-green-400' : 'bg-white/20'}`} /> 8+ Characters
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasUpper ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasUpper ? 'bg-green-400' : 'bg-white/20'}`} /> Uppercase Letter
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasNumber ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasNumber ? 'bg-green-400' : 'bg-white/20'}`} /> Number
      </div>
      <div className={`flex items-center gap-2 ${passChecks.hasSpecial ? 'text-green-400' : 'text-white/20'}`}>
        <div className={`w-1 h-1 rounded-full ${passChecks.hasSpecial ? 'bg-green-400' : 'bg-white/20'}`} /> Special (!@#$)
      </div>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="z-10 max-w-md w-full glass-morphism rounded-[2rem] p-12 text-center"
    >
      <Brain className="w-16 h-16 mx-auto mb-6 text-purple-400" />
      <h1 className="text-5xl font-light mb-2 tracking-tight">Sparkle</h1>
      <p className="text-white/40 mb-10 font-light text-sm italic">Ignite your inner narrative.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {authStep === 'input' && (
          <>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center"
              />
            </div>
            
            {authMode === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500/50 transition-all font-light mb-4 text-center"
                />
              </motion.div>
            )}

            {authMode !== 'forgot' && (
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center"
                />
                {authMode === 'register' && password && renderPasswordStrength()}
              </div>
            )}
          </>
        )}

        {authStep === 'verifying' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-sm text-white/40 font-light">
              We sent a 6-digit code to <br/>
              <span className="text-purple-300">
                {authMode === 'forgot' && email ? email.replace(/(.{2})(.*)(?=@)/, "$1***") : email}
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Enter Code" 
              value={verificationInput}
              maxLength={6}
              onChange={(e) => setVerificationInput(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-white/10 border border-purple-500/30 rounded-2xl px-4 py-6 text-center text-4xl tracking-widest focus:outline-none focus:border-purple-400 transition-all font-mono"
            />
            <button 
              type="button"
              onClick={() => setAuthStep('input')}
              className="text-[10px] text-white/20 hover:text-white/50 uppercase tracking-widest underline underline-offset-4"
            >
              Back to details
            </button>
          </motion.div>
        )}

        {authStep === 'reset' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-sm text-white/40 font-light mb-4 text-center">
              Enter your new secure password
            </div>
            <div className="relative">
              <input 
                type="password" 
                placeholder="New Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500/50 transition-all font-light text-center"
              />
              {password && renderPasswordStrength()}
            </div>
          </motion.div>
        )}

        {error && <p className="text-red-400/80 text-xs mt-2 font-light">{error}</p>}
        
        <button 
          type="submit"
          className="w-full py-5 rounded-xl font-medium outline-btn text-white flex items-center justify-center gap-3 group mt-8 shadow-xl"
        >
          {authStep === 'verifying' ? 'Verify Code' : authStep === 'reset' ? 'Reset Password' : authMode === 'register' ? 'Send Code' : authMode === 'forgot' ? 'Find Account' : 'Enter the Vortex'}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      
      <div className="flex flex-col gap-4 mt-8">
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

const SelectionSection = ({ user, username, onSelectTopic, onLogout, openHistory, openStats }) => {
  const [mindInput, setMindInput] = useState("")
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [randomTopic, setRandomTopic] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)

  const handleRandomize = async () => {
    setIsRandomizing(true)
    
    let fetchedPrompt = ""
    try {
      const res = await fetch('https://dummyjson.com/quotes/random')
      const data = await res.json()
      if (data && data.quote) fetchedPrompt = data.quote
    } catch (e) {}

    let count = 0
    const interval = setInterval(() => {
      setRandomTopic(RANDOM_TOPIC_POOL[Math.floor(Math.random() * RANDOM_TOPIC_POOL.length)])
      count++
      if (count > 25) {
        clearInterval(interval)
        if (fetchedPrompt) setRandomTopic(fetchedPrompt)
        setIsRandomizing(false)
      }
    }, 80)
  }

  useEffect(() => {
    if (!isRandomizing && randomTopic) {
      setTimeout(() => onSelectTopic(randomTopic), 1000)
    }
  }, [isRandomizing, randomTopic])

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
          <span className="absolute -top-1 -right-1 bg-purple-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#020202]">{user.streak}</span>
        </button>
        <button onClick={onLogout} className="p-4 glass-morphism rounded-full hover:bg-white/10 transition-all group" title="Logout">
          <LogOut className="w-5 h-5 text-red-400/50 group-hover:text-red-400" />
        </button>
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-16 w-full"
      >
        <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight text-white/90">
          What's on <br className="md:hidden" /> your mind?
        </h1>
        <div className="max-w-3xl mx-auto border-b border-white/10 mb-8 group focus-within:border-purple-500/50 transition-all relative">
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
            className="w-full bg-transparent text-center text-3xl font-light py-4 focus:outline-none resize-none h-20 placeholder:text-white/5"
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
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl">
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

        <button 
          onClick={handleRandomize}
          disabled={isRandomizing}
          className="relative group"
        >
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/60 transition-all" />
          <div className="w-32 h-32 rounded-full glass-morphism flex items-center justify-center relative hover:scale-110 transition-all active:scale-95 border-2 border-white/5 group-hover:border-purple-500/50 shadow-2xl">
            <Shuffle className={`w-10 h-10 text-purple-300 ${isRandomizing ? 'animate-spin' : ''}`} />
          </div>
          <span className="block mt-4 text-[10px] uppercase tracking-[0.4em] text-white/20 group-hover:text-white/50 transition-all">Randomizer</span>
        </button>
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
  const [isExiting, setIsExiting] = useState(false)

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
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      clearInterval(interval)
      setIsActive(false)
      handleSave()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

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
    if (!content.trim()) return
    onSave(topic, content)
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 3000)
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
              <div className="px-6 py-2 glass-morphism rounded-full text-2xl font-mono flex items-center gap-4 text-purple-300">
                <Clock className="w-6 h-6 text-purple-400" />
                {formatTime(timeLeft)}
              </div>
              <h1 className="text-white/20 font-light truncate max-w-md italic text-xl">"{topic}"</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                className="p-4 glass-morphism hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white"
                title="Save Entry"
              >
                <Save className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsExiting(true)}
                className="p-4 glass-morphism hover:bg-red-500/20 rounded-full transition-all text-white/30 hover:text-red-400"
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
            className="flex-1 bg-transparent border-none outline-none text-3xl font-light leading-relaxed resize-none p-12 placeholder:text-white/5 scrollbar-hide text-center selection:bg-purple-500/20"
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
  const [currentUser, setCurrentUser] = useLocalStorage('sparkle_v2_current', null)
  const [users, setUsers] = useLocalStorage('sparkle_v2_users', {})
  const [page, setPage] = useState('login')
  const [selectedTopic, setSelectedTopic] = useState("")
  const [sidebars, setSidebars] = useState({ history: false, stats: false })

  const user = currentUser ? users[currentUser] : null

  useEffect(() => {
    if (currentUser) setPage('selection')
  }, [currentUser])

  const handleLogin = (username) => {
    const updatedUsers = { ...users }
    const today = new Date().toDateString()
    
    // Initialize user if they don't exist (e.g. Guest)
    if (!updatedUsers[username]) {
      updatedUsers[username] = { 
        email: "guest@sparkle.os", 
        password: "", 
        history: [], 
        streak: 1, 
        lastLogin: today 
      }
    } else if (updatedUsers[username].lastLogin !== today) {
      const last = new Date(updatedUsers[username].lastLogin)
      const diff = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24))
      if (diff === 1) updatedUsers[username].streak += 1
      else if (diff > 1) updatedUsers[username].streak = 1
      updatedUsers[username].lastLogin = today
    }
    
    setUsers(updatedUsers)
    setCurrentUser(username)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setPage('login')
    setSidebars({ history: false, stats: false })
  }

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic)
    setPage('journaling')
  }

  const handleSaveJournal = (topic, content) => {
    if (!currentUser) return
    const updatedUsers = { ...users }
    updatedUsers[currentUser].history = [
      { id: Date.now(), topic, content, date: new Date().toLocaleString() },
      ...updatedUsers[currentUser].history
    ]
    setUsers(updatedUsers)
  }

  const handleExit = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    setPage('selection')
  }

  const toggleSidebar = (name) => {
    setSidebars(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#020202] text-white selection:bg-purple-500/40 font-sans tracking-wide">
      <InteractiveNeuralVortex />
      
      <AnimatePresence mode="wait">
        {!currentUser && <LoginSection key="login" onLogin={handleLogin} />}
        {currentUser && page === 'selection' && (
          <SelectionSection 
            key="selection" 
            user={user}
            username={currentUser}
            onSelectTopic={handleSelectTopic} 
            onLogout={handleLogout}
            openHistory={() => toggleSidebar('history')}
            openStats={() => toggleSidebar('stats')}
          />
        )}
        {currentUser && page === 'journaling' && (
          <JournalSection 
            key="journal" 
            topic={selectedTopic} 
            onExit={handleExit} 
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
          {user?.history.map((entry) => (
            <div key={entry.id} className="p-5 glass-morphism rounded-3xl border-white/5 hover:border-purple-500/20 transition-all group">
              <div className="text-[10px] text-white/20 mb-2 uppercase tracking-widest">{entry.date}</div>
              <div className="text-sm font-medium text-purple-300 mb-3 italic">"{entry.topic}"</div>
              <div className="text-xs text-white/40 group-hover:text-white/60 line-clamp-3 leading-relaxed transition-colors font-light">{entry.content}</div>
            </div>
          ))}
          {user?.history.length === 0 && (
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
            <div className="text-6xl font-light mb-2">{user?.streak}</div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/30">Day Streak</div>
          </div>
          
          <div className="p-8 glass-morphism rounded-[2rem] border border-white/5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-2">
              <Clock className="w-3 h-3" /> System Clock
            </div>
            <div className="text-xl font-light text-white/80">{new Date().toDateString()}</div>
          </div>

          <div className="p-8 glass-morphism rounded-[2rem] border border-white/5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6">Linked Account</div>
            <div className="text-sm font-light text-white/60 mb-1">{currentUser}</div>
            <div className="text-xs font-light text-purple-400/50 italic">{user?.email}</div>
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
