import { motion } from 'framer-motion';
import { Image } from '@heroui/image';

const logos = [
  "https://cdn-icons-png.flaticon.com/512/80/80804.png",
  "https://cdn-icons-png.flaticon.com/512/15/15476.png", 
  "https://cdn-icons-png.flaticon.com/512/299/299409.png",
  "https://cdn-icons-png.flaticon.com/512/5969/5969043.png"
];

const InfiniteLogoCarousel = () => {
  const logoWidth = 80;
  const gap = 32;
  const totalWidth = (logoWidth + gap) * logos.length;

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden py-8">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div
        className="flex gap-8"
        animate={{
          x: [0, -totalWidth]
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: 15,
            ease: "linear"
          }
        }}
      >
        {logos.map((logo, index) => (
          <motion.div
            key={`first-${index}`}
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.8
            }}
          >
            <Image 
              src={logo} 
              width={logoWidth}
              height={logoWidth}
              alt="Company logo"
              className="object-contain dark:invert dark:brightness-0 dark:hue-rotate-180"
            />
          </motion.div>
        ))}
        
        {logos.map((logo, index) => (
          <motion.div
            key={`second-${index}`}
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: (index + logos.length) * 0.8
            }}
          >
            <Image 
              src={logo} 
              width={logoWidth}
              height={logoWidth}
              alt="Company logo"
              className="object-contain dark:invert dark:brightness-0 dark:hue-rotate-180"
            />
          </motion.div>
        ))}

        {logos.map((logo, index) => (
          <motion.div
            key={`second-${index}`}
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: (index + logos.length) * 0.8
            }}
          >
            <Image 
              src={logo} 
              width={logoWidth}
              height={logoWidth}
              alt="Company logo"
              className="object-contain dark:invert dark:brightness-0 dark:hue-rotate-180"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteLogoCarousel;