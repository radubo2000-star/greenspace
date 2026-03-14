import { ReactNode } from 'react'
import { useBanner } from '../contexts/BannerContext'

interface PageWrapperProps {
  children: ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const { isBannerVisible } = useBanner()
  
  // Calculate padding-top based on banner visibility
  const paddingTop = isBannerVisible 
    ? 'pt-[120px] sm:pt-[128px]' // Banner height (40-48px) + Header height (80px)
    : 'pt-20' // Just Header height (80px)

  return (
    <div className={`min-h-screen transition-all duration-300 ${paddingTop}`}>
      {children}
    </div>
  )
}

export default PageWrapper
