/* XENO v1.0.1: shared view reconciliation and composer recovery. */
(()=>{'use strict';
const chat=document.getElementById('chatView');const form=document.getElementById('form');
if(!chat||!form)return;
let scheduled=false;
function sync(){scheduled=false;const visible=!chat.classList.contains('hidden')&&getComputedStyle(chat).display!=='none';
 document.body.classList.toggle('x-chat-visible',visible);
 if(visible){form.classList.remove('hidden');form.removeAttribute('aria-hidden');}
 else{form.classList.add('hidden');form.setAttribute('aria-hidden','true');}
}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(sync)}
const observer=new MutationObserver(queue);observer.observe(chat,{attributes:true,attributeFilter:['class','style']});
const unified=document.getElementById('unifiedView');if(unified)observer.observe(unified,{attributes:true,attributeFilter:['class','style']});
document.addEventListener('click',()=>requestAnimationFrame(queue));
document.addEventListener('visibilitychange',queue);
window.addEventListener('pageshow',queue);window.addEventListener('focus',queue);
queue();
})();
