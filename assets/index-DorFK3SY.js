const Et={shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',"shield-check":'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',"map-pin":'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',activity:'<path d="M3 12h4l3 8 4-16 3 8h4"/>',mountain:'<path d="m8 3 4 8 5-5 5 14H2L8 3Z"/>',tag:'<path d="M12.6 2.7 21 11a2 2 0 0 1 0 2.8l-6.2 6.2a2 2 0 0 1-2.8 0L3.7 11.6A2 2 0 0 1 3 10.2V4a1 1 0 0 1 1-1h6.2a2 2 0 0 1 1.4.7Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 16M14.5 12.5 20 20M8.1 8 12 12"/>',minimize:'<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',merge:'<path d="M8 18v-4a4 4 0 0 1 4-4h8M16 6l4 4-4 4M6 6v12"/>',download:'<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',upload:'<path d="M12 17V5M7 9l5-5 5 5M5 21h14"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',check:'<path d="M20 6 9 17l-5-5"/>',"alert-triangle":'<path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',"rotate-ccw":'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',"zoom-in":'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',"zoom-out":'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6"/>',crosshair:'<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',route:'<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h0"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',"wifi-off":'<path d="m2 2 20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 3.3-2.2M2 8.8a15 15 0 0 1 4.2-2.6M16.7 10.7A10 10 0 0 1 19 12.9M9 4.2a15 15 0 0 1 12 2.6M12 20h.01"/>',"help-circle":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'};function f(s,t="size-4"){const n=Et[s];return n?`<svg class="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`:""}function vt(s,t){if(t==="imperial"){const e=s/1609.344;return`${e.toFixed(e<10?2:1)} mi`}const n=s/1e3;return`${n.toFixed(n<10?2:1)} km`}function G(s,t){return t==="imperial"?`${Math.round(s*3.28084).toLocaleString()} ft`:`${Math.round(s).toLocaleString()} m`}function nt(s){if(s===null)return"—";const t=Math.round(s),n=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60;return n>0?`${n}:${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`:`${e}:${String(i).padStart(2,"0")}`}function et(s,t){return s===null?"—":t==="imperial"?`${(s*2.236936).toFixed(1)} mph`:`${(s*3.6).toFixed(1)} km/h`}function Pt(s,t){if(s===null||s<=0)return"—";const n=t==="imperial"?1609.344/s:1e3/s,e=Math.floor(n/60),i=Math.round(n%60),o=t==="imperial"?"/mi":"/km";return`${e}:${String(i).padStart(2,"0")} ${o}`}function B(s){return s<1024?`${s} B`:s<1024*1024?`${(s/1024).toFixed(1)} KB`:`${(s/(1024*1024)).toFixed(2)} MB`}function yt(s){return s?`${s.minLat.toFixed(4)}, ${s.minLon.toFixed(4)} → ${s.maxLat.toFixed(4)}, ${s.maxLon.toFixed(4)}`:"—"}function st(s){if(!s)return"—";const t=Date.parse(s);return Number.isFinite(t)?new Date(t).toLocaleString(void 0,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):s}function P(s){return Math.round(s).toLocaleString()}function bt(s,t){return s===0?"0%":`${Math.round((1-t/s)*100)}%`}function _(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function I(s){if(s.length===0)return{metadata:{},tracks:[],routes:[],waypoints:[],warnings:[]};if(s.length===1)return s[0];const t={metadata:{...s[0].metadata},tracks:[],routes:[],waypoints:[],warnings:[]};for(const n of s)t.tracks.push(...n.tracks),t.routes.push(...n.routes),t.waypoints.push(...n.waypoints),n.warnings.length&&t.warnings.push(...n.warnings);return t}function Mt(s,t){if(s.tracks.length<=1||s.tracks.length===0)return s;const n=s.tracks.flatMap(p=>p.segments);if(n.length===0)return s;const e=t.name??s.tracks.find(p=>p.name)?.name??"Merged track";let i;return i=n,{...s,tracks:[{name:e,segments:i}]}}const K=63710088e-1,Z=Math.PI/180;function W(s,t,n,e){const i=(n-s)*Z,o=(e-t)*Z,p=s*Z,r=n*Z,x=Math.sin(i/2),a=Math.sin(o/2),g=x*x+Math.cos(p)*Math.cos(r)*a*a;return 2*K*Math.asin(Math.min(1,Math.sqrt(g)))}function wt(s,t){return W(s.lat,s.lon,t.lat,t.lon)}function $(s){if(s.length===0)return null;let t=1/0,n=1/0,e=-1/0,i=-1/0;for(const o of s)o.lat<t&&(t=o.lat),o.lat>e&&(e=o.lat),o.lon<n&&(n=o.lon),o.lon>i&&(i=o.lon);return{minLat:t,minLon:n,maxLat:e,maxLon:i}}function R(s,t){return s?t?{minLat:Math.min(s.minLat,t.minLat),minLon:Math.min(s.minLon,t.minLon),maxLat:Math.max(s.maxLat,t.maxLat),maxLon:Math.max(s.maxLon,t.maxLon)}:s:t}function O(s,t,n){const e=t*Z*K*Math.cos(n*Z),i=s*Z*K;return{x:e,y:i}}function it(s,t){const n=Math.pow(10,t);return Math.round(s*n)/n}function Zt(s){return 111320/Math.pow(10,s)}const $t=150,zt=100,Lt=150,St=500;function Ct(s){const t=[],n=e=>{e.length!==0&&(t.push(e[0]),e.length>1&&t.push(e[e.length-1]))};for(const e of s.tracks)for(const i of e.segments)n(i.points);for(const e of s.routes)n(e.points);return t}function ot(s){const t=Ct(s);if(t.length<2)return null;const n=[];for(const p of t){let r=null,x=1/0;for(const a of n){const g=W(p.lat,p.lon,a.lat,a.lon);g<=$t&&g<x&&(r=a,x=g)}r?(r.members.push(p),r.lat=r.members.reduce((a,g)=>a+g.lat,0)/r.members.length,r.lon=r.members.reduce((a,g)=>a+g.lon,0)/r.members.length):n.push({lat:p.lat,lon:p.lon,members:[p]})}let e=n[0];for(const p of n)p.members.length>e.members.length&&(e=p);if(e.members.length<2)return null;const i=Math.max(0,...e.members.map(p=>W(p.lat,p.lon,e.lat,e.lon))),o=Math.min(St,Math.max(Lt,Math.round(i+zt)));return{lat:e.lat,lon:e.lon,radiusM:o}}function F(s,t){return W(s.lat,s.lon,t.lat,t.lon)<=t.radiusM}function pt(s,t){let n=0,e=s.length-1;for(;n<=e&&F(s[n],t);)n++;for(;e>=n&&F(s[e],t);)e--;const i=n<=e?s.slice(n,e+1):[];return{kept:i,removed:s.length-i.length}}function rt(s,t){const n=[];let e=[],i=0;for(const o of s)F(o,t)?(i++,e.length>0&&(n.push(e),e=[])):e.push(o);return e.length>0&&n.push(e),{runs:n,removed:i}}function Rt(s,t,n){let e=0;const i=x=>{const a=[];for(const g of x)if(n==="crop-ends"){const{kept:d,removed:c}=pt(g.points,t);e+=c,d.length>0&&a.push({points:d})}else{const{runs:d,removed:c}=rt(g.points,t);e+=c;for(const l of d)a.push({points:l})}return a},o=s.tracks.map(x=>({...x,segments:i(x.segments)})).filter(x=>x.segments.length>0),p=s.routes.flatMap(x=>{if(n==="crop-ends"){const{kept:d,removed:c}=pt(x.points,t);return e+=c,d.length>0?[{...x,points:d}]:[]}const{runs:a,removed:g}=rt(x.points,t);return e+=g,a.map(d=>({...x,points:d}))}),r=s.waypoints.filter(x=>F(x,t)?(e++,!1):!0);return{doc:{...s,tracks:o,routes:p,waypoints:r},removed:e}}function ht(s,t){return{...s,tracks:s.tracks.map(n=>({...n,segments:n.segments.map(e=>({points:e.points.map(t)}))})),routes:s.routes.map(n=>({...n,points:n.points.map(t)})),waypoints:s.waypoints.map(t)}}function Nt(s,t){let e=ht(s,o=>{const p={lat:o.lat,lon:o.lon};return!t.elevation&&o.ele!==void 0&&(p.ele=o.ele),!t.time&&o.time&&(p.time=o.time),t.names||(o.name&&(p.name=o.name),o.cmt&&(p.cmt=o.cmt),o.desc&&(p.desc=o.desc),o.sym&&(p.sym=o.sym)),t.extensions||(o.ext&&(p.ext=o.ext),o.extRaw&&(p.extRaw=o.extRaw)),p});const i={...e.metadata};return t.time&&delete i.time,t.creator&&(delete i.creator,delete i.author),t.names&&(delete i.name,delete i.desc),e={...e,metadata:i},t.names&&(e={...e,tracks:e.tracks.map(o=>{const p={segments:o.segments};return o.type&&(p.type=o.type),p}),routes:e.routes.map(o=>({points:o.points}))}),e}function Dt(s,t){return ht(s,n=>({...n,lat:it(n.lat,t),lon:it(n.lon,t)}))}function ft(s){let t=!1,n=!1,e=!1,i=s.waypoints.some(r=>r.name||r.cmt||r.desc);const o=r=>{r.time&&(t=!0),r.ele!==void 0&&(e=!0),(r.extRaw||r.ext&&Object.keys(r.ext).length>0)&&(n=!0),(r.name||r.cmt||r.desc||r.sym)&&(i=!0)};for(const r of s.tracks){(r.name||r.desc||r.cmt)&&(i=!0);for(const x of r.segments)for(const a of x.points)o(a)}for(const r of s.routes){(r.name||r.desc)&&(i=!0);for(const x of r.points)o(x)}for(const r of s.waypoints)o(r);s.metadata.time&&(t=!0);const p=!!(s.metadata.creator||s.metadata.author);return{hasTime:t,hasExtensions:n,hasElevation:e,hasNames:i,hasCreator:p}}const At=.5,xt=3;function Ft(s){let t=0,n=0;if(s.length<2)return{gain:t,loss:n};let e=s[0];for(let i=1;i<s.length;i++){const o=s[i],p=o-e;p>xt?(t+=p,e=o):p<-xt&&(n+=-p,e=o)}return{gain:t,loss:n}}function j(s){if(!s)return null;const t=Date.parse(s);return Number.isFinite(t)?t:null}function Gt(s){let t=0,n=0,e=null,i=!1,o=0;const p=j(s[0]?.time),r=j(s[s.length-1]?.time);p!==null&&r!==null&&(i=!0,o=Math.max(0,(r-p)/1e3));for(let x=1;x<s.length;x++){const a=s[x-1],g=s[x],d=wt(a,g);t+=d;const c=j(a.time),l=j(g.time);if(c!==null&&l!==null&&l>c){const m=(l-c)/1e3,h=d/m;h>=At&&(n+=m),(e===null||h>e)&&(e=h)}}return{distanceM:t,movingTimeS:n,hasTime:i,spanS:o,maxSpeedMps:e}}function at(s){let t=0,n=0,e=0,i=!1,o=null,p=null,r=null,x=null,a=null,g=null,d=0,c=0;for(const k of s){t+=k.points.length,x=R(x,$(k.points));const M=Gt(k.points);n+=M.distanceM,e+=M.movingTimeS,M.hasTime&&(i=!0),M.maxSpeedMps!==null&&(o===null||M.maxSpeedMps>o)&&(o=M.maxSpeedMps);const E=k.points.map(v=>v.ele).filter(v=>v!==void 0),z=Ft(E);d+=z.gain,c+=z.loss;for(const v of E)(p===null||v<p)&&(p=v),(r===null||v>r)&&(r=v);const L=k.points.find(v=>v.time)?.time??null,Y=[...k.points].reverse().find(v=>v.time)?.time??null;L&&(a===null||Date.parse(L)<Date.parse(a))&&(a=L),Y&&(g===null||Date.parse(Y)>Date.parse(g))&&(g=Y)}let l=null;i&&a&&g&&(l=Math.max(0,(Date.parse(g)-Date.parse(a))/1e3));const m=i?e:null,h=l&&l>0?n/l:null;return{pointCount:t,distanceM:n,durationS:l,movingTimeS:m,elevationGainM:d,elevationLossM:c,minEleM:p,maxEleM:r,avgSpeedMps:h,maxSpeedMps:o,startTime:a,endTime:g,bbox:x}}function ct(s){const t=s.tracks.map(i=>at(i.segments)),n=s.tracks.flatMap(i=>i.segments);return{total:at(n),perTrack:t}}const jt=["magvar","geoidheight","src","sym","type","fix","sat","hdop","vdop","pdop","ageofdgpsdata","dgpsid","speed","course"];function u(s,t){for(const n of Array.from(s.children))if(n.localName===t){const e=n.textContent?.trim();return e&&e.length>0?e:void 0}}function V(s){if(s===void 0)return;const t=Number(s);return Number.isFinite(t)?t:void 0}function Ht(s){const t=new XMLSerializer,n=[];for(const i of Array.from(s.childNodes))n.push(t.serializeToString(i));const e=n.join("").trim();return e.length>0?e:void 0}function q(s,t,n){const e=V(s.getAttribute("lat")??void 0),i=V(s.getAttribute("lon")??void 0);if(e===void 0||i===void 0)return t.push(`Skipped a ${n} with missing/invalid lat/lon.`),null;if(e<-90||e>90||i<-180||i>180)return t.push(`Skipped a ${n} with out-of-range coordinates (${e}, ${i}).`),null;const o={lat:e,lon:i},p=V(u(s,"ele"));p!==void 0&&(o.ele=p);const r=u(s,"time");r&&(o.time=r);const x=u(s,"name");x&&(o.name=x);const a=u(s,"cmt");a&&(o.cmt=a);const g=u(s,"desc");g&&(o.desc=g);const d=u(s,"sym");d&&(o.sym=d);const c={};for(const l of jt){if(l==="sym")continue;const m=u(s,l);m!==void 0&&(c[l]=m)}for(const l of Array.from(s.children))if(l.localName==="extensions"){const m=Ht(l);m&&(o.extRaw=m)}return Object.keys(c).length>0&&(o.ext=c),o}function Xt(s){const t={},n=s.getAttribute("creator");n&&(t.creator=n);let e;for(const i of Array.from(s.children))if(i.localName==="metadata"){e=i;break}if(e){const i=u(e,"name");i&&(t.name=i);const o=u(e,"desc");o&&(t.desc=o);const p=u(e,"time");p&&(t.time=p);for(const r of Array.from(e.children))if(r.localName==="author"){const x=u(r,"name");x&&(t.author=x)}}else{const i=u(s,"name");i&&(t.name=i);const o=u(s,"desc");o&&(t.desc=o);const p=u(s,"author");p&&(t.author=p);const r=u(s,"time");r&&(t.time=r)}return t}function S(s,t){return Array.from(s.children).filter(n=>n.localName===t)}function ut(s,t){if(!s||s.trim().length===0)return{ok:!1,error:"The file is empty."};let n;try{n=new DOMParser().parseFromString(s,"application/xml")}catch{return{ok:!1,error:"Could not parse the file as XML."}}let e=n.documentElement&&n.documentElement.localName==="gpx"?n.documentElement:null;e||(e=Array.from(n.getElementsByTagName("*")).find(d=>d.localName==="gpx")??null);const i=n.documentElement?.localName==="parsererror"||n.getElementsByTagName("parsererror").length>0;if(!e)return{ok:!1,error:i?"This file is not valid XML, so it could not be read as GPX.":"No <gpx> element found — is this really a GPX file?"};const o=[],p=Xt(e),r=[];for(const d of S(e,"wpt")){const c=q(d,o,"waypoint");c&&r.push(c)}const x=[];for(const d of S(e,"rte")){const c={points:[]},l=u(d,"name");l&&(c.name=l);const m=u(d,"desc");m&&(c.desc=m);for(const h of S(d,"rtept")){const k=q(h,o,"route point");k&&c.points.push(k)}c.points.length>0?x.push(c):o.push("Skipped an empty route.")}const a=[];for(const d of S(e,"trk")){const c={segments:[]},l=u(d,"name");l&&(c.name=l);const m=u(d,"desc");m&&(c.desc=m);const h=u(d,"cmt");h&&(c.cmt=h);const k=u(d,"type");k&&(c.type=k);for(const M of S(d,"trkseg")){const E={points:[]};for(const z of S(M,"trkpt")){const L=q(z,o,"track point");L&&E.points.push(L)}E.points.length>0&&c.segments.push(E)}c.segments.length>0?a.push(c):o.push(`Skipped track "${c.name??"(unnamed)"}" with no valid points.`)}if(a.length===0&&x.length===0&&r.length===0)return{ok:!1,error:"No tracks, routes, or waypoints found in this GPX file."};const g={metadata:p,tracks:a,routes:x,waypoints:r,warnings:o};return t&&(g.sourceName=t),{ok:!0,doc:g}}function H(s){let t=s.waypoints.length;for(const n of s.routes)t+=n.points.length;for(const n of s.tracks)for(const e of n.segments)t+=e.points.length;return t}const Bt="GPX Privacy Cleaner";function T(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function y(s){return Number.isFinite(s)?Number(s.toFixed(7)).toString():"0"}function Ot(s){const t=n=>!!n.extRaw||n.ext&&Object.keys(n.ext).length>0;return s.waypoints.some(t)||s.routes.some(n=>n.points.some(t))?!0:s.tracks.some(n=>n.segments.some(e=>e.points.some(t)))}const _t=["magvar","geoidheight"],It=["type","fix","sat","hdop","vdop","pdop","ageofdgpsdata","dgpsid","speed","course"];function J(s,t,n){const e=[],i=s.ext??{},o=p=>{i[p]!==void 0&&e.push(`${t}<${p}>${T(i[p])}</${p}>`)};s.ele!==void 0&&e.push(`${t}<ele>${s.ele}</ele>`),s.time&&e.push(`${t}<time>${T(s.time)}</time>`);for(const p of _t)o(p);s.name&&e.push(`${t}<name>${T(s.name)}</name>`),s.cmt&&e.push(`${t}<cmt>${T(s.cmt)}</cmt>`),s.desc&&e.push(`${t}<desc>${T(s.desc)}</desc>`),o("src"),s.sym&&e.push(`${t}<sym>${T(s.sym)}</sym>`);for(const p of It)o(p);return s.extRaw&&e.push(`${t}<extensions>${s.extRaw}</extensions>`),e.join(`
`)}function U(s){const t=Ot(s),n=['xmlns="http://www.topografix.com/GPX/1/1"','xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"','xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"'];t&&n.push('xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"','xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"','xmlns:gpxtrkx="http://www.garmin.com/xmlschemas/TrackStatsExtension/v1"');const e=[];e.push('<?xml version="1.0" encoding="UTF-8"?>'),e.push(`<gpx version="1.1" creator="${T(s.metadata.creator??Bt)}"`),e.push(`  ${n.join(`
  `)}>`);const i=s.metadata;(i.name||i.desc||i.author||i.time)&&(e.push("  <metadata>"),i.name&&e.push(`    <name>${T(i.name)}</name>`),i.desc&&e.push(`    <desc>${T(i.desc)}</desc>`),i.author&&e.push(`    <author><name>${T(i.author)}</name></author>`),i.time&&e.push(`    <time>${T(i.time)}</time>`),e.push("  </metadata>"));for(const o of s.waypoints){e.push(`  <wpt lat="${y(o.lat)}" lon="${y(o.lon)}">`);const p=J(o,"    ");p&&e.push(p),e.push("  </wpt>")}for(const o of s.routes){e.push("  <rte>"),o.name&&e.push(`    <name>${T(o.name)}</name>`),o.desc&&e.push(`    <desc>${T(o.desc)}</desc>`);for(const p of o.points){e.push(`    <rtept lat="${y(p.lat)}" lon="${y(p.lon)}">`);const r=J(p,"      ");r&&e.push(r),e.push("    </rtept>")}e.push("  </rte>")}for(const o of s.tracks){e.push("  <trk>"),o.name&&e.push(`    <name>${T(o.name)}</name>`),o.cmt&&e.push(`    <cmt>${T(o.cmt)}</cmt>`),o.desc&&e.push(`    <desc>${T(o.desc)}</desc>`),o.type&&e.push(`    <type>${T(o.type)}</type>`);for(const p of o.segments){e.push("    <trkseg>");for(const r of p.points){e.push(`      <trkpt lat="${y(r.lat)}" lon="${y(r.lon)}">`);const x=J(r,"        ");x&&e.push(x),e.push("      </trkpt>")}e.push("    </trkseg>")}e.push("  </trk>")}return e.push("</gpx>"),e.push(""),e.join(`
`)}function Wt(s){const t=[],n=e=>e.ele!==void 0?[e.lon,e.lat,e.ele]:[e.lon,e.lat];for(const e of s.tracks){const i=e.segments.map(o=>o.points.map(n)).filter(o=>o.length>0);i.length!==0&&t.push({type:"Feature",properties:{name:e.name??null,kind:"track"},geometry:i.length===1?{type:"LineString",coordinates:i[0]}:{type:"MultiLineString",coordinates:i}})}for(const e of s.routes)e.points.length!==0&&t.push({type:"Feature",properties:{name:e.name??null,kind:"route"},geometry:{type:"LineString",coordinates:e.points.map(n)}});for(const e of s.waypoints)t.push({type:"Feature",properties:{name:e.name??null,kind:"waypoint"},geometry:{type:"Point",coordinates:n(e)}});return JSON.stringify({type:"FeatureCollection",features:t},null,2)}function b(s){if(s===void 0)return"";const t=String(s);return/[",\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t}function Ut(s){const t=["type,track,segment,index,lat,lon,ele,time,name"];return s.tracks.forEach((n,e)=>{n.segments.forEach((i,o)=>{i.points.forEach((p,r)=>{t.push(["track",b(n.name??e),o,r,y(p.lat),y(p.lon),b(p.ele),b(p.time),b(p.name)].join(","))})})}),s.routes.forEach((n,e)=>{n.points.forEach((i,o)=>{t.push(["route",b(n.name??e),0,o,y(i.lat),y(i.lon),b(i.ele),b(i.time),b(i.name)].join(","))})}),s.waypoints.forEach((n,e)=>{t.push(["waypoint","","",e,y(n.lat),y(n.lon),b(n.ele),b(n.time),b(n.name)].join(","))}),t.join(`
`)+`
`}function lt(s){return new TextEncoder().encode(s).length}function Yt(s,t,n){const e=n.x-t.x,i=n.y-t.y,o=e*e+i*i;if(o===0){const a=s.x-t.x,g=s.y-t.y;return Math.hypot(a,g)}let p=((s.x-t.x)*e+(s.y-t.y)*i)/o;p=Math.max(0,Math.min(1,p));const r=t.x+p*e,x=t.y+p*i;return Math.hypot(s.x-r,s.y-x)}function kt(s,t){const n=s.length;if(n<=2||t<=0)return s.slice();let e=0;for(const a of s)e+=a.lat;const i=e/n,o=s.map(a=>O(a.lat,a.lon,i)),p=new Array(n).fill(!1);p[0]=!0,p[n-1]=!0;const r=[[0,n-1]];for(;r.length>0;){const[a,g]=r.pop();if(g-a<2)continue;let d=-1,c=-1;const l=o[a],m=o[g];for(let h=a+1;h<g;h++){const k=Yt(o[h],l,m);k>d&&(d=k,c=h)}d>t&&c!==-1&&(p[c]=!0,r.push([a,c]),r.push([c,g]))}const x=[];for(let a=0;a<n;a++)p[a]&&x.push(s[a]);return x}function Vt(s,t){return{points:kt(s.points,t)}}function qt(s,t){return{...s,segments:s.segments.map(n=>Vt(n,t))}}function Jt(s,t){return t<=0?s:{...s,tracks:s.tracks.map(n=>qt(n,t)),routes:s.routes.map(n=>({...n,points:kt(n.points,t)}))}}function gt(s){let t=0;for(const n of s.tracks)for(const e of n.segments)t+=e.points.length;return t}function Kt(s,t){const n=Number.isFinite(t.start)?t.start:0,e=Number.isFinite(t.end)?t.end:1/0;let i=0;const o=s.tracks.map(p=>{const r=p.segments.map(x=>({points:x.points.filter(()=>{const g=i>=n&&i<=e;return i++,g})})).filter(x=>x.points.length>0);return{...p,segments:r}}).filter(p=>p.segments.length>0);return{...s,tracks:o}}function dt(s){let t=null;for(const n of s.tracks)for(const e of n.segments)t=R(t,$(e.points));for(const n of s.routes)t=R(t,$(n.points));return t=R(t,$(s.waypoints)),t}function Qt(s,t){const n=I(s),e=ft(n);let i=n;t.merge&&(i=Mt(i,{})),t.trimRange&&(i=Kt(i,t.trimRange));let o=0;if(t.privacyZone){const g=Rt(i,t.privacyZone,t.privacyMode);i=g.doc,o=g.removed}t.simplifyToleranceM&&t.simplifyToleranceM>0&&(i=Jt(i,t.simplifyToleranceM)),t.fuzzDecimals!==null&&(i=Dt(i,t.fuzzDecimals)),i=Nt(i,t.strip);const p=U(n),r=U(i),x={pointsBefore:H(n),pointsAfter:H(i),pointsRemoved:H(n)-H(i),bytesBefore:lt(p),bytesAfter:lt(r),bboxBefore:dt(n),bboxAfter:dt(i),removedTimestamps:t.strip.time&&e.hasTime,removedExtensions:t.strip.extensions&&e.hasExtensions,removedElevation:t.strip.elevation&&e.hasElevation,removedNames:t.strip.names&&e.hasNames,removedCreator:t.strip.creator&&e.hasCreator,fuzzedTo:t.fuzzDecimals,privacyZoneApplied:t.privacyZone,privacyZonePointsRemoved:o,notes:[]},a=[];return x.privacyZoneApplied&&a.push(`Privacy zone (${x.privacyZoneApplied.radiusM} m) removed ${o} point(s) near the centre.`),x.removedTimestamps&&a.push("Removed all timestamps."),x.removedExtensions&&a.push("Removed sensor/extension data (heart rate, cadence, power, accuracy…)."),x.removedElevation&&a.push("Removed elevation data."),x.removedNames&&a.push("Removed names, comments and descriptions."),x.removedCreator&&a.push("Removed creator/device and author metadata."),x.fuzzedTo!==null&&a.push(`Rounded coordinates to ${x.fuzzedTo} decimal place(s).`),t.simplifyToleranceM&&t.simplifyToleranceM>0&&a.push(`Simplified geometry at ${t.simplifyToleranceM} m tolerance.`),t.trimRange&&a.push("Trimmed the track to the selected range."),t.merge&&a.push("Merged all tracks into one."),a.length===0&&a.push("No edits applied yet — the output equals the input."),tn(a,n,i),x.notes=a,{source:n,result:i,report:x}}function tn(s,t,n){const e=gt(t),i=gt(n);e!==i&&s.push(`Track points: ${e.toLocaleString()} → ${i.toLocaleString()}.`)}function nn(){return{time:!1,extensions:!1,elevation:!1,names:!1,creator:!1}}function X(){return{privacyZone:null,privacyMode:"crop-ends",strip:nn(),fuzzDecimals:null,trimRange:null,simplifyToleranceM:null,merge:!1}}function en(s){let t=0;for(const n of s.tracks)for(const e of n.segments)t+=e.points.length;return t}class sn{files=[];config=X();units="metric";status="empty";errorMessage=null;zonePickMode=!1;listeners=new Set;derivedCache=null;subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(){this.derivedCache=null;for(const t of this.listeners)t(this)}get docs(){return this.files.map(t=>t.doc)}get derived(){if(this.derivedCache)return this.derivedCache;const t=I(this.docs),n=Qt(this.docs,this.config),e={transform:n,sourceStats:ct(t),resultStats:ct(n.result),trimMax:Math.max(0,en(t)-1),inventory:ft(t)};return this.derivedCache=e,e}get trackCount(){return this.docs.reduce((t,n)=>t+n.tracks.length,0)}addFiles(t){t.length!==0&&(this.files.push(...t),this.status="ready",this.errorMessage=null,this.config=X(),this.zonePickMode=!1,this.emit())}removeFile(t){this.files.splice(t,1),this.files.length===0&&(this.status="empty"),this.config=X(),this.emit()}reset(){this.files=[],this.config=X(),this.status="empty",this.errorMessage=null,this.zonePickMode=!1,this.emit()}setError(t){this.errorMessage=t,this.files.length===0&&(this.status="error"),this.emit()}clearError(){this.errorMessage&&(this.errorMessage=null,this.files.length===0&&(this.status="empty"),this.emit())}patchConfig(t){this.config={...this.config,...t},this.emit()}patchStrip(t){this.config={...this.config,strip:{...this.config.strip,...t}},this.emit()}setUnits(t){this.units=t,this.emit()}setZonePickMode(t){this.zonePickMode=t,this.emit()}}const on=`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Forerunner 965"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">
  <metadata>
    <name>Morning loop from home</name>
    <author><name>Sample Runner</name></author>
    <time>2024-05-18T07:32:10.000Z</time>
  </metadata>
  <wpt lat="47.6512300" lon="-122.3456700">
    <name>Home</name>
    <sym>House</sym>
  </wpt>
  <trk>
    <name>Morning loop from home</name>
    <type>running</type>
    <trkseg>
      <trkpt lat="47.6512300" lon="-122.3456700">
        <ele>42</ele>
        <time>2024-05-18T07:32:10.000Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>132</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6513017" lon="-122.3431191">
        <ele>45.3</ele>
        <time>2024-05-18T07:32:21.673Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>134</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6515173" lon="-122.3405627">
        <ele>48.5</ele>
        <time>2024-05-18T07:32:32.727Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>135</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6518789" lon="-122.3379959">
        <ele>51.5</ele>
        <time>2024-05-18T07:32:43.113Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>137</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6523896" lon="-122.3354146">
        <ele>54.3</ele>
        <time>2024-05-18T07:32:53.395Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>135</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6526889" lon="-122.3353866">
        <ele>56.8</ele>
        <time>2024-05-18T07:33:04.233Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>136</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6529940" lon="-122.3353556">
        <ele>58.8</ele>
        <time>2024-05-18T07:33:15.776Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>138</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6533058" lon="-122.3353231">
        <ele>60.5</ele>
        <time>2024-05-18T07:33:27.526Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>139</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6536249" lon="-122.3352913">
        <ele>61.8</ele>
        <time>2024-05-18T07:33:38.791Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6539515" lon="-122.3352622">
        <ele>62.8</ele>
        <time>2024-05-18T07:33:49.330Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6542859" lon="-122.3352383">
        <ele>63.4</ele>
        <time>2024-05-18T07:33:59.565Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>141</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6546279" lon="-122.3352219">
        <ele>63.7</ele>
        <time>2024-05-18T07:34:10.200Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>142</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6549772" lon="-122.3352155">
        <ele>63.8</ele>
        <time>2024-05-18T07:34:21.571Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6553330" lon="-122.3352218">
        <ele>63.8</ele>
        <time>2024-05-18T07:34:33.336Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>144</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6556946" lon="-122.3352430">
        <ele>63.8</ele>
        <time>2024-05-18T07:34:44.792Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>146</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6560606" lon="-122.3352816">
        <ele>63.8</ele>
        <time>2024-05-18T07:34:55.520Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6564299" lon="-122.3353399">
        <ele>63.9</ele>
        <time>2024-05-18T07:35:05.770Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>147</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6568007" lon="-122.3354198">
        <ele>64.1</ele>
        <time>2024-05-18T07:35:16.231Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>146</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6571713" lon="-122.3355232">
        <ele>64.7</ele>
        <time>2024-05-18T07:35:27.399Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>148</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6575397" lon="-122.3356517">
        <ele>65.5</ele>
        <time>2024-05-18T07:35:39.120Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>150</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6579037" lon="-122.3358066">
        <ele>66.5</ele>
        <time>2024-05-18T07:35:50.730Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>148</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6582613" lon="-122.3359887">
        <ele>67.9</ele>
        <time>2024-05-18T07:36:01.669Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6586101" lon="-122.3361987">
        <ele>69.5</ele>
        <time>2024-05-18T07:36:11.993Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6589479" lon="-122.3364369">
        <ele>71.2</ele>
        <time>2024-05-18T07:36:22.323Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6592723" lon="-122.3367031">
        <ele>73.1</ele>
        <time>2024-05-18T07:36:33.276Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>150</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6595812" lon="-122.3369970">
        <ele>75</ele>
        <time>2024-05-18T07:36:44.894Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>150</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6598724" lon="-122.3373176">
        <ele>76.9</ele>
        <time>2024-05-18T07:36:56.610Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6601439" lon="-122.3376639">
        <ele>78.7</ele>
        <time>2024-05-18T07:37:07.765Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6603939" lon="-122.3380343">
        <ele>80.2</ele>
        <time>2024-05-18T07:37:18.217Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6606207" lon="-122.3384271">
        <ele>81.4</ele>
        <time>2024-05-18T07:37:28.469Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6608229" lon="-122.3388402">
        <ele>82.3</ele>
        <time>2024-05-18T07:37:39.210Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6609993" lon="-122.3392714">
        <ele>82.8</ele>
        <time>2024-05-18T07:37:50.677Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6611491" lon="-122.3397182">
        <ele>82.8</ele>
        <time>2024-05-18T07:38:02.441Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6612716" lon="-122.3401780">
        <ele>82.3</ele>
        <time>2024-05-18T07:38:13.800Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6613665" lon="-122.3406482">
        <ele>81.4</ele>
        <time>2024-05-18T07:38:24.423Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6614339" lon="-122.3411260">
        <ele>80.1</ele>
        <time>2024-05-18T07:38:34.657Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6614740" lon="-122.3416086">
        <ele>78.5</ele>
        <time>2024-05-18T07:38:45.207Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6614874" lon="-122.3420933">
        <ele>76.5</ele>
        <time>2024-05-18T07:38:56.485Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6614751" lon="-122.3425776">
        <ele>74.3</ele>
        <time>2024-05-18T07:39:08.237Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6614381" lon="-122.3430590">
        <ele>72.1</ele>
        <time>2024-05-18T07:39:19.771Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6613779" lon="-122.3435352">
        <ele>69.7</ele>
        <time>2024-05-18T07:39:30.596Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6612961" lon="-122.3440041">
        <ele>67.5</ele>
        <time>2024-05-18T07:39:40.873Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6611946" lon="-122.3444639">
        <ele>65.4</ele>
        <time>2024-05-18T07:39:51.267Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6610753" lon="-122.3449131">
        <ele>63.5</ele>
        <time>2024-05-18T07:40:02.335Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6609402" lon="-122.3453504">
        <ele>61.8</ele>
        <time>2024-05-18T07:40:14.014Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6607917" lon="-122.3457749">
        <ele>60.4</ele>
        <time>2024-05-18T07:40:25.681Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6606319" lon="-122.3461860">
        <ele>59.3</ele>
        <time>2024-05-18T07:40:36.721Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6604631" lon="-122.3465834">
        <ele>58.5</ele>
        <time>2024-05-18T07:40:47.099Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6602875" lon="-122.3469672">
        <ele>58</ele>
        <time>2024-05-18T07:40:57.385Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6601071" lon="-122.3473378">
        <ele>57.6</ele>
        <time>2024-05-18T07:41:08.237Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6599241" lon="-122.3476957">
        <ele>57.4</ele>
        <time>2024-05-18T07:41:19.790Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>150</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6597402" lon="-122.3480419">
        <ele>57.2</ele>
        <time>2024-05-18T07:41:31.536Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>146</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6595572" lon="-122.3483777">
        <ele>57</ele>
        <time>2024-05-18T07:41:42.789Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6593766" lon="-122.3487042">
        <ele>56.7</ele>
        <time>2024-05-18T07:41:53.317Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6591995" lon="-122.3490232">
        <ele>56.2</ele>
        <time>2024-05-18T07:42:03.553Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>144</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6590270" lon="-122.3493362">
        <ele>55.4</ele>
        <time>2024-05-18T07:42:14.200Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6588598" lon="-122.3496450">
        <ele>54.3</ele>
        <time>2024-05-18T07:42:25.583Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6586984" lon="-122.3499514">
        <ele>52.8</ele>
        <time>2024-05-18T07:42:37.349Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>142</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6585430" lon="-122.3502572">
        <ele>51</ele>
        <time>2024-05-18T07:42:48.794Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>143</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6583934" lon="-122.3505640">
        <ele>48.8</ele>
        <time>2024-05-18T07:42:59.509Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>142</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6582493" lon="-122.3508736">
        <ele>46.3</ele>
        <time>2024-05-18T07:43:09.756Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6581101" lon="-122.3511873">
        <ele>43.5</ele>
        <time>2024-05-18T07:43:20.227Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>139</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6579748" lon="-122.3515064">
        <ele>40.4</ele>
        <time>2024-05-18T07:43:31.409Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>139</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6578426" lon="-122.3518319">
        <ele>37.2</ele>
        <time>2024-05-18T07:43:43.134Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>136</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6577119" lon="-122.3521648">
        <ele>34</ele>
        <time>2024-05-18T07:43:54.736Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>139</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6575816" lon="-122.3525053">
        <ele>30.7</ele>
        <time>2024-05-18T07:44:05.661Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>136</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6574499" lon="-122.3528539">
        <ele>27.6</ele>
        <time>2024-05-18T07:44:15.979Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>137</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6573153" lon="-122.3532102">
        <ele>24.7</ele>
        <time>2024-05-18T07:44:26.316Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>133</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6571762" lon="-122.3535739">
        <ele>22.1</ele>
        <time>2024-05-18T07:44:37.282Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>131</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6570307" lon="-122.3539441">
        <ele>19.8</ele>
        <time>2024-05-18T07:44:48.908Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>131</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6568772" lon="-122.3543197">
        <ele>17.9</ele>
        <time>2024-05-18T07:45:00.619Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>132</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6567142" lon="-122.3546993">
        <ele>16.4</ele>
        <time>2024-05-18T07:45:11.761Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>132</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6565401" lon="-122.3550810">
        <ele>15.3</ele>
        <time>2024-05-18T07:45:22.203Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>127</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6563536" lon="-122.3554630">
        <ele>14.7</ele>
        <time>2024-05-18T07:45:32.459Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>128</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6561535" lon="-122.3558427">
        <ele>14.3</ele>
        <time>2024-05-18T07:45:43.212Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>125</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6559387" lon="-122.3562179">
        <ele>14.3</ele>
        <time>2024-05-18T07:45:54.690Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>127</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6557085" lon="-122.3565858">
        <ele>14.4</ele>
        <time>2024-05-18T07:46:06.453Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>125</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6554623" lon="-122.3569435">
        <ele>14.7</ele>
        <time>2024-05-18T07:46:17.800Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>122</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6552000" lon="-122.3572883">
        <ele>15.1</ele>
        <time>2024-05-18T07:46:28.411Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>125</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6549214" lon="-122.3576172">
        <ele>15.4</ele>
        <time>2024-05-18T07:46:38.645Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>122</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6546268" lon="-122.3579274">
        <ele>15.6</ele>
        <time>2024-05-18T07:46:49.205Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>122</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6543167" lon="-122.3582159">
        <ele>15.7</ele>
        <time>2024-05-18T07:47:00.496Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>121</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6539920" lon="-122.3584801">
        <ele>15.5</ele>
        <time>2024-05-18T07:47:12.251Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>121</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6536537" lon="-122.3587174">
        <ele>15</ele>
        <time>2024-05-18T07:47:23.775Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>117</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6533031" lon="-122.3589255">
        <ele>14.3</ele>
        <time>2024-05-18T07:47:34.587Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>118</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6529416" lon="-122.3591023">
        <ele>13.3</ele>
        <time>2024-05-18T07:47:44.859Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>119</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6525711" lon="-122.3592460">
        <ele>12.1</ele>
        <time>2024-05-18T07:47:55.261Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>117</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6521932" lon="-122.3593551">
        <ele>10.8</ele>
        <time>2024-05-18T07:48:06.343Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>116</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6518101" lon="-122.3594285">
        <ele>9.3</ele>
        <time>2024-05-18T07:48:18.028Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>117</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6514237" lon="-122.3594654">
        <ele>7.7</ele>
        <time>2024-05-18T07:48:29.688Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>115</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6510363" lon="-122.3594654">
        <ele>6.3</ele>
        <time>2024-05-18T07:48:40.715Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>114</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6506499" lon="-122.3594285">
        <ele>4.9</ele>
        <time>2024-05-18T07:48:51.085Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>115</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6502668" lon="-122.3593551">
        <ele>3.8</ele>
        <time>2024-05-18T07:49:01.376Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>114</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6498889" lon="-122.3592460">
        <ele>3</ele>
        <time>2024-05-18T07:49:12.241Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6495184" lon="-122.3591023">
        <ele>2.6</ele>
        <time>2024-05-18T07:49:23.804Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6491569" lon="-122.3589255">
        <ele>2.6</ele>
        <time>2024-05-18T07:49:35.547Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6488063" lon="-122.3587174">
        <ele>3</ele>
        <time>2024-05-18T07:49:46.787Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>113</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6484680" lon="-122.3584801">
        <ele>3.9</ele>
        <time>2024-05-18T07:49:57.304Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6481433" lon="-122.3582159">
        <ele>5.2</ele>
        <time>2024-05-18T07:50:07.541Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6478332" lon="-122.3579274">
        <ele>7</ele>
        <time>2024-05-18T07:50:18.201Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>109</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6475386" lon="-122.3576172">
        <ele>9</ele>
        <time>2024-05-18T07:50:29.595Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>108</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6472600" lon="-122.3572883">
        <ele>11.4</ele>
        <time>2024-05-18T07:50:41.362Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6469977" lon="-122.3569435">
        <ele>13.9</ele>
        <time>2024-05-18T07:50:52.796Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6467515" lon="-122.3565858">
        <ele>16.5</ele>
        <time>2024-05-18T07:51:03.498Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>109</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6465213" lon="-122.3562179">
        <ele>19.2</ele>
        <time>2024-05-18T07:51:13.743Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>109</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6463065" lon="-122.3558427">
        <ele>21.7</ele>
        <time>2024-05-18T07:51:24.224Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>109</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6461064" lon="-122.3554630">
        <ele>24.1</ele>
        <time>2024-05-18T07:51:35.418Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6459199" lon="-122.3550810">
        <ele>26.3</ele>
        <time>2024-05-18T07:51:47.148Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6457458" lon="-122.3546993">
        <ele>28.2</ele>
        <time>2024-05-18T07:51:58.741Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6455828" lon="-122.3543197">
        <ele>29.9</ele>
        <time>2024-05-18T07:52:09.653Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6454293" lon="-122.3539441">
        <ele>31.2</ele>
        <time>2024-05-18T07:52:19.965Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>113</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6452838" lon="-122.3535739">
        <ele>32.2</ele>
        <time>2024-05-18T07:52:30.308Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>113</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6451447" lon="-122.3532102">
        <ele>32.9</ele>
        <time>2024-05-18T07:52:41.288Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6450101" lon="-122.3528539">
        <ele>33.5</ele>
        <time>2024-05-18T07:52:52.922Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>111</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6448784" lon="-122.3525053">
        <ele>33.9</ele>
        <time>2024-05-18T07:53:04.628Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>113</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6447481" lon="-122.3521648">
        <ele>34.2</ele>
        <time>2024-05-18T07:53:15.756Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>115</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6446174" lon="-122.3518319">
        <ele>34.5</ele>
        <time>2024-05-18T07:53:26.189Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>114</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6444852" lon="-122.3515064">
        <ele>35</ele>
        <time>2024-05-18T07:53:36.448Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>113</gpxtpx:hr>
            <gpxtpx:cad>90</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6443499" lon="-122.3511873">
        <ele>35.6</ele>
        <time>2024-05-18T07:53:47.214Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>115</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6442107" lon="-122.3508736">
        <ele>36.5</ele>
        <time>2024-05-18T07:53:58.703Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>114</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6440666" lon="-122.3505640">
        <ele>37.6</ele>
        <time>2024-05-18T07:54:10.464Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>116</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6439170" lon="-122.3502572">
        <ele>39.1</ele>
        <time>2024-05-18T07:54:21.799Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>116</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6437616" lon="-122.3499514">
        <ele>40.9</ele>
        <time>2024-05-18T07:54:32.399Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>120</gpxtpx:hr>
            <gpxtpx:cad>89</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6436002" lon="-122.3496450">
        <ele>43.1</ele>
        <time>2024-05-18T07:54:42.632Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>120</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6434330" lon="-122.3493362">
        <ele>45.6</ele>
        <time>2024-05-18T07:54:53.203Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>118</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6432605" lon="-122.3490232">
        <ele>48.4</ele>
        <time>2024-05-18T07:55:04.507Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>119</gpxtpx:hr>
            <gpxtpx:cad>88</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6430834" lon="-122.3487042">
        <ele>51.4</ele>
        <time>2024-05-18T07:55:16.264Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>120</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6429028" lon="-122.3483777">
        <ele>54.5</ele>
        <time>2024-05-18T07:55:27.778Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>122</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6427198" lon="-122.3480419">
        <ele>57.6</ele>
        <time>2024-05-18T07:55:38.577Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>124</gpxtpx:hr>
            <gpxtpx:cad>87</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6425359" lon="-122.3476957">
        <ele>60.7</ele>
        <time>2024-05-18T07:55:48.845Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>125</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6423529" lon="-122.3473378">
        <ele>63.7</ele>
        <time>2024-05-18T07:55:59.256Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>125</gpxtpx:hr>
            <gpxtpx:cad>86</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6421725" lon="-122.3469672">
        <ele>66.4</ele>
        <time>2024-05-18T07:56:10.351Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>126</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6419969" lon="-122.3465834">
        <ele>68.8</ele>
        <time>2024-05-18T07:56:22.042Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>127</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6418281" lon="-122.3461860">
        <ele>70.8</ele>
        <time>2024-05-18T07:56:33.695Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>126</gpxtpx:hr>
            <gpxtpx:cad>85</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6416683" lon="-122.3457749">
        <ele>72.4</ele>
        <time>2024-05-18T07:56:44.709Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>130</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6415198" lon="-122.3453504">
        <ele>73.6</ele>
        <time>2024-05-18T07:56:55.071Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>129</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6413847" lon="-122.3449131">
        <ele>74.4</ele>
        <time>2024-05-18T07:57:05.368Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>132</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6412654" lon="-122.3444639">
        <ele>74.7</ele>
        <time>2024-05-18T07:57:16.246Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>133</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6411639" lon="-122.3440041">
        <ele>74.8</ele>
        <time>2024-05-18T07:57:27.818Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>132</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6410821" lon="-122.3435352">
        <ele>74.5</ele>
        <time>2024-05-18T07:57:39.557Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>131</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6410219" lon="-122.3430590">
        <ele>73.9</ele>
        <time>2024-05-18T07:57:50.784Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>133</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6409849" lon="-122.3425776">
        <ele>73.3</ele>
        <time>2024-05-18T07:58:01.291Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>134</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6409726" lon="-122.3420933">
        <ele>72.6</ele>
        <time>2024-05-18T07:58:11.530Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>138</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6409860" lon="-122.3416086">
        <ele>71.9</ele>
        <time>2024-05-18T07:58:22.201Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>136</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6410261" lon="-122.3411260">
        <ele>71.3</ele>
        <time>2024-05-18T07:58:33.607Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>138</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6410935" lon="-122.3406482">
        <ele>70.9</ele>
        <time>2024-05-18T07:58:45.374Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6411884" lon="-122.3401780">
        <ele>70.7</ele>
        <time>2024-05-18T07:58:56.797Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6413109" lon="-122.3397182">
        <ele>70.8</ele>
        <time>2024-05-18T07:59:07.487Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>140</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6414607" lon="-122.3392714">
        <ele>71.1</ele>
        <time>2024-05-18T07:59:17.729Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>143</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6416371" lon="-122.3388402">
        <ele>71.7</ele>
        <time>2024-05-18T07:59:28.220Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>143</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6418393" lon="-122.3384271">
        <ele>72.5</ele>
        <time>2024-05-18T07:59:39.428Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>144</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6420661" lon="-122.3380343">
        <ele>73.5</ele>
        <time>2024-05-18T07:59:51.162Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6423161" lon="-122.3376639">
        <ele>74.5</ele>
        <time>2024-05-18T08:00:02.747Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>145</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6425876" lon="-122.3373176">
        <ele>75.7</ele>
        <time>2024-05-18T08:00:13.645Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>147</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6428788" lon="-122.3369970">
        <ele>76.7</ele>
        <time>2024-05-18T08:00:23.950Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6431877" lon="-122.3367031">
        <ele>77.6</ele>
        <time>2024-05-18T08:00:34.301Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6435121" lon="-122.3364369">
        <ele>78.3</ele>
        <time>2024-05-18T08:00:45.295Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6438499" lon="-122.3361987">
        <ele>78.7</ele>
        <time>2024-05-18T08:00:56.936Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>149</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6441987" lon="-122.3359887">
        <ele>78.7</ele>
        <time>2024-05-18T08:01:08.637Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>148</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6445563" lon="-122.3358066">
        <ele>78.3</ele>
        <time>2024-05-18T08:01:19.752Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6449203" lon="-122.3356517">
        <ele>77.5</ele>
        <time>2024-05-18T08:01:30.176Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6452887" lon="-122.3355232">
        <ele>76.2</ele>
        <time>2024-05-18T08:01:40.438Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>150</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6456593" lon="-122.3354198">
        <ele>74.5</ele>
        <time>2024-05-18T08:01:51.217Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>78</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6460301" lon="-122.3353399">
        <ele>72.4</ele>
        <time>2024-05-18T08:02:02.716Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6463994" lon="-122.3352816">
        <ele>70</ele>
        <time>2024-05-18T08:02:14.476Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6467654" lon="-122.3352430">
        <ele>67.3</ele>
        <time>2024-05-18T08:02:25.798Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>151</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6471270" lon="-122.3352218">
        <ele>64.4</ele>
        <time>2024-05-18T08:02:36.387Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>79</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6474828" lon="-122.3352155">
        <ele>61.5</ele>
        <time>2024-05-18T08:02:46.620Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6478321" lon="-122.3352219">
        <ele>58.6</ele>
        <time>2024-05-18T08:02:57.202Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6481741" lon="-122.3352383">
        <ele>55.8</ele>
        <time>2024-05-18T08:03:08.518Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6485085" lon="-122.3352622">
        <ele>53.2</ele>
        <time>2024-05-18T08:03:20.277Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>154</gpxtpx:hr>
            <gpxtpx:cad>80</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6488351" lon="-122.3352913">
        <ele>50.8</ele>
        <time>2024-05-18T08:03:31.781Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6491542" lon="-122.3353231">
        <ele>48.7</ele>
        <time>2024-05-18T08:03:42.567Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>81</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6494660" lon="-122.3353556">
        <ele>46.9</ele>
        <time>2024-05-18T08:03:52.831Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>153</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6497711" lon="-122.3353866">
        <ele>45.5</ele>
        <time>2024-05-18T08:04:03.251Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6500704" lon="-122.3354146">
        <ele>44.3</ele>
        <time>2024-05-18T08:04:14.359Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>82</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6505811" lon="-122.3379959">
        <ele>43.5</ele>
        <time>2024-05-18T08:04:26.057Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6509427" lon="-122.3405627">
        <ele>42.8</ele>
        <time>2024-05-18T08:04:37.702Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>83</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6511583" lon="-122.3431191">
        <ele>42.4</ele>
        <time>2024-05-18T08:04:48.702Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>152</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
      <trkpt lat="47.6512300" lon="-122.3456700">
        <ele>42</ele>
        <time>2024-05-18T08:04:59.057Z</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>155</gpxtpx:hr>
            <gpxtpx:cad>84</gpxtpx:cad>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
`;function pn(s){return new Promise((t,n)=>{const e=new FileReader;e.onload=()=>t(String(e.result??"")),e.onerror=()=>n(e.error??new Error("Could not read file")),e.readAsText(s)})}const rn=60*1024*1024;async function xn(s){const t=Array.from(s),n=[],e=[];for(const o of t){if(o.size>rn){e.push(`${o.name}: file is too large (${(o.size/1024/1024).toFixed(0)} MB).`);continue}!o.name.toLowerCase().endsWith(".gpx")&&o.type!=="application/gpx+xml"&&e.push(`${o.name}: not a .gpx file; attempting to parse anyway.`);try{const r=await pn(o),x=ut(r,o.name);x.ok?n.push({name:o.name,doc:x.doc}):e.push(`${o.name}: ${x.error}`)}catch(r){e.push(`${o.name}: ${r.message}`)}}const i=new Set(n.map(o=>o.name));return{loaded:n,errors:e.filter(o=>!i.has(o.split(":")[0]))}}function Tt(s,t="pasted.gpx"){const n=ut(s,t);return n.ok?{loaded:[{name:t,doc:n.doc}],errors:[]}:{loaded:[],errors:[`${t}: ${n.error}`]}}function an(){return Tt(on,"sample-morning-loop.gpx")}const w={source:"rgba(148,163,184,0.35)",result:"#38bdf8",ring:"#f59e0b",ringFill:"rgba(245,158,11,0.12)",removed:"#f43f5e",start:"#22c55e",end:"#f43f5e",waypoint:"#f59e0b",grid:"rgba(148,163,184,0.08)"};function N(s){const t=[];for(const n of s.tracks)for(const e of n.segments)e.points.length&&t.push(e.points);for(const n of s.routes)n.points.length&&t.push(n.points);return t}class cn{canvas;ctx;dpr=Math.max(1,window.devicePixelRatio||1);source=null;result=null;zone=null;pickMode=!1;originLat=0;baseScale=1;dataCenter={x:0,y:0};zoom=1;panX=0;panY=0;dragging=!1;moved=!1;lastX=0;lastY=0;onPickCenter=null;constructor(t){this.canvas=document.createElement("canvas"),this.canvas.className="block size-full touch-none",this.canvas.setAttribute("role","img"),this.canvas.setAttribute("aria-label","Map preview of the GPS track (rendered locally)"),t.appendChild(this.canvas);const n=this.canvas.getContext("2d");if(!n)throw new Error("Canvas 2D context unavailable");this.ctx=n,new ResizeObserver(()=>this.resize()).observe(t),this.canvas.addEventListener("pointerdown",this.onPointerDown),this.canvas.addEventListener("pointermove",this.onPointerMove),this.canvas.addEventListener("pointerup",this.onPointerUp),this.canvas.addEventListener("pointerleave",this.onPointerUp),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1}),this.resize()}get cssW(){return this.canvas.clientWidth||1}get cssH(){return this.canvas.clientHeight||1}resize=()=>{this.canvas.width=Math.round(this.cssW*this.dpr),this.canvas.height=Math.round(this.cssH*this.dpr),this.draw()};setData(t,n,e){const i=t!==this.source;this.source=t,this.result=n,this.zone=e,i&&t&&(this.computeProjection(t),this.fitView()),this.draw()}setPickMode(t){this.pickMode=t,this.canvas.style.cursor=t?"crosshair":"grab"}computeProjection(t){let n=null;for(const x of N(t))n=R(n,$(x));n=R(n,$(t.waypoints)),n||(n={minLat:0,minLon:0,maxLat:0,maxLon:0}),this.originLat=(n.minLat+n.maxLat)/2;const e=O(n.minLat,n.minLon,this.originLat),i=O(n.maxLat,n.maxLon,this.originLat);this.dataCenter={x:(e.x+i.x)/2,y:(e.y+i.y)/2};const o=Math.max(1,Math.abs(i.x-e.x)),p=Math.max(1,Math.abs(i.y-e.y)),r=.86;this.baseScale=Math.min(this.cssW*r/o,this.cssH*r/p),(!Number.isFinite(this.baseScale)||this.baseScale<=0)&&(this.baseScale=1)}fitView(){this.zoom=1,this.panX=0,this.panY=0,this.draw()}invalidateSize(){this.source&&this.computeProjection(this.source),this.resize()}zoomBy(t){this.zoom=Math.min(200,Math.max(.2,this.zoom*t)),this.draw()}scale(){return this.baseScale*this.zoom}project(t){const n=O(t.lat,t.lon,this.originLat),e=this.scale();return{x:this.cssW/2+(n.x-this.dataCenter.x)*e+this.panX,y:this.cssH/2-(n.y-this.dataCenter.y)*e+this.panY}}unproject(t,n){const e=this.scale(),i=(t-this.cssW/2-this.panX)/e+this.dataCenter.x,o=-(n-this.cssH/2-this.panY)/e+this.dataCenter.y,p=63710088e-1,r=Math.PI/180,x=o/(r*p),a=i/(r*p*Math.cos(this.originLat*r));return{lat:x,lon:a}}onPointerDown=t=>{this.dragging=!0,this.moved=!1,this.lastX=t.clientX,this.lastY=t.clientY,this.canvas.setPointerCapture(t.pointerId),this.pickMode||(this.canvas.style.cursor="grabbing")};onPointerMove=t=>{if(!this.dragging)return;const n=t.clientX-this.lastX,e=t.clientY-this.lastY;Math.abs(n)+Math.abs(e)>3&&(this.moved=!0),this.pickMode||(this.panX+=n,this.panY+=e,this.draw()),this.lastX=t.clientX,this.lastY=t.clientY};onPointerUp=t=>{if(this.dragging&&this.pickMode&&!this.moved){const n=this.canvas.getBoundingClientRect(),{lat:e,lon:i}=this.unproject(t.clientX-n.left,t.clientY-n.top);this.onPickCenter?.(e,i)}this.dragging=!1,this.pickMode||(this.canvas.style.cursor="grab")};onWheel=t=>{t.preventDefault(),this.zoomBy(t.deltaY<0?1.12:1/1.12)};draw(){const t=this.ctx;if(t.save(),t.scale(this.dpr,this.dpr),t.clearRect(0,0,this.cssW,this.cssH),this.drawGrid(),!this.source){t.restore();return}this.drawRuns(N(this.source),w.source,1.5),this.zone&&this.drawZone(this.zone),this.result&&this.drawRuns(N(this.result),w.result,2.5),this.zone&&this.drawRemovedPoints(this.source,this.zone),this.result&&this.drawEndpoints(this.result),this.drawWaypoints(this.source),this.drawScaleBar(),t.restore()}drawGrid(){const t=this.ctx;t.strokeStyle=w.grid,t.lineWidth=1;const n=40;t.beginPath();for(let e=0;e<this.cssW;e+=n)t.moveTo(e,0),t.lineTo(e,this.cssH);for(let e=0;e<this.cssH;e+=n)t.moveTo(0,e),t.lineTo(this.cssW,e);t.stroke()}drawRuns(t,n,e){const i=this.ctx;i.strokeStyle=n,i.lineWidth=e,i.lineJoin="round",i.lineCap="round";for(const o of t)i.beginPath(),o.forEach((p,r)=>{const x=this.project(p);r===0?i.moveTo(x.x,x.y):i.lineTo(x.x,x.y)}),i.stroke()}drawZone(t){const n=this.ctx,e=this.project({lat:t.lat,lon:t.lon}),i=t.radiusM*this.scale();n.beginPath(),n.arc(e.x,e.y,Math.max(2,i),0,Math.PI*2),n.fillStyle=w.ringFill,n.fill(),n.strokeStyle=w.ring,n.lineWidth=1.5,n.setLineDash([6,4]),n.stroke(),n.setLineDash([]),n.strokeStyle=w.ring,n.beginPath(),n.moveTo(e.x-6,e.y),n.lineTo(e.x+6,e.y),n.moveTo(e.x,e.y-6),n.lineTo(e.x,e.y+6),n.stroke()}drawRemovedPoints(t,n){const e=this.ctx;e.fillStyle=w.removed;for(const i of N(t))for(const o of i)if(F(o,n)){const p=this.project(o);e.beginPath(),e.arc(p.x,p.y,2.2,0,Math.PI*2),e.fill()}}drawEndpoints(t){const n=N(t);if(n.length===0)return;const e=n[0][0],i=n[n.length-1],o=i[i.length-1];this.marker(this.project(e),w.start),this.marker(this.project(o),w.end)}drawWaypoints(t){for(const n of t.waypoints)this.marker(this.project(n),w.waypoint,3.5)}marker(t,n,e=5){const i=this.ctx;i.beginPath(),i.arc(t.x,t.y,e,0,Math.PI*2),i.fillStyle=n,i.fill(),i.lineWidth=2,i.strokeStyle="#0f172a",i.stroke()}drawScaleBar(){const t=this.ctx,n=this.scale();if(!Number.isFinite(n)||n<=0)return;const i=80/n,o=[1,2,5,10,20,50,100,200,500,1e3,2e3,5e3,1e4];let p=o[o.length-1];for(const d of o)if(d>=i){p=d;break}const r=p*n,x=16,a=this.cssH-18;t.strokeStyle="rgba(248,250,252,0.8)",t.lineWidth=2,t.beginPath(),t.moveTo(x,a),t.lineTo(x+r,a),t.moveTo(x,a-4),t.lineTo(x,a+4),t.moveTo(x+r,a-4),t.lineTo(x+r,a+4),t.stroke(),t.fillStyle="rgba(248,250,252,0.85)",t.font='11px "JetBrains Mono", monospace';const g=p>=1e3?`${p/1e3} km`:`${p} m`;t.fillText(g,x,a-8)}}class ln{constructor(t){this.cb=t,this.root=document.createElement("div"),this.root.className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16",this.root.innerHTML=`
      <div class="text-center space-y-3 mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-fg">Strip your home location from a GPS track</h2>
        <p class="text-fg-muted max-w-xl mx-auto">Drop a <code class="font-mono text-fg">.gpx</code> file from Strava, Garmin, Komoot or your phone. Everything happens in your browser — your route never leaves this page.</p>
        <details class="max-w-xl mx-auto text-sm text-fg-muted">
          <summary class="cursor-pointer text-accent hover:underline underline-offset-2 inline-flex items-center gap-1.5">${f("help-circle","size-4")} Where do I get my .gpx file?</summary>
          <ul class="mt-2 text-left space-y-1 leading-relaxed">
            <li><span class="text-fg">Strava:</span> open the activity → <span class="text-fg">⋯</span> menu → <span class="text-fg">Export GPX</span>.</li>
            <li><span class="text-fg">Garmin Connect:</span> open the activity → gear icon → <span class="text-fg">Export to GPX</span>.</li>
            <li><span class="text-fg">Komoot:</span> open the tour → <span class="text-fg">⋯</span> → <span class="text-fg">Export GPX</span>.</li>
            <li><span class="text-fg">Phone apps:</span> look for a Share or Export option and choose <span class="text-fg">GPX</span>.</li>
          </ul>
        </details>
      </div>

      <div data-ref="drop" tabindex="0" role="button" aria-label="Drop a GPX file or click to choose one"
        class="group relative rounded-card border-2 border-dashed border-border hover:border-accent focus-visible:border-accent transition-colors bg-surface/60 cursor-pointer">
        <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <span class="text-accent">${f("upload","size-8")}</span>
          <p class="text-fg font-medium">Drop your <span class="font-mono">.gpx</span> file here</p>
          <p class="text-sm text-fg-muted">or <span class="text-accent underline underline-offset-2">browse files</span> · you can load several at once</p>
        </div>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button data-ref="sample" class="btn-ghost text-sm">${f("route","size-4")} Try it with a sample track</button>
        <button data-ref="paste-toggle" aria-expanded="false" aria-controls="paste-box" class="btn-ghost text-sm">${f("copy","size-4")} Paste GPX text</button>
      </div>

      <div data-ref="paste-box" id="paste-box" class="mt-4 hidden">
        <textarea data-ref="paste-area" rows="6" placeholder="Paste the contents of a .gpx file here…"
          class="input font-mono text-xs w-full" aria-label="Paste GPX text"></textarea>
        <div class="mt-2 text-right">
          <button data-ref="paste-load" class="btn-primary text-sm">${f("check","size-4")} Load pasted GPX</button>
        </div>
      </div>

      <div class="mt-10 grid sm:grid-cols-2 gap-3">
        <div class="card p-4 space-y-2">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${f("wifi-off","size-4")}</span><h3 class="text-sm font-semibold">100% offline</h3></div>
          <p class="text-sm text-fg-muted">No uploads, no servers, no accounts, no tracking. The map is drawn locally — this page makes zero network requests.</p>
        </div>
        <div class="card p-4 space-y-2">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${f("eye","size-4")}</span><h3 class="text-sm font-semibold">What it removes</h3></div>
          <p class="text-sm text-fg-muted">Home/start-end location, timestamps, heart-rate &amp; sensor data, elevation, device info and names — then exports a clean GPX, GeoJSON or CSV.</p>
        </div>
      </div>

      <input data-ref="file" type="file" accept=".gpx,application/gpx+xml" multiple class="hidden" />`,this.wire()}root;ref(t){return this.root.querySelector(`[data-ref="${t}"]`)}wire(){const t=this.ref("drop"),n=this.ref("file");t.addEventListener("click",()=>n.click()),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),n.click())}),n.addEventListener("change",()=>{n.files&&n.files.length&&this.cb.onFiles(n.files),n.value=""});const e=i=>{t.classList.toggle("!border-accent",i),t.classList.toggle("bg-accent/5",i)};t.addEventListener("dragover",i=>{i.preventDefault(),e(!0)}),t.addEventListener("dragleave",()=>e(!1)),t.addEventListener("drop",i=>{i.preventDefault(),e(!1),i.dataTransfer?.files?.length&&this.cb.onFiles(i.dataTransfer.files)}),this.ref("sample").addEventListener("click",()=>this.cb.onSample()),this.ref("paste-toggle").addEventListener("click",()=>{const i=this.ref("paste-box").classList.toggle("hidden");this.ref("paste-toggle").setAttribute("aria-expanded",String(!i)),i||this.ref("paste-area").focus()}),this.ref("paste-load").addEventListener("click",()=>{const i=this.ref("paste-area").value;i.trim()&&this.cb.onPaste(i)})}}function D(s,t,n,e){return`<section class="card p-4 space-y-3" data-ref="sec-${s}">
    <header class="flex items-center gap-2 text-fg">
      <span class="text-accent">${f(t,"size-4")}</span>
      <h2 class="text-sm font-semibold">${n}</h2>
    </header>
    ${e}
  </section>`}function C(s,t){return`<label class="flex items-center gap-2.5 cursor-pointer select-none">
    <input type="checkbox" data-ref="${s}" class="peer sr-only" />
    <span class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-surface-2 border border-border-soft transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
      <span class="inline-block size-3.5 translate-x-1 rounded-full bg-fg-muted transition-transform peer-checked:translate-x-[18px] peer-checked:bg-on-accent"></span>
    </span>
    <span class="text-sm text-fg">${t}</span>
  </label>`}function A(s,t,n){return`<div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      ${C(s,t)}
      <p class="ml-[46px] mt-0.5 text-xs text-fg-muted">${n}</p>
    </div>
    <span data-ref="${s}-badge" class="data shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium"></span>
  </div>`}class gn{root;store;constructor(t){this.store=t,this.root=document.createElement("div"),this.root.className="space-y-4",this.root.innerHTML=this.template(),this.wire()}template(){return[D("zone","shield-check","Privacy zone",`<p class="text-xs text-fg-muted">Hide your home: cut the points around a chosen centre. Auto-detected from where your tracks start and end.</p>
         ${C("zone-on","Enable privacy zone")}
         <div data-ref="zone-body" class="space-y-3 hidden">
           <div class="flex gap-2">
             <button data-ref="zone-auto" class="btn-ghost flex-1 text-xs">${f("crosshair","size-3.5")} Auto-detect home</button>
             <button data-ref="zone-pick" class="btn-ghost flex-1 text-xs">${f("map-pin","size-3.5")} <span data-ref="zone-pick-label">Pick on map</span></button>
           </div>
           <div class="grid grid-cols-2 gap-2">
             <label class="space-y-1"><span class="label">Latitude</span><input data-ref="zone-lat" class="input" inputmode="decimal" /></label>
             <label class="space-y-1"><span class="label">Longitude</span><input data-ref="zone-lon" class="input" inputmode="decimal" /></label>
           </div>
           <label class="space-y-1 block">
             <span class="label flex justify-between"><span>Radius</span><span data-ref="zone-radius-val" class="text-fg-muted"></span></span>
             <input data-ref="zone-radius" type="range" min="50" max="1000" step="10" class="w-full accent-accent" />
           </label>
           <div role="radiogroup" class="grid grid-cols-2 gap-2 text-xs">
             <label class="flex items-center gap-2 cursor-pointer rounded-control border border-border-soft px-2.5 py-2"><input type="radio" name="zone-mode" data-ref="mode-crop" value="crop-ends" class="accent-accent" /> Crop ends</label>
             <label class="flex items-center gap-2 cursor-pointer rounded-control border border-border-soft px-2.5 py-2"><input type="radio" name="zone-mode" data-ref="mode-cut" value="cut-all" class="accent-accent" /> Cut all</label>
           </div>
           <p class="text-xs text-fg-muted"><span class="text-fg">Crop ends</span> trims only the start &amp; finish near home — best for most people. <span class="text-fg">Cut all</span> removes every point inside the zone, anywhere on the route.</p>
           <p data-ref="zone-count" class="data text-xs"></p>
         </div>`),D("strip","eye","Remove personal data",`<div class="space-y-3">
           ${A("strip-time","Timestamps","When you were there. Reveals your routine.")}
           ${A("strip-ext","Sensor data","Heart rate, cadence, power, GPS accuracy.")}
           ${A("strip-ele","Elevation","Per-point altitude readings.")}
           ${A("strip-names","Names & notes","Track, waypoint and route names/comments.")}
           ${A("strip-creator","Device & author","The recording device and author metadata.")}
         </div>`),D("fuzz","crosshair","Coordinate precision",`<p class="text-xs text-fg-muted">Round coordinates to blur exact positions. Off keeps full precision.</p>
         ${C("fuzz-on","Reduce precision")}
         <label data-ref="fuzz-body" class="space-y-1 hidden block">
           <span class="label flex justify-between"><span>Decimal places</span><span data-ref="fuzz-res" class="text-fg-muted"></span></span>
           <input data-ref="fuzz-dec" type="range" min="2" max="6" step="1" class="w-full accent-accent" />
         </label>`),D("trim","scissors","Trim",`<p class="text-xs text-fg-muted">Drop points from the start and end of the track.</p>
         ${C("trim-on","Trim range")}
         <div data-ref="trim-body" class="space-y-2 hidden">
           <label class="space-y-1 block"><span class="label">Start point</span><input data-ref="trim-start" type="range" min="0" step="1" class="w-full accent-accent" /></label>
           <label class="space-y-1 block"><span class="label">End point</span><input data-ref="trim-end" type="range" min="0" step="1" class="w-full accent-accent" /></label>
           <p data-ref="trim-count" class="data text-xs text-fg-muted"></p>
         </div>`),D("simplify","minimize","Simplify",`<p class="text-xs text-fg-muted">Reduce the number of points to shrink the file.</p>
         ${C("simp-on","Simplify geometry")}
         <div data-ref="simp-body" class="space-y-1 hidden">
           <label class="space-y-1 block">
             <span class="label flex justify-between"><span>Tolerance</span><span data-ref="simp-tol" class="text-fg-muted"></span></span>
             <input data-ref="simp-range" type="range" min="1" max="50" step="1" class="w-full accent-accent" />
           </label>
           <p data-ref="simp-count" class="data text-xs"></p>
         </div>`),`<section data-ref="sec-merge" class="card p-4 space-y-2 hidden">
         <header class="flex items-center gap-2 text-fg"><span class="text-accent">${f("merge","size-4")}</span><h2 class="text-sm font-semibold">Merge</h2></header>
         <p class="text-xs text-fg-muted">Combine all loaded tracks into one.</p>
         ${C("merge-on","Merge into one track")}
       </section>`].join("")}ref(t){return this.root.querySelector(`[data-ref="${t}"]`)}wire(){const t=this.store;this.ref("zone-on").addEventListener("change",o=>{if(o.target.checked){const r=I(t.docs),x=ot(r)??(()=>{const a=$(r.tracks.flatMap(g=>g.segments.flatMap(d=>d.points)));return a?{lat:(a.minLat+a.maxLat)/2,lon:(a.minLon+a.maxLon)/2,radiusM:200}:{lat:0,lon:0,radiusM:200}})();t.patchConfig({privacyZone:x})}else t.setZonePickMode(!1),t.patchConfig({privacyZone:null})}),this.ref("zone-auto").addEventListener("click",()=>{const o=ot(I(t.docs));o?t.patchConfig({privacyZone:o}):t.setError("Could not auto-detect a home location (your track does not loop back).")}),this.ref("zone-pick").addEventListener("click",()=>t.setZonePickMode(!t.zonePickMode));const n=o=>{const p=t.config.privacyZone;p&&t.patchConfig({privacyZone:{...p,...o}})};this.ref("zone-lat").addEventListener("change",o=>{const p=Number(o.target.value);Number.isFinite(p)&&n({lat:p})}),this.ref("zone-lon").addEventListener("change",o=>{const p=Number(o.target.value);Number.isFinite(p)&&n({lon:p})}),this.ref("zone-radius").addEventListener("input",o=>n({radiusM:Number(o.target.value)})),this.ref("mode-crop").addEventListener("change",()=>t.patchConfig({privacyMode:"crop-ends"})),this.ref("mode-cut").addEventListener("change",()=>t.patchConfig({privacyMode:"cut-all"}));const e=[["strip-time","time"],["strip-ext","extensions"],["strip-ele","elevation"],["strip-names","names"],["strip-creator","creator"]];for(const[o,p]of e)this.ref(o).addEventListener("change",r=>t.patchStrip({[p]:r.target.checked}));this.ref("fuzz-on").addEventListener("change",o=>t.patchConfig({fuzzDecimals:o.target.checked?4:null})),this.ref("fuzz-dec").addEventListener("input",o=>t.patchConfig({fuzzDecimals:Number(o.target.value)})),this.ref("trim-on").addEventListener("change",o=>{const p=o.target.checked;t.patchConfig({trimRange:p?{start:0,end:t.derived.trimMax}:null})});const i=()=>{const o=Number(this.ref("trim-start").value),p=Number(this.ref("trim-end").value);t.patchConfig({trimRange:{start:Math.min(o,p),end:Math.max(o,p)}})};this.ref("trim-start").addEventListener("input",i),this.ref("trim-end").addEventListener("input",i),this.ref("simp-on").addEventListener("change",o=>t.patchConfig({simplifyToleranceM:o.target.checked?5:null})),this.ref("simp-range").addEventListener("input",o=>t.patchConfig({simplifyToleranceM:Number(o.target.value)})),this.ref("merge-on").addEventListener("change",o=>t.patchConfig({merge:o.target.checked}))}update(){const t=this.store,n=t.config,e=t.derived,i=e.inventory,o=!!n.privacyZone;if(this.ref("zone-on").checked=o,this.ref("zone-body").classList.toggle("hidden",!o),n.privacyZone){const l=this.ref("zone-lat"),m=this.ref("zone-lon");document.activeElement!==l&&(l.value=n.privacyZone.lat.toFixed(6)),document.activeElement!==m&&(m.value=n.privacyZone.lon.toFixed(6)),this.ref("zone-radius").value=String(n.privacyZone.radiusM),this.ref("zone-radius-val").textContent=`${n.privacyZone.radiusM} m`,this.ref("mode-crop").checked=n.privacyMode==="crop-ends",this.ref("mode-cut").checked=n.privacyMode==="cut-all";const h=e.transform.report.privacyZonePointsRemoved,k=this.ref("zone-count");k.textContent=`${P(h)} ${h===1?"point":"points"} inside the zone will be removed.`,k.className=`data text-xs ${h>0?"text-danger":"text-fg-muted"}`}const p=this.ref("zone-pick-label");p.textContent=t.zonePickMode?"Click the map…":"Pick on map";const r=this.ref("zone-pick");r.classList.toggle("!border-accent",t.zonePickMode),r.setAttribute("aria-pressed",String(t.zonePickMode)),this.ref("strip-time").checked=n.strip.time,this.ref("strip-ext").checked=n.strip.extensions,this.ref("strip-ele").checked=n.strip.elevation,this.ref("strip-names").checked=n.strip.names,this.ref("strip-creator").checked=n.strip.creator,this.setBadge("strip-time-badge",i.hasTime),this.setBadge("strip-ext-badge",i.hasExtensions),this.setBadge("strip-ele-badge",i.hasElevation),this.setBadge("strip-names-badge",i.hasNames),this.setBadge("strip-creator-badge",i.hasCreator);const x=n.fuzzDecimals!==null;if(this.ref("fuzz-on").checked=x,this.ref("fuzz-body").classList.toggle("hidden",!x),x){this.ref("fuzz-dec").value=String(n.fuzzDecimals);const l=Zt(n.fuzzDecimals);this.ref("fuzz-res").textContent=`${n.fuzzDecimals} dp · ≈ ${l>=1e3?`${(l/1e3).toFixed(0)} km`:`${l.toFixed(l<10?1:0)} m`}`}const a=n.trimRange!==null;this.ref("trim-on").checked=a,this.ref("trim-body").classList.toggle("hidden",!a);const g=this.ref("trim-start"),d=this.ref("trim-end");if(g.max=String(e.trimMax),d.max=String(e.trimMax),n.trimRange){document.activeElement!==g&&(g.value=String(n.trimRange.start)),document.activeElement!==d&&(d.value=String(n.trimRange.end));const l=n.trimRange.end-n.trimRange.start+1;this.ref("trim-count").textContent=`Keeping points ${P(n.trimRange.start)}–${P(n.trimRange.end)} (${P(l)} of ${P(e.trimMax+1)}).`}const c=n.simplifyToleranceM!==null&&n.simplifyToleranceM>0;if(this.ref("simp-on").checked=c,this.ref("simp-body").classList.toggle("hidden",!c),c){this.ref("simp-range").value=String(n.simplifyToleranceM),this.ref("simp-tol").textContent=`${n.simplifyToleranceM} m`;const l=e.sourceStats.total.pointCount,m=e.resultStats.total.pointCount,h=this.ref("simp-count");h.textContent=`${P(l)} → ${P(m)} pts · ~${B(e.transform.report.bytesAfter)}`,h.className="data text-xs text-accent"}this.ref("sec-merge").classList.toggle("hidden",t.trackCount<=1),this.ref("merge-on").checked=n.merge}setBadge(t,n){const e=this.ref(t);e.textContent=n?"present":"none",e.className=`data shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${n?"bg-warn/15 text-warn":"bg-surface-2 text-fg-muted"}`}}function Q(s,t,n){const e=new Blob([t],{type:n}),i=URL.createObjectURL(e),o=document.createElement("a");o.href=i,o.download=s,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function tt(s){return(s.sourceName??s.metadata.name??"track").replace(/\.gpx$/i,"").replace(/[^a-z0-9-_]+/gi,"-")||"track"}function dn(s){Q(`${tt(s)}-cleaned.gpx`,U(s),"application/gpx+xml")}function mn(s){Q(`${tt(s)}-cleaned.geojson`,Wt(s),"application/geo+json")}function hn(s){Q(`${tt(s)}-cleaned.csv`,Ut(s),"text/csv")}async function fn(s){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(s),!0}catch{}try{const t=document.createElement("textarea");t.value=s,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");return t.remove(),n}catch{return!1}}class un{root;store;copyTimer;constructor(t){this.store=t,this.root=document.createElement("div"),this.root.className="space-y-4",this.root.innerHTML=`
      <section class="card p-4 space-y-3">
        <header class="flex items-center gap-2 text-fg">
          <span class="text-accent">${f("shield-check","size-4")}</span>
          <h2 class="text-sm font-semibold">Privacy report</h2>
        </header>
        <div data-ref="report-body" class="space-y-3"></div>
      </section>

      <section class="card p-4 space-y-3">
        <header class="flex items-center gap-2 text-fg">
          <span class="text-accent">${f("download","size-4")}</span>
          <h2 class="text-sm font-semibold">Export cleaned track</h2>
        </header>
        <div class="grid grid-cols-3 gap-2">
          <button data-ref="exp-gpx" class="btn-primary text-xs">${f("download","size-3.5")} GPX</button>
          <button data-ref="exp-geojson" class="btn-ghost text-xs">GeoJSON</button>
          <button data-ref="exp-csv" class="btn-ghost text-xs">CSV</button>
        </div>
        <button data-ref="exp-copy" class="btn-ghost w-full text-xs">${f("copy","size-3.5")} <span data-ref="copy-label">Copy GPX to clipboard</span></button>
      </section>

      <section class="card p-4 space-y-3">
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-fg"><span class="text-accent">${f("activity","size-4")}</span><h2 class="text-sm font-semibold">Statistics</h2></div>
          <div role="group" aria-label="Distance units" class="inline-flex rounded-control border border-border-soft overflow-hidden text-xs">
            <button data-ref="unit-metric" aria-label="Show distances in kilometres" class="px-2 py-1">km</button>
            <button data-ref="unit-imperial" aria-label="Show distances in miles" class="px-2 py-1 border-l border-border-soft">mi</button>
          </div>
        </header>
        <div data-ref="stats-body"></div>
      </section>`,this.wire()}ref(t){return this.root.querySelector(`[data-ref="${t}"]`)}wire(){const t=this.store;this.ref("exp-gpx").addEventListener("click",()=>dn(t.derived.transform.result)),this.ref("exp-geojson").addEventListener("click",()=>mn(t.derived.transform.result)),this.ref("exp-csv").addEventListener("click",()=>hn(t.derived.transform.result)),this.ref("exp-copy").addEventListener("click",async()=>{const n=await fn(U(t.derived.transform.result)),e=this.ref("copy-label");e.textContent=n?"Copied!":"Copy failed",window.clearTimeout(this.copyTimer),this.copyTimer=window.setTimeout(()=>{e.textContent="Copy GPX to clipboard"},1800)}),this.ref("unit-metric").addEventListener("click",()=>t.setUnits("metric")),this.ref("unit-imperial").addEventListener("click",()=>t.setUnits("imperial"))}row(t,n,e=!1){return`<div class="flex items-baseline justify-between gap-3 py-1 border-b border-border-soft/60 last:border-0">
      <span class="text-xs text-fg-muted">${_(t)}</span>
      <span class="data text-sm ${e?"text-accent":"text-fg"}">${_(n)}</span>
    </div>`}update(){const t=this.store,{report:n}=t.derived.transform,e=t.units,i=this.ref("unit-metric"),o=this.ref("unit-imperial");i.className=`px-2 py-1 ${e==="metric"?"bg-accent text-on-accent":"text-fg-muted"}`,o.className=`px-2 py-1 border-l border-border-soft ${e==="imperial"?"bg-accent text-on-accent":"text-fg-muted"}`,i.setAttribute("aria-pressed",String(e==="metric")),o.setAttribute("aria-pressed",String(e==="imperial"));const r=[[n.privacyZoneApplied!==null&&n.privacyZonePointsRemoved>0,"Home/privacy zone cropped"],[n.removedTimestamps,"Timestamps removed"],[n.removedExtensions,"Sensor data removed"],[n.removedElevation,"Elevation removed"],[n.removedNames,"Names & notes removed"],[n.removedCreator,"Device & author removed"],[n.fuzzedTo!==null,`Coordinates rounded to ${n.fuzzedTo} dp`]].filter(([l])=>l),x=r.length>0,a=x?`<div class="flex items-center gap-2 rounded-control bg-accent/10 border border-accent/30 px-3 py-2 text-accent text-sm">${f("shield-check","size-4")}<span>${r.length} privacy ${r.length===1?"action":"actions"} applied — ready to share.</span></div>`:`<div class="flex items-center gap-2 rounded-control bg-surface-2 border border-border-soft px-3 py-2 text-fg-muted text-sm">${f("shield","size-4")}<span>No personal data removed yet. Use the cleaning controls to choose what to remove.</span></div>`,g=r.map(([,l])=>`<li class="flex items-center gap-2 text-sm text-fg"><span class="text-accent">${f("check","size-3.5")}</span>${l}</li>`).join(""),d=n.bytesBefore>0?`${B(n.bytesBefore)} → ${B(n.bytesAfter)} (${bt(n.bytesBefore,n.bytesAfter)} smaller)`:B(n.bytesAfter);this.ref("report-body").innerHTML=`
      ${a}
      ${x?`<ul class="space-y-1">${g}</ul>`:""}
      <div class="pt-1">
        ${this.row("Points",`${P(n.pointsBefore)} → ${P(n.pointsAfter)}`,n.pointsRemoved>0)}
        ${this.row("Removed",`${P(n.pointsRemoved)}`,n.pointsRemoved>0)}
        ${this.row("File size",d)}
        ${this.row("Bounds (after)",yt(n.bboxAfter))}
      </div>`;const c=t.derived.resultStats.total;this.ref("stats-body").innerHTML=`
      <p class="text-[11px] uppercase tracking-wide text-fg-muted mb-1">Cleaned output</p>
      ${this.row("Distance",vt(c.distanceM,e))}
      ${this.row("Duration",nt(c.durationS))}
      ${this.row("Moving time",nt(c.movingTimeS))}
      ${this.row("Elevation gain",c.maxEleM!==null?G(c.elevationGainM,e):"—")}
      ${this.row("Elevation loss",c.maxEleM!==null?G(c.elevationLossM,e):"—")}
      ${this.row("Min / max elev.",c.minEleM!==null&&c.maxEleM!==null?`${G(c.minEleM,e)} / ${G(c.maxEleM,e)}`:"—")}
      ${this.row("Avg / max speed",`${et(c.avgSpeedMps,e)} / ${et(c.maxSpeedMps,e)}`)}
      ${this.row("Avg pace",Pt(c.avgSpeedMps,e))}
      ${this.row("Points",P(c.pointCount))}
      ${this.row("Start",st(c.startTime))}
      ${this.row("End",st(c.endTime))}`}}function kn(s){const t=new sn;s.innerHTML=`
    <div class="min-h-[100dvh] flex flex-col">
      <header class="sticky top-0 z-20 border-b border-border-soft bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
        <h1 class="sr-only">GPX Privacy Cleaner — remove your home location and personal data from GPS tracks, entirely in your browser</h1>
        <div class="mx-auto max-w-[1500px] px-4 h-14 flex items-center gap-3">
          <div class="flex items-center gap-2 text-fg">
            <span class="text-accent">${f("shield-check","size-6")}</span>
            <span class="font-semibold tracking-tight" aria-hidden="true">GPX Privacy Cleaner</span>
          </div>
          <span class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
            ${f("wifi-off","size-3.5")} Offline · nothing uploaded
          </span>
          <div class="ml-auto flex items-center gap-2" data-ref="header-actions"></div>
        </div>
      </header>

      <main class="flex-1">
        <div data-ref="error" role="alert" class="hidden border-b border-danger/30 bg-danger/10">
          <div class="mx-auto max-w-[1500px] px-4 py-2.5 flex items-start gap-2 text-sm text-danger">
            <span class="mt-0.5 shrink-0">${f("alert-triangle","size-4")}</span>
            <p data-ref="error-text" class="flex-1"></p>
            <button data-ref="error-close" class="shrink-0 text-danger/80 hover:text-danger" aria-label="Dismiss">${f("x","size-4")}</button>
          </div>
        </div>
        <div data-ref="empty"></div>
        <div data-ref="workspace" class="hidden mx-auto max-w-[1500px] px-4 py-4">
          <div data-ref="chips" class="mb-3 flex flex-wrap items-center gap-2"></div>
          <div class="grid gap-4 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_360px] lg:h-[calc(100dvh-128px)]">
            <aside aria-label="Cleaning controls" class="order-2 lg:order-1 lg:overflow-y-auto lg:h-full pr-0.5" data-ref="controls-host"></aside>
            <section class="order-1 lg:order-2 relative h-[52vh] lg:h-full rounded-card border border-border-soft bg-surface overflow-hidden" data-ref="canvas-host">
              <div class="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
                <button data-ref="zoom-in" class="btn-ghost size-9 !p-0" aria-label="Zoom in">${f("zoom-in","size-4")}</button>
                <button data-ref="zoom-out" class="btn-ghost size-9 !p-0" aria-label="Zoom out">${f("zoom-out","size-4")}</button>
                <button data-ref="zoom-fit" class="btn-ghost size-9 !p-0" aria-label="Fit to view">${f("crosshair","size-4")}</button>
              </div>
              <div data-ref="legend" class="absolute left-3 top-3 z-10 rounded-control bg-bg/80 border border-border-soft px-2.5 py-2 text-[11px] space-y-1 backdrop-blur"></div>
            </section>
            <aside aria-label="Privacy report and export" class="order-3 lg:overflow-y-auto lg:h-full pr-0.5" data-ref="report-host"></aside>
          </div>
        </div>
      </main>

      <footer class="border-t border-border-soft">
        <div class="mx-auto max-w-[1500px] px-4 py-3 text-xs text-fg-muted flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Runs entirely in your browser. No data is uploaded.</span>
          <a href="https://github.com/Skytuhua/gpx-privacy-cleaner" class="text-accent hover:underline">Source &amp; docs</a>
        </div>
      </footer>
    </div>`;const n=l=>s.querySelector(`[data-ref="${l}"]`);async function e(l){const{loaded:m,errors:h}=await xn(l);m.length&&t.addFiles(m),h.length&&t.setError(h.join(" "))}function i(l){const{loaded:m,errors:h}=Tt(l);m.length?t.addFiles(m):t.setError(h.join(" "))}function o(){const{loaded:l}=an();t.addFiles(l)}const p=new ln({onFiles:e,onSample:o,onPaste:i});n("empty").appendChild(p.root);const r=new gn(t);n("controls-host").appendChild(r.root);const x=new un(t);n("report-host").appendChild(x.root);const a=new cn(n("canvas-host"));a.onPickCenter=(l,m)=>{const h=t.config.privacyZone;h&&t.patchConfig({privacyZone:{...h,lat:l,lon:m}}),t.setZonePickMode(!1)},n("zoom-in").addEventListener("click",()=>a.zoomBy(1.3)),n("zoom-out").addEventListener("click",()=>a.zoomBy(1/1.3)),n("zoom-fit").addEventListener("click",()=>a.fitView()),n("header-actions").innerHTML=`
    <input data-ref="hdr-file" type="file" accept=".gpx,application/gpx+xml" multiple class="hidden" />
    <button data-ref="hdr-add" aria-label="Add files" class="btn-ghost text-xs hidden">${f("upload","size-3.5")} <span class="hidden sm:inline">Add files</span></button>
    <button data-ref="hdr-reset" aria-label="Reset" class="btn-ghost text-xs hidden">${f("rotate-ccw","size-3.5")} <span class="hidden sm:inline">Reset</span></button>`;const g=n("hdr-file");n("hdr-add").addEventListener("click",()=>g.click()),g.addEventListener("change",()=>{g.files?.length&&e(g.files),g.value=""}),n("hdr-reset").addEventListener("click",()=>t.reset()),n("error-close").addEventListener("click",()=>t.clearError()),s.addEventListener("dragover",l=>{t.files.length&&l.preventDefault()}),s.addEventListener("drop",l=>{t.files.length&&l.dataTransfer?.files?.length&&(l.preventDefault(),e(l.dataTransfer.files))});const d=`
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block h-0.5 w-4 bg-track"></span> cleaned track</div>
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block h-0.5 w-4 bg-fg-muted"></span> original</div>
    <div class="flex items-center gap-1.5 text-fg-muted"><span class="inline-block size-2 rounded-full bg-accent"></span> start <span class="inline-block size-2 rounded-full ml-1 bg-danger"></span> end</div>`;function c(){const l=t.files.length>0;n("empty").classList.toggle("hidden",l),n("workspace").classList.toggle("hidden",!l),n("hdr-add").classList.toggle("hidden",!l),n("hdr-reset").classList.toggle("hidden",!l);const m=n("error");if(t.errorMessage?(m.classList.remove("hidden"),n("error-text").textContent=t.errorMessage):m.classList.add("hidden"),l){const h=t.derived.sourceStats.total.pointCount;n("chips").innerHTML=t.files.map((E,z)=>`<span class="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border-soft px-2.5 py-1 text-xs text-fg">${f("file","size-3.5")}<span class="max-w-[180px] truncate">${_(E.name)}</span><button data-remove="${z}" class="text-fg-muted hover:text-danger" aria-label="Remove ${_(E.name)}">${f("x","size-3.5")}</button></span>`).join("")+`<span class="text-xs text-fg-muted ml-1 data">${P(h)} points loaded</span>`,n("chips").querySelectorAll("[data-remove]").forEach(E=>E.addEventListener("click",()=>t.removeFile(Number(E.dataset.remove)))),n("legend").innerHTML=d,a.invalidateSize();const{source:k,result:M}=t.derived.transform;a.setData(k,M,t.config.privacyZone),a.setPickMode(t.zonePickMode),r.update(),x.update()}}t.subscribe(c),c()}const mt=document.querySelector("#app");mt&&kn(mt);
