"use strict";
(self["webpackChunkreact_remote_module"] = self["webpackChunkreact_remote_module"] || []).push([["src_components_KyloWC_jsx"],{

/***/ "./src/components/KyloWC.jsx":
/*!***********************************!*\
  !*** ./src/components/KyloWC.jsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "../../node_modules/react-dom/client.js");
/* harmony import */ var _Kylo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Kylo */ "./src/components/Kylo.jsx");

// import { render } from "react-dom";


const loadApp = (id, props) => {
  const container = document.getElementById(id);
  if (container) {
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container); // createRoot(container!) if you use TypeScript
    root.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Kylo__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ...props
    }, null), root);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadApp);

/***/ }),

/***/ "../../node_modules/react-dom/client.js":
/*!**********************************************!*\
  !*** ../../node_modules/react-dom/client.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "webpack/sharing/consume/default/react-dom/react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ })

}]);
//# sourceMappingURL=src_components_KyloWC_jsx.js.map