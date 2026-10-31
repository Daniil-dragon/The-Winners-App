'use strict';
const originArtIcon={"廾":"⚔️","人":"🚶","大":"🙆","女":"🧎‍♀️","子":"👶","木":"🌳","山":"🏔️","巛":"🏞️","日":"☀️","月":"🌙","口":"👄","門":"🚪","手":"✋","目":"👁️","耳":"👂","足":"🦶","心":"❤️","火":"🔥","水":"🌊","雨":"🌧️","田":"🌾","石":"🪨","牛":"🐂","羊":"🐏","魚":"🐟","鳥":"🐦","馬":"🐎","竹":"🎋","米":"🍚","貝":"🐚","車":"🛞","艸":"🌱","川":"🏞️"};
let originShowGlyph=true;
const legacyOriginIllustration=originIllustration;
originIllustration=function(ch){
 const glyph=originRadical(ch)?.display||ch;
 if(!originArtIcon[ch])return legacyOriginIllustration(ch);
 const emoji=originArtIcon[ch];
 const sword=ch==='廾';
 const foreground=sword?
 '<path d="M160 15 L160 112" stroke="#a8c0c8" stroke-width="10" stroke-linecap="round"/><path d="M143 111 L177 111" stroke="#c99949" stroke-width="9" stroke-linecap="round"/><path d="M160 119 L160 143" stroke="#745235" stroke-width="9" stroke-linecap="round"/><path d="M43 230 Q61 165 111 167 Q138 172 151 130" stroke="#f1b28c" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M277 230 Q259 165 209 167 Q182 172 169 130" stroke="#f1b28c" stroke-width="26" fill="none" stroke-linecap="round"/>' :
 '<text x="160" y="164" text-anchor="middle" dominant-baseline="middle" font-size="116">'+originEscape(emoji)+'</text>';
 const overlay=originShowGlyph?'<text x="160" y="164" text-anchor="middle" dominant-baseline="middle" font-size="'+(sword?70:102)+'" font-weight="700" fill="#172842" stroke="#fff8de" stroke-width="2.8" paint-order="stroke" opacity=".85">'+originEscape(glyph)+'</text>':'';
 return '<div class="origin-illustration" style="margin:12px auto;max-width:420px">'+
 '<svg viewBox="0 0 320 250" width="100%" role="img" aria-label="'+originEscape(originData.get(ch)?.memory||glyph)+'" style="border-radius:16px;display:block;background:#91dbfb">'+
 '<rect width="320" height="250" fill="#91dbfb"/><circle cx="268" cy="46" r="20" fill="#ffe36e" opacity=".88"/>'+
 '<path d="M0 164 Q80 138 160 171 T320 161 V250 H0Z" fill="#8ccb72"/>'+
 '<path d="M0 199 Q100 175 200 211 T320 199 V250 H0Z" fill="#42a86c"/>'+
 foreground+overlay+'</svg>'+
 '<div class="flex" style="justify-content:center;margin-top:10px"><button type="button" id="originOverlayToggle" class="btn alt">'+(originShowGlyph?'◉ Скрыть графему':'◎ Показать графему')+'</button></div>'+
 '<p class="hint" style="text-align:center">Учебная визуальная ассоциация, не воспроизведение древнего написания.</p></div>';
};
const originalRenderOrigins=renderOrigins;
renderOrigins=function(){
 originalRenderOrigins();
 const toggle=document.getElementById('originOverlayToggle');
 if(toggle)toggle.onclick=()=>{
  originShowGlyph=!originShowGlyph;
  const pos=window.scrollY;renderOrigins();window.scrollTo(0,pos);
 };
};
