import { useState } from 'react'
import { motion } from 'framer-motion'
import './AccordionSection.css'

function AccordionSection({ title, defaultOpen = false, actions, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [animating, setAnimating] = useState(false)

  return (
    <div className={`sidebar-section${isOpen ? ' open' : ''}`}>
      <button
        className="sidebar-section-title"
        onClick={() => { setIsOpen(o => !o); setAnimating(true) }}
      >
        {title}
        {actions}
      </button>
      <motion.div
        style={{ overflow: (isOpen && !animating) ? 'visible' : 'hidden' }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        initial={false}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onAnimationComplete={() => setAnimating(false)}
      >
        <div className="sidebar-section-body">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export default AccordionSection
