"use client";

import { useRef, useState, useEffect } from "react";

// --- 1. HELPER: PROTECTED IMAGE ---
const ProtectedImage = ({ url }) => {
  if (!url) return null;
  return (
    <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${url}')` }} />
    </div>
  );
};

// --- 2. HELPER: STATIC TEXT ZONE (FIXED ALIGNMENT) ---
const StaticTextZone = ({ zone, value, userStyle }) => {
  // 1. Determine Font & Color
  const activeFont = userStyle?.fontFamily || (zone.fontFamily ? zone.fontFamily.replace(/['"]/g, "").split(",")[0] : "Arial");
  const activeColor = userStyle?.color || zone.color || "#000";
  const fontSize = zone.fontSize || 32;
  
  // 2. Alignment Logic (Updated)
  // We prioritize the User's choice or the Zone's default. 
  // We only default to 'center' if nothing is defined.
  const textAlign = userStyle?.textAlign || zone.textAlign || 'center';
  
  // Map textAlign to Flexbox justifyContent
  const justifyContent = 
    textAlign === 'left' ? 'flex-start' : 
    textAlign === 'right' ? 'flex-end' : 
    'center';

  return (
    <div
      style={{
        position: "absolute", 
        left: `${zone.x}px`, 
        top: `${zone.y}px`, 
        width: `${zone.width}px`, 
        height: `${zone.height}px`,
        transform: `rotate(${zone.rotation}deg)`, 
        zIndex: 20,
        
        // Flexbox centering
        display: "flex", 
        flexDirection: "column", // Stack text lines vertically
        justifyContent: "center", // Vertically center the block of text
        alignItems: justifyContent, // Horizontally align the block (Left/Center/Right)
        
        fontFamily: activeFont, 
        fontSize: `${fontSize}px`, 
        fontWeight: zone.fontWeight || "normal",
        color: activeColor, 
        textAlign: textAlign, 
        
        // Text Wrapping Fixes
        whiteSpace: "pre-wrap",   // Respects line breaks
        wordBreak: "break-word",  // Prevents long words from overflowing
        lineHeight: 1.3,
        pointerEvents: "none",
        padding: "5px" // Small padding to prevent cutting off italic fonts
      }}
    >
      {value || zone.text || ""}
    </div>
  );
};

// --- 3. HELPER: PAGE CONTENT RENDERER ---
const PageContent = ({ slide, userInputs, userStyles }) => (
    <>
        <ProtectedImage url={slide?.background_url} />
        
        {/* Render Static Zones */}
        {slide?.static_zones?.map((zone) => (
            zone.type === 'emoji' ? (
                <div key={zone.id} style={{ position: "absolute", left: `${zone.x}px`, top: `${zone.y}px`, width: `${zone.width}px`, height: `${zone.height}px`, transform: `rotate(${zone.rotation}deg)`, fontSize: `${(zone.fontSize || zone.height) * 0.8}px`, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 5 }}>
                    {zone.emoji}
                </div>
            ) : (
                <StaticTextZone 
                    key={zone.id} 
                    zone={zone} 
                    value="" 
                    userStyle={{}} 
                />
            )
        ))}

        {/* Render Dynamic Zones */}
        {slide?.dynamic_zones?.map((zone) => (
            <StaticTextZone 
                key={zone.id} 
                zone={zone} 
                value={userInputs?.[String(zone.id)]} 
                userStyle={userStyles?.[String(zone.id)]}
            />
        ))}
    </>
);

// --- 4. MAIN COMPONENT ---
export default function ReadOnlyCard({ product, viewState, userInputs, userStyles }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Handle Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && product && product.canvas_settings) {
        const parentWidth = containerRef.current.offsetWidth;
        const cardWidth = product.canvas_settings.width; 
        const contentWidth = viewState === 'inner' ? cardWidth * 2.1 : cardWidth * 1.1; 
        const newScale = Math.min((parentWidth) / contentWidth, 1); 
        setScale(newScale > 0 ? newScale : 1);
      }
    };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100); 
    return () => window.removeEventListener("resize", handleResize);
  }, [product, viewState]);

  // Load Fonts
  useEffect(() => {
    if (!product || !product.design_data) return;
    const slides = product.design_data.slides;
    if (!slides) return;

    const getZones = (slide) => [ ...(slide?.dynamic_zones || []), ...(slide?.static_zones || []) ];

    const allZones = [
        ...getZones(slides.front), 
        ...getZones(slides.left_inner), 
        ...getZones(slides.right_inner), 
        ...getZones(slides.back)
    ];

    allZones.forEach((zone) => {
      if (zone.fontFamily) {
        const cleanFont = zone.fontFamily.replace(/['"]/g, "").split(",")[0].trim();
        const linkId = `font-${cleanFont.replace(/\s+/g, '-')}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.href = `https://fonts.googleapis.com/css2?family=${cleanFont.replace(/ /g, "+")}&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
      }
    });
  }, [product]);

  if (!product || !product.canvas_settings) return null;

  const { width, height } = product.canvas_settings;
  const isInner = viewState === 'inner'; 
  const isBack = viewState === 'back';   
  const coverZ = isBack ? 0 : 20;
  const baseZ = isBack ? 20 : 10;

  return (
      <div ref={containerRef} className="w-full flex justify-center items-center perspective-container" style={{ height: `${height * scale}px` }}>
        <div className="relative transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
            style={{ width: `${width}px`, height: `${height}px`, transform: `scale(${scale}) translateX(${isInner ? '50%' : '0%'}) rotateY(${isBack ? '-180deg' : '0deg'})`, transformStyle: "preserve-3d" }}
        >
            {/* Front Cover & Inside Left */}
            <div className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]" style={{ transformStyle: "preserve-3d", transform: isInner ? 'rotateY(-180deg)' : 'rotateY(0deg)', zIndex: coverZ }}>
                <div className="absolute inset-0 bg-white shadow-xl backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}>
                    <PageContent slide={product.design_data.slides.front} userInputs={userInputs} userStyles={userStyles} />
                    <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-white shadow-md" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
                    <PageContent slide={product.design_data.slides.left_inner} userInputs={userInputs} userStyles={userStyles} />
                    <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* Inside Right & Back Cover */}
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", zIndex: baseZ }}>
                <div className="absolute inset-0 bg-white shadow-md backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <PageContent slide={product.design_data.slides.right_inner} userInputs={userInputs} userStyles={userStyles} />
                    <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                </div>
                <div className="absolute inset-0 bg-white shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(2px)' }}>
                    <PageContent slide={product.design_data.slides.back} userInputs={userInputs} userStyles={userStyles} />
                </div>
            </div>
        </div>
        
        <style jsx global>{`
        .perspective-container { perspective: 2500px; } 
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
      </div>
  );
}