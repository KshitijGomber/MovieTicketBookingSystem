import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Box, Typography } from '@mui/material';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  children,
}) {
  const ref = useRef(null);

  const x = useMotionValue();
  const y = useMotionValue();
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <Box
      component="figure"
      ref={ref}
      sx={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        perspective: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <Box
          sx={{
            position: 'absolute',
            top: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            display: { xs: 'block', sm: 'none' },
            color: 'text.secondary',
            zIndex: 10,
          }}
        >
          This effect is not optimized for mobile. Check on desktop.
        </Box>
      )}

      <motion.div
        style={{
          position: 'relative',
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {children || (
          <Box
            component="img"
            src={imageSrc}
            alt={altText}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: imageWidth,
              height: imageHeight,
              objectFit: 'cover',
              borderRadius: '15px',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              willChange: 'transform',
              transform: 'translateZ(30px)',
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '4px',
            backgroundColor: '#fff',
            padding: '4px 10px',
            fontSize: '10px',
            color: '#2d2d2d',
            opacity,
            zIndex: 3,
            x,
            y,
            rotate: rotateFigcaption,
          }}
        >
          <Typography variant="caption" sx={{ color: '#2d2d2d' }}>
            {captionText}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
}
