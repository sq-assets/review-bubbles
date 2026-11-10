document.querySelectorAll('.reviews').forEach(async row=>{
  const STEP=1.1,READ=.45,HOLD=.4,SMOOTH=.12,FILL=.94,LAND=.9,SPREAD=1,TILT=10,INTRO=1.4,HEART_Y=.74;
  const ds=row.dataset;
  const list=v=>(v||'').split(',').map(s=>s.trim()).filter(Boolean);
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
  const ease=x=>1-Math.pow(1-x,3);
  const back=t=>1+2.4*Math.pow(t-1,3)+1.4*Math.pow(t-1,2);
  const jit=(i,sp)=>{const v=Math.sin(i*999.7)*43758.5453;return((v-Math.floor(v))-.5)*2*sp};
  let items=[];
  try{items=((await (await fetch(ds.collection+'?format=json')).json()).items||[]).slice(0,+(ds.max||6))}catch(e){return}
  if(!items.length)return;
  const bg=list(ds.cardColors),tx=list(ds.cardTextColors);
  const sec=row.closest('.page-section');
  const bubbles=items.map((it,i)=>{
    const b=document.createElement('article');b.className='rv-bubble';
    if(bg.length)b.style.setProperty('--rv-bg',bg[i%bg.length]);
    if(tx.length)b.style.setProperty('--rv-text',tx[i%tx.length]);
    const name=(ds.names||'on')!=='off'&&it.tags&&it.tags[0]?`<span class="rv-name">${it.tags[0]}</span>`:'';
    b.innerHTML=`<div class="rv-hin"><h3>${it.title||''}</h3><div class="rv-quote">${it.excerpt||''}</div>${name}</div>`;
    b.insertAdjacentHTML('afterbegin','<svg class="rv-hsvg" viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true"><path d="M50 88 C20 66 4 50 4 30 C4 15 16 4 30 4 C39 4 46 9 50 17 C54 9 61 4 70 4 C84 4 96 15 96 30 C96 50 80 66 50 88Z"/></svg>');
    return b;
  });
  const glowHost=sec||row;
  if(ds.titleColor)glowHost.style.setProperty('--rv-tc',ds.titleColor);
  if((ds.titleCase||'upper')==='upper')glowHost.style.setProperty('--rv-tt','uppercase');
  [['titleSize','--rv-ts'],['textSize','--rv-xs'],['titleSizeMobile','--rv-ts-m'],['textSizeMobile','--rv-xs-m']].forEach(([k,v])=>{if(ds[k])glowHost.style.setProperty(v,ds[k])});
  if((ds.glow||'off').toLowerCase()==='on'){
    glowHost.classList.add('rv-glow');
    if(ds.glowColor)glowHost.style.setProperty('--glow-color',ds.glowColor.trim());
    if(ds.glowSize)glowHost.style.setProperty('--glow-size',(parseFloat(ds.glowSize)||25)+'px');
    if(ds.glowStrength)glowHost.style.setProperty('--glow-strength',Math.min(parseFloat(ds.glowStrength)||1,1));
  }

  const src=row.querySelector('h1,h2,h3');
  const headline=(ds.headline||(src?src.textContent:'')).trim();
  row.innerHTML='';
  if(sec&&headline){
    const w=document.createElement('p');w.className='rv-word';w.setAttribute('aria-hidden','true');
    const s=document.createElement('span');s.textContent=headline;w.append(s);
    if(ds.headlineColor)w.style.setProperty('--rv-word-color',ds.headlineColor);
    if(ds.fontWeight)sec.style.setProperty('--rv-word-weight',ds.fontWeight);
    const size=ds.headlineSize;
    const fit=()=>{
      if(size&&size!=='fill'){w.style.setProperty('font-size',size,'important');return}
      const W=sec.clientWidth;if(!W)return;
      w.style.setProperty('font-size','100px','important');
      const tw=s.getBoundingClientRect().width;
      if(tw)w.style.setProperty('font-size',(100*W*FILL/tw).toFixed(1)+'px','important');
    };
    const fname=(ds.fontName||'').trim().replace(/["']/g,''),furl=(ds.fontUrl||'').trim().replace(/\/+$/,'');
    if(fname){
      sec.style.setProperty('--rv-word-font','"'+fname+'", var(--heading-font-font-family, sans-serif)');
      if(furl&&window.FontFace){
        new FontFace(fname,'url("'+furl+'")').load().then(f=>{document.fonts.add(f);fit()}).catch(()=>{});
      }else{
        const l=document.createElement('link');l.rel='stylesheet';
        l.href='https://fonts.googleapis.com/css2?family='+fname.replace(/ /g,'+')+'&display=swap';
        document.head.append(l);
      }
    }
    sec.classList.add('rv-on');sec.append(w);
    fit();addEventListener('resize',fit);addEventListener('load',fit);if(document.fonts)document.fonts.ready.then(fit);
  }

  /* Heart intro builder (desktop + mobile) */
  const introOn=(ds.intro||'off').toLowerCase()==='on';
  const HEART='M50 88 C20 66 4 50 4 30 C4 15 16 4 30 4 C39 4 46 9 50 17 C54 9 61 4 70 4 C84 4 96 15 96 30 C96 50 80 66 50 88Z';
  const heartUrl='url("data:image/svg+xml,'+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 90' preserveAspectRatio='none'><path d='"+HEART+"' fill='black'/></svg>")+'")';
  const makeIntro=host=>{
    if(ds.introBg)sec.style.setProperty('--rv-intro-bg',ds.introBg);
    if(ds.introColor)sec.style.setProperty('--rv-intro-color',ds.introColor);
    const cover=document.createElement('div');cover.className='rv-cover';cover.setAttribute('aria-hidden','true');
    const iword=document.createElement('p');iword.className='rv-iword';
    const is=document.createElement('span');is.textContent=(ds.introWord||headline||'REVIEWS');iword.append(is);cover.append(iword);
    const heart=document.createElementNS('http://www.w3.org/2000/svg','svg');heart.setAttribute('class','rv-heart');heart.setAttribute('viewBox','0 0 100 90');heart.setAttribute('preserveAspectRatio','none');
    heart.innerHTML='<path d="'+HEART+'" fill="none" stroke="#111" stroke-width="1.5" vector-effect="non-scaling-stroke"/>';
    host.append(cover,heart);
    const ifit=()=>{const W=host.clientWidth;if(!W)return;iword.style.setProperty('font-size','100px','important');const tw=is.getBoundingClientRect().width;if(tw)iword.style.setProperty('font-size',(100*W*FILL/tw).toFixed(1)+'px','important')};
    ifit();addEventListener('resize',ifit);addEventListener('load',ifit);if(document.fonts)document.fonts.ready.then(ifit);
    return h=>{
      const W=host.clientWidth,H=host.clientHeight;
      if(h>=1){cover.style.display='none';heart.style.display='none';return}
      cover.style.display='';heart.style.display='';
      const S0=Math.min(W,H)*(parseFloat(ds.heartSize)||16)/100,S=S0+Math.pow(h,2.6)*4.5*Math.max(W,H),Sh=S*.9;
      const L=W/2-S/2,T=H*HEART_Y-Sh/2;
      const m=heartUrl+' '+L.toFixed(1)+'px '+T.toFixed(1)+'px / '+S.toFixed(1)+'px '+Sh.toFixed(1)+'px no-repeat, linear-gradient(#000 0 0)';
      cover.style.webkitMask=m;cover.style.mask=m;cover.style.webkitMaskComposite='xor';cover.style.maskComposite='exclude';
      heart.style.left=L+'px';heart.style.top=T+'px';heart.style.width=S+'px';heart.style.height=Sh+'px';
      iword.style.opacity=Math.max(0,1-h*1.4).toFixed(3);iword.style.transform='scale('+(1+h*.8).toFixed(3)+')';
    };
  };

  /* Mobile: heart intro holds the screen, then a stacked list that pops in */
  if(!sec||innerWidth<640){
    row.classList.add('rv-list');bubbles.forEach(b=>row.append(b));
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
    bubbles.forEach(b=>io.observe(b));
    if(sec&&introOn){
      sec.classList.add('rv-on');
      const wrap=document.createElement('div');wrap.className='rv-mwrap';
      const stick=document.createElement('div');stick.className='rv-mstick';
      wrap.append(stick);sec.prepend(wrap);
      const paintM=makeIntro(stick);
      let mc=0,mt=0,mr=null;
      const mcontent=sec.querySelector(':scope > .content-wrapper');
      const msize=()=>{const vh=innerHeight;wrap.style.height=(vh*(1+INTRO))+'px';stick.style.height=vh+'px';sec.style.minHeight=(vh*(1+INTRO))+'px';if(mcontent)mcontent.style.marginTop=(vh*INTRO)+'px'};
      const mtick=()=>{mc+=(mt-mc)*SMOOTH;if(Math.abs(mt-mc)<.001)mc=mt;paintM(mc);mr=mc!==mt?requestAnimationFrame(mtick):null};
      const mupd=()=>{mt=clamp(-wrap.getBoundingClientRect().top/(innerHeight*INTRO));if(!mr)mr=requestAnimationFrame(mtick)};
      msize();paintM(0);mupd();
      addEventListener('scroll',mupd,{passive:true});
      addEventListener('resize',()=>{msize();mupd()});
    }
    return;
  }

  /* Desktop: pinned scene */
  const stage=document.createElement('div');stage.className='rv-stage';
  if((ds.shape||'bubble')==='heart'){sec.classList.add('rv-shape-heart');if(ds.heartWidth)sec.style.setProperty('--rv-hw',ds.heartWidth)}
  bubbles.forEach(b=>stage.append(b));
  sec.classList.add('rv-on');sec.append(stage);
  const N=bubbles.length,I=introOn?INTRO:0;
  let cur=0;
  const paintI=introOn?makeIntro(sec):null;
  const paintIntro=()=>{if(paintI)paintI(clamp(cur/I))};
  const scene=document.createElement('div');scene.className='rv-scene';
  const hb=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-bottom'))||0;
  const sz=()=>{if(scene.isConnected)scene.style.height=(sec.getBoundingClientRect().height+innerHeight*(I+N*STEP+HOLD))+'px'};
  let tgt=0,raf=null;
  const GA=Math.PI*(3-Math.sqrt(5));
  const spots=bubbles.map((b,i)=>{const a=i*GA+.6,r=.35+.65*Math.sqrt((i+.5)/N);return{x:Math.cos(a)*r,y:Math.sin(a)*r,r:jit(i+60,TILT)}});
  const paint=()=>{
    const W=stage.clientWidth,H=stage.clientHeight;
    bubbles.forEach((b,i)=>{
      const sp=spots[i];
      const mx=(W/2-b.offsetWidth*LAND*.35)*SPREAD,my=(H/2-b.offsetHeight*LAND*.35)*SPREAD;
      const k=(cur-I)/STEP,t=clamp((k-i-READ)/(1-READ)),e=back(t);
      const px=jit(i,14),py=jit(i+50,14),pr=jit(i+100,6);
      const x=px+(sp.x*mx-px)*e,y=py+(sp.y*my-py)*e,r=pr+(sp.r-pr)*e,sc=1+(LAND-1)*e;
      b.style.opacity=I?clamp((cur-I*.8)/(I*.2)).toFixed(3):'1';
      b.style.zIndex=t<=0?100-i:(t<1?200:10+i);
      b.style.transform='translate(-50%,-50%) translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+r.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
    });
    paintIntro();
  };
  const tick=()=>{cur+=(tgt-cur)*SMOOTH;if(Math.abs(tgt-cur)<.001)cur=tgt;paint();raf=cur!==tgt?requestAnimationFrame(tick):null};
  const update=()=>{if(!scene.isConnected)return;tgt=clamp((hb()-scene.getBoundingClientRect().top)/innerHeight,0,I+N*STEP);if(!raf)raf=requestAnimationFrame(tick)};
  const check=()=>{
    const edit=document.body.classList.contains('sqs-edit-mode-active');
    if(edit&&scene.isConnected){scene.replaceWith(sec);cur=tgt=I+N*STEP;paint()}
    if(!edit&&!scene.isConnected){sec.before(scene);scene.append(sec);sz();update()}
  };
  new MutationObserver(check).observe(document.body,{attributes:true,attributeFilter:['class']});
  check();paint();
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',()=>{sz();update()});
  addEventListener('load',()=>{sz();update()});
});
