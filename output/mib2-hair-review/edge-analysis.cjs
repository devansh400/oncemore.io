const sharp=require('../../node_modules/.bun/sharp@0.35.5+6896990797d7a805/node_modules/sharp');
(async()=>{for(const n of [0,15,30,40,45,50,53,54,55,56,57,58,60]){const {data,info}=await sharp(`apps/web/public/maa-inti-bangaaram/v2/frames/${String(n).padStart(3,'0')}.webp`).removeAlpha().raw().toBuffer({resolveWithObject:true});const rows=[];for(let y=90;y<=205;y+=5){let x=580;while(x<700){const j=(y*info.width+x)*3;if(data[j]<data[j+1]*1.8+12 && data[j]<95)break;x++;}rows.push([y,x]);}console.log(n,JSON.stringify(rows));}})();

