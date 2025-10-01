import React from "react";

interface BackgroundBlobsProps {
  leftBlobSrc: string;
  rightBlobSrc: string;
  className?: string;     
}

export const BackgroundBlobs = ({ 
  leftBlobSrc, 
  rightBlobSrc, 
  className = "" 
}: BackgroundBlobsProps) => {
  return (
    <>
      <img 
        src={leftBlobSrc}
        alt=""
        className={`fixed -left-90 -bottom-70 w-200 h-200 opacity-20 blur-[100px] pointer-events-none z-0 ${className}`}
      />
      
      <img 
        src={rightBlobSrc}
        alt=""
        className={`fixed -right-80 -top-0 w-200 h-200 opacity-20 blur-[100px] pointer-events-none z-0 ${className}`}
      />
    </>
  );
};