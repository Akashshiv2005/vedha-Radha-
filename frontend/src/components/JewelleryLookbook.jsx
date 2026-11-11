import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LEAVES = [
  // LEAF 0: FRONT = OFFICIAL GOLD HERITAGE MAGAZINE COVER | BACK = SPREAD 1 LEFT (KASU HARAM)
  {
    leafIndex: 0,
    front: {
      isCover: true,
      image: '/images/magazine_cover_gold_heritage_clean.jpg?v=6',
      alt: 'Gold Heritage - The Jewellery Magazine Master Cover'
    },
    back: {
      tag: 'SACRED TEMPLE HARAM',
      title: 'Centuries of Sacred Devotion',
      plate: 'Plate 01: Sacred Temple Kasu Haram',
      num: '01',
      note: 'Consecrated Nakshi coin garland with Goddess Lakshmi centerpiece',
      image: '/images/plate_01_temple_kasu_haram_pristine.jpg?v=6',
      alt: 'Sacred Signature Temple Kasu Haram'
    }
  },

  // LEAF 1: SPREAD 1 RIGHT (KADAS) | SPREAD 2 LEFT (CHOKER)
  {
    leafIndex: 1,
    front: {
      tag: 'HEIRLOOM KADAS',
      title: 'Veera Simha Bangles',
      plate: 'Plate 02: Solid 22K Veera Simha & Lakshmi Kadas',
      num: '02',
      note: 'Heavy 64g solid antique filigree wristwear with ruby cabochons',
      image: '/images/plate_07_royal_antique_kadas_pristine.jpg?v=6',
      alt: 'Solid 64g 22K Veera Simha & Lakshmi Antique Bangles'
    },
    back: {
      tag: 'BRIDAL CHOKER',
      title: 'Royal Peacock Choker',
      plate: 'Plate 03: Hand-Chased Royal Peacock Bridal Choker',
      num: '03',
      note: 'Sculpted Mayil (peacock) motifs cast in 916 pure gold with untreated emeralds',
      image: '/images/plate_05_royal_peacock_choker_pristine.jpg?v=6',
      alt: 'Grand 22K Bridal Peacock Choker and Jhumkas'
    }
  },

  // LEAF 2: SPREAD 2 RIGHT (JHUMKAS) | SPREAD 3 LEFT (VADDANAM)
  {
    leafIndex: 2,
    front: {
      tag: 'PEACOCK JHUMKAS',
      title: 'Chettinad Temple Jhumkas',
      plate: 'Plate 04: Chettinad Royal Peacock Bell Jhumkas',
      num: '04',
      note: 'Classic South Indian bridal jhumkas with ruby cabochons and pearl drops',
      image: '/images/plate_09_chettinad_peacock_jhumkas_pristine.jpg?v=6',
      alt: 'Exclusive Handcrafted Peacock Temple Jhumkas'
    },
    back: {
      tag: 'TEMPLE VADDANAM',
      title: 'Royal Nakshi Waistbelt',
      plate: 'Plate 05: Handcrafted Royal Temple Vaddanam',
      num: '05',
      note: 'Masterpiece 22K bridal waistbelt hand-chased with Ashtalakshmi motifs',
      image: '/images/plate_06_royal_nakshi_vaddanam_pristine.jpg?v=6',
      alt: 'Handcrafted Royal Nakshi Temple Vaddanam'
    }
  },

  // LEAF 3: SPREAD 3 RIGHT (MANGA MALAI) | SPREAD 4 LEFT (SURYA PENDANT)
  {
    leafIndex: 3,
    front: {
      tag: 'HERITAGE MANGA MALAI',
      title: '22K Solid Antique Mango Mala',
      plate: 'Plate 06: Sacred Antique Gold Maanga Malai',
      num: '06',
      note: 'Handcrafted paisley motifs with uncut cabochon rubies on crimson silk',
      image: '/images/plate_04_antique_gold_manga_malai_pristine.jpg?v=6',
      alt: '22K Solid Antique South Indian Mango Mala'
    },
    back: {
      tag: 'TEMPLE SURYA PENDANT',
      title: 'Auspicious Surya Locket',
      plate: 'Plate 07: Handcrafted 22K Temple Surya Nakshi Pendant',
      num: '07',
      note: 'Radiant solar medallion embossed with divine iconography & pearl drops',
      image: '/images/new-arrivals/new-arrival-exclusive-surya-pendant-01.jpg',
      alt: 'Handcrafted 22K Temple Surya Nakshi Pendant'
    }
  },

  // LEAF 4: SPREAD 4 RIGHT (MUHURTHAM HARAM) | SPREAD 5 LEFT (IMPERIAL CHOKER)
  {
    leafIndex: 4,
    front: {
      tag: 'MUHURTHAM GRAND HARAM',
      title: '22K Sacred Muhurtham Haram',
      plate: 'Plate 08: 22K Grand Temple Muhurtham Haram Suite',
      num: '08',
      note: 'Festooned with Basra pearls, nakshi Goddess Lakshmi, and matching jhumkas',
      image: '/images/plate_08_antique_temple_grand_haram_pristine.jpg?v=6',
      alt: '22K Grand Temple Muhurtham Kasu Haram Suite'
    },
    back: {
      tag: 'IMPERIAL MASTERPIECE',
      title: 'Imperial Peacock Choker',
      plate: 'Plate 09: 22K Royal Peacock Choker Suite',
      num: '09',
      note: 'Masterpiece 916 antique gold with hand-chased Mayil motifs and jhumkas',
      image: '/images/plate_10_imperial_peacock_choker_pristine.jpg?v=6',
      alt: 'Grand 22K Imperial Peacock Choker and Jhumkas'
    }
  },

  // LEAF 5: SPREAD 5 RIGHT (CARVED TEAKWOOD CHEST) | FINALE OFFICIAL BACK COVER
  {
    leafIndex: 5,
    front: {
      tag: 'VEDHA RADHA ARCHIVES',
      title: 'Heirloom Masterpiece Suite',
      plate: 'Plate 10: Master Heirlooms on Carved Teakwood Chest',
      num: '10',
      note: 'Solid 22K temple architecture castings with natural cabochon rubies',
      image: '/images/hero_temple_box.jpg?v=7',
      alt: 'Antique Lakshmi Choker on Teakwood Heirloom Chest'
    },
    back: {
      isBackCover: true,
      image: '/images/magazine_back_cover_thank_you.jpg',
      alt: 'Gold Heritage - The Jewellery Magazine Finale Back Cover'
    }
  }
];

export default function JewelleryLookbook() {
  const sectionRef = useRef(null);
  const bookContainerRef = useRef(null);
  const headerRef = useRef(null);
  const gildedEdgeRef = useRef(null);
  const shadowRef = useRef(null);
  const spreadTargetsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const bookContainer = bookContainerRef.current;
    if (!section || !bookContainer) return;

    const pageElements = gsap.utils.toArray('.booklet-page', section);
    if (pageElements.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 640px)',
        isTablet: '(min-width: 641px) and (max-width: 1023px)',
        isDesktop: '(min-width: 1024px)'
      },
      (context) => {
        const { isMobile, isTablet } = context.conditions;

        // Base 3D Booklet setup:
        // Closed state: Slender single cover, spine centered at 50vw - (W/2), vertical y = 0
        // Open state: Spine glides to 50vw (+50% xPercent), shifts up into the top space, and expands symmetrically
        gsap.set(bookContainer, {
          xPercent: 0,
          y: 0,
          scale: 1.0,
          transformOrigin: 'left center',
          force3D: true
        });

        // Initialize every leaf with deterministic stacking order:
        // Leaf 0 (top of right stack) has zIndex 20, Leaf 1 has 19, ..., Leaf 5 has 15
        pageElements.forEach((page, i) => {
          gsap.set(page, {
            rotationY: 0,
            zIndex: 20 - i,
            force3D: true
          });
        });

        // Durations & Butter-Smooth Scrub:
        const flipDur = 1.0;
        const restDur = 0.25; // Quick, natural reading rest between turns
        const totalSteps = pageElements.length; // 6 leaves

        // Generous scroll distance so fast scrolling glides smoothly through pages without freezing
        const scrollDistance = totalSteps * 48;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${scrollDistance}%`,
            scrub: 0.35, // Butter-smooth 0.35s dampening - eliminates mouse-wheel stutter and fast-scroll frame drops
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Record target progress points for precise next/previous navigation
        const targets = [0];

        // Dynamic adaptive scale: maximizes upper/down & left/right screen utilization
        // while ensuring the open magazine spread stays cleanly centered and never collides with the header
        const winW = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
        const navH = isMobile ? 65 : 95;

        let baseStageW = 375;
        let baseStageH = 505;
        if (isMobile) {
          baseStageW = 250;
          baseStageH = 350;
        } else if (isTablet) {
          baseStageW = 300;
          baseStageH = 410;
        } else if (winW >= 1536) {
          baseStageW = 395;
          baseStageH = 530;
        } else if (winW < 1280) {
          baseStageW = 350;
          baseStageH = 480;
        }

        const openSpreadW = baseStageW * 2;
        // Maximum safe height utilizing vertical space without hitting navbar or bottom
        const maxSafeH = Math.max(260, winH - navH - 46);
        // Maximum safe width utilizing horizontal space without clipping navigation arrows
        const maxSafeW = Math.max(300, winW - (isMobile ? 50 : 130));

        const scaleFromH = maxSafeH / baseStageH;
        const scaleFromW = maxSafeW / openSpreadW;

        // Pick optimal scale to utilize both upper/down and left/right space fully
        const openScale = Number(Math.min(Math.min(scaleFromH, scaleFromW), 1.16).toFixed(3));

        // Slightly move up to balance vertical margin between the header and the bottom taskbar
        const openY = isMobile ? 6 : (isTablet ? 12 : 18);

        // Timeline position 0: Ensure all initial values are registered in GSAP's timeline state
        pageElements.forEach((page, i) => {
          tl.set(page, { zIndex: 20 - i, rotationY: 0 }, 0);
        });
        if (gildedEdgeRef.current) {
          tl.set(gildedEdgeRef.current, { opacity: 1 }, 0);
        }
        if (shadowRef.current) {
          tl.set(shadowRef.current, { scaleX: 1.0, y: 0 }, 0);
        }

        // ==========================================
        // STEP 1: COVER OPEN (Leaf 0)
        // ==========================================
        const coverLabel = 'flip_0';
        tl.addLabel(coverLabel);

        // Active flipping page gets zIndex 50 (above both left and right stacks)
        tl.set(pageElements[0], { zIndex: 50 }, coverLabel);

        // Header fades up & away to maximize vertical reading area
        if (headerRef.current) {
          tl.to(
            headerRef.current,
            {
              opacity: 0,
              y: -30,
              duration: flipDur * 0.75,
              ease: 'none',
              pointerEvents: 'none'
            },
            coverLabel
          );
        }

        // Floor shadow expands under the open spread
        if (shadowRef.current) {
          tl.to(
            shadowRef.current,
            {
              scaleX: openScale * 1.5,
              y: openY,
              duration: flipDur,
              ease: 'none',
              force3D: true
            },
            coverLabel
          );
        }

        // Spine glides to 50vw, moves slightly UP into the top space, and container scales up
        tl.to(
          bookContainer,
          {
            xPercent: 50,
            y: openY,
            scale: openScale,
            duration: flipDur,
            ease: 'none',
            force3D: true
          },
          coverLabel
        );

        // Leaf 0 turns 180 degrees smoothly with linear ease
        tl.to(
          pageElements[0],
          {
            rotationY: -180,
            duration: flipDur,
            ease: 'none',
            force3D: true
          },
          coverLabel
        );

        // When Leaf 0 finishes rotation, it lands at the bottom of the left stack (zIndex: 1)
        tl.set(pageElements[0], { zIndex: 1 }, `${coverLabel}+=${flipDur}`);

        // Reading pause on Spread 1
        tl.to({}, { duration: restDur });

        // Record timeline progress for Spread 1
        targets.push(tl.duration());

        // ==========================================
        // STEPS 2-N: SUBSEQUENT LEAVES (1 through 5)
        // ==========================================
        for (let i = 1; i < pageElements.length; i++) {
          const leafLabel = `flip_${i}`;
          tl.addLabel(leafLabel);

          // Elevate active leaf above both stacks during motion
          tl.set(pageElements[i], { zIndex: 50 + i }, leafLabel);

          // Linear, silky-smooth 3D flip
          tl.to(
            pageElements[i],
            {
              rotationY: -180,
              duration: flipDur,
              ease: 'none',
              force3D: true
            },
            leafLabel
          );

          // FINALE: When the final leaf (Thank You back cover) turns, the magazine closes smoothly!
          if (i === pageElements.length - 1) {
            // Container glides to xPercent: 100, perfectly centering the closed back cover at 50vw
            tl.to(
              bookContainer,
              {
                xPercent: 100,
                y: 0,
                scale: 1.0,
                duration: flipDur,
                ease: 'none',
                force3D: true
              },
              leafLabel
            );

            // Gilded edge on empty right side fades out
            if (gildedEdgeRef.current) {
              tl.to(
                gildedEdgeRef.current,
                {
                  opacity: 0,
                  duration: flipDur * 0.5,
                  ease: 'none'
                },
                leafLabel
              );
            }

            // Floor shadow contracts smoothly back to single book width directly under back cover
            if (shadowRef.current) {
              tl.to(
                shadowRef.current,
                {
                  scaleX: 1.0,
                  y: 0,
                  duration: flipDur,
                  ease: 'none',
                  force3D: true
                },
                leafLabel
              );
            }

            // Re-show header celebrating the completed volume
            if (headerRef.current) {
              tl.to(
                headerRef.current,
                {
                  opacity: 1,
                  y: 0,
                  duration: flipDur * 0.8,
                  ease: 'none',
                  pointerEvents: 'auto'
                },
                `${leafLabel}+=${flipDur * 0.25}`
              );
            }
          }

          // On landing, active leaf sits cleanly on top of previous left pages (zIndex: 1 + i)
          tl.set(pageElements[i], { zIndex: 1 + i }, `${leafLabel}+=${flipDur}`);

          // Reading pause on open spreads; minimal settle on closed back cover so scrolling doesn't get stuck
          if (i < pageElements.length - 1) {
            tl.to({}, { duration: restDur });
          } else {
            tl.to({}, { duration: 0.08 });
          }

          targets.push(tl.duration());
        }

        // Convert targets to 0-1 normalized progress values
        const totalDuration = tl.duration();
        spreadTargetsRef.current = targets.map((t) => t / totalDuration);
      }
    );

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      mm.revert();
    };
  }, []);

  // Butter-smooth navigation to specific spread progress
  const scrollToProgress = (targetProg) => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.getAll().find(
      (t) => t.trigger === sectionRef.current
    );
    if (!trigger) return;

    const clampedProg = Math.max(0, Math.min(1, targetProg));
    const targetScroll = trigger.start + (trigger.end - trigger.start) * clampedProg;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleNext = () => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.getAll().find(
      (t) => t.trigger === sectionRef.current
    );
    if (!trigger) return;

    const currentProg = trigger.progress;
    const targets = spreadTargetsRef.current;
    if (!targets || targets.length === 0) return;

    // Find the next spread threshold ahead of current position
    const nextTarget = targets.find((t) => t > currentProg + 0.04);
    if (nextTarget !== undefined) {
      scrollToProgress(nextTarget);
    } else {
      scrollToProgress(1);
    }
  };

  const handlePrev = () => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.getAll().find(
      (t) => t.trigger === sectionRef.current
    );
    if (!trigger) return;

    const currentProg = trigger.progress;
    const targets = spreadTargetsRef.current;
    if (!targets || targets.length === 0) return;

    // Find the previous spread threshold behind current position
    const prevTargets = targets.filter((t) => t < currentProg - 0.04);
    if (prevTargets.length > 0) {
      const prevTarget = prevTargets[prevTargets.length - 1];
      scrollToProgress(prevTarget);
    } else {
      scrollToProgress(0);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F3E5CD] text-[#2C1810] select-none border-t border-[#D4AF37]/45 w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <style>{`
        .booklet-scene {
          width: 100%;
          height: 100%;
          perspective: 2000px;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        /* Responsive 3D Booklet Stage (Single Page Width - Slender when closed) */
        .booklet-stage {
          position: relative;
          width: 250px;
          height: 350px;
          transform-style: preserve-3d;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          will-change: transform;
        }

        @media (min-width: 640px) {
          .booklet-stage {
            width: 300px;
            height: 410px;
          }
        }

        @media (min-width: 1024px) {
          .booklet-stage {
            width: 350px;
            height: 480px;
          }
        }

        @media (min-width: 1280px) {
          .booklet-stage {
            width: 375px;
            height: 505px;
          }
        }

        @media (min-width: 1536px) {
          .booklet-stage {
            width: 395px;
            height: 530px;
          }
        }

        /* Each Leaf page is 100% width of the stage, flipping around the left spine edge */
        .booklet-page {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: left center;
          border-radius: 4px 10px 10px 4px;
          will-change: transform;
          transform: translateZ(0);
        }

        .booklet-face-front,
        .booklet-face-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 4px 10px 10px 4px;
          overflow: hidden;
          will-change: transform;
          transform: translateZ(0);
          box-shadow: 0 8px 22px -4px rgba(0, 0, 0, 0.7);
        }

        .booklet-face-front {
          transform: rotateY(0deg) translateZ(1px);
        }

        .booklet-face-back {
          transform: rotateY(180deg) translateZ(1px);
          border-radius: 10px 4px 4px 10px;
        }
      `}</style>

      {/* =========================================================================
          1. PHOTOREALISTIC LUXURY JEWELLERY SHOWROOM BOUTIQUE BACKGROUND
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/luxury_jewellery_showroom_bg.jpg"
          alt="Luxury Jewellery Showroom Boutique Interior"
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Soft golden boutique lighting blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF3E6]/25 via-transparent to-[#FAF3E6]/10 pointer-events-none" />
        
        {/* Seamless blend gradient into Customer Reviews below */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#FAF3E6]/50 to-[#FAF3E6] pointer-events-none z-20" />
      </div>

      {/* Central Soft Golden Ambient Radiance Behind Book (Pure hardware-accelerated radial glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] max-w-full h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.07)_45%,transparent_70%)] rounded-full pointer-events-none z-0 transform-gpu" />

      {/* Viewport Stage: Constrained to screen height without taskbar collision */}
      <div className="w-full h-screen max-h-screen flex flex-col justify-between pt-3 pb-3 px-3 sm:px-6 relative z-10 box-border">
        
        {/* 1. TOP HEADER (Auto-fades out on scroll when magazine opens to give full vertical space) */}
        <div ref={headerRef} className="text-center max-w-xl mx-auto flex-shrink-0 z-20 transition-all duration-300">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF7]/95 border border-[#C5A059]/70 text-[#4A0E17] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] mb-1 shadow-sm backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>GOLD HERITAGE • THE JEWELLERY MAGAZINE</span>
          </div>

          <h2 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#35050C] tracking-tight leading-tight"
          >
            The Gold Heritage Magazine
          </h2>

          <p className="text-[11px] sm:text-xs text-[#6D533D] mt-0.5 font-light">
            Scroll down to open the volume and flip the pages smoothly.
          </p>
        </div>

        {/* 2. CENTERED 3D BOOKLET STAGE */}
        <div className="flex-1 flex items-center justify-center my-auto w-full relative z-10 overflow-visible">
          
          {/* Floating Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Page"
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/95 hover:bg-[#B8860B] text-[#7A5510] hover:text-[#FFFDF9] border border-[#C5A059]/60 flex items-center justify-center shadow-[0_6px_22px_rgba(180,140,60,0.22)] transition-all cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Floating Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Page"
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9]/95 hover:bg-[#B8860B] text-[#7A5510] hover:text-[#FFFDF9] border border-[#C5A059]/60 flex items-center justify-center shadow-[0_6px_22px_rgba(180,140,60,0.22)] transition-all cursor-pointer group"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3D Scene */}
          <div className="booklet-scene">
            {/* Natural Physical Floor Shadow Under 3D Booklet - Hardware Accelerated Radial Shadow */}
            <div 
              ref={shadowRef}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[260px] sm:w-[320px] lg:w-[380px] h-8 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_45%,transparent_75%)] rounded-full pointer-events-none z-0 transform-gpu" 
            />

            <div ref={bookContainerRef} className="booklet-stage">
              
              {/* Stacked Gilded Page Edge Depth Behind Booklet */}
              <div 
                ref={gildedEdgeRef}
                className="absolute -right-2 top-2 bottom-2 w-2.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF5D6] to-[#AA8222] rounded-r-sm shadow-md border-y border-r border-[#AA8222]/50 pointer-events-none transition-opacity" 
              />

              {/* RENDER ALL LEAVES */}
              {LEAVES.map((leaf, index) => (
                <div
                  key={leaf.leafIndex}
                  className="booklet-page"
                  data-index={index}
                >
                  
                  {/* FRONT FACE */}
                  <div className="booklet-face-front bg-[#180307] border-2 border-[#D4AF37]/75 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                    
                    {leaf.front.isCover ? (
                      /* FRONT COVER: 100% FULLY VISIBLE, ZERO CROPPING */
                      <div className="relative w-full h-full select-none bg-[#120205] flex items-center justify-center overflow-hidden">
                        <img
                          src={leaf.front.image}
                          alt={leaf.front.alt}
                          className="w-full h-full object-contain object-center select-none"
                          loading="eager"
                        />
                        {/* High-Gloss Spine & Edge Sheen */}
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
                      </div>
                    ) : (
                      /* INSIDE RIGHT PAGE: FULL BLEED LUXURY PHOTOGRAPHY (OCCUPIES FULL SPACE, NO EMPTY GAPS) */
                      <div className="relative w-full h-full flex flex-col justify-between select-none bg-[#160205] overflow-hidden">
                        
                        {/* Main Jewelry Photograph - Occupies Full Frame */}
                        <img
                          src={leaf.front.image}
                          alt={leaf.front.alt}
                          className="absolute inset-0 w-full h-full object-cover object-center select-none"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/hero_opulent_temple_jewelry_still_life.png';
                          }}
                        />

                        {/* High-Fashion Vignette & Deep Spine Shadows */}
                        <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-3 border border-[#D4AF37]/45 pointer-events-none rounded z-20" />

                        {/* Floating Top Editorial Bar */}
                        <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-[#DECDBB]">
                          <span className="font-mono text-[#D4AF37] drop-shadow">GOLD HERITAGE GAZETTE</span>
                          <span className="font-semibold text-[#F3E5AB] drop-shadow">{leaf.front.tag}</span>
                        </div>

                        {/* Floating Bottom Plate Caption & Page Number */}
                        <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
                          <div className="max-w-[78%]">
                            <p 
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                              className="italic text-xs sm:text-sm text-white drop-shadow-md truncate font-medium"
                            >
                              {leaf.front.plate}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-[#DECDBB]/90 font-serif italic drop-shadow truncate mt-0.5">
                              {leaf.front.note}
                            </p>
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#D4AF37] drop-shadow">
                            — {leaf.front.num} —
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* BACK FACE (LANDS ON LEFT SIDE WHEN ROTATED -180DEG) */}
                  <div className="booklet-face-back bg-[#180307] border-2 border-[#D4AF37]/75 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                    
                    {leaf.back.isBackCover ? (
                      /* FINALE OFFICIAL "THANK YOU" BACK COVER: 100% PRISTINE FULL COVER, ZERO OVERLAYS */
                      <div className="relative w-full h-full select-none bg-[#FAF6EE] flex items-center justify-center overflow-hidden">
                        <img
                          src={leaf.back.image}
                          alt={leaf.back.alt}
                          className="w-full h-full object-contain object-center select-none"
                          loading="eager"
                        />
                        {/* High-Gloss Spine & Edge Sheen on Back Cover */}
                        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/45 via-white/10 to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-white/10 pointer-events-none" />
                      </div>
                    ) : (
                      /* REGULAR INSIDE LEFT SPREAD WITH LUXURY PHOTOGRAPHY & EDITORIAL CAPTIONS */
                      <div className="relative w-full h-full flex flex-col justify-between select-none bg-[#160205] overflow-hidden">
                        
                        {/* Main Jewelry Photograph - Occupies Full Frame */}
                        <img
                          src={leaf.back.image}
                          alt={leaf.back.alt}
                          className="absolute inset-0 w-full h-full object-cover object-center select-none"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/hero_opulent_temple_jewelry_still_life.png';
                          }}
                        />

                        {/* High-Fashion Vignette & Deep Spine Shadows */}
                        <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
                        <div className="absolute inset-3 border border-[#D4AF37]/45 pointer-events-none rounded z-20" />

                        {/* Floating Top Editorial Bar */}
                        <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-[#DECDBB]">
                          <span className="font-semibold text-[#D4AF37] drop-shadow">{leaf.back.tag}</span>
                          <span className="font-mono text-[#DECDBB] drop-shadow">TRADITION | ELEGANCE</span>
                        </div>

                        {/* Floating Bottom Plate Caption & Page Number */}
                        <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between">
                          <div className="max-w-[78%]">
                            <p 
                              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                              className="italic text-xs sm:text-sm text-white drop-shadow-md truncate font-medium"
                            >
                              {leaf.back.plate}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-[#DECDBB]/90 font-serif italic drop-shadow truncate mt-0.5">
                              {leaf.back.note}
                            </p>
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#D4AF37] drop-shadow">
                            — {leaf.back.num} —
                          </span>
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
