import puppeteer from "puppeteer-core";
const CHROME="/agent/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome";
const b=await puppeteer.launch({executablePath:CHROME,headless:"new",
  args:["--no-sandbox","--disable-dev-shm-usage","--autoplay-policy=no-user-gesture-required"]});
for (const [tag,w,h] of [["d",1440,900],["m",390,844]]) {
  const p=await b.newPage();
  await p.setViewport({width:w,height:h});
  await p.goto("http://localhost:3000",{waitUntil:"networkidle0",timeout:60000});
  await new Promise(r=>setTimeout(r,3500));
  const s=await p.evaluate(()=>{const v=document.querySelector("video");
    return v?{src:v.currentSrc.split("/").pop(),paused:v.paused,t:+v.currentTime.toFixed(1),dur:+v.duration.toFixed(1)}:{none:true};});
  console.log(tag, JSON.stringify(s));
  await p.screenshot({path:`/tmp/film/hero-${tag}.png`});
  await p.close();
}
await b.close();
