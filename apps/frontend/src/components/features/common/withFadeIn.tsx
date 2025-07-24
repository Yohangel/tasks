'use client';

import { motion } from 'framer-motion';
import { ComponentType } from 'react';

/**
 * Higher-order component that adds a fade-in animation to any component
 * @param Component The component to wrap with fade-in animation
 * @param delay Optional delay before animation starts (in seconds)
 * @returns The component wrapped with fade-in animation
 */
export function withFadeIn<P extends object>(
  Component: ComponentType<P>,
  delay: number = 0
) {
  return function WithFadeIn(props: P) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
}