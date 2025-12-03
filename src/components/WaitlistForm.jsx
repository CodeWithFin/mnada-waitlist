import { useState, useEffect } from 'react'

export default function WaitlistForm() {
  const [isTyping, setIsTyping] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // Get Google Apps Script URL from environment variable or use default
  const GOOGLE_SCRIPT_URL =
    import.meta.env.VITE_GOOGLE_SCRIPT_URL ||
    'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'

  useEffect(() => {
    const handleMouse = (e) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20
    setEyePos({ x: offsetX, y: offsetY })
  }, [cursor])

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
      return
    }

    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      console.error('Google Apps Script URL not configured. Please set VITE_GOOGLE_SCRIPT_URL in your .env file')
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Send data to Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script (no CORS support)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          timestamp: new Date().toISOString(),
        }),
      })

      // With no-cors mode, we can't read the response, but we assume success
      // The data will be saved to Google Sheets if the script is set up correctly
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 opacity-0 transform translate-y-8">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 w-full max-w-md border border-white/20">
        {/* Cartoon Face */}
        <div className="relative w-70 h-40">
          <img
            src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/cloud.jpg"
            alt="cartoon"
            className="w-full h-full object-contain"
          />
          {['left', 'right'].map((side, idx) => (
            <div
              key={side}
              className="absolute flex justify-center items-end overflow-hidden"
              style={{
                top: 60,
                left: idx === 0 ? 80 : 150,
                width: 28,
                height: isTyping
                  ? 4 // fully closed when typing
                  : blink
                  ? 6 // temporary blink
                  : 40, // open eye
                borderRadius: isTyping || blink ? '2px' : '50% / 60%',
                backgroundColor: isTyping ? 'black' : 'white',
                transition: 'all 0.15s ease',
              }}
            >
              {!isTyping && (
                <div
                  className="bg-black"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    marginBottom: 4,
                    transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
                    transition: 'all 0.1s ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-white mb-2 text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-white mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="text-white mb-2 text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full px-6 py-3 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-white/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </button>

          {submitStatus === 'success' && (
            <div className="mt-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
              ✓ Successfully joined the waitlist!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              ✗ Error submitting. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

