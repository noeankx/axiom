import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Bug } from 'lucide-react';

export default function BugBlaster({ onClose }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let ship = { x: width / 2, y: height - 100, w: 40, h: 40 };
    let bullets = [];
    let enemies = [];
    let particles = []; // Explosions
    let keys = {};
    let frameId;
    let spawnRate = 60;
    let frames = 0;

    const spawnEnemy = () => {
        const size = 30 + Math.random() * 20;
        enemies.push({
            x: Math.random() * (width - size),
            y: -size,
            w: size,
            h: size,
            speed: 2 + Math.random() * 3,
            color: '#ef4444' // Red bugs
        });
    };

    const update = () => {
        if (gameOver) return;

        ctx.fillStyle = 'rgba(10, 10, 11, 0.8)';
        ctx.fillRect(0, 0, width, height);

        // Ship logic
        if (keys['ArrowLeft']) ship.x -= 8;
        if (keys['ArrowRight']) ship.x += 8;
        ship.x = Math.max(0, Math.min(width - ship.w, ship.x));

        // Draw Ship
        ctx.fillStyle = '#22d3ee'; // Cyan
        ctx.beginPath();
        ctx.moveTo(ship.x + ship.w/2, ship.y);
        ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
        ctx.lineTo(ship.x, ship.y + ship.h);
        ctx.fill();

        // Shooty logic
        bullets.forEach((b, i) => {
            b.y -= 10;
            ctx.fillStyle = '#facc15'; // Yellow
            ctx.fillRect(b.x, b.y, 4, 10);
            if (b.y < 0) bullets.splice(i, 1);
        });

        // Enemy logic
        if (frames % spawnRate === 0) spawnEnemy();
        
        enemies.forEach((e, i) => {
            e.y += e.speed;
            
            // Draw Bug (Simple box with label)
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.w, e.h);
            ctx.fillStyle = 'white';
            ctx.font = '10px monospace';
            ctx.fillText('BUG', e.x + 5, e.y + e.h/2);

            if (e.y > height) {
                enemies.splice(i, 1);
                // Missed enemy logic could go here
            }

            // Collision: Bullet hit Enemy
            bullets.forEach((b, bi) => {
                if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                    // Boom
                    for(let k=0; k<10; k++) {
                        particles.push({
                            x: e.x + e.w/2, 
                            y: e.y + e.h/2, 
                            vx: (Math.random()-0.5)*10, 
                            vy: (Math.random()-0.5)*10,
                            life: 1.0
                        });
                    }
                    setScore(s => s + 100);
                    enemies.splice(i, 1);
                    bullets.splice(bi, 1);
                }
            });

            // Collision: Enemy hit Ship
            if (ship.x < e.x + e.w && ship.x + ship.w > e.x &&
                ship.y < e.y + e.h && ship.y + ship.h > e.y) {
                    setGameOver(true);
            }
        });

        // Particles
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            ctx.fillStyle = `rgba(255, 100, 0, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
            ctx.fill();
            if(p.life <= 0) particles.splice(i, 1);
        });

        frames++;
        frameId = requestAnimationFrame(update);
    };

    const handleKeyDown = (e) => {
        keys[e.code] = true;
        if (e.code === 'Space' && !gameOver) {
            bullets.push({x: ship.x + ship.w/2 - 2, y: ship.y});
        }
    };
    const handleKeyUp = (e) => keys[e.code] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    update();

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        cancelAnimationFrame(frameId);
    };
  }, [gameOver]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center font-mono">
       <canvas ref={canvasRef} className="absolute inset-0" />
       
       <div className="absolute top-8 left-8 text-white z-10">
           <div className="flex items-center gap-2 text-yellow-400 text-2xl font-bold">
               <Trophy className="w-8 h-8" />
               SCORE: {score}
           </div>
           <div className="text-white/50 text-sm mt-2">Space to Shoot • Arrows to Move</div>
       </div>

       <button onClick={onClose} className="absolute top-8 right-8 p-2 bg-white/10 rounded hover:bg-white/20 text-white z-10">
           <X className="w-6 h-6" />
       </button>

       {gameOver && (
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }} 
             className="relative z-20 bg-red-900/90 p-12 rounded-3xl border-2 border-red-500 text-center"
           >
               <h2 className="text-6xl font-black text-white mb-4 glitch-text">SYSTEM HACKED</h2>
               <p className="text-red-200 text-xl mb-8">Final Score: {score}</p>
               <button 
                  onClick={() => window.location.reload()} // Lazy restart
                  className="px-8 py-3 bg-red-500 hover:bg-red-400 text-black font-bold rounded-lg text-lg transition-colors"
               >
                  REBOOT SYSTEM
               </button>
           </motion.div>
       )}
    </div>
  );
}
