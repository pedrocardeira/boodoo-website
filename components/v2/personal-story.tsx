'use client';
import { useState } from 'react';
import { ArrowRight, BookOpen, Camera, Heart, Settings } from 'lucide-react';
const views = [
  {name:'Your daily book', icon:BookOpen, screen:'4049', title:'An ordinary day. A memory forever.', copy:'A photograph, a few words, a little first. Save them in Moments and look back by year, month, or day. Over time, those everyday entries become your child’s own daily book.'},
  {name:'Your photos', icon:Camera, screen:'4054', title:'Open the app. See your little world.', copy:'Choose your child’s profile photo and background. The face you love stays at the center of the day, with care and routines close at hand.'},
  {name:'Your settings', icon:Settings, screen:'4048', title:'Their own colors. Their own rhythm.', copy:'Personalize the theme and main color, and keep each child’s profile and settings their own. BooDoo feels familiar because you make it personal.'},
  {name:'Before birth', icon:Heart, screen:'4052', title:'Their story starts before hello.', copy:'Keep the thoughts, decisions, photos, and special days of pregnancy. Start collecting the memories you will one day share with them.'}
];
export function PersonalStory(){
 const [active,setActive]=useState(0);const item=views[active];
 return <section className="v2-section" id="your-daily-book"><div className="section-heading"><span className="eyebrow">PERSONAL FROM THE VERY FIRST DAY</span><h2>Your photos. Your words.<br/><em>Your child’s daily book.</em></h2><p>Make BooDoo feel like your family. Then keep the moments that make your family’s story.</p></div>
 <div className="stage-tabs" role="tablist" aria-label="Your personal BooDoo">{views.map((v,i)=><button key={v.name} role="tab" aria-selected={i===active} aria-controls="personal-story-panel" id={`personal-story-${i}`} onClick={()=>setActive(i)}><v.icon size={20}/>{v.name}</button>)}</div>
 <div className="stage-content" role="tabpanel" id="personal-story-panel" aria-labelledby={`personal-story-${active}`}><div className="app-stage"><img className="app-screen" src={`/screenshots/v2/app-${item.screen}.webp`} alt={`BooDoo iOS screenshot: ${item.name}`} loading="lazy"/></div><div className="stage-copy"><span className="eyebrow">YOUR REAL PHOTOS · THE REAL APP</span><h3>{item.title}</h3><p>{item.copy}</p><p>When you are ready, gather your saved Moments into an album. Choose the chapter, shape the pages, and keep your own words.</p><a className="text-link" href="/albums">Explore your memory book <ArrowRight size={18}/></a></div></div></section>;
}
