(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{285:function(t,n,e){},286:function(t,n,e){"use strict";e.r(n);var a=e(6),s=e(46);function o(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var i=new(function(){function n(t){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),this.container=t,this.loadingBar=document.getElementById("news-loading-bar"),this.titleEl=document.getElementById("news-title")}var t,e,i;return t=n,(e=[{key:"render",value:function(t){var e=this;if(t.length){var n=t.map(function(t,n){return e.template(t,n)}).join("");this.container.innerHTML=n}else s.a.show(a.a.errorMessages.nothing)}},{key:"template",value:function(t,n){var e=t.urlToImage;return'\n\t\t<div class="news__item" style="animation-delay: '.concat(50*n,'ms">\n\t\t  <div class="row news__item-container">\n\t\t\t<div class="col news__item-img-col">\n\t\t\t  <a class="news__item-img-container loading ').concat(e?"":"no-img",'" href="').concat(t.url,'">\n\t\t\t\t<img class="news__item-img"  src="').concat(e||"img/picture.svg",'" alt="').concat(t.title,'"/>\n\t\t\t  </a>\n\t\t\t</div>\n\t\t\t<div class="col news__item-content">\n\t\t\t  <p class="news__item-title">\n\t\t\t\t<a href="').concat(t.url,'">').concat(t.title,"</a>\n\t\t\t  </p>\n\t\t\t  ").concat(t.description?'<p class="news__item-descr">'.concat(t.description,"</p>"):"","\n\t\t\t  ").concat(t.author?'<p class="news__item-author">'.concat(t.author,"</p>"):"","\n\t\t\t</div>\n\t\t  </div>\n\t\t</div>\n\t  ")}},{key:"setTitle",value:function(t){this.titleEl.innerHTML=t}},{key:"loading",value:function(t){var n=this.loadingBar.classList,e="visible";t?(this.container.innerHTML="",n.add(e)):n.remove(e)}},{key:"imgIsLoaded",value:function(t){var n=t.target;n.classList.contains("news__item-img")&&n.parentElement.classList.remove("loading")}},{key:"imgLoadListener",value:function(){this.container.addEventListener("load",this.imgIsLoaded,!0)}}])&&o(t.prototype,e),i&&o(t,i),n}())(document.getElementById("news-container"));e(285),n.default=i}}]);