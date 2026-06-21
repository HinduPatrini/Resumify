import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = true,
  ...props
}) {
  const isClickable = !!onClick;
  const CardComponent = isClickable ? motion.div : 'div';
  
  const interactionProps = isClickable 
    ? {
        whileHover: hoverable ? { y: -4, borderColor: 'rgba(110, 92, 245, 0.6)', boxShadow: '0 10px 20px -10px rgba(0,0,0,0.5)' } : {},
        whileTap: hoverable ? { scale: 0.99 } : {},
        onClick,
        style: { cursor: 'pointer' }
      }
    : {};

  return (
    <CardComponent
      className={`bg-dark-card border border-dark-border rounded-xl p-6 transition-colors duration-300 ${className}`}
      {...interactionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}
