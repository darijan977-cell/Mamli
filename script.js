document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SLIDER TRACK LOGIC ---
    const track = document.getElementById("sliderTrack");
    const dotsContainer = document.getElementById("dotsNav");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let currentIndex = 0;
    const totalUniqueSlides = 8; 
    const stepPercentage = 11.1111;

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalUniqueSlides; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll(".dot");

    // Initial Load Animations
    gsap.from(".navbar-dark", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
    
    gsap.from(".slider-track .slide:first-child .text-line", { 
        y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 
    });
    
    gsap.from(".slider-track .slide:first-child .product-image", { 
        scale: 0.5, rotation: -15, opacity: 0, duration: 1, ease: "elastic.out(1, 0.6)", delay: 0.4 
    });
    
    gsap.from(".slider-track .slide:first-child .price-stamp", { 
        scale: 0, rotation: 90, opacity: 0, duration: 0.8, ease: "back.out(1.5)", delay: 0.6 
    });

    function updateDots(index) {
        if (dots.length > 0) {
            dots.forEach(d => d.classList.remove("active"));
            dots[index % totalUniqueSlides].classList.add("active");
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        const shiftAmount = -(currentIndex * stepPercentage);
        
        updateDots(currentIndex);

        if (track) {
            gsap.to(track, {
                x: `${shiftAmount}%`,
                duration: 0.4, 
                ease: "power2.out",
                overwrite: "auto", 
                onComplete: () => {
                    if (currentIndex === totalUniqueSlides) {
                        currentIndex = 0;
                        gsap.set(track, { x: "0%" });
                    }
                }
            });
        }

        gsap.fromTo([".background-text", ".product-image", ".price-stamp"], 
            { scale: 0.8, opacity: 0, rotation: -5 },
            { 
                scale: 1, 
                opacity: 1, 
                rotation: 0,
                duration: 0.45, 
                stagger: 0.05, 
                ease: "back.out(1.4)", 
                overwrite: "auto" 
            }
        );
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex >= totalUniqueSlides) {
                currentIndex = 0;
                if (track) gsap.set(track, { x: "0%" });
            }
            goToSlide(currentIndex + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex === 0) {
                currentIndex = totalUniqueSlides;
                const terminalPosition = -(currentIndex * stepPercentage);
                if (track) gsap.set(track, { x: `${terminalPosition}%` });
                setTimeout(() => goToSlide(totalUniqueSlides - 1), 10);
            } else {
                goToSlide(currentIndex - 1);
            }
        });
    }

    setInterval(() => {
        if (track && !gsap.isTweening(track) && nextBtn) {
            nextBtn.click();
        }
    }, 8000); 

    // --- 2. BURGER ASSEMBLY GSAP ENGINE ---
    gsap.registerPlugin(ScrollTrigger);

    const burgerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".assembly-section", 
            start: "top 40%",             
            end: "bottom 10%", 
            scrub: 2.5,        
        }
    });

    burgerTimeline
        .fromTo(".layer-top-bun",   { y: -600, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0)
        .fromTo(".layer-lettuce",   { y: -450, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.05)
        .fromTo(".layer-patty",     { y: -300, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.1)
        .fromTo(".layer-cheese",    { y: -150, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.15)
        .fromTo(".layer-tomatoes",  { y: 150,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.2)
        .fromTo(".layer-sauce",     { y: 300,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.25)
        .fromTo(".layer-bottom-bun",{ y: 450,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.3)
        .to({}, { duration: 1.5 }); 

    // --- 3. GSAP SCROLLTRIGGER FLY-INS ---
    gsap.utils.toArray(".anim-left").forEach(item => {
        gsap.fromTo(item, 
            { x: -100, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.85, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%", 
                    toggleActions: "play none none none"
                }
            }
        );
    });

    gsap.utils.toArray(".anim-right").forEach(item => {
        gsap.fromTo(item, 
            { x: 100, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.85, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // --- 4. CATEGORY TABS (CARDS) LOGIC ---
    const catCards = document.querySelectorAll('.cat-card');
    const catSections = document.querySelectorAll('.menu-category-section');

    catCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active state from all cards and sections
            catCards.forEach(c => c.classList.remove('active'));
            catSections.forEach(s => s.classList.remove('active'));

            // Add active state to clicked card
            card.classList.add('active');

            // Show target section
            const targetId = card.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                ScrollTrigger.refresh(); // Recalculate scroll triggers for content setup
                
                // Add bounce animation to incoming category items
                gsap.fromTo(targetSection.querySelectorAll('.menu-item'),
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
                );
            }
        });
    });

    // --- 5. DYNAMIC LANGUAGE SWITCHING SYSTEM ---
    const langButtons = document.querySelectorAll(".lang-toggle-btn");

    langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            langButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const targetLang = btn.getAttribute("data-target-lang");

            document.querySelectorAll("[data-en], [data-mk]").forEach(element => {
                const textToAssign = element.getAttribute(`data-${targetLang}`);
                if (textToAssign) {
                    element.innerHTML = textToAssign;
                }
            });
        });
    });

    // --- 6. DYNAMIC SCROLL SPY TRACKER & SMOOTH LINK CLICK HANDLER ---
    const sections = [
        { id: "home", linkId: "homeLink" },
        { id: "menu", linkId: "menuLink" },
        { id: "contact", linkId: "contactLink" }
    ];

    // Smooth Navigation Jump Scrolling Handler
    sections.forEach(({ id, linkId }) => {
        const linkElement = document.getElementById(linkId);
        
        if (linkElement) {
            linkElement.addEventListener("click", (e) => {
                e.preventDefault();
                
                if (id === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    const targetSection = document.getElementById(id);
                    if (targetSection) {
                        const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 90;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                }
            });
        }
    });

    // Active Scrollspy Highlight Trigger Loop
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Trigger active state when section takes up the primary view window space
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active styling from all links
                document.querySelectorAll(".nav-center-capsule .nav-link").forEach(link => {
                    link.classList.remove("active");
                });

                // Set current item active matching the screen zone
                const matchingSection = sections.find(s => s.id === entry.target.id);
                if (matchingSection) {
                    const activeLink = document.getElementById(matchingSection.linkId);
                    if (activeLink) activeLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    // Watch your structural sections on the page layout
    const menuSec = document.getElementById("menu");
    const contactSec = document.getElementById("contact");
    
    if (menuSec) observer.observe(menuSec);
    if (contactSec) observer.observe(contactSec);

    // Fallback tracker for Home when scrolling all the way back to top page boundaries
    window.addEventListener("scroll", () => {
        if (window.scrollY < 200) {
            document.querySelectorAll(".nav-center-capsule .nav-link").forEach(link => link.classList.remove("active"));
            const homeBtn = document.getElementById("homeLink");
            if (homeBtn) homeBtn.classList.add("active");
        }
    });

    // --- 7. SCOOTER TRACK ANIMATION ---
    const trackSection = document.querySelector('.scooter-track-section');

    if (trackSection) {
        gsap.to(".scooter-animation-container", {
            x: () => trackSection.offsetWidth + 150, 
            duration: 10,                            
            ease: "none",
            repeat: -1,
            startAt: { x: -150 },                    
            onUpdate: function() {
                const currentX = gsap.getProperty(".scooter-animation-container", "x");
                const sectionWidth = trackSection.offsetWidth;
                
                // Keep line width synced with scooter
                const progressWidth = Math.min(sectionWidth, Math.max(0, currentX));
                gsap.set(".scooter-progress-fill", { width: progressWidth });
            }
        });
    }

    // Engine/Bumpy Road Vibration
    gsap.to(".scooter-guy", {
        y: -3,
        duration: 0.12,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
    
});
