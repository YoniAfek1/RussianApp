/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/Layout.tsx":
/*!*******************************!*\
  !*** ./components/Layout.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Layout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/Layout.module.css */ \"(pages-dir-node)/./styles/Layout.module.css\");\n/* harmony import */ var _styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst menuItems = [\n    {\n        id: 'home',\n        name: 'בית',\n        icon: '🏠',\n        path: '/',\n        color: '#4fc3f7'\n    },\n    {\n        id: 'vocabulary',\n        name: 'אוצר מילים',\n        icon: '📁',\n        path: '/vocabulary',\n        color: '#1e90ff'\n    },\n    {\n        id: 'practice',\n        name: 'תרגול',\n        icon: '🎮',\n        path: '/practice',\n        color: '#2ecc71'\n    },\n    {\n        id: 'grammar',\n        name: 'דקדוק',\n        icon: '🧠',\n        path: '/grammar',\n        color: '#8e44ad'\n    },\n    {\n        id: 'hearing',\n        name: 'האזנה',\n        icon: '👂',\n        path: '/hearing',\n        color: '#e91e63'\n    }\n];\nfunction Layout({ children }) {\n    const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const menuRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const hamburgerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Layout.useEffect\": ()=>{\n            const handleClickOutside = {\n                \"Layout.useEffect.handleClickOutside\": (event)=>{\n                    if (menuRef.current && hamburgerRef.current && !menuRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)) {\n                        setIsMenuOpen(false);\n                    }\n                }\n            }[\"Layout.useEffect.handleClickOutside\"];\n            document.addEventListener('mousedown', handleClickOutside);\n            return ({\n                \"Layout.useEffect\": ()=>document.removeEventListener('mousedown', handleClickOutside)\n            })[\"Layout.useEffect\"];\n        }\n    }[\"Layout.useEffect\"], []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"Layout.useEffect\": ()=>{\n            const handleRouteChange = {\n                \"Layout.useEffect.handleRouteChange\": ()=>{\n                    setIsMenuOpen(false);\n                }\n            }[\"Layout.useEffect.handleRouteChange\"];\n            router.events.on('routeChangeStart', handleRouteChange);\n            return ({\n                \"Layout.useEffect\": ()=>router.events.off('routeChangeStart', handleRouteChange)\n            })[\"Layout.useEffect\"];\n        }\n    }[\"Layout.useEffect\"], [\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().layout),\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                ref: hamburgerRef,\n                className: (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().hamburgerButton),\n                onClick: ()=>setIsMenuOpen(!isMenuOpen),\n                \"aria-label\": \"Toggle navigation menu\",\n                children: \"☰\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                lineNumber: 80,\n                columnNumber: 7\n            }, this),\n            isMenuOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().overlay),\n                onClick: ()=>setIsMenuOpen(false)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                lineNumber: 89,\n                columnNumber: 22\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                ref: menuRef,\n                className: `${(_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().sideMenu)} ${isMenuOpen ? (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().open) : ''}`,\n                children: menuItems.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: ()=>router.push(item.path),\n                        className: (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().menuItem),\n                        style: {\n                            background: `linear-gradient(135deg, ${item.color}, ${adjustColor(item.color, -20)})`\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                className: (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().menuIcon),\n                                children: item.icon\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                                lineNumber: 104,\n                                columnNumber: 13\n                            }, this),\n                            item.name\n                        ]\n                    }, item.id, true, {\n                        fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                        lineNumber: 96,\n                        columnNumber: 11\n                    }, this))\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                lineNumber: 91,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: `${(_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().mainContent)} ${isMenuOpen ? (_styles_Layout_module_css__WEBPACK_IMPORTED_MODULE_3___default().menuOpen) : ''}`,\n                children: children\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n                lineNumber: 110,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\components\\\\Layout.tsx\",\n        lineNumber: 79,\n        columnNumber: 5\n    }, this);\n}\n// Helper function to darken a color for gradient\nfunction adjustColor(color, amount) {\n    const hex = color.replace('#', '');\n    const num = parseInt(hex, 16);\n    const r = Math.max(0, Math.min(255, (num >> 16) + amount));\n    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));\n    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));\n    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvTGF5b3V0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQW9EO0FBQ1o7QUFDUztBQU1qRCxNQUFNSyxZQUFZO0lBQ2hCO1FBQ0VDLElBQUk7UUFDSkMsTUFBTTtRQUNOQyxNQUFNO1FBQ05DLE1BQU07UUFDTkMsT0FBTztJQUNUO0lBQ0E7UUFDRUosSUFBSTtRQUNKQyxNQUFNO1FBQ05DLE1BQU07UUFDTkMsTUFBTTtRQUNOQyxPQUFPO0lBQ1Q7SUFDQTtRQUNFSixJQUFJO1FBQ0pDLE1BQU07UUFDTkMsTUFBTTtRQUNOQyxNQUFNO1FBQ05DLE9BQU87SUFDVDtJQUNBO1FBQ0VKLElBQUk7UUFDSkMsTUFBTTtRQUNOQyxNQUFNO1FBQ05DLE1BQU07UUFDTkMsT0FBTztJQUNUO0lBQ0E7UUFDRUosSUFBSTtRQUNKQyxNQUFNO1FBQ05DLE1BQU07UUFDTkMsTUFBTTtRQUNOQyxPQUFPO0lBQ1Q7Q0FDRDtBQUVjLFNBQVNDLE9BQU8sRUFBRUMsUUFBUSxFQUFlO0lBQ3RELE1BQU0sQ0FBQ0MsWUFBWUMsY0FBYyxHQUFHZCwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNZSxVQUFVYiw2Q0FBTUEsQ0FBaUI7SUFDdkMsTUFBTWMsZUFBZWQsNkNBQU1BLENBQW9CO0lBQy9DLE1BQU1lLFNBQVNkLHNEQUFTQTtJQUV4QkYsZ0RBQVNBOzRCQUFDO1lBQ1IsTUFBTWlCO3VEQUFxQixDQUFDQztvQkFDMUIsSUFDRUosUUFBUUssT0FBTyxJQUNmSixhQUFhSSxPQUFPLElBQ3BCLENBQUNMLFFBQVFLLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDRixNQUFNRyxNQUFNLEtBQ3RDLENBQUNOLGFBQWFJLE9BQU8sQ0FBQ0MsUUFBUSxDQUFDRixNQUFNRyxNQUFNLEdBQzNDO3dCQUNBUixjQUFjO29CQUNoQjtnQkFDRjs7WUFFQVMsU0FBU0MsZ0JBQWdCLENBQUMsYUFBYU47WUFDdkM7b0NBQU8sSUFBTUssU0FBU0UsbUJBQW1CLENBQUMsYUFBYVA7O1FBQ3pEOzJCQUFHLEVBQUU7SUFFTGpCLGdEQUFTQTs0QkFBQztZQUNSLE1BQU15QjtzREFBb0I7b0JBQ3hCWixjQUFjO2dCQUNoQjs7WUFFQUcsT0FBT1UsTUFBTSxDQUFDQyxFQUFFLENBQUMsb0JBQW9CRjtZQUNyQztvQ0FBTyxJQUFNVCxPQUFPVSxNQUFNLENBQUNFLEdBQUcsQ0FBQyxvQkFBb0JIOztRQUNyRDsyQkFBRztRQUFDVDtLQUFPO0lBRVgscUJBQ0UsOERBQUNhO1FBQUlDLFdBQVczQix5RUFBYTs7MEJBQzNCLDhEQUFDNkI7Z0JBQ0NDLEtBQUtsQjtnQkFDTGUsV0FBVzNCLGtGQUFzQjtnQkFDakNnQyxTQUFTLElBQU10QixjQUFjLENBQUNEO2dCQUM5QndCLGNBQVc7MEJBQ1o7Ozs7OztZQUlBeEIsNEJBQWMsOERBQUNpQjtnQkFBSUMsV0FBVzNCLDBFQUFjO2dCQUFFZ0MsU0FBUyxJQUFNdEIsY0FBYzs7Ozs7OzBCQUU1RSw4REFBQ3lCO2dCQUNDTCxLQUFLbkI7Z0JBQ0xnQixXQUFXLEdBQUczQiwyRUFBZSxDQUFDLENBQUMsRUFBRVMsYUFBYVQsdUVBQVcsR0FBRyxJQUFJOzBCQUUvREMsVUFBVXFDLEdBQUcsQ0FBQyxDQUFDQyxxQkFDZCw4REFBQ1Y7d0JBRUNHLFNBQVMsSUFBTW5CLE9BQU8yQixJQUFJLENBQUNELEtBQUtsQyxJQUFJO3dCQUNwQ3NCLFdBQVczQiwyRUFBZTt3QkFDMUIwQyxPQUFPOzRCQUNMQyxZQUFZLENBQUMsd0JBQXdCLEVBQUVKLEtBQUtqQyxLQUFLLENBQUMsRUFBRSxFQUFFc0MsWUFBWUwsS0FBS2pDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2Rjs7MENBRUEsOERBQUN1QztnQ0FBS2xCLFdBQVczQiwyRUFBZTswQ0FBR3VDLEtBQUtuQyxJQUFJOzs7Ozs7NEJBQzNDbUMsS0FBS3BDLElBQUk7O3VCQVJMb0MsS0FBS3JDLEVBQUU7Ozs7Ozs7Ozs7MEJBYWxCLDhEQUFDNkM7Z0JBQUtwQixXQUFXLEdBQUczQiw4RUFBa0IsQ0FBQyxDQUFDLEVBQUVTLGFBQWFULDJFQUFlLEdBQUcsSUFBSTswQkFDMUVROzs7Ozs7Ozs7Ozs7QUFJVDtBQUVBLGlEQUFpRDtBQUNqRCxTQUFTb0MsWUFBWXRDLEtBQWEsRUFBRTRDLE1BQWM7SUFDaEQsTUFBTUMsTUFBTTdDLE1BQU04QyxPQUFPLENBQUMsS0FBSztJQUMvQixNQUFNQyxNQUFNQyxTQUFTSCxLQUFLO0lBQzFCLE1BQU1JLElBQUlDLEtBQUtDLEdBQUcsQ0FBQyxHQUFHRCxLQUFLRSxHQUFHLENBQUMsS0FBSyxDQUFDTCxPQUFPLEVBQUMsSUFBS0g7SUFDbEQsTUFBTVMsSUFBSUgsS0FBS0MsR0FBRyxDQUFDLEdBQUdELEtBQUtFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBUSxJQUFLLE1BQUssSUFBS1I7SUFDNUQsTUFBTVUsSUFBSUosS0FBS0MsR0FBRyxDQUFDLEdBQUdELEtBQUtFLEdBQUcsQ0FBQyxLQUFLLENBQUNMLE1BQU0sUUFBTyxJQUFLSDtJQUN2RCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUNLLEtBQUssS0FBS0ksS0FBSyxJQUFJQyxDQUFBQSxFQUFHQyxRQUFRLENBQUMsSUFBSUMsUUFBUSxDQUFDLEdBQUcsTUFBTTtBQUNuRSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFw5NzI1MFxcRGVza3RvcFxcR2l0XFxMZWFyblJ1c3NpYW5OZXdcXGNvbXBvbmVudHNcXExheW91dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuLi9zdHlsZXMvTGF5b3V0Lm1vZHVsZS5jc3MnO1xuXG5pbnRlcmZhY2UgTGF5b3V0UHJvcHMge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xufVxuXG5jb25zdCBtZW51SXRlbXMgPSBbXG4gIHtcbiAgICBpZDogJ2hvbWUnLFxuICAgIG5hbWU6ICfXkdeZ16onLFxuICAgIGljb246ICfwn4+gJyxcbiAgICBwYXRoOiAnLycsXG4gICAgY29sb3I6ICcjNGZjM2Y3J1xuICB9LFxuICB7XG4gICAgaWQ6ICd2b2NhYnVsYXJ5JyxcbiAgICBuYW1lOiAn15DXldem16gg157Xmdec15nXnScsXG4gICAgaWNvbjogJ/Cfk4EnLFxuICAgIHBhdGg6ICcvdm9jYWJ1bGFyeScsXG4gICAgY29sb3I6ICcjMWU5MGZmJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdwcmFjdGljZScsXG4gICAgbmFtZTogJ9eq16jXkteV15wnLFxuICAgIGljb246ICfwn46uJyxcbiAgICBwYXRoOiAnL3ByYWN0aWNlJyxcbiAgICBjb2xvcjogJyMyZWNjNzEnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2dyYW1tYXInLFxuICAgIG5hbWU6ICfXk9en15PXldenJyxcbiAgICBpY29uOiAn8J+noCcsXG4gICAgcGF0aDogJy9ncmFtbWFyJyxcbiAgICBjb2xvcjogJyM4ZTQ0YWQnXG4gIH0sXG4gIHtcbiAgICBpZDogJ2hlYXJpbmcnLFxuICAgIG5hbWU6ICfXlNeQ15bXoNeUJyxcbiAgICBpY29uOiAn8J+RgicsXG4gICAgcGF0aDogJy9oZWFyaW5nJyxcbiAgICBjb2xvcjogJyNlOTFlNjMnXG4gIH1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheW91dCh7IGNoaWxkcmVuIH06IExheW91dFByb3BzKSB7XG4gIGNvbnN0IFtpc01lbnVPcGVuLCBzZXRJc01lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgbWVudVJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGhhbWJ1cmdlclJlZiA9IHVzZVJlZjxIVE1MQnV0dG9uRWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlQ2xpY2tPdXRzaWRlID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIG1lbnVSZWYuY3VycmVudCAmJlxuICAgICAgICBoYW1idXJnZXJSZWYuY3VycmVudCAmJlxuICAgICAgICAhbWVudVJlZi5jdXJyZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBOb2RlKSAmJlxuICAgICAgICAhaGFtYnVyZ2VyUmVmLmN1cnJlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIE5vZGUpXG4gICAgICApIHtcbiAgICAgICAgc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrT3V0c2lkZSk7XG4gICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGhhbmRsZUNsaWNrT3V0c2lkZSk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZVJvdXRlQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgc2V0SXNNZW51T3BlbihmYWxzZSk7XG4gICAgfTtcblxuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlU3RhcnQnLCBoYW5kbGVSb3V0ZUNoYW5nZSk7XG4gICAgcmV0dXJuICgpID0+IHJvdXRlci5ldmVudHMub2ZmKCdyb3V0ZUNoYW5nZVN0YXJ0JywgaGFuZGxlUm91dGVDaGFuZ2UpO1xuICB9LCBbcm91dGVyXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmxheW91dH0+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHJlZj17aGFtYnVyZ2VyUmVmfVxuICAgICAgICBjbGFzc05hbWU9e3N0eWxlcy5oYW1idXJnZXJCdXR0b259XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTWVudU9wZW4oIWlzTWVudU9wZW4pfVxuICAgICAgICBhcmlhLWxhYmVsPVwiVG9nZ2xlIG5hdmlnYXRpb24gbWVudVwiXG4gICAgICA+XG4gICAgICAgIOKYsFxuICAgICAgPC9idXR0b24+XG5cbiAgICAgIHtpc01lbnVPcGVuICYmIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMub3ZlcmxheX0gb25DbGljaz17KCkgPT4gc2V0SXNNZW51T3BlbihmYWxzZSl9IC8+fVxuXG4gICAgICA8bmF2XG4gICAgICAgIHJlZj17bWVudVJlZn1cbiAgICAgICAgY2xhc3NOYW1lPXtgJHtzdHlsZXMuc2lkZU1lbnV9ICR7aXNNZW51T3BlbiA/IHN0eWxlcy5vcGVuIDogJyd9YH1cbiAgICAgID5cbiAgICAgICAge21lbnVJdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBrZXk9e2l0ZW0uaWR9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb3V0ZXIucHVzaChpdGVtLnBhdGgpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtzdHlsZXMubWVudUl0ZW19XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgJHtpdGVtLmNvbG9yfSwgJHthZGp1c3RDb2xvcihpdGVtLmNvbG9yLCAtMjApfSlgXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17c3R5bGVzLm1lbnVJY29ufT57aXRlbS5pY29ufTwvc3Bhbj5cbiAgICAgICAgICAgIHtpdGVtLm5hbWV9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9uYXY+XG5cbiAgICAgIDxtYWluIGNsYXNzTmFtZT17YCR7c3R5bGVzLm1haW5Db250ZW50fSAke2lzTWVudU9wZW4gPyBzdHlsZXMubWVudU9wZW4gOiAnJ31gfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9tYWluPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gZGFya2VuIGEgY29sb3IgZm9yIGdyYWRpZW50XG5mdW5jdGlvbiBhZGp1c3RDb2xvcihjb2xvcjogc3RyaW5nLCBhbW91bnQ6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGhleCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyk7XG4gIGNvbnN0IG51bSA9IHBhcnNlSW50KGhleCwgMTYpO1xuICBjb25zdCByID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCAobnVtID4+IDE2KSArIGFtb3VudCkpO1xuICBjb25zdCBnID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCAoKG51bSA+PiA4KSAmIDB4MDBGRikgKyBhbW91bnQpKTtcbiAgY29uc3QgYiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgKG51bSAmIDB4MDAwMEZGKSArIGFtb3VudCkpO1xuICByZXR1cm4gYCMkeyhyIDw8IDE2IHwgZyA8PCA4IHwgYikudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDYsICcwJyl9YDtcbn0gIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlUm91dGVyIiwic3R5bGVzIiwibWVudUl0ZW1zIiwiaWQiLCJuYW1lIiwiaWNvbiIsInBhdGgiLCJjb2xvciIsIkxheW91dCIsImNoaWxkcmVuIiwiaXNNZW51T3BlbiIsInNldElzTWVudU9wZW4iLCJtZW51UmVmIiwiaGFtYnVyZ2VyUmVmIiwicm91dGVyIiwiaGFuZGxlQ2xpY2tPdXRzaWRlIiwiZXZlbnQiLCJjdXJyZW50IiwiY29udGFpbnMiLCJ0YXJnZXQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlUm91dGVDaGFuZ2UiLCJldmVudHMiLCJvbiIsIm9mZiIsImRpdiIsImNsYXNzTmFtZSIsImxheW91dCIsImJ1dHRvbiIsInJlZiIsImhhbWJ1cmdlckJ1dHRvbiIsIm9uQ2xpY2siLCJhcmlhLWxhYmVsIiwib3ZlcmxheSIsIm5hdiIsInNpZGVNZW51Iiwib3BlbiIsIm1hcCIsIml0ZW0iLCJwdXNoIiwibWVudUl0ZW0iLCJzdHlsZSIsImJhY2tncm91bmQiLCJhZGp1c3RDb2xvciIsInNwYW4iLCJtZW51SWNvbiIsIm1haW4iLCJtYWluQ29udGVudCIsIm1lbnVPcGVuIiwiYW1vdW50IiwiaGV4IiwicmVwbGFjZSIsIm51bSIsInBhcnNlSW50IiwiciIsIk1hdGgiLCJtYXgiLCJtaW4iLCJnIiwiYiIsInRvU3RyaW5nIiwicGFkU3RhcnQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/Layout.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Layout */ \"(pages-dir-node)/./components/Layout.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Layout__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\97250\\\\Desktop\\\\Git\\\\LearnRussianNew\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDMEM7QUFDWDtBQUVoQixTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDSCwwREFBTUE7a0JBQ0wsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcOTcyNTBcXERlc2t0b3BcXEdpdFxcTGVhcm5SdXNzaWFuTmV3XFxwYWdlc1xcX2FwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IExheW91dCBmcm9tICcuLi9jb21wb25lbnRzL0xheW91dCc7XHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxMYXlvdXQ+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvTGF5b3V0PlxyXG4gICk7XHJcbn0gIl0sIm5hbWVzIjpbIkxheW91dCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/Layout.module.css":
/*!**********************************!*\
  !*** ./styles/Layout.module.css ***!
  \**********************************/
/***/ ((module) => {

eval("// Exports\nmodule.exports = {\n\t\"layout\": \"Layout_layout__oM4MU\",\n\t\"hamburgerButton\": \"Layout_hamburgerButton__McWbH\",\n\t\"overlay\": \"Layout_overlay__pk7Py\",\n\t\"fadeIn\": \"Layout_fadeIn__y0mvQ\",\n\t\"sideMenu\": \"Layout_sideMenu__cKOvJ\",\n\t\"open\": \"Layout_open__pZ2tV\",\n\t\"menuItem\": \"Layout_menuItem__JaM0o\",\n\t\"menuIcon\": \"Layout_menuIcon__Qx3Nc\",\n\t\"mainContent\": \"Layout_mainContent__ut07Y\",\n\t\"menuOpen\": \"Layout_menuOpen__RVWMj\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3N0eWxlcy9MYXlvdXQubW9kdWxlLmNzcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFw5NzI1MFxcRGVza3RvcFxcR2l0XFxMZWFyblJ1c3NpYW5OZXdcXHN0eWxlc1xcTGF5b3V0Lm1vZHVsZS5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibGF5b3V0XCI6IFwiTGF5b3V0X2xheW91dF9fb000TVVcIixcblx0XCJoYW1idXJnZXJCdXR0b25cIjogXCJMYXlvdXRfaGFtYnVyZ2VyQnV0dG9uX19NY1diSFwiLFxuXHRcIm92ZXJsYXlcIjogXCJMYXlvdXRfb3ZlcmxheV9fcGs3UHlcIixcblx0XCJmYWRlSW5cIjogXCJMYXlvdXRfZmFkZUluX195MG12UVwiLFxuXHRcInNpZGVNZW51XCI6IFwiTGF5b3V0X3NpZGVNZW51X19jS092SlwiLFxuXHRcIm9wZW5cIjogXCJMYXlvdXRfb3Blbl9fcFoydFZcIixcblx0XCJtZW51SXRlbVwiOiBcIkxheW91dF9tZW51SXRlbV9fSmFNMG9cIixcblx0XCJtZW51SWNvblwiOiBcIkxheW91dF9tZW51SWNvbl9fUXgzTmNcIixcblx0XCJtYWluQ29udGVudFwiOiBcIkxheW91dF9tYWluQ29udGVudF9fdXQwN1lcIixcblx0XCJtZW51T3BlblwiOiBcIkxheW91dF9tZW51T3Blbl9fUlZXTWpcIlxufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./styles/Layout.module.css\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();