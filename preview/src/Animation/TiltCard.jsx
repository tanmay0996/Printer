import React, { useRef } from 'react';
import { Box, Card } from '@mui/material';

const TiltCard = ({ children, sx, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const deltaX = (x - midX) / midX;
    const deltaY = (y - midY) / midY;
    const rotateX = deltaY * 15; // adjust intensity as needed
    const rotateY = -deltaX * 15;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <Box
      sx={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        ref={cardRef}
        elevation={5}
        sx={{
          border: '1px solid #ccc',
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </Box>
  );
};

export default TiltCard;
