import{a as d}from"./index-Dpx_4rWJ.js";let I={data:""},O=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||I,C=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,D=/\/\*[^]*?\*\/|  +/g,z=/\n+/g,g=(t,e)=>{let a="",o="",s="";for(let r in t){let i=t[r];r[0]=="@"?r[1]=="i"?a=r+" "+i+";":o+=r[1]=="f"?g(i,r):r+"{"+g(i,r[1]=="k"?"":e)+"}":typeof i=="object"?o+=g(i,e?e.replace(/([^,])+/g,n=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,n):n?n+" "+l:l)):r):i!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=g.p?g.p(r,i):r+":"+i+";")}return a+(e&&s?e+"{"+s+"}":s)+o},m={},F=t=>{if(typeof t=="object"){let e="";for(let a in t)e+=a+F(t[a]);return e}return t},S=(t,e,a,o,s)=>{let r=F(t),i=m[r]||(m[r]=(l=>{let c=0,u=11;for(;c<l.length;)u=101*u+l.charCodeAt(c++)>>>0;return"go"+u})(r));if(!m[i]){let l=r!==t?t:(c=>{let u,b,h=[{}];for(;u=C.exec(c.replace(D,""));)u[4]?h.shift():u[3]?(b=u[3].replace(z," ").trim(),h.unshift(h[0][b]=h[0][b]||{})):h[0][u[1]]=u[2].replace(z," ").trim();return h[0]})(t);m[i]=g(s?{["@keyframes "+i]:l}:l,a?"":"."+i)}let n=a&&m.g?m.g:null;return a&&(m.g=m[i]),((l,c,u,b)=>{b?c.data=c.data.replace(b,l):c.data.indexOf(l)===-1&&(c.data=u?l+c.data:c.data+l)})(m[i],e,o,n),i},_=(t,e,a)=>t.reduce((o,s,r)=>{let i=e[r];if(i&&i.call){let n=i(a),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;i=l?"."+l:n&&typeof n=="object"?n.props?"":g(n,""):n===!1?"":n}return o+s+(i??"")},"");function v(t){let e=this||{},a=t.call?t(e.p):t;return S(a.unshift?a.raw?_(a,[].slice.call(arguments,1),e.p):a.reduce((o,s)=>Object.assign(o,s&&s.call?s(e.p):s),{}):a,O(e.target),e.g,e.o,e.k)}let N,k,E;v.bind({g:1});let f=v.bind({k:1});function M(t,e,a,o){g.p=e,N=t,k=a,E=o}function y(t,e){let a=this||{};return function(){let o=arguments;function s(r,i){let n=Object.assign({},r),l=n.className||s.className;a.p=Object.assign({theme:k&&k()},n),a.o=/ *go\d+/.test(l),n.className=v.apply(a,o)+(l?" "+l:"");let c=t;return t[0]&&(c=n.as||t,delete n.as),E&&c[0]&&E(n),N(c,n)}return s}}var P=t=>typeof t=="function",j=(t,e)=>P(t)?t(e):t,L=(()=>{let t=0;return()=>(++t).toString()})(),V=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");t=!e||e.matches}return t}})(),q=20,T=(t,e)=>{switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,q)};case 1:return{...t,toasts:t.toasts.map(r=>r.id===e.toast.id?{...r,...e.toast}:r)};case 2:let{toast:a}=e;return T(t,{type:t.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=e;return{...t,toasts:t.toasts.map(r=>r.id===o||o===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return e.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(r=>r.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let s=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+s}))}}},H=[],w={toasts:[],pausedAt:void 0},A=t=>{w=T(w,t),H.forEach(e=>{e(w)})},J=(t,e="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:(a==null?void 0:a.id)||L()}),x=t=>(e,a)=>{let o=J(e,t,a);return A({type:2,toast:o}),o.id},p=(t,e)=>x("blank")(t,e);p.error=x("error");p.success=x("success");p.loading=x("loading");p.custom=x("custom");p.dismiss=t=>{A({type:3,toastId:t})};p.remove=t=>A({type:4,toastId:t});p.promise=(t,e,a)=>{let o=p.loading(e.loading,{...a,...a==null?void 0:a.loading});return typeof t=="function"&&(t=t()),t.then(s=>{let r=e.success?j(e.success,s):void 0;return r?p.success(r,{id:o,...a,...a==null?void 0:a.success}):p.dismiss(o),s}).catch(s=>{let r=e.error?j(e.error,s):void 0;r?p.error(r,{id:o,...a,...a==null?void 0:a.error}):p.dismiss(o)}),t};var U=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,W=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Z=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${W} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Y} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,B=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,G=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${B} 1s linear infinite;
`,K=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Q=f`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,R=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,X=y("div")`
  position: absolute;
`,tt=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,et=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,at=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${et} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,rt=({toast:t})=>{let{icon:e,type:a,iconTheme:o}=t;return e!==void 0?typeof e=="string"?d.createElement(at,null,e):e:a==="blank"?null:d.createElement(tt,null,d.createElement(G,{...o}),a!=="loading"&&d.createElement(X,null,a==="error"?d.createElement(Z,{...o}):d.createElement(R,{...o})))},ot=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,st=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,it="0%{opacity:0;} 100%{opacity:1;}",nt="0%{opacity:1;} 100%{opacity:0;}",lt=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ct=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,dt=(t,e)=>{let a=t.includes("top")?1:-1,[o,s]=V()?[it,nt]:[ot(a),st(a)];return{animation:e?`${f(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};d.memo(({toast:t,position:e,style:a,children:o})=>{let s=t.height?dt(t.position||e||"top-center",t.visible):{opacity:0},r=d.createElement(rt,{toast:t}),i=d.createElement(ct,{...t.ariaProps},j(t.message,t));return d.createElement(lt,{className:t.className,style:{...s,...a,...t.style}},typeof o=="function"?o({icon:r,message:i}):d.createElement(d.Fragment,null,r,i))});M(d.createElement);v`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var $=p;const ut=()=>({showToast:({title:e,message:a,type:o})=>{switch(o){case"success":$.success(a);break;case"error":$.error(a);break;default:$(a)}}});export{ut as u};
