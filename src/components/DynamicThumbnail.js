"use client";

import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

export default function DynamicThumbnail({ product }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // 1. Handle Resize (Scale)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const designWidth = product.canvas_settings?.width || 600;
        setScale(parentWidth / designWidth);
      }
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [product]);

  // 2. NEW: Automatically Load Fonts from Google
  useEffect(() => {
    if (!product.preview_zones) return;

    product.preview_zones.forEach(zone => {
      if (zone.fontFamily) {
        const fontName = zone.fontFamily;
        const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
        
        // Check if font is already added to document
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          // Convert "Open Sans" to "Open+Sans" for URL
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  }, [product.preview_zones]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ aspectRatio: `${product.canvas_settings?.width || 600}/${product.canvas_settings?.height || 850}` }}
    >
      
      {/* Background Image */}
      <img 
        src={product.thumbnail_url || "/placeholder.png"} 
        alt={product.title || "Product Thumbnail"} 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Text Overlay Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${product.canvas_settings?.width || 600}px`,
          height: `${product.canvas_settings?.height || 850}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      >
        {product.preview_zones?.map((zone) => (
          <div
            key={zone.id}
            style={{
              position: "absolute",
              left: `${zone.x}px`,
              top: `${zone.y}px`,
              width: `${zone.width}px`,
              height: `${zone.height}px`,
              transform: `rotate(${zone.rotation}deg)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              
              // --- APPLY FONT FAMILY ---
              fontFamily: zone.fontFamily || 'Arial', 
              fontSize: `${zone.fontSize}px`,
              fontWeight: zone.fontWeight,
              color: zone.color,
              textAlign: zone.textAlign,
              whiteSpace: "pre-wrap",
              lineHeight: 1.2,
            }}
          >
            {zone.text || "Sample"}
          </div>
        ))}
      </div>
    </div>
  );
}

DynamicThumbnail.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    thumbnail_url: PropTypes.string,
    canvas_settings: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    preview_zones: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      rotation: PropTypes.number,
      text: PropTypes.string,
      fontSize: PropTypes.number,
      color: PropTypes.string,
      fontFamily: PropTypes.string, // Added PropType
    }))
  }).isRequired
};