"use client"

import { ReactNode, forwardRef, useRef, useEffect, useState } from "react"
import { motion, useInView, Variants } from "framer-motion"

interface TimelineContentProps {
  children: ReactNode
  as?: React.ElementType
  animationNum?: number
  timelineRef?: React.RefObject<HTMLDivElement | null>
  customVariants?: Variants
  className?: string
}

export const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ children, as: Component = "div", animationNum = 0, timelineRef, customVariants, className, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(localRef, { once: true, margin: "-100px" })
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
      if (isInView && !hasAnimated) {
        setHasAnimated(true)
      }
    }, [isInView, hasAnimated])

    const variants = customVariants || {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }

    const mergedRef = ref || localRef

    if (Component === "div") {
      return (
        <div
          ref={mergedRef as any}
          className={className}
          {...props}
        >
          <motion.div
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={variants}
            custom={animationNum}
          >
            {children}
          </motion.div>
        </div>
      )
    }

    if (Component === "p") {
      return (
        <p
          ref={mergedRef as any}
          className={className}
          {...props}
        >
          <motion.div
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            variants={variants}
            custom={animationNum}
          >
            {children}
          </motion.div>
        </p>
      )
    }

    return (
      <Component
        ref={mergedRef as any}
        className={className}
        {...(props as any)}
      >
        <motion.div
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          variants={variants}
          custom={animationNum}
        >
          {children}
        </motion.div>
      </Component>
    )
  }
)

TimelineContent.displayName = "TimelineContent"
