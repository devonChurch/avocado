(window.webpackJsonpavocado=window.webpackJsonpavocado||[]).push([[0],{35:function(n,e,t){n.exports=t(49)},49:function(n,e,t){"use strict";t.r(e);var r=t(0),a=t.n(r),c=t(14),o=t.n(c),i=t(15),u=t(4),s=t(5),l=t(1),f=(t(40),t(41),t(51)),d=t(50),p=t(31),b=t.n(p),g=t(2),m=t(27),h=t.n(m),O=t(6),v=t(7),j=t(8),x=t.n(j),y=t(19),D=t.n(y);function w(){var n=Object(l.a)(["\n  transform-origin: right top;\n  animation: 0.1s infinite alternate ",";\n  animation-timing-function: ease-in-out;\n"]);return w=function(){return n},n}function E(){var n=Object(l.a)(["\n  from {\n    transform: rotate(-","deg);\n  }\n\n  to {\n    transform: rotate(","deg);\n  }\n"]);return E=function(){return n},n}function S(){var n=Object(l.a)(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"]);return S=function(){return n},n}function I(){var n=Object(l.a)(["\n  list-style: none;\n  margin: 0;\n  padding: 0;\n"]);return I=function(){return n},n}function C(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function k(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?C(t,!0).forEach((function(e){Object(i.a)(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):C(t).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}var T=function(n){return x()(n)},A="0 0 13px ".concat(3,"px ").concat(T("#000").setAlpha(.25)),H="inset 0 0 0 ".concat(3,"px ").concat(T("#000").setAlpha(.1)),z=function(n,e){var t=e.get(n),r=Object(u.a)(e.values()),a=x.a.mostReadable(t,r).toHexString(),c=Object(u.a)(e.entries()).find((function(n){return Object(s.a)(n,2)[1]===a}));return Object(s.a)(c,1)[0]},M=function(n){return T(n).getLuminance()>.9},P=function(n,e){return function(t,r){return t?n:e}},R=function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return function(t){var r=T(t).toHsl(),a=r.l,c=k({},r,{l:n(a>.6,a)});return x()(c).setAlpha(e).toString()}},L=R(P(.2,.8)),U=R(P(.3,.7),.5),N=R(P(.5,.5),1),V=function(n){return"0 0 0 ".concat(3,"px ").concat(U(n))},B=function(n){return"".concat(A,", ").concat(V(n))},F=Object(g.b)(I()),J=Object(g.b)(S()),Q=new Map([["1",T("rgb(150, 180, 150)").toHexString()],["2",T("rgb(246, 199, 163)").toHexString()],["3",T("rgb(240, 124, 125)").toHexString()],["4",T("rgb(218, 68, 93)").toHexString()],["5",T("rgb(38, 51, 56)").toHexString()]]),W=new Map([["1",{baseId:"5",contentId:"1"}],["2",{baseId:"4",contentId:"2"}],["3",{baseId:"2",contentId:"5"}]]),q=function(n){return Object(g.b)(w(),function(n){return Object(g.d)(E(),n,n)}(n))};function G(){var n=Object(l.a)(["\n  height: ","px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: ","px;\n\n  /** React CSSTransition animation property when the add <button /> is in NOT ACTIVE. */\n  &.deleteItem-enter,\n  &.deleteItem-exit {\n    opacity: 0;\n    transform: translate(","px, -","px) scale(",");\n  }\n\n  /** React CSSTransition animation property when the add <button /> is in IS ACTIVE. */\n  &.deleteItem-enter-active,\n  &.deleteItem-enter-done {\n    opacity: 1;\n    transform: translate(","px, -","px) scale(",");\n  }\n"]);return G=function(){return n},n}function K(){var n=Object(l.a)(["\n  ","\n  appearance: none;\n  opacity: 0;\n"]);return K=function(){return n},n}function Y(){var n=Object(l.a)(["\n          background: ",";\n          /* transform: scale(","); */\n        "]);return Y=function(){return n},n}function _(){var n=Object(l.a)(["\n          background: ",";\n          /* transform: scale(","); */\n          transform: translate(-","px, -","px);\n          width: calc(100% + ","px);\n          height: calc(100% + ","px);\n        "]);return _=function(){return n},n}function X(){var n=Object(l.a)(["\n  appearance: none;\n  border: ","px solid ",";\n  border-radius: ","px;\n  color: ",";\n  cursor: pointer;\n  display: block;\n  height: 100%;\n  font-family: sans-serif;\n  font-weight: bold;\n  font-size: 14px;\n  text-transform: uppercase;\n  transition-duration: ","ms;\n  transition-property: box-shadow, background, opacity, transform, width, height;\n  width: 100%;\n  outline: 0;\n\n  ",";\n\n  &:focus,\n  &:hover {\n    box-shadow: ",";\n  }\n\n  &:active {\n    background: ",";\n  }\n"]);return X=function(){return n},n}function Z(){var n=Object(l.a)(['\n  /** Force contents to take up ALL of the "cells" x/y space. */\n  display: grid;\n  padding: ',"px;\n  position: relative;\n  transition-duration: ","ms;\n  transition-property: opacity, transform;\n\n  /** React CSSTransition animation property when the add <button /> is in NOT ACTIVE. */\n  &.addItem-enter,\n  &.addItem-exit {\n    opacity: 0;\n    transform: scale(",");\n  }\n\n  /** React CSSTransition animation property when the add <button /> is in IS ACTIVE. */\n  &.addItem-enter-active {\n    opacity: 1;\n    transform: scale(",");\n  }\n"]);return Z=function(){return n},n}function $(){var n=Object(l.a)(["\n          transition-property: none;\n        "]);return $=function(){return n},n}function nn(){var n=Object(l.a)(["\n          transition-property: transform;\n        "]);return nn=function(){return n},n}function en(){var n=Object(l.a)(["\n      ","\n    "]);return en=function(){return n},n}function tn(){var n=Object(l.a)(["\n  ","\n  transition: ","ms;\n\n  ","\n\n  ","\n"]);return tn=function(){return n},n}function rn(){var n=Object(l.a)(["\n      opacity: 0.25;\n      transform: scale(",");\n    "]);return rn=function(){return n},n}function an(){var n=Object(l.a)(["\n      &:focus-within,\n      &:hover {\n        ","\n      }\n    "]);return an=function(){return n},n}function cn(){var n=Object(l.a)(["\n  position: relative;\n  transition-duration: ",'ms;\n  transition-property: opacity, transform;\n  /**\n   * When an item is being dragged we send it to the BACK so that ALL other\n   * swatches can overlap when the "recording" animation is running. The dragging\n   * swatch is also completely white and therefore CANNOT reside on top of\n   * anything else.\n   */\n  z-index: ',";\n\n  ","\n\n  ","\n\n  ","\n\n  ","\n\n  /** React CSSTransition animation property when an item is in its DORMANT state. */\n  &.swatch-enter,\n  &.swatch-exit,\n  &.swatch-exit-active {\n    opacity: 0;\n    transform: scale(0);\n  }\n\n  /** React CSSTransition animation property when an item is in its ACTIVE state. */\n  &.swatch-enter-active,\n  &.swatch-enter-done {\n    opacity: 1;\n    transform: scale(",");\n  }\n"]);return cn=function(){return n},n}function on(){var n=Object(l.a)(["\n  z-index: 10;\n\n  "," {\n    box-shadow: ",";\n    border-radius: ","px;\n    outline: 0;\n\n    &:after {\n      opacity: 0;\n    }\n  }\n"]);return on=function(){return n},n}function un(){var n=Object(l.a)(["\n      ","\n    "]);return un=function(){return n},n}function sn(){var n=Object(l.a)(["\n  ","\n  background: ",";\n  /* pointer-events: none; */\n  transition-duration: ","ms, ","ms, ","ms, ","ms;\n  transition-property: background, box-shadow, transform, border;\n\n  ","\n"]);return sn=function(){return n},n}function ln(){var n=Object(l.a)(["\n  ","\n  display: grid;\n  grid-gap: 0;\n  grid-template-rows: repeat(auto-fill, ","px);\n  grid-template-columns: repeat(auto-fill, ","px);\n\n  /** Regardless of content we ALWAYS conform to the rigid grid system dimensions. */\n  > * {\n    height: ","px;\n    width: ","px;\n  }\n"]);return ln=function(){return n},n}var fn=g.c.ul(ln(),F,80,80,80,80),dn=g.c.div(sn(),J,(function(n){return n.hex}),500,250,500,500,(function(n){var e=n.hex,t=n.isUserDragging,r=n.isDragged,a=n.isAboutToDrag,c=n.shouldSwatchRegress,o=n.isDeleting,i="";return M(e)&&(i+="\n        &:after {\n          ".concat(J,"\n          border-radius: 4px;\n          box-shadow: ").concat(H,';\n          content: "";\n          display: block;\n          transition: opacity ').concat(250,"ms;\n        }\n      ")),(r||t||a||c||o)&&(i+="\n        border-radius: ".concat(4,"px;\n      ")),(t||o)&&(i+="\n        transform: scale(".concat(.8,");\n      ")),r&&t&&(i+="\n        background: ".concat("#fff",";\n      ")),a&&(i+="\n        box-shadow: ".concat((function(n){return function(n){return V(n)}(n.hex)})," !important;\n        transition-duration: 0ms;\n        transform: scale(").concat(.9,");\n      ")),Object(g.b)(un(),i)})),pn=Object(g.b)(on(),dn,(function(n){var e=n.hex;return B(e)}),4),bn=g.c.li(cn(),250,(function(n){return n.isDragged?"0":"1"}),(function(n){var e=n.isUserDragging,t=n.isDeleting;return!e&&!t&&Object(g.b)(an(),pn)}),(function(n){return n.shouldSwatchRegress&&Object(g.b)(rn(),.8)}),(function(n){return n.shouldSwatchPronounce&&pn}),(function(n){var e=n.isDeleting,t=n.hasCapacityToDelete;return e&&t&&q(2)}),1),gn=g.c.div(tn(),J,250,(function(n){var e=n.reorderTransform;return Object(g.b)(en(),e)}),(function(n){switch(n.isUserDragging){case!0:return Object(g.b)(nn());default:return Object(g.b)($())}})),mn=g.c.li(Z(),8,250,.8,1),hn=g.c.button(X(),3,(function(n){var e=n.hex;return L(e)}),4,(function(n){var e=n.hex;return L(e)}),250,(function(n){return n.isTargeted?Object(g.b)(_(),(function(n){return function(n){return n}(n.hex)}),1.1,4,4,8,8):Object(g.b)(Y(),(function(n){return n.hex}),.8)}),(function(n){var e=n.hex;return B(e)}),(function(n){var e=n.hex;return N(e)})),On=g.c.input(K(),J),vn=Object(g.c)(hn)(G(),32,32,16,16,.8,16,16,1),jn=fn,xn=Object(r.memo)((function(n){var e=n.swatchId,t=n.hex,c=n.handleChange,o=n.handleDragStart,i=n.handleDragOver,u=n.handleDragExit,l=n.handleDragEnd,f=n.handleDrop,p=n.isUserDragging,b=n.isDeleting,g=n.handleDelete,m=n.hasCapacityToDelete,j=n.createReorderTransform,x=n.shouldSwatchPronounce,y=n.shouldSwatchRegress,D=Object(r.useState)(!1),w=Object(s.a)(D,2),E=w[0],S=w[1],I=Object(r.useState)(!1),C=Object(s.a)(I,2),k=C[0],T=C[1],A=Object(r.useState)(t),H=Object(s.a)(A,2),z=H[0],M=H[1],P=h()((function(n){return c(e,n)}),100),R=Object(r.useRef)(null);return a.a.createElement(bn,Object.assign({isDragged:E,isUserDragging:p,hex:t,shouldSwatchPronounce:x,shouldSwatchRegress:y,isDeleting:b,hasCapacityToDelete:m},{draggable:!b,ref:R,onDragStart:function(n){T(!1),n.dataTransfer.setData("text/plain","banana");n.dataTransfer.setDragImage(R.current,40,40),S(!0),o(e)},onDragEnd:function(){S(!1),l()},onDragOver:function(n){i(e),n.preventDefault()},onDragLeave:u,onDrop:function(n){S(!1),f(e),n.preventDefault()},onMouseDown:b?void 0:function(){return T(!0)},onMouseUp:b?void 0:function(){return T(!1)}}),a.a.createElement(gn,Object.assign({isDragged:E,isUserDragging:p},{reorderTransform:j(R.current)}),a.a.createElement(dn,{hex:t,isDragged:E,isUserDragging:p,isAboutToDrag:k,shouldSwatchRegress:y,isDeleting:b},a.a.createElement(d.a,{unmountOnExit:!0,in:b&&m,timeout:500,classNames:"deleteItem"},a.a.createElement(vn,{hex:"#c8d5d1",onClick:function(){return g(e)}},a.a.createElement(O.a,{icon:v.b,size:"1x"})))),!b&&a.a.createElement(On,{type:"color",value:z,onChange:function(n){var e=n.target.value;M(e),P(e)}})))})),yn=Object(r.memo)((function(n){var e=n.dragHex,t=n.handleClick,c=n.handleDrop,o=Object(r.useState)(!1),i=Object(s.a)(o,2),u=i[0],l=i[1];return a.a.createElement(mn,null,a.a.createElement(hn,Object.assign({isTargeted:u},{hex:u&&e?e:"#c8d5d1",onClick:t,onDragOver:function(n){l(!0),n.preventDefault()},onDragLeave:function(){return l(!1)},onMouseEnter:function(){return l(!0)},onMouseLeave:function(){return l(!1)},onDrop:function(n){c(),l(!1),n.preventDefault()}}),a.a.createElement(O.a,{icon:v.b,size:"2x"})))})),Dn=t(12);function wn(){var n=Object(l.a)(["\n          opacity: 0;\n          pointer-events: none;\n        "]);return wn=function(){return n},n}function En(){var n=Object(l.a)(["\n          opacity: 1;\n        "]);return En=function(){return n},n}function Sn(){var n=Object(l.a)(["\n  ","\n"]);return Sn=function(){return n},n}function In(){var n=Object(l.a)(["\n  position: relative;\n  transition-duration: ","ms;\n  transition-property: opacity, transform;\n\n  /** React CSSTransition animation property when an item is in its DORMANT state. */\n  &.composition-enter,\n  &.composition-exit,\n  &.composition-exit-active {\n    opacity: 0;\n    transform: scale(",");\n  }\n\n  /** React CSSTransition animation property when an item is in its ACTIVE state. */\n  &.composition-enter-active,\n  &.composition-enter-done {\n    opacity: 1;\n    transform: scale(",");\n  }\n"]);return In=function(){return n},n}function Cn(){var n=Object(l.a)(["\n  transform: scale(",");\n"]);return Cn=function(){return n},n}function kn(){var n=Object(l.a)(["\n      opacity: 0;\n      pointer-events: none;\n      transform: scale(",");\n    "]);return kn=function(){return n},n}function Tn(){var n=Object(l.a)(["\n  ","\n  display: grid;\n  grid-gap: ","px;\n  padding: ","px;\n  transition-duration: ","ms;\n  transition-property: opacity, transform;\n\n  ","\n"]);return Tn=function(){return n},n}function An(){var n=Object(l.a)(["\n  border-radius: ","px;\n  height: ",";\n  background-image: linear-gradient(to right, var(--contentHex), transparent);\n"]);return An=function(){return n},n}function Hn(){var n=Object(l.a)(['\n  /**\n   * Force font size to be pixels (px) rather than something scaleable like rems\n   * so that we can force the "worst case scenario" when creating our color\n   * compositions.\n   */\n  display: block;\n  font-size: ',";\n  font-weight: ",";\n"]);return Hn=function(){return n},n}function zn(){var n=Object(l.a)(["\n        &:after {\n          ","\n          border-radius: ","px ","px 0 0;\n          box-shadow: ",';\n          content: "";\n          display: block;\n        }\n      ']);return zn=function(){return n},n}function Mn(){var n=Object(l.a)(["\n  /*\n   * \n   */\n  --baseHex: ",";\n  --contentHex: ",";\n  border-radius: ","px ","px 0 0;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: auto;\n  grid-gap: ","px;\n  background: var(--baseHex);\n  color: var(--contentHex);\n  padding: ","px;\n  position: relative;\n  font-family: sans-serif;\n  transition: background ","ms;\n\n  > * {\n    display: block;\n  }\n\n  ","\n"]);return Mn=function(){return n},n}function Pn(){var n=Object(l.a)(["\n      opacity: 0.5;\n      pointer-events: none;\n      /* transform: scale(","); */\n    "]);return Pn=function(){return n},n}function Rn(){var n=Object(l.a)(["\n  height: 100%;\n  width: 100%;\n  position: relative;\n  transition-property: opacity, transform;\n  transition-duration: ","ms;\n  transform: scale(SCALE_500);\n\n  ","\n\n  ","\n"]);return Rn=function(){return n},n}function Ln(){var n=Object(l.a)(["\n  opacity: ",";\n"]);return Ln=function(){return n},n}function Un(){var n=Object(l.a)(["\n  ","\n  display: flex;\n  border-radius: 0 0 ","px ","px;\n  background: ",";\n  color: ",";\n  justify-content: space-between;\n  padding: ","px;\n  font-family: monospace;\n  font-size: 24px;\n  font-weight: bold;\n  align-items: center;\n\n  > * {\n    display: block;\n  }\n"]);return Un=function(){return n},n}function Nn(){var n=Object(l.a)(["\n  ","\n  display: grid;\n  grid-gap: ","px;\n  grid-template-columns: 1fr;\n"]);return Nn=function(){return n},n}function Vn(){var n=Object(l.a)(["\n  ","\n\n  display: grid;\n  grid-template-columns: repeat(auto-fit, 1rem);\n  grid-gap: ","px;\n"]);return Vn=function(){return n},n}function Bn(){var n=Object(l.a)(["\n  ","\n  display: grid;\n  grid-gap: ","px;\n  grid-template-columns: repeat(auto-fit, minmax(","px, auto));\n  /* grid-template-rows: repeat(auto-fill, minmax(","px, auto)); */\n\n  > * {\n    min-height: ","px;\n    min-width: ","px;\n  }\n"]);return Bn=function(){return n},n}var Fn=g.c.ul(Bn(),F,24,256,288,288,256),Jn=g.c.ul(Vn(),F,24),Qn=g.c.ul(Nn(),F,24),Wn=g.c.ul(Un(),F,4,4,"#c8d5d1","#40504C",24),qn=g.c.span(Ln(),(function(n){return"A"===n.children?1:.25})),Gn=g.c.div(Rn(),250,(function(n){return n.isUserDragging&&Object(g.b)(Pn(),.8)}),(function(n){var e=n.isDeleting,t=n.hasCapacityToDelete;return e&&t&&q(.5)})),Kn=g.c.div(Mn(),(function(n){return n.baseHex}),(function(n){return n.contentHex}),4,4,24,24,500,(function(n){var e=n.baseHex;if(M(e))return Object(g.b)(zn(),J,4,4,H)})),Yn=g.c.span(Hn(),(function(n){var e=n.isBold;return"".concat(e?14:16,"px")}),(function(n){return n.isBold?"bold":"initial"})),_n=g.c.div(An(),4,(function(n){var e=n.height;return"".concat(e,"px")})),Xn=Fn,Zn=function(n,e){var t=function(n,e){return function(t){return x.a.isReadable(n,e,{level:t,size:"small"})}}(n,e);switch(!0){case t("AAA"):return"AAA";case t("AA"):return"AA-";default:return"---"}},$n=function(){return a.a.createElement("div",null,a.a.createElement(Jn,null,[Dn.b,Dn.a,Dn.c,Dn.d,Dn.e].map((function(n,e){return a.a.createElement("li",{key:e},a.a.createElement(O.a,{icon:n}))}))))},ne=function(){return a.a.createElement("div",null,a.a.createElement(Qn,null,[1,2,4].map((function(n){return a.a.createElement("li",{key:n},a.a.createElement(_n,{height:n}))}))))},ee=function(n){var e=n.children.split("").map((function(n,e){return a.a.createElement(qn,{key:e},n)}));return a.a.createElement("span",null,e)},te=g.c.div(Tn(),J,24,24,250,(function(n){return!n.isUserDragging&&Object(g.b)(kn(),1.1)})),re=Object(g.c)(O.a)(Cn(),1.1),ae=function(n){var e=n.baseHex,t=n.contentHex,r=Zn(e,t),c=r.includes("AA")?v.a:v.d,o=function(n,e){var t=x.a.readability(n,e)/21*100;return Math.round(t)}(e,t);return a.a.createElement("div",null,a.a.createElement(Wn,null,a.a.createElement(re,Object.assign({icon:c},{size:"1x"})),a.a.createElement(ee,null,r),a.a.createElement("span",null,o,"%")))},ce=g.c.li(In(),250,.5,1),oe=Object(g.c)(hn)(Sn(),(function(n){return n.isActive?Object(g.b)(En()):Object(g.b)(wn())})),ie=Object(r.memo)((function(n){var e=n.compId,t=n.baseId,c=n.contentId,o=n.dragStartId,i=n.baseHex,u=n.contentHex,l=n.dragHex,f=n.isUserDragging,p=n.isDeleting,b=n.hasCapacityToDelete,g=n.handleDelete,m=n.handleDrop,h=n.setActiveCompositionId,j=n.removeActiveCompositionId,x=Object(r.useState)(!1),y=Object(s.a)(x,2),D=y[0],w=y[1],E=Object(r.useState)(!1),S=Object(s.a)(E,2),I=S[0],C=S[1];return a.a.createElement(ce,null,a.a.createElement(Gn,Object.assign({isUserDragging:f,isDeleting:p,hasCapacityToDelete:b},{onMouseEnter:p?void 0:function(){return h(e)},onMouseLeave:p?void 0:j}),a.a.createElement(Kn,{baseHex:i,contentHex:u},a.a.createElement(Yn,null,"The quick brown fox,"),a.a.createElement(Yn,{isBold:!0},"jumps over the lazy dog."),a.a.createElement($n,null),a.a.createElement(ne,null)),a.a.createElement(ae,{baseHex:i,contentHex:u}),a.a.createElement(d.a,{unmountOnExit:!0,in:p&&b,timeout:500,classNames:"deleteItem"},a.a.createElement(vn,{hex:"#c8d5d1",onClick:function(){return g(e)}},a.a.createElement(O.a,{icon:v.b,size:"1x"})))),a.a.createElement(te,{isUserDragging:f},a.a.createElement(hn,{hex:D?l:u,isTargeted:D,onDragOver:function(n){w(!0),n.preventDefault()},onDragLeave:function(){return w(!1)},onDrop:function(n){m(e,{contentId:o,baseId:t}),w(!1),C(!1),n.preventDefault()}},a.a.createElement(O.a,{icon:v.b,size:"2x"})),a.a.createElement(hn,{hex:I?l:i,isTargeted:I,onDragOver:function(n){C(!0),n.preventDefault()},onDragLeave:function(){return C(!1)},onDrop:function(n){m(e,{contentId:c,baseId:o}),w(!1),C(!1),n.preventDefault()}},a.a.createElement(O.a,{icon:v.b,size:"2x"}))))})),ue=Object(r.memo)((function(n){var e=n.dragHex,t=n.dragStartId,c=n.handleClick,o=n.handleDrop,i=n.isUserDragging,u=Object(r.useState)(!1),l=Object(s.a)(u,2),f=l[0],d=l[1],p=Object(r.useState)(!1),b=Object(s.a)(p,2),g=b[0],m=b[1],h=Object(r.useState)(!1),j=Object(s.a)(h,2),x=j[0],y=j[1];return a.a.createElement(mn,null,a.a.createElement(te,{isUserDragging:i},a.a.createElement(hn,{hex:g?e:"#c8d5d1",isTargeted:g,onDragOver:function(n){m(!0),n.preventDefault()},onDragLeave:function(){return m(!1)},onDrop:function(n){o({contentId:t}),n.preventDefault()}},a.a.createElement(O.a,{icon:v.b,size:"2x"})),a.a.createElement(hn,{hex:x?e:"#c8d5d1",isTargeted:x,onDragOver:function(n){y(!0),n.preventDefault()},onDragLeave:function(){return y(!1)},onDrop:function(n){o({baseId:t}),m(!1),y(!1),n.preventDefault()}},a.a.createElement(O.a,{icon:v.b,size:"2x"}))),a.a.createElement(oe,{hex:"#c8d5d1",isActive:!i,isTargeted:f,onClick:c,onMouseEnter:function(){return d(!0)},onMouseLeave:function(){return d(!1)}},a.a.createElement(O.a,{icon:v.b,size:"2x"})))})),se=t(30);function le(){var n=Object(l.a)(["\n  height: ","px;\n  display: flex;\n  justify-content: space-between;\n"]);return le=function(){return n},n}function fe(){var n=Object(l.a)(["\n  display: inline-flex;\n  align-items: center;\n  width: auto;\n  padding: 0 ","px;\n  text-decoration: none;\n\n  > *:nth-child(1n + 2) {\n    margin-left: ","px;\n  }\n"]);return fe=function(){return n},n}var de=Object(g.c)(hn)(fe(),16,8),pe=g.c.header(le(),40),be=Object(r.memo)((function(n){var e=n.isDeleting,t=n.handleDeleteToggle;return a.a.createElement(pe,null,a.a.createElement(de,{hex:"#c8d5d1",as:"a",href:"https://github.com/devonChurch/avocado"},a.a.createElement(O.a,{icon:se.a,size:"1x"}),a.a.createElement("span",null,"Github")),a.a.createElement(de,{hex:"#c8d5d1",onClick:t},a.a.createElement(O.a,{icon:e?v.c:v.e,size:"1x"}),a.a.createElement("span",null,e?"Edit":"Delete")))}));function ge(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function me(){var n=Object(l.a)(["\n  html {\n    box-sizing: border-box;\n  }\n  \n  *, *:before, *:after {\n    box-sizing: inherit;\n  }\n\n  body {\n    padding: 50px;\n  }\n\n  #root {\n    display: grid;\n    grid-gap: ","px;\n  }\n"]);return me=function(){return n},n}var he=Object(g.a)(me(),24),Oe=function(){return b()()},ve=Oe,je=function(n){return function(e){var t=Object(s.a)(e,1)[0];return n===t}},xe=function(n,e){return n.findIndex(je(e))},ye=function(n,e){return n.findIndex(je(e))},De=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return"transform: translate(".concat(n,"%, ").concat(e,"%);")},we=function(n,e,t,r){if(!(e&&t&&e!==t))return De;var a=xe(n,e),c=xe(n,t);return a!==r&&(r>=a||r>=c)&&(r<=a||r<=c)?function(n){var e=n[a>r?"nextElementSibling":"previousElementSibling"],t=n.offsetTop,c=n.offsetLeft,o=e.offsetTop,i=e.offsetLeft;return De((i-c)/80*100,(o-t)/80*100)}:De},Ee=function(){var n=Object(r.useState)([]),e=Object(s.a)(n,2),t=e[0],c=e[1],o=Object(r.useState)(null),l=Object(s.a)(o,2),p=l[0],b=l[1],g=Object(r.useState)(null),m=Object(s.a)(g,2),h=m[0],O=m[1],v=!!p,j=v&&t.get(p),x=Object(r.useCallback)((function(){return O(null)}),[]),y=Object(r.useCallback)((function(){b(null),x(null)}),[x]),w=function(n){return c(new Map([].concat(Object(u.a)(t),[[Oe(),n]])))},E=Object(r.useCallback)((function(n,e){return c(new Map([].concat(Object(u.a)(t),[[n,e]])))}),[t]),S=Object(r.useCallback)((function(n){if(p!==n){var e=Object(u.a)(t),r=xe(e,n)<xe(e,p),a=[p,t.get(p)],o=new Map(e.reduce((function(e,t){var c=Object(s.a)(t,2),o=c[0],i=c[1];switch(!0){case o===p:return e;case o===n:return[].concat(Object(u.a)(e),r?[a,[o,i]]:[[o,i],a]);default:return[].concat(Object(u.a)(e),[[o,i]])}}),[]));c(o),y()}}),[t,p,y]),I=function(){for(var n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return we.apply(void 0,[Object(u.a)(t)].concat(e))},C=Object(r.useState)([]),k=Object(s.a)(C,2),T=k[0],A=k[1],H=Object(r.useState)(null),M=Object(s.a)(H,2),P=M[0],R=M[1],L=function(){return R(null)},U=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=n.baseId,r=n.contentId,a={baseId:e||z(r,t),contentId:r||z(e,t)};A(new Map([].concat(Object(u.a)(T),[[ve(),a]])))},N=Object(r.useCallback)((function(n,e){var t=Object(u.a)(T),r=ye(t,n),a=[].concat(Object(u.a)(t.slice(0,r)),[[n,e]],Object(u.a)(t.slice(r+1)));A(new Map(a))}),[T]);Object(r.useEffect)((function(){var n=function(n){var e=D.a.parse(n,{ignoreQueryPrefix:!0}),t=e.s,r=void 0===t?[]:t,a=e.c,c=void 0===a?[]:a,o=new Map(r.map((function(n,e){return["".concat(e),n]}))),i=new Map(c.map((function(n,e){var t=Object(s.a)(n,2),r=t[0],a=t[1];return["".concat(e),{baseId:r,contentId:a}]}))),u=o.size||i.size;return{swatches:u?o||[]:Q,compositions:u?i||[]:W}}(window.location.search),e=n.swatches,t=n.compositions;c(e),A(t)}),[]),Object(r.useEffect)((function(){var n=function(n,e){var t=Object(u.a)(n.values()),r=Object(u.a)(n.keys()),a=Object(u.a)(e.values()).map((function(n){var e=n.baseId,t=n.contentId;return[r.indexOf(e),r.indexOf(t)]}));return D.a.stringify({s:t,c:a},{addQueryPrefix:!0})}(t,T),e=window.location,r=e.protocol,a=e.host,c=e.pathname,o="".concat(r,"//").concat(a).concat(c).concat(n);window.history.replaceState({},"",o)}),[t,T]);var V=Object(r.useState)(!1),B=Object(s.a)(V,2),F=B[0],J=B[1],q=Object(r.useCallback)((function(n){var e=Object(u.a)(t),r=xe(e,n),a=[].concat(Object(u.a)(e.slice(0,r)),Object(u.a)(e.slice(r+1)));c(new Map(a))}),[t]),G=Object(r.useCallback)((function(n){var e=Object(u.a)(T),t=ye(e,n),r=[].concat(Object(u.a)(e.slice(0,t)),Object(u.a)(e.slice(t+1)));A(new Map(r))}),[T]),K=t.size>2,Y=T.size>1,_=function(){var n=Object(u.a)(T.values()).reduce((function(n,e){var t=e.baseId,r=e.contentId;return[].concat(Object(u.a)(n),[t,r])}),[]);return function(e){return n.includes(e)}}();return a.a.createElement(a.a.Fragment,null,a.a.createElement(he,null),a.a.createElement(be,{isDeleting:F,handleDeleteToggle:function(){return J(!F)}}),a.a.createElement(f.a,{component:jn},Object(u.a)(t).map((function(n,e){var t=Object(s.a)(n,2),r=t[0],c=t[1];return a.a.createElement(d.a,{key:r,timeout:500,classNames:"swatch"},a.a.createElement(xn,Object.assign({key:r},function(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?ge(t,!0).forEach((function(e){Object(i.a)(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):ge(t).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}({swatchId:r,hex:c,isUserDragging:v,isDeleting:F},function(n){if(P){var e=T.get(P),t=e.baseId===n,r=e.contentId===n,a=t||r;return{shouldSwatchPronounce:a,shouldSwatchRegress:!a&&P}}}(r)),{hasCapacityToDelete:K&&!_(r),handleChange:E,handleDragStart:b,handleDragOver:O,handleDragExit:x,handleDragEnd:y,handleDrop:S,handleDelete:q,createReorderTransform:I(p,h,e)})))})),a.a.createElement(a.a.Fragment,null,F?a.a.createElement("div",null):a.a.createElement(d.a,{unmountOnExit:!0,in:!F,timeout:500,classNames:"addItem"},a.a.createElement(yn,Object.assign({dragHex:j},{handleClick:function(){var n=Object(u.a)(t).pop()||[],e=Object(s.a)(n,2)[1];w(e||"#000")},handleDrop:function(){w(j),y()}}))))),a.a.createElement(f.a,{component:Xn},Object(u.a)(T).map((function(n){var e=Object(s.a)(n,2),r=e[0],c=e[1],o=c.baseId,i=c.contentId;return a.a.createElement(d.a,{key:r,timeout:500,classNames:"composition"},a.a.createElement(ie,Object.assign({key:r},{compId:r,baseId:o,contentId:i,dragStartId:p,dragHex:j,isUserDragging:v,isDeleting:F,setActiveCompositionId:R,removeActiveCompositionId:L},{hasCapacityToDelete:Y,baseHex:t.get(o),contentHex:t.get(i),handleDrop:N,handleDelete:G})))})),a.a.createElement(a.a.Fragment,null,F?a.a.createElement("div",null):a.a.createElement(d.a,{unmountOnExit:!0,in:!F,timeout:500,classNames:"addItem"},a.a.createElement(ue,Object.assign({dragStartId:p,dragHex:j,isUserDragging:v},{handleClick:function(){var n=Object(u.a)(T).pop()||[],e=Object(s.a)(n,2)[1];U(e)},handleDrop:function(n){U(n),y()}}))))))};o.a.render(a.a.createElement(Ee,null),document.getElementById("root"))}},[[35,1,2]]]);
//# sourceMappingURL=main.5326c53b.chunk.js.map