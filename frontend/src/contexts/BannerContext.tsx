import { createContext, useContext, useState, ReactNode } from 'react';

interface BannerContextType {
  isBannerVisible: boolean;
  closeBanner: () => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  // Banner is hidden by default. To display a banner (e.g. Summer Camp),
  // set the initial value below to `true`.
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  const closeBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <BannerContext.Provider value={{ isBannerVisible, closeBanner }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};
