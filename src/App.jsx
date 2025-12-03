import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxScene from './components/ParallaxScene'
import WaitlistForm from './components/WaitlistForm'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // GSAP text animations
    const sections = document.querySelectorAll('section')

    const animateSection = (section, title, paragraphs) => {
      if (title) {
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
      }
      
      paragraphs.forEach((p, i) => {
        gsap.to(p, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: title ? 0.25 + i * 0.15 : i * 0.15,
          ease: 'power3.out',
        })
      })
    }

    sections.forEach((section, index) => {
      const title = section.querySelector('h1')
      const paragraphs = section.querySelectorAll('p')
      const formContainer = section.querySelector('.opacity-0')

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          animateSection(section, title, paragraphs)
          // Animate form container if it exists
          if (formContainer) {
            gsap.to(formContainer, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
            })
          }
        },
        onLeaveBack: () => {
          const elements = title ? [title, ...paragraphs] : [...paragraphs]
          gsap.to(elements, {
            opacity: 0,
            y: 48,
            duration: 0.6,
          })
          if (formContainer) {
            gsap.to(formContainer, {
              opacity: 0,
              y: 32,
              duration: 0.6,
            })
          }
        },
      })

      // Animate first section immediately if it's already in view
      if (index === 0) {
        const rect = section.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
        if (isInView) {
          setTimeout(() => {
            animateSection(section, title, paragraphs)
          }, 100)
        }
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger !== 'body') {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <div className="bg-zinc-950">
      <ParallaxScene />

      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center px-8">
          <div className="max-w-7xl pointer-events-auto">
            <h1 className="text-8xl md:text-9xl font-bold leading-tight mb-12 opacity-0 transform translate-y-12 text-white tracking-tight">
              Mnada
            </h1>
            <p className="text-2xl md:text-3xl leading-relaxed max-w-4xl opacity-0 transform translate-y-8 text-zinc-300 font-medium mb-8">
              — where style meets community.
            </p>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl opacity-0 transform translate-y-8 text-zinc-300 font-medium">
              We're building a space where you can buy and sell clothing you love, discover unique pieces, and connect with people who share your style.
            </p>
          </div>
        </section>

        <section className="h-screen flex items-center justify-center px-8">
          <div className="max-w-7xl pointer-events-auto text-center">
            <p className="text-2xl md:text-3xl leading-relaxed max-w-4xl opacity-0 transform translate-y-8 text-zinc-300 font-medium mb-12">
              Join the waitlist to get early access to the next generation of fashion and social interaction.
            </p>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center px-8 pointer-events-auto">
          <WaitlistForm />
        </section>
      </div>
    </div>
  )
}

export default App

