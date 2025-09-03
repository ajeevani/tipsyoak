import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    // Show title after 500ms
    const titleTimer = setTimeout(() => setShowTitle(true), 500);
    // Show subtitle after 2000ms
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2000);
    // Complete after 4200ms
    const completeTimer = setTimeout(() => onComplete(), 4200);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Faint Oak Tree Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="oak-tree-silhouette">
          {/* Tree trunk */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-40 bg-primary/30 rounded-t-lg"></div>
          
          {/* Tree canopy - multiple layers for depth */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 rounded-full bg-primary/20"></div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-x-8 w-48 h-48 rounded-full bg-primary/25"></div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 translate-x-8 w-48 h-48 rounded-full bg-primary/25"></div>
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-56 h-56 rounded-full bg-primary/30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center z-10 space-y-4">
        {/* Store Name */}
        <h1 className={`text-6xl md:text-8xl font-bold text-primary transition-opacity duration-1000 ${
          showTitle ? 'opacity-100' : 'opacity-0'
        }`}>
          Tipsy Oak
        </h1>
        
        {/* Welcome Text */}
        <p className={`text-lg md:text-xl text-foreground transition-opacity duration-1000 delay-500 ${
          showSubtitle ? 'opacity-100' : 'opacity-0'
        }`}>
          Welcome to Premium Spirits & More
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
