'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

/**
 * SkipLink component for accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 */
export function SkipLink() {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  // Reset focus state when route changes
  useEffect(() => {
    setIsFocused(false);
  }, []);

  return (
    <a
      href="#main-content"
      className={`
        fixed top-2 left-2 p-2 bg-blue-500 text-white z-50 rounded
        transition-transform duration-200
        ${isFocused ? 'translate-y-0' : '-translate-y-full'}
        focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {t('common.skipToContent')}
    </a>
  );
}