(function(){
  const canvas=document.getElementById('hero-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,pts,mouse={x:null,y:null};

  function resize(){
    W=canvas.width=canvas.offsetWidth;
    H=canvas.height=canvas.offsetHeight;
    pts=Array.from({length:Math.min(60,Math.floor(W/22))},()=>({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
      r:Math.random()*1.2+.4,o:Math.random()*.3+.05
    }));
  }

  function frame(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(mouse.x){const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
        if(d<140){const f=(140-d)/140;p.x+=dx/d*f*1.5;p.y+=dy/d*f*1.5}}
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    });
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<160){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(255,255,255,${(1-d/160)*.08})`;ctx.lineWidth=.5;ctx.stroke()}
    }
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.o})`;ctx.fill()});
    if(mouse.x){
      ctx.beginPath();ctx.arc(mouse.x,mouse.y,3,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fill();
      pts.forEach(p=>{const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
        if(d<200){ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);ctx.lineTo(p.x,p.y);
          ctx.strokeStyle=`rgba(100,160,255,${(1-d/200)*.3})`;ctx.lineWidth=.7;ctx.stroke()}});
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top},{passive:true});
  document.addEventListener('mouseleave',()=>{mouse.x=null;mouse.y=null});
  resize();frame();
})();
