var app=function(){"use strict";function t(){}function e(t){return t()}function i(){return Object.create(null)}function n(t){t.forEach(e)}function a(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,i,n){e.$$.on_destroy.push(function(e,...i){if(null==e)return t;const n=e.subscribe(...i);return n.unsubscribe?()=>n.unsubscribe():n}(i,n))}function r(t,e){t.appendChild(e)}function c(t,e,i){t.insertBefore(e,i||null)}function l(t){t.parentNode.removeChild(t)}function h(t){return document.createElement(t)}function d(){return t=" ",document.createTextNode(t);var t}function p(t,e,i,n){return t.addEventListener(e,i,n),()=>t.removeEventListener(e,i,n)}function f(t,e,i){null==i?t.removeAttribute(e):t.getAttribute(e)!==i&&t.setAttribute(e,i)}function m(t,e){t.value=null==e?"":e}class b{constructor(t=null){this.a=t,this.e=this.n=null}m(t,e,i=null){this.e||(this.e=h(e.nodeName),this.t=e,this.h(t)),this.i(i)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let e=0;e<this.n.length;e+=1)c(this.t,this.n[e],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(l)}}let u;function g(t){u=t}function x(t){(function(){if(!u)throw new Error("Function called outside component initialization");return u})().$$.on_mount.push(t)}const w=[],y=[],_=[],k=[],v=Promise.resolve();let $=!1;function z(t){_.push(t)}let L=!1;const T=new Set;function H(){if(!L){L=!0;do{for(let t=0;t<w.length;t+=1){const e=w[t];g(e),R(e.$$)}for(w.length=0;y.length;)y.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];T.has(e)||(T.add(e),e())}_.length=0}while(w.length);for(;k.length;)k.pop()();$=!1,L=!1,T.clear()}}function R(t){if(null!==t.fragment){t.update(),n(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}const A=new Set;function M(t,e){-1===t.$$.dirty[0]&&(w.push(t),$||($=!0,v.then(H)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function E(o,s,r,c,h,d,p=[-1]){const f=u;g(o);const m=s.props||{},b=o.$$={fragment:null,ctx:null,props:d,update:t,not_equal:h,bound:i(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:i(),dirty:p,skip_bound:!1};let x=!1;if(b.ctx=r?r(o,m,(t,e,...i)=>{const n=i.length?i[0]:e;return b.ctx&&h(b.ctx[t],b.ctx[t]=n)&&(!b.skip_bound&&b.bound[t]&&b.bound[t](n),x&&M(o,t)),e}):[],b.update(),x=!0,n(b.before_update),b.fragment=!!c&&c(b.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);b.fragment&&b.fragment.l(t),t.forEach(l)}else b.fragment&&b.fragment.c();s.intro&&((w=o.$$.fragment)&&w.i&&(A.delete(w),w.i(y))),function(t,i,o){const{fragment:s,on_mount:r,on_destroy:c,after_update:l}=t.$$;s&&s.m(i,o),z(()=>{const i=r.map(e).filter(a);c?c.push(...i):n(i),t.$$.on_mount=[]}),l.forEach(z)}(o,s.target,s.anchor),H()}var w,y;g(f)}let S;"function"==typeof HTMLElement&&(S=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,i){this[t]=i}$destroy(){!function(t,e){const i=t.$$;null!==i.fragment&&(n(i.on_destroy),i.fragment&&i.fragment.d(e),i.on_destroy=i.fragment=null,i.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(e),()=>{const t=i.indexOf(e);-1!==t&&i.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});const I=[];const j=function(e,i=t){let n;const a=[];function s(t){if(o(e,t)&&(e=t,n)){const t=!I.length;for(let t=0;t<a.length;t+=1){const i=a[t];i[1](),I.push(i,e)}if(t){for(let t=0;t<I.length;t+=2)I[t][0](I[t+1]);I.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(o,r=t){const c=[o,r];return a.push(c),1===a.length&&(n=i(s)||t),o(e),()=>{const t=a.indexOf(c);-1!==t&&a.splice(t,1),0===a.length&&(n(),n=null)}}}}(!1);function C(e){let i,n,a,o;return{c(){i=h("span"),n=h("div"),n.innerHTML='<img src="https://ayzom.com/img/akhilesh.png">',a=d(),this.c=t,f(n,"class","chat_avatar"),o=new b(null),f(i,"class","chat_msg_item chat_msg_item_admin")},m(t,s){c(t,i,s),r(i,n),r(i,a),o.m(e[0],i)},p(t,[e]){1&e&&o.p(t[0])},i:t,o:t,d(t){t&&l(i)}}}function N(t,e,i){let{text:n}=e;return t.$$set=t=>{"text"in t&&i(0,n=t.text)},[n]}class O extends S{constructor(t){super(),this.shadowRoot.innerHTML="<style>.chat_msg_item_admin{overflow-wrap:break-word;letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;border-radius:3px;animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999;margin-left:60px;float:left;background:rgba(0, 0, 0, 0.03);color:#666}.chat_avatar{letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;color:#666;position:absolute;top:0;width:40px;height:40px;text-align:center;border-radius:50%;left:-52px;background:rgba(0, 0, 0, 0.03)}img{letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;color:#666;width:40px;height:40px;text-align:center;border-radius:50%}</style>",E(this,{target:this.shadowRoot},N,C,o,{text:0}),t&&(t.target&&c(t.target,this,t.anchor),t.props&&(this.$set(t.props),H()))}static get observedAttributes(){return["text"]}get text(){return this.$$.ctx[0]}set text(t){this.$set({text:t}),H()}}function q(e){let i;return{c(){i=h("span"),this.c=t,f(i,"class","chat_msg_item chat_msg_item_user")},m(t,n){c(t,i,n),i.innerHTML=e[0]},p(t,[e]){1&e&&(i.innerHTML=t[0])},i:t,o:t,d(t){t&&l(i)}}}function P(t,e,i){let{text:n}=e;return t.$$set=t=>{"text"in t&&i(0,n=t.text)},[n]}customElements.define("my-admin",O);class U extends S{constructor(t){super(),this.shadowRoot.innerHTML="<style>.chat_msg_item_user{overflow-wrap:break-word;letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;border-radius:3px;animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999;margin-right:20px;float:right;background:#42a5f5;color:#eceff1}</style>",E(this,{target:this.shadowRoot},P,q,o,{text:0}),t&&(t.target&&c(t.target,this,t.anchor),t.props&&(this.$set(t.props),H()))}static get observedAttributes(){return["text"]}get text(){return this.$$.ctx[0]}set text(t){this.$set({text:t}),H()}}function D(e){let i,a,o,s,b,u,g,x,w,y,_,k,v,$,z,L,T,H,R,A,M,E,S;return{c(){var n,r,c;i=h("main"),a=h("div"),o=h("div"),s=h("div"),s.innerHTML='<div class="chat_option"><div class="header_img"><img src="https://ayzom.com/img/akhilesh.png"></div> \n\t\t\t\t<span id="chat_head">Akhilesh Yadav</span>  <br>  <span class="agent">Status</span>  <span class="online">(Online)</span></div>',b=d(),u=h("div"),u.innerHTML='<div class="chat_body"><p>Ask me anything. Please drop your email/phone/socialmedia profile link so I can connect later in case I am offline.</p></div> \n\t\t\t<span class="chat_msg_item chat_msg_item_admin"><div class="chat_avatar"><img src="https://ayzom.com/img/akhilesh.png"></div>\n\t\t\t\tHey there! Any question?</span>',g=d(),x=h("div"),w=h("a"),w.innerHTML='<i class="zmdi zmdi-mail-send"></i>',y=d(),_=h("textarea"),v=d(),$=h("a"),z=h("i"),H=d(),R=h("link"),A=d(),M=h("link"),this.c=t,f(s,"class","chat_header"),f(u,"id","chat_converse"),f(u,"class","chat_conversion chat_converse"),n="display",r="block",u.style.setProperty(n,r,c?"important":""),f(w,"id","fab_send"),f(w,"class","fab is-visible"),f(_,"id","chatSend"),f(_,"name","chat_message"),f(_,"placeholder","Send a message"),f(_,"class","chat_field chat_message"),f(x,"class","fab_field"),f(o,"class",k=e[2]?"chat is-visible":"chat hide-div"),f(z,"class",L=e[2]?"prime zmdi zmdi-close is-active is-visible":"prime zmdi zmdi-comment-outline"),f($,"id","prime"),f($,"class",T=e[2]?"fab is-float is-visible":"fab"),f(a,"class","fabs"),f(R,"rel","stylesheet"),f(R,"href","https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic⊂=latin,cyrillic"),f(M,"rel","stylesheet"),f(M,"href","https://zavoloklom.github.io/material-design-iconic-font/css/docs.md-iconic-font.min.css")},m(t,n){c(t,i,n),r(i,a),r(a,o),r(o,s),r(o,b),r(o,u),e[6](u),r(o,g),r(o,x),r(x,w),r(x,y),r(x,_),m(_,e[0]),r(a,v),r(a,$),r($,z),c(t,H,n),c(t,R,n),c(t,A,n),c(t,M,n),E||(S=[p(w,"click",e[4]),p(_,"input",e[7]),p($,"click",e[3])],E=!0)},p(t,[e]){1&e&&m(_,t[0]),4&e&&k!==(k=t[2]?"chat is-visible":"chat hide-div")&&f(o,"class",k),4&e&&L!==(L=t[2]?"prime zmdi zmdi-close is-active is-visible":"prime zmdi zmdi-comment-outline")&&f(z,"class",L),4&e&&T!==(T=t[2]?"fab is-float is-visible":"fab")&&f($,"class",T)},i:t,o:t,d(t){t&&l(i),e[6](null),t&&l(H),t&&l(R),t&&l(A),t&&l(M),E=!1,n(S)}}}function J(t,e,i){let n;s(t,j,t=>i(2,n=t));let a,{name:o}=e,r="",c="-";!async function(){var t;a=await fetch("https://ipapi.co/json/").then(t=>t.json()),c=`\n\nGeoData:\n------------------\n${(t=a).ip}\n${t.city},${t.region}\n${t.country_name}(${t.country_code} - ${t.country_capital})\n${t.country_calling_code}, ${t.currency}\nUTC ${t.utc_offset}-${t.org}`||" - Details Unavailable"}();let l="";function h(t,e){const i=document.querySelector("body > tg-chat").shadowRoot.querySelector("#chat_converse");new("Admin"===e?O:U)({target:document.querySelector("body > tg-chat").shadowRoot.querySelector("#chat_converse"),props:{text:t}});return i.scrollTo(0,i.scrollHeight),""}function d(){j.set(!n)}const p=new WebSocket("wss://83afvazpb0.execute-api.us-east-1.amazonaws.com/dev");x(async()=>{window.wscount=1,p.onopen=function(t){let e=JSON.stringify("User joined. "+c);console.log({socket:p,wscount:wscount}),window.wscount=window.wscount+1,2===window.wscount&&p.send(`{"action":"test", "echo":${e}}`)}});let f=1;function m(t){return t&&l.insertAdjacentHTML("beforeend",h(t,"Admin")),0}return p.onmessage=function(t){let e=t.data&&t.data.substring(6);!1===n&&f>1&&d(),m(e),f++},p.onclose=function(t){t.wasClean,m("Talk to you later! Please connect at <a href='https://linkedin.com/in/arki7n'>linkedin.com/in/arki7n</a>")},p.onerror=function(t){m("Talk to you later! Please connect at <a href='https://linkedin.com/in/arki7n'>linkedin.com/in/arki7n</a>")},t.$$set=t=>{"name"in t&&i(5,o=t.name)},[r,l,n,d,function(){let t=r;!function(t){t&&l.insertAdjacentHTML("beforeend",h(t,"User"))}(t);let e=JSON.stringify(`${t}\n${a.ip}`);p.send(`{"action":"test", "echo":${e}}`),i(0,r="")},o,function(t){y[t?"unshift":"push"](()=>{l=t,i(1,l)})},function(){r=this.value,i(0,r)}]}customElements.define("my-user",U);class B extends S{constructor(t){super(),this.shadowRoot.innerHTML="<style>.hide-div{visibility:hidden}.fabs{bottom:0;position:fixed;margin:1em;right:0;z-index:998}.fab{display:block;width:56px;height:56px;border-radius:50%;text-align:center;color:#f0f0f0;margin:25px auto 0;box-shadow:0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);cursor:pointer;-webkit-transition:all .1s ease-out;transition:all .1s ease-out;position:relative;z-index:998;overflow:hidden;background:#42a5f5}.fab>i{font-size:2em;line-height:55px;-webkit-transition:all .2s ease-out;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.fab:not(:last-child){width:0;height:0;margin:20px auto 0;opacity:0;visibility:hidden;line-height:40px}.fab:not(:last-child)>i{font-size:1.4em;line-height:40px}.fab:not(:last-child).is-visible{width:40px;height:40px;margin:15px auto 10;opacity:1;visibility:visible}.fab:nth-last-child(1){-webkit-transition-delay:25ms;transition-delay:25ms}.fab:not(:last-child):nth-last-child(2){-webkit-transition-delay:20ms;transition-delay:20ms}.fab:not(:last-child):nth-last-child(3){-webkit-transition-delay:40ms;transition-delay:40ms}.fab:not(:last-child):nth-last-child(4){-webkit-transition-delay:60ms;transition-delay:60ms}.fab:not(:last-child):nth-last-child(5){-webkit-transition-delay:80ms;transition-delay:80ms}.fab:active,.fab:focus,.fab:hover{box-shadow:0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32)}.chat{position:fixed;right:85px;bottom:20px;width:400px;font-size:12px;line-height:22px;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;opacity:0;box-shadow:1px 1px 100px 2px rgba(0, 0, 0, 0.22);border-radius:10px;-webkit-transition:all .2s ease-out;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.chat_header{font-size:13px;font-family:'Roboto';font-weight:500;color:#f3f3f3;height:55px;background:#42a5f5;border-top-left-radius:10px;border-top-right-radius:10px;padding-top:8px}.chat.is-visible{opacity:1;-webkit-animation:zoomIn .2s cubic-bezier(.42, 0, .58, 1);animation:zoomIn .2s cubic-bezier(.42, 0, .58, 1)}.chat_option{float:left;font-size:15px;list-style:none;position:relative;height:100%;width:100%;text-align:relative;margin-right:10px;letter-spacing:0.5px;font-weight:400\n         }.chat_option img{border-radius:50%;width:55px;float:left;margin:-30px 20px 10px 20px;border:4px solid rgba(0, 0, 0, 0.21)}.chat_option .agent{font-size:12px;font-weight:300}.chat_option .online{opacity:0.4;font-size:11px;font-weight:300}.chat_body{background:#fff;width:100%;display:inline-block;text-align:center;overflow-y:auto}.chat_body p{padding:20px;color:#888\n         }.chat_field{position:relative;margin:5px 0 5px 0;width:50%;font-family:'Roboto';font-size:12px;line-height:30px;font-weight:500;color:#4b4b4b;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;border:none;outline:none;display:inline-block}.chat_field.chat_message{height:30px;resize:none;font-size:13px;font-weight:400}.fab_field{width:100%;display:inline-block;text-align:center;background:#fff;border-top:1px solid #eee;border-bottom-right-radius:10px;border-bottom-left-radius:10px}.fab_field a{display:inline-block;text-align:center}#fab_send{float:right;background:rgba(0, 0, 0, 0)}.fab_field .fab{width:35px;height:35px;box-shadow:none;margin:5px}.fab_field .fab>i{font-size:1.6em;line-height:35px;color:#bbb}.fab_field .fab>i:hover{color:#42a5f5}.chat_converse{position:relative;background:#fff;margin:6px 0 0px 0;height:300px;min-height:0;font-size:12px;line-height:18px;overflow-y:auto;width:100%;float:right;padding-bottom:30px}.chat .chat_converse .chat_msg_item{position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;word-wrap:break-word;border-radius:3px;-webkit-animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999}.chat .chat_converse .chat_msg_item .chat_avatar{position:absolute;top:0}.chat .chat_converse .chat_msg_item.chat_msg_item_admin .chat_avatar{left:-52px;background:rgba(0, 0, 0, 0.03)}.chat .chat_converse .chat_msg_item .chat_avatar,.chat_avatar img{width:40px;height:40px;text-align:center;border-radius:50%}.chat .chat_converse .chat_msg_item.chat_msg_item_admin{margin-left:60px;float:left;background:rgba(0, 0, 0, 0.03);color:#666}.chat .chat_converse .chat_msg_item.chat_msg_item_admin:before{content:'';position:absolute;top:15px;left:-12px;z-index:998;border:6px solid transparent;border-right-color:rgba(255, 255, 255, .4)}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{border-radius:0}::-webkit-scrollbar-thumb{margin:2px;border-radius:10px;background:rgba(0, 0, 0, 0.2)}.is-active{-webkit-transform:rotate(180deg);transform:rotate(180deg);-webkit-transition:all 1s ease-in-out;transition:all 1s ease-in-out}.is-float{box-shadow:0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32)}@-webkit-keyframes zoomIn{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes zoomIn{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes load{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}50%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:0}}@keyframes load{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}50%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:0}}@media only screen and (min-width: 300px){.chat{width:250px}}@media only screen and (min-width: 480px){.chat{width:300px}.chat_field{width:65%}}@media only screen and (min-width: 768px){.chat{width:300px}.chat_field{width:65%}}@media only screen and (min-width: 1024px){.chat{width:300px}.chat_field{width:65%}}@-webkit-keyframes ripple{100%{opacity:0;-moz-transform:scale(5);-ms-transform:scale(5);webkit-transform:scale(5);-webkit-transform:scale(5);transform:scale(5)}}@keyframes ripple{100%{opacity:0;-moz-transform:scale(5);-ms-transform:scale(5);webkit-transform:scale(5);-webkit-transform:scale(5);transform:scale(5)}}::-webkit-input-placeholder{color:#bbb}:-ms-input-placeholder{color:#bbb}::-moz-placeholder{color:#bbb}:-moz-placeholder{color:#bbb}</style>",E(this,{target:this.shadowRoot},J,D,o,{name:5}),t&&(t.target&&c(t.target,this,t.anchor),t.props&&(this.$set(t.props),H()))}static get observedAttributes(){return["name"]}get name(){return this.$$.ctx[5]}set name(t){this.$set({name:t}),H()}}customElements.define("tg-chat",B);return new B({})}();
//# sourceMappingURL=bundle.js.map