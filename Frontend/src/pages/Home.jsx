import { useState, useEffect, useRef } from "react";
import anime from "animejs";
import Nav from "../components/Nav";

function Home() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome to the DisRope!";
  const [currentIndex, setCurrentIndex] = useState(0);
  const HeaderRef = useRef(null);
  const NavRef = useRef(null);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText.length]);

  useEffect(() => {
    anime({
      targets: HeaderRef.current,
      translateY: [-1000, 0],
      opacity:[0,1],
      duration: 1800,
      easing: 'easeOutExpo'
    });

    anime({
      targets: NavRef.current,
      translateX: [-1000, 0],  
       opacity:[0,1],
      duration: 1800,
      easing: 'easeOutExpo'
    });
  }, []); 

  return (
    <>
      <div className="bg-slate-800 min-h-screen">
        <div ref={HeaderRef} className="fixed flex flex-col bg-slate-700 text-white min-w-screen h-10 border-b border-white/10 overflow-hidden header">
          <header className="flex flex-col font-bold items-center justify-center py-2">
            <h1>DisRope</h1>
          </header>
        </div>
        <Nav ref={NavRef} className='nav-bar ' />
        <div className="flex justify-center items-center h-screen">
          <div>
            <h1 className="text-4xl text-white font-bold mb-4">
              <span className="font-bold">
                {displayText}
                <span className="animate-pulse">|</span> 
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;