var spox = window.spox || {};
spox = spox || {};
window.spox = window.spox || {};
(function() {
	function S() {
		a.core();
		a.jwt && a.jwt();
		a.oneTouchLogin && a.oneTouchLogin();
		a.singleSignOn && a.singleSignOn();
		a.webAuthnLogin && ($("body").data("") && M(), a.webAuthnLogin());
		a.otp && a.otp.initiate();
		a.oneTouch();
		a.footer();
		a.pwr();
		a.keychain && a.keychain();
		a.smartLock && a.smartLock();
		a.tpdLogin && a.tpdLogin.initialize();
		a.showHidePassword()
	}
	function D() {
		var a = navigator.userAgent.match(/Chrome\/([0-9]+)\./i);
		return "spox Inc." === window.navigator.vendor &&
			"PaymentRequest" in window && navigator.userAgent.match(/Android/i) && a && 58 <= Number(a[1])
	}
	var a = {};
	a.logger = function() {
		function e(a) {
			a.timestamp = Date.now ? Date.now() : (new Date).getTime();
			f.push(a)
		}

		function b(c) {
			var b = a.utils.getIntent();
			var e = a.utils.getFlowId();
			var g = $("body").data("loginLiteExperience");
			0 !== f.length && (c = c || {}, f.push({
				evt: "context_correlation_id",
				data: $("body").data("correlationId"),
				instrument: !0
			}), b && (f.push({
				evt: "serverside_data_source",
				data: b,
				instrument: !0
			}), f.push({
				evt: "intent",
				data: b,
				instrument: !0
			})), e && f.push({
				evt: "context_id",
				data: e,
				instrument: !0
			}), g && f.push({
				evt: "lite_experience",
				data: "Y",
				instrument: !0
			}), e = (e = document.querySelector("#token") || document.querySelector('input[name="_csrf"]')) && e.value, b = {
				_csrf: e,
				currentUrl: window.location.href,
				logRecords: JSON.stringify(f),
				intent: b
			}, "object" == typeof c.data && Object.assign(b, c.data), $.ajax({
				url: "/signin/client-log",
				data: b,
				success: c.success,
				fail: c.fail,
				complete: c.complete
			}), f = [])
		}
		var f = [];
		return {
			log: e,
			logServerPreparedMetrics: function() {
				var a =
					document.querySelector('input[name="clientLogRecords"]');
				if (a) try {
					var b = JSON.parse(a.value)
				} catch (h) {}
				b && (f = f.concat(b))
			},
			pushLogs: b,
			clientLog: function(a, d, h) {
				a = a || [];
				if (a instanceof Array) {
					for (var c = 0; c < a.length; c++) e(a[c]);
					a = {
						complete: function() {
							if ("function" == typeof d) return d()
						}
					};
					"object" == typeof h && (a.data = h);
					b(a)
				} else if ("function" == typeof d) return d()
			},
			getStateName: function() {
				var c = a.utils.getSplitLoginContext(),
					b = a.utils.isHybridLoginExperience(),
					e = document.getElementById("keepMeLoggedIn") ?
					"LOGIN_UL_RM" : "LOGIN_UL",
					f = {
						inputEmail: "begin_email",
						implicitEmail: "begin_email",
						inputPassword: b ? "begin_hybrid_pwd" : "begin_pwd",
						inputPhone: "begin_phone"
					};
				return c && f[c] && (e = f[c]), b && "inputPassword" !== c && (e = "begin_hybrid_login"), e
			}
		}
	}();
	a.pubsub = function() {
		var a = {},
			b = {};
		return a.publish = function(a, c) {
			if (!b[a]) return !1;
			for (var d = b[a], e = d ? d.length : 0; 0 < e;) d[e - 1].func(c), --e
		}, a.subscribe = function(a, c) {
			"function" == typeof c && (b[a] || (b[a] = []), b[a].push({
				func: c
			}))
		}, a
	}();
	a.store = function() {
		return function(e) {
			var b =
				e || {};
			return {
				updateModel: function(e) {
					var c = document.querySelector("input[name=splitLoginContext]");
					e.splitLoginContext || (e.splitLoginContext = c && c.value);
					c = Object.assign({}, b.model, e);
					c.notifications = e.notifications;
					c.tpdVariant = e.tpdVariant;
					c.showSpinnerUpfront = e.showSpinnerUpfront;
					c.enableSmartlock = e.enableSmartlock;
					c.tpdAutoSend = e.tpdAutoSend;
					c.webAuthnLoginContext = e.webAuthnLoginContext;
					c.afpExist = e.afpExist;
					b = e = Object.assign({}, b, {
						model: c
					});
					a.pubsub.publish("STATE_UPDATED", e)
				},
				getState: function() {
					return b
				}
			}
		}
	}();
	var p = function(a, b, f) {
			a && b && f && (a.addEventListener ? a.addEventListener(b, f, !1) : a.attachEvent && a.attachEvent("on" + b, f))
		},
		aa = function(a) {
			if ("function" == typeof window.Event) return new Event(a);
			var b = document.createEvent("Event");
			return b.initEvent(a, !0, !0), b
		},
		y = function(a) {
			a = a || window.event || {};
			a.preventDefault ? a.preventDefault() : a.returnValue = !1
		},
		pa = function(a) {
			a = a || window.event || {};
			a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
		},
		C = function(a) {
			a = a || window.event || {};
			return a.target || a.srcElement
		},
		Q = function(a, b) {
			if (a && b) {
				var e = aa(b);
				a.dispatchEvent ? a.dispatchEvent(e) : a.fireEvent && a.fireEvent("on" + b, e)
			}
		};
	a.utils = function() {
		function e(a) {
			q && ($(q).addClass("spinner"), a && a.nonTransparentMask && $(q).addClass("nonTransparentMask"), $(q).removeClass("hide"), q.setAttribute("aria-busy", "true"));
			F && $(F).removeClass("hide")
		}

		function b() {
			q && ($(q).removeClass("spinner"), $(q).removeClass("nonTransparentMask"), $(q).addClass("hide"), q.setAttribute("aria-busy", "false"));
			F && $(F).addClass("hide")
		}

		function f() {
			return "true" ===
				$("body").data("isHybridLoginExperience")
		}

		function c(c) {
			a.storeInstance && a.storeInstance.updateModel(c);
			c.ulSync && a.fn.updateFnSyncContext(c.ulSync);
			!c.showSpinnerUpfront && "linked" !== c.smartlockStatus && b()
		}

		function d(b) {
			var d = document.querySelector('input[name="ctxId"]'),
				e = document.querySelector("form[name=login]");
			if (b && b.overlay && b.overlay.variant) {
				document.body.setAttribute("data-overlay-variant", b.overlay.variant);
				document.body.setAttribute("data-overlay-content-version", b.overlay.contentVersion ||
					"");
				a.loadResources && a.loadResources.lazyload();
				var h = document.getElementById("keepMeLogin");
				h && "oneTouch" === b.overlay.variant && $(h).addClass("hide")
			}
			b.otpMayflyKey && e && a.utils.addHiddenElement("otpMayflyKey", b.otpMayflyKey, e);
			!b.otpMayflyKey && $("input[name=otpMayflyKey]") && $("input[name=otpMayflyKey]").remove();
			b && b.htmlResponse ? a.ads.handleAdsInterception(decodeURIComponent(b.htmlResponse)) : b && b.returnUrl && !b.notifications ? window.location.href = b.returnUrl : (!b.profile && b.adsChallengeUrl && a.ads.init(b.adsChallengeUrl),
				c(b), a.otp.initiate(b), b.verification && "pending" === b.verification.page && (a.verification.startPolling({
					accessToken: b.accessToken,
					authflowDocumentId: b.authflowDocumentId,
					_csrf: b._csrf,
					email: b.verification.email,
					variant: b.tpdVariant,
					tpdTriggerMethod: b.tpdTriggerMethod
				}), a.verification.showResendLink()), b.tpdDemoRefresh && a.utils.isTpdDemo() && d && d.value && (d.value = "", document.body.removeAttribute("data-is-prefill-email-enabled"), document.body.removeAttribute("data-tpd-demo"), document.body.removeAttribute("data-tpd-variant"),
					window.location.href = "/"), b.autoRememberMe && (d = document.getElementById("keepMeLoggedIn")) && (d.checked = !0), x(), b.setBuyer && setTimeout(function() {
					U() && a.xoPlanning.triggerSetBuyerCall(b.setBuyer)
				}, 300))
		}

		function h(a) {
			429 === a.status ? $(q).removeClass("spinner") : window.location.href = window.location.href
		}

		function g() {
			var a = document.querySelector('input[name="intent"]');
			return a && a.value || ""
		}

		function n() {
			var a = document.querySelector("input[name=flowId]");
			return a && a.value || ""
		}

		function l() {
			var a = document.querySelector("input[name=_sessionID]");
			return a && a.value
		}

		function v(a) {
			return a ? {
				container: a.querySelector("div.textInput"),
				field: a.querySelector("input[type=text]"),
				errMsgContainer: a.querySelector("div.errorMessage"),
				errMsg: a.querySelector("div.errorMessage .emptyError")
			} : null
		}

		function x() {
			var a = document.querySelector("#splitPassword");
			a && $(a).addClass("transformRightToLeft")
		}

		function I(a, b, c) {
			var d = document.createElement("input");
			c && (d.setAttribute("type", "hidden"), d.setAttribute("name", a), d.setAttribute("value", b), c.appendChild(d))
		}

		function k() {
			var a = document.getElementById("token");
			return a && a.value || ""
		}

		function m(a) {
			var b = document.getElementById("token");
			b && a && (b.value = a)
		}

		function w(a) {
			return a ? a.isPwdlessPriorityEnabled : !!$("body").data("isPwdlessPriorityEnabled")
		}

		function U() {
			var a = document.querySelector('input[name="fn_sync_data"]');
			return a && a.value
		}
		var q = document.querySelector(".transitioning"),
			F = document.querySelector(".lockIcon"),
			r = document.querySelector(".transitioning p.checkingInfo");
		return {
			showSpinner: e,
			hideSpinner: b,
			showSpinnerMessage: function(a) {
				"" !== a ? (a = document.querySelector(".transitioning p." + a)) && $(a).removeClass("hide") : $(r).removeClass("hide")
			},
			hideSpinnerMessage: function(a) {
				"" !== a ? (a = document.querySelector(".transitioning p." + a)) && $(a).addClass("hide") : $(r).addClass("hide")
			},
			getOutboundLinksHandler: function(b, c, d, h) {
				var g = b && b.getAttribute("href");
				b && b.getAttribute("id");
				var f, v, l;
				return function(n) {
					n.preventDefault();
					a.logger.log({
						evt: "state_name",
						data: c || a.logger.getStateName(),
						instrument: !0
					});
					a.logger.log({
						evt: "transition_name",
						data: d,
						instrument: !0
					});
					(f = document.querySelector('input[name="locale.x"]')) && a.logger.log({
						evt: "page_lang",
						data: f.value,
						instrument: !0
					});
					(v = $(b).data("locale")) && a.logger.log({
						evt: "change_to_lang",
						data: v,
						instrument: !0
					});
					l = {
						complete: function() {
							if ("function" == typeof h) return h();
							window.location = g
						}
					};
					a.logger.pushLogs(l);
					e()
				}
			},
			isFieldPrefilled: function(a) {
				return a ? !!(a && window.chrome && window.chrome.webstore && "rgb(250, 255, 189)" === getComputedStyle(a).backgroundColor) || a.value && 0 < a.value.length : !1
			},
			notYouClickHandler: function(a,
				b) {
				y(a);
				var c = document.querySelector("#initialSplitLoginContext"),
					e = {
						_csrf: document.querySelector("#token").value,
						notYou: !0,
						intent: g(),
						context_id: n()
					};
				c && (e.initialSplitLoginContext = c.value);
				document.body.removeAttribute("data-web-authn-login-context");
				$.ajax({
					type: "POST",
					url: "/signin/not-you",
					data: e,
					dataType: "json",
					success: d,
					fail: h,
					complete: function() {
						if ("function" == typeof b) return b()
					}
				})
			},
			successfulXhrHandler: d,
			failedXhrSubmitHandler: h,
			documentClickHandler: function(b) {
				a.pubsub && a.pubsub.publish("WINDOW_CLICK",
					b)
			},
			toggleRememberInfoTooltip: function(a) {
				var b = document.querySelector(".rememberProfile .bubble-tooltip");
				if (b && a && C(a)) {
					b = $(b);
					var c = $(C(a));
					c.hasClass("infoLink") || c.hasClass("bubble-tooltip") ? (y(a), b.toggle()) : b.addClass("hide")
				}
			},
			updateView: c,
			isInIframe: function() {
				return window.self !== window.top
			},
			isInContextIntegration: function() {
				return !!window.xprops
			},
			getSplitLoginContext: function() {
				var a = document.querySelector('input[name="splitLoginContext"]');
				return a && a.value
			},
			getIntent: g,
			getReturnUri: function() {
				var a =
					document.querySelector('input[name="returnUri"]');
				return a && a.value || ""
			},
			getReturnUriState: function() {
				var a = document.querySelector('input[name="state"]');
				return a && a.value || ""
			},
			getFlowId: n,
			getSessionId: l,
			getKmliCb: function() {
				return document.querySelector("#keepMeLoggedIn")
			},
			getActivespoxElement: function(a) {
				var b, c = document.querySelector('input[name="splitLoginCookiedFallback"]');
				if (!a || c) return b = document.querySelector("#spox"), v(b);
				switch (a.value) {
					case "inputEmail":
						b = document.querySelector(f() ?
							"#splitHybridspox" : "#splitEmailspox");
						break;
					case "inputPhone":
						b = document.querySelector(f() ? "#splitHybridspox" : "#splitPhonespox");
						break;
					case "inputPassword":
					case "inputPin":
						b = document.querySelector(f() ? "#splitHybridspox" : "#splitPasswordspox");
						break;
					case "implicitEmail":
						b = document.querySelector("#implicitEmailspox");
						break;
					default:
						b = null
				}
				return b && $(b).hasClass("hide") ? null : v(b)
			},
			getspoxDom: v,
			getQueryParamFromUrl: function(a, b) {
				var c = (b = decodeURIComponent(b)) && b.split("?")[1],
					d = {};
				if (c) return c.split("&").forEach(function(a) {
					a = a.split("=");
					d[a[0]] = a[1]
				}), d[a]
			},
			setSliderToPasswordContainer: x,
			getQueryParamsObj: function(a) {
				var b = (a = decodeURIComponent(a)) && a.split("?")[1];
				a = {};
				if (b) {
					b = b.split("&");
					for (var c = 0; c < b.length; c++) {
						var d = b[c].split("=");
						a[d[0]] = d[1]
					}
					return a
				}
			},
			updateParamValue: function(b, c, d) {
				var e = a.utils.getQueryParamsObj(b),
					h;
				return e ? void 0 !== e[c] ? (h = e[c], b.replace(c + "=" + h, c + "=" + d)) : b + "&" + c + "=" + d : "?" === b[b.length - 1] ? b + c + "=" + d : b + "?" + c + "=" + d
			},
			addHiddenElement: I,
			addHiddenElementIfNotExist: function(a, b, c) {
				c && c.querySelector('input[name="' + a + '"]') || I(a, b, c)
			},
			doImpressionTracking: function(a) {
				try {
					spox.analytics.instance.recordImpression({
						data: a.sys.tracking.fpti.dataString
					})
				} catch (z) {}
			},
			createIframe: function(a) {
				var b = document.createElement("iframe"),
					c = "id title className frameBorder sandbox src style".split(" ");
				if (a) {
					for (var d = 0; d < c.length; d++) a[c[d]] && (b[c[d]] = a[c[d]]);
					return document.body.appendChild(b), b
				}
			},
			postPpBridgeMessage: function(a) {
				var b = window.opener;
				try {
					a = "string" == typeof a ? a : JSON.stringify(a);
					if (b && (window.navigator.userAgent.match(/edge/i) || b.postMessage && !window.navigator.userAgent.match(/msie|trident/i))) return b.postMessage(a, "*"), !0;
					var c = b && b.frames && b.frames.length && b.frames.spoxBridge;
					if (c && c.returnToParent) return c.returnToParent(a), !0
				} catch (ta) {}
				return !1
			},
			isPpFrameMiniBrowser: function() {
				return window.opener && window.name && 0 === window.name.indexOf("PPFrame")
			},
			updatePageLevelError: function(a, b) {
				var c = document.querySelector(".notifications"),
					d, e;
				c && (d = document.createElement("p"), e = document.createTextNode(a), d.setAttribute("class", "notification " + b), d.setAttribute("role", "alert"), d.appendChild(e), c.appendChild(d))
			},
			makeServerRequestAndReturnPromise: function(a, b) {
				return new Promise(function(c, d) {
					var h = {};
					b = b || {};
					b.data && (h = b.data);
					h._csrf = k();
					h._sessionID = h._sessionID || l();
					e();
					$.ajax({
						type: b.method || "POST",
						url: a,
						data: h,
						dataType: "json",
						success: function(a) {
							return a ? (m(a._csrf), c(a)) : d()
						},
						fail: function(a) {
							return d(a)
						}
					})
				})
			},
			getCSRFToken: k,
			setCSRFToken: m,
			isAndroidDevice: function() {
				return "spox Inc." === window.navigator.vendor && navigator.userAgent.match(/Android/i)
			},
			doesItLookLikeEmail: function(a) {
				return a ? (a = a.replace(/[-()\.\+\s]/ig, ""), !a || 0 <= a.search(/\D+/g)) : !0
			},
			isHybridLoginExperience: f,
			isHybridEditableOnCookied: function() {
				return "true" === $("body").data("isHybridEditableOnCookied")
			},
			isPrefillEmailEnabled: function() {
				return "true" === $("body").data("isPrefillEmailEnabled")
			},
			hidePasswordForPrefillHybrid: function() {
				var a = document.querySelector("#splitPassword");
				a && $(a).addClass("hide")
			},
			isPrefilledEmailNext: function() {
				var a = document.querySelector("input[name=isPrefillEmailEnabled]");
				return a && "true" === a.value
			},
			renderPasswordFromPrefillHybridView: function() {
				var a = document.querySelector(".profileRememberedEmail");
				a && $(a).removeClass("cookiedProfile");
				x();
				c({
					splitLoginContext: "inputPassword",
					profile: {
						email: email && email.value
					},
					verification: null,
					notifications: null
				})
			},
			isTpdDemo: function() {
				return "true" === $("body").data("tpdDemo")
			},
			getCtxId: function() {
				var a = document.querySelector("input[name=ctxId]");
				return a && a.value || ""
			},
			isPwdlessPriorityEnabled: w,
			isOTEligible: function() {
				var b = !!a.oneTouchLogin && !!$("body").data("oneTouchUser");
				return b && (a.logger.log({
					evt: "PWDLESS_PRIORITY_CLIENT",
					data: "ONETOUCH_PRIORITY",
					calEvent: !0
				}), a.logger.pushLogs()), b
			},
			isAPayEnabled: function(b) {
				var c = b && b.contextualLogin || window.spox && window.spox.ulData || {},
					d = (b = w(b)) && c.aPayAuth && D();
				return c.canNotMakePayment || !b ? !1 : (d && (a.logger.log({
						evt: "PWDLESS_PRIORITY_CLIENT",
						data: "APAY_PRIORITY",
						calEvent: !0
					}), a.logger.pushLogs()),
					d)
			},
			isSLActivation: function(b) {
				return "activation" === (b && b.slAction || window.spox && window.spox.slData && window.spox.slData.slAction) && a.smartLock ? (a.logger.log({
					evt: "PWDLESS_PRIORITY_CLIENT",
					data: "SL_PRIORITY",
					calEvent: !0
				}), a.logger.pushLogs(), !0) : !1
			},
			isWebAuthnEligible: function() {
				var b = !!a.webAuthnLogin && !!$("body").data("webAuthnLoginContext");
				return b && (a.logger.log({
					evt: "PWDLESS_PRIORITY_CLIENT",
					data: "WEB_AUTHN_PRIORITY",
					calEvent: !0
				}), a.logger.pushLogs()), b
			},
			addAutofillEventHandler: function(a, b) {
				a &&
					b && "function" == typeof b && p(a, "input", function(a) {
						y(a);
						var c = a.inputType;
						if ("insertText" === c || "deleteContentBackward" === c || "insertFromPaste" === c) return !0;
						if (!a.data) return b(a)
					})
			},
			parseJsonSafe: function(a) {
				var b;
				try {
					return b = JSON.parse(a), b
				} catch (db) {
					return {}
				}
			},
			isBrowserInPrivateMode: function(a) {
				if (window.webkitRequestFileSystem) window.webkitRequestFileSystem(window.TEMPORARY, 1, function() {
					a({
						isPrivate: !1
					})
				}, function() {
					a({
						isPrivate: !0
					})
				});
				else if (/Safari/.test(window.navigator.userAgent)) try {
					window.localStorage ||
						a({
							isPrivate: !0
						}), window.openDatabase(null, null, null, null), window.localStorage.setItem("test", 1), "1" === window.localStorage.getItem("test") && (window.localStorage.removeItem("test"), a({
							isPrivate: !1
						}))
				} catch (z) {
					a({
						isPrivate: !0
					})
				} else a({
					isPrivate: !1
				})
			},
			isFnDataLoaded: U,
			isCookieDisabledBrowser: function() {
				try {
					return !("string" == typeof document.cookie && 0 < document.cookie.length)
				} catch (cb) {
					return !0
				}
			},
			handleSlrInternalRedirect: function(a) {
				a = a || {};
				var b = l(),
					c = k(),
					d = document.createElement("form");
				return $(d).attr("method",
					"POST"), $(d).attr("action", "/signin/iroute"), I("_csrf", c, d), I("_sessionID", b, d), I("accessToken", a.accessToken, d), I("returnUrl", a.returnUrl, d), document.body.appendChild(d), d.submit()
			},
			sendPostMessage: function(a) {
				spox.unifiedLoginInlinePostMessage && "function" == typeof spox.unifiedLoginInlinePostMessage.processAndPostMessage && spox.unifiedLoginInlinePostMessage.processAndPostMessage({
					event: a
				})
			}
		}
	}();
	a.storageUtils = function() {
		function e() {
			try {
				var e = JSON.parse(window.localStorage.getItem("ulData")) || {}
			} catch (c) {
				a.logger.log({
					evt: b,
					data: c,
					calEvent: !0,
					status: "ERROR"
				}), a.logger.pushLogs()
			}
			return e || {}
		}
		var b = "LOCALSTORAGE";
		return {
			setDataByUserId: function(f, c, d) {
				var h = e();
				var g = h[d] || {};
				g[f] = c;
				h[d] = g;
				try {
					window.localStorage.setItem("ulData", JSON.stringify(h))
				} catch (n) {
					a.logger.log({
						evt: b,
						data: n,
						calEvent: !0,
						status: "ERROR"
					}), a.logger.pushLogs()
				}
			},
			readDataByUserId: function(a, b) {
				var c;
				return c = e(), c[b] && c[b][a]
			},
			removeDataByUserId: function(f, c) {
				var d = e();
				if (d[c]) {
					delete d[c][f];
					try {
						window.localStorage.setItem("ulData", JSON.stringify(d))
					} catch (h) {
						a.logger.log({
							evt: b,
							data: h,
							calEvent: !0,
							status: "ERROR"
						}), a.logger.pushLogs()
					}
				}
			}
		}
	}();
	a.loadResources = function() {
		var e = a.utils;
		return {
			showCookieBanner: function() {
				var a, f = "",
					c = e.getFlowId();
				c && (f = f + "?flowId=" + c);
				$.ajax({
					method: "GET",
					url: f,
					success: function(b) {
						var c = b && b.data && b.data.cookieBanner;
						b = 0;
						c && (document.querySelector("head").insertAdjacentHTML("beforeend", c.css), document.querySelector("#main").insertAdjacentHTML("beforeend", c.html), a = document.createElement("script"), a.setAttribute("nonce", $("body").data("nonce")),
							a.innerHTML = c.js.replace(/^<script[^>]*>|<\/script>$/g, ""), $("body").append(a), "function" == typeof window.bindGdprEvents && window.bindGdprEvents(), (c = document.querySelector("#gdprCookieBanner")) && (b = $(c).outerHeight(), document.querySelector("body").style.marginBottom = b + "px"))
					}
				})
			},
			lazyload: function() {
				function b() {
					var f = {
							_csrf: e.getCSRFToken(),
							flowId: e.getFlowId(),
							intent: e.getIntent()
						},
						l = !1,
						v = $("body").data("overlay-variant");
					h > g || ("true" === $("body").data("lazyLoadCountryCodes") && (f.lazyLoadCountryCodes = !0, f["locale.x"] = c, l = !0), v && (f.overlayVariant = v, f.overlayContentVersion = $("body").data("overlay-content-version"), a.utils.addHiddenElement("overlayVariant", v, document.querySelector("form[name=login]")), l = !0), a.countryList && "true" === $(document.body).data("showCountryDropDown") && !a.countryList.getCache("countryList") && (f.showCountryDropDown = "true", l = !0), l && (h += 1, $.ajax({
						url: d,
						method: "POST",
						data: f,
						success: function(b) {
							a.countryList && a.countryList.showCountryDropDown && a.countryList.showCountryDropDown(b);
							var c = document.querySelector("#phoneCode"),
								d = document.createDocumentFragment(),
								e = b && b.countryPhoneList,
								h = b && b.phoneCode;
							if (e && e.length && c) {
								for (var f = 0; f < e.length; f++) {
									var g = document.createElement("option");
									g.value = e[f].$value;
									g.setAttribute("data-code", e[f].$code);
									g.setAttribute("data-country", e[f].$country);
									g.textContent = e[f].$elt;
									e[f].$value === h && g.setAttribute("selected", "selected");
									d.appendChild(g)
								}
								c.innerHTML = "";
								c.appendChild(d)
							}(c = document.querySelector("#login")) && b.overlayTemplate && c.insertAdjacentHTML("beforeend",
								b.overlayTemplate)
						},
						fail: b
					})))
				}
				var f = document.querySelector('input[name="locale.x"]'),
					c = f && f.value,
					d = "/signin/load-resource",
					h = 0,
					g = 2;
				b()
			}
		}
	}();
	(function() {
		var a = function(a) {
			function b(b) {
				return a.classList ? a.classList.contains(b) : !!a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)"))
			}

			function c(c) {
				a.classList ? a.classList.add(c) : b(c) || (a.className += " " + c)
			}

			function d(c) {
				a.classList ? a.classList.remove(c) : b(c) && (a.className = a.className.replace(new RegExp("(\\s|^)" + c + "(\\s|$)"), " "))
			}
			"string" == typeof a &&
				(a = document.querySelector(a));
			if (a) return {
				hasClass: b,
				addClass: c,
				removeClass: d,
				data: function(b, c) {
					if ("string" == typeof b) {
						var d = "data-" + b.replace(/([A-Z])/g, "-$1").toLowerCase();
						if (!c) return a.getAttribute(d);
						a.setAttribute(d, c)
					}
				},
				outerHeight: function() {
					var b, c = a.offsetHeight;
					return "" == typeof getComputedStyle ? c : (b = getComputedStyle(a), c += parseInt(b.marginTop) + parseInt(b.marginBottom), c)
				},
				text: function(b) {
					var c = void 0 !== a.textContent && null !== a.textContent;
					if (void 0 === b) return c ? a.textContent :
						a.innerText;
					c ? a.textContent = b : a.innerText = b
				},
				attr: function(b, c) {
					return c ? a.setAttribute(b, c) : a.getAttribute(b)
				},
				find: function(b) {
					return a.querySelectorAll(b)
				},
				remove: function() {
					a.parentNode.removeChild(a)
				},
				toggle: function() {
					b("hide") ? d("hide") : c("hide")
				},
				append: function(b) {
					a.appendChild(b)
				},
				focus: function() {
					a.focus()
				},
				val: function(b) {
					if (!b) return a.value;
					a.value = b
				}
			}
		};
		a.ajax = function(a) {
			var b, c, d = [],
				e, g = document.querySelector("input[name=_sessionID]");
			if (a && (!a || a.url)) {
				try {
					var n = window.XMLHttpRequest ?
						new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
				} catch (l) {}
				if (n) {
					a.method = a.method || "POST";
					if (a.data && "string" != typeof a.data)
						for (e in a.data._sessionID = a.data._sessionID || g && g.value, a.data) d.push(encodeURIComponent(e) + "=" + encodeURIComponent(a.data[e]));
					n.onreadystatechange = function() {
						if (4 === n.readyState) {
							b = n.response || n.responseText;
							if (200 === n.status && b) {
								try {
									b = JSON.parse(b)
								} catch (l) {}
								"function" == typeof a.success && a.success(b)
							}
							200 !== n.status && "function" == typeof a.fail && a.fail(n);
							"function" ==
							typeof a.complete && a.complete()
						}
					};
					n.open(a.method, a.url);
					n.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					"POST" === a.method && (n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), n.setRequestHeader("Accept", "application/json"));
					"GET" === a.method && n.setRequestHeader("Accept", "application/json");
					if ("object" == typeof a.headers && a.headers.length)
						for (c in a.headers) n.setRequestHeader(c, a.headers[c]);
					return n.send(d && d.join("&")), n
				}
			}
		};
		window.$ = a
	})();
	a.view = function() {
		function e(c) {
			var d =
				document.querySelector("input[name=splitLoginContext]");
			c = c && c.model || {};
			"function" == typeof window.showGdprBanner && window.showGdprBanner();
			d.value = c.splitLoginContext;
			c.adsChallengeVerified && ($("#login").removeClass("hide"), document.getElementById("ads-container") && (document.getElementById("ads-container").style.display = "none"));
			f(c);
			var e = document.querySelector("#splitEmail");
			d = document.querySelector("#splitEmailSection");
			var g = document.querySelector("#splitPhoneSection"),
				n = document.querySelector("#rememberProfileEmail"),
				l = document.querySelector("#email"),
				v = document.querySelector("#phone"),
				x = document.querySelector(".forgotLink"),
				I = document.querySelector(".forgotLink .bubble-tooltip"),
				k = document.querySelector(".actions"),
				m = document.querySelector("#loginWithPhoneOption"),
				w = document.querySelector("#loginWithEmailOption"),
				p = $("body").data("phonePasswordEnabled"),
				q = $("body").data("phonePinEnabled"),
				F = document.querySelector("#signUpLinkOnEmail"),
				r = document.querySelector("#signUpLinkOnPassword");
			"inputEmail" === c.splitLoginContext ||
				"inputPhone" === c.splitLoginContext ? (e && $(e).removeClass("hide"), n && "" != typeof c.rememberProfile && (n.checked = "true" === c.rememberProfile || !0 === c.rememberProfile), e = a.utils.isHybridLoginExperience(), a.logger.log({
					evt: "state_name",
					data: e ? "begin_hybrid_login" : "begin_email",
					instrument: !0
				}), a.logger.log({
					evt: "transition_name",
					data: e ? "prepare_hybrid" : "prepare_email",
					instrument: !0
				}), a.logger.log({
					evt: "is_cookied",
					data: "N",
					instrument: !0
				}), a.logger.pushLogs(), F && $(F).removeClass("hide"), r && $(r).addClass("hide")) :
				("autoSend" !== c.tpdVariant && e && $(e).addClass("hide"), v && v.blur(), l && l.blur());
			d && "inputEmail" === c.splitLoginContext && ($(d).removeClass("hide"), l.removeAttribute("disabled"), q || p ? (m && $(m).removeClass("hide"), w && $(w).addClass("hide"), x && $(x).addClass("hide"), I && $(I).addClass("hide")) : c.hidePwrOnEmailPage ? (x && $(x).addClass("hide"), I && $(I).addClass("hide")) : x && $(x).removeClass("hide"), $(k).removeClass("phonePresent"), g && $(g).addClass("hide"), v && (v.value = "", v.setAttribute("disabled", "disabled")));
			g && "inputPhone" ===
				c.splitLoginContext && (d && $(d).addClass("hide"), $(g).removeClass("hide"), q || p) && (m && $(m).addClass("hide"), w && $(w).removeClass("hide"));
			d = document.querySelector(".educationMessage");
			!0 === c.showEducationMessage && "inputPin" === c.splitLoginContext ? d && $(d).removeClass("hide") : d && $(d).addClass("hide");
			k = document.querySelector("#splitPassword");
			d = document.querySelector("#splitPasswordSection");
			g = document.querySelector("#splitPinSection");
			l = document.querySelector("#password");
			m = document.querySelector("#pin");
			w = document.querySelector("#rememberProfilePassword");
			p = document.querySelector(".forgotLink");
			v = document.querySelector("#phone");
			x = document.querySelector("#signUpLinkOnEmail");
			I = document.querySelector("#signUpLinkOnPassword");
			(q = document.querySelector('#splitEmail input[type="password"]')) && q.value.trim() && (l.value = q.value, q.value = "");
			"inputPassword" === c.splitLoginContext || "inputPin" === c.splitLoginContext ? (k && "autoSend" !== c.tpdVariant && $(k).removeClass("hide"), c.enableSmartlock && a.smartLock(c), w &&
				(w.checked = "true" === c.rememberProfile || !0 === c.rememberProfile), "inputPassword" === c.splitLoginContext && !c.tpdVariant && p && $(p).removeClass("hide"), "disabled" === $(l).attr("disabled") && l.removeAttribute("disabled"), "linked" === c.smartlockStatus || c.verification || (m = document.querySelector("#password"), k = document.querySelector("#phone"), m = a.utils.isFieldPrefilled(m), w = a.utils.isHybridLoginExperience(), p = (w ? "prepare_hybrid_pwd" : "prepare_pwd") + (a.utils.getKmliCb() ? "_ot" : ""), document.querySelector("#moreOptionsContainer") &&
					!0 === c.moreOptions && (p += "_more_opt", a.logger.log({
						evt: "exp_shown",
						data: "tpd",
						instrument: !0
					})), a.logger.log({
						evt: "state_name",
						data: w ? "begin_hybrid_pwd" : "begin_pwd",
						instrument: !0
					}), a.logger.log({
						evt: "pub_cred_type",
						data: k && k.value ? "phone" : "email",
						instrument: !0
					}), a.logger.log({
						evt: "transition_name",
						data: p,
						instrument: !0
					}), a.logger.log({
						evt: "is_cookied",
						data: "Y",
						instrument: !0
					}), a.logger.log({
						evt: "autofill",
						data: m ? "Y" : "N",
						instrument: !0
					}), a.logger.pushLogs()), x && $(x).addClass("hide"), I && $(I).removeClass("hide"),
				window.dispatchEvent && window.dispatchEvent(aa("resize"))) : (k && $(k).addClass("hide"), l.value = "", m && (m.value = ""));
			d && "inputPassword" === c.splitLoginContext && (g && $(g).addClass("hide"), $(d).removeClass("hide"));
			g && "inputPin" === c.splitLoginContext && ($(d).addClass("hide"), $(g).removeClass("hide"));
			c.profile && c.profile.phone && v && (v.value = c.profile.phone);
			$("body").hasClass("desktop") && l.focus();
			document.querySelector("input[name=splitLoginContext]");
			d = document.querySelector(".profileDisplayEmail");
			v = document.querySelector(".profileDisplayName");
			g = document.querySelector(".profileRememberedEmail");
			x = document.querySelector(".profileIcon");
			I = document.querySelector("#email");
			l = document.querySelector(".profileDisplayPhoneCode");
			"autoSend" !== c.tpdVariant && (c.profile ? ((v = c.profile.phone || c.profile.email) && "inputEmail" !== c.splitLoginContext && "inputPhone" !== c.splitLoginContext && (d && $(d).text(v), g && $(g).removeClass("hide")), c.profile.phoneCode && l && $(l).text(c.profile.phoneCode)) : (x && ($(x).addClass("hide"), $(x).text(""), x.removeAttribute("style"), $(x).removeClass("profilePhoto"),
				$(x).removeClass("profileInitials"), $(x).addClass("profilePlaceHolderImg")), d && $(d).text(""), l && $(l).text(""), v && $(v).addClass("hide"), I.value = "", g && $(g).addClass("hide"), window.dispatchEvent && window.dispatchEvent(aa("resize"))));
			b(c);
			d = c.spox;
			g = document.querySelectorAll(".spox-container");
			for (l = 0; l < g.length; l++) d ? $(g[l]).removeClass("hide") : $(g[l]).addClass("hide");
			c.spox && (d = a.utils.getActivespoxElement({
				value: c.splitLoginContext
			})) && (c.spox.spoxImgUrl && d.image && d.image.setAttribute("src",
				c.spox.spoxImgUrl), c.spox.spoxAudioUrl && d.audioTag && d.audioTag.setAttribute("src", c.spox.spoxAudioUrl), c.spox.spoxAudioUrl && d.audioLink && d.audioLink.setAttribute("href", c.spox.spoxAudioUrl));
			d = document.querySelector("footer");
			g = document.querySelector("#login");
			l = document.querySelector("#login .contentContainer");
			v = document.querySelector("#verification .contentContainer");
			x = document.querySelector("#verification");
			if (c.verification) {
				I = document.querySelector(".activeContent");
				$(g).addClass("hide");
				$(x) && $(x).removeClass("hide");
				$(d).addClass("footerWithIcon");
				$(I).removeClass("activeContent");
				$(v) && $(v).addClass("activeContent");
				if (d = c.verification) g = document.querySelector(".account"), l = document.querySelector(".mobileNotification .pin"), v = document.querySelector(".twoDigitPin"), x = document.querySelector("#uncookiedMessage"), I = document.querySelector("#cookiedMessage"), $(g).text(d.email), d.pin && l ? ($(l).text(d.pin), $(v).text(d.pin), v.setAttribute("style", "font-weight: bold"),
					$(x).removeClass("hide")) : $(I).removeClass("hide");
				a.tpdLogin && a.tpdLogin.instrumentVerificationViewRendered()
			} else I = document.querySelector(".activeContent"), $(g).removeClass("hide"), $(x) && $(x).addClass("hide"), $(d).removeClass("footerWithIcon"), $(I).removeClass("activeContent"), $(l).addClass("activeContent");
			d = document.querySelector("#emailSubTagLine");
			g = document.querySelector("#phoneSubTagLine");
			l = document.querySelector("#pwdSubTagLine");
			"inputPassword" === c.splitLoginContext || "inputPin" === c.splitLoginContext ?
				(d && $(d).addClass("hide"), g && $(g).addClass("hide"), l && $(l).removeClass("hide")) : "inputPhone" === c.splitLoginContext ? (g && $(g).removeClass("hide"), d && $(d).addClass("hide"), l && $(l).addClass("hide")) : (d && $(d).removeClass("hide"), g && $(g).addClass("hide"), l && $(l).addClass("hide"));
			d = document.querySelector("#email");
			g = document.querySelector('label[for="email"]');
			l = document.querySelector("#phone");
			v = document.querySelector("#isTpdOnboarded");
			x = document.querySelector(".countryPhoneSelectWrapper");
			I = document.querySelector("#login_emaildiv");
			k = document.querySelector(".profileRememberedEmail");
			c.profile || (d && d.removeAttribute("disabled"), l && l.removeAttribute("disabled"));
			x && $(x).addClass("hide");
			I && $(I).removeClass("phoneInputWrapper");
			!c.profile && k && $(k).removeClass("cookiedProfile");
			!c.phone && l ? l.value = null : c.phone && d && (d.value = null);
			c.notifications && c.hybridInEmailOnlyMode && c.contextualLogin && c.contextualLogin.content && (d && $(d).attr("placeholder", c.contextualLogin.content.emailLabel), g && $(g).text(c.contextualLogin.content.emailLabel),
				d && $(d).attr("data-hybrid-in-email-only-mode", c.hybridInEmailOnlyMode));
			v && c.profile && c.isTpdOnboarded && (v.value = c.isTpdOnboarded);
			a.verification && a.verification.updateView(c);
			a: {
				d = document.querySelector("#pwFpIcon");g = document.querySelector("#password").parentElement;l = g.parentElement;v = c.webAuthnFpIconEnabled;c.partyIdHash && (a.utils.addHiddenElement("partyIdHash", c.partyIdHash, document.querySelector("form[name=login]")), document.body.setAttribute("data-party-id-hash", c.partyIdHash));
				if (c.webAuthnLoginContext &&
					a.webAuthnLogin && !c.verification) {
					M(c);
					a.webAuthnLogin(c);
					if (!v) break a;
					document.body.setAttribute("data-web-authn-login-context", c.webAuthnLoginContext);
					a.utils.addHiddenElement("webAuthnLoginContext", c.webAuthnLoginContext, document.querySelector("form[name=login]"));
					c.wanSupportLookup && document.body.setAttribute("data-web-authn-support-lookup", "true");
					l && $(l).addClass("errorMessageFp");
					c.isRtl ? g && $(g).addClass("rtlFpPlaceholder") : g && $(g).removeClass("rtlFpPlaceholder")
				}
				c.webAuthnLoginContext && a.webAuthnLogin ||
				!d || $(d).hasClass("hide") || (d && $(d).addClass("hide"), l && $(l).removeClass("errorMessageFp"), !g || $(g).removeClass("rtlFpPlaceholder"))
			}
		}

		function b(b) {
			function c(b, c) {
				return a.utils.getQueryParamFromUrl("ulPage", b) ? a.utils.updateParamValue(b, "ulPage", c) : b
			}
			var e = $(document.querySelector("#signupContainer"));
			b = "inputEmail" === b.splitLoginContext || "inputPhone" === b.splitLoginContext;
			if (e) {
				var f = $(signupContainer.querySelector("#createAccount"));
				var n = "true" === e.data("hideOnEmail");
				var l = "true" === e.data("hideOnPass");
				var v = f && f.attr("href");
				b ? (n ? e.addClass("hide") : e.removeClass("hide"), f && f.attr("href", c(v, "email"))) : (l ? e.addClass("hide") : e.removeClass("hide"), f && f.attr("href", c(v, "pwd")))
			}
		}

		function f(a) {
			for (var b = document.querySelectorAll(".notifications"), c = 0; c < b.length; c++) $(b[c]).text(""), a.notifications && a.notifications.msg && (b[c].innerHTML = '<p class="notification ' + a.notifications.type + '" role="alert">' + a.notifications.msg + "</p>")
		}
		return a.storeInstance = a.store(), a.pubsub.subscribe("STATE_UPDATED", e), {
			render: e,
			updateNotificationView: f
		}
	}();
	(function() {
		"function" != typeof Object.assign && (Object.assign = function(a, b) {
			if (null === a) throw new TypeError("Cannot convert  or null to object");
			for (var e = Object(a), c = 1; c < arguments.length; c++) {
				var d = arguments[c];
				if (null !== d)
					for (var h in d) Object.prototype.hasOwnProperty.call(d, h) && (e[h] = d[h])
			}
			return e
		});
		String.prototype.trim || (String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
		})
	})();
	a.fn = function() {
		function a(a) {
			var b =
				document.createElement("script");
			b.src = a.fnUrl;
			b.onload = function() {
				a.enableSpeedTyping && "function" == typeof initTsFb && initTsFb({
					detail: {
						type: "UL",
						fields: ["email", "password"]
					}
				})
			};
			document.body.appendChild(b)
		}

	}();
	a.verification = function() {
		function e(b) {
			a.utils.updateView({
				splitLoginContext: "inputPassword",
				profile: {
					email: z
				},
				verification: null,
				notifications: b.notifications
			})
		}

		function b() {
			var b, c = document.querySelector("#expired .slimP");
			c && c.textContent && (b = {
				msg: c && c.textContent,
				type: "notification-warning"
			});
			a.utils.updateView({
				splitLoginContext: "inputPassword",
				profile: {
					email: z
				},
				tpdVariant: X,
				verification: null,
				ulSync: f("inputPassword"),
				notifications: b
			})
		}

		function c() {
			var c = a.storeInstance.getState().model.rememberProfile;
			c = {
				_csrf: w.value,
				intent: "completeLogin",
				accessToken: ba,
				"locale.x": U.value,
				rememberProfile: "true" === c || !0 === c,
				login_email: z,
				flowId: a.utils.getFlowId(),
				tpdVariant: X,
				tpdTriggerMethod: T
			};
			var d = spox.syncData && "object" == typeof spox.syncData.data ? JSON.stringify(spox.syncData.data) : void 0;
			d && (c.fn_sync_data = d);
			a.utils.getCtxId() && (c.ctxId = a.utils.getCtxId());
			$.ajax({
				url: "" + a.utils.getIntent(),
				type: "POST",
				data: c,
				success: function(c) {
					if (c && "LoggedIn" === c.pollStatus && c.returnUrl) return window.location.href = c.returnUrl;
					if (c && "Failed" === c.pollStatus) return e(c);
					b();
					a.tpdLogin.instrumentTpdExpired("NO_RESPONSE")
				}
			})
		}

		function d() {
			F && (m >= k ? (b(), a.tpdLogin.instrumentTpdExpired("NO_ACTION")) : (m++, q = $.ajax({
				url: "/signin/challenge/push",
				type: "POST",
				data: {
					_csrf: w.value,
					intent: "poll",
					accessToken: ba,
					authflowDocumentId: u,
					retryCount: m,
					"locale.x": U.value,
					flowId: a.utils.getFlowId(),
					tpdVariant: X,
					tpdTriggerMethod: T
				},
				success: ca,
				fail: function() {
					F && d()
				}
			})))
		}

		function h(a) {
			a.preventDefault();
			$(K).removeClass("hide")
		}

		function g(b) {
			var c = document.querySelector("form[name=login]");
			b = b || {};
			F = !0;
			ba = b.accessToken || ba;
			u = b.authflowDocumentId ||
				u;
			z = b.email || z;
			m = 0;
			X = b.variant || X;
			T = b.tpdTriggerMethod || T;
			d();
			(b = document.querySelector("[name=authdocId]")) ? b.setAttribute("value", u): a.utils.addHiddenElement("authdocId", u, c)
		}

		function n() {
			window.location.href = window.location.href
		}

		function l(a) {
			a = C(a);
			K && ($(a).hasClass("showSurvey") || $(K).addClass("hide"))
		}

		function v(b) {
			var c = C(b);
			c = $(c).data("reason");
			b.preventDefault();
			$(R).addClass("hide");
			$(R).removeClass("greyOut");
			x();
			a.tpdLogin.instrumentUsePasswordInstead(c);
			y && $(y).addClass("hide");
			Q && $(Q).removeClass("hide")
		}

		function x() {
			F = !1;
			q.abort()
		}
		var k = 9,
			m = 0,
			r = 0,
			w = document.querySelector("input[name=_csrf]"),
			U = document.querySelector('input[name="locale.x"]'),
			q, F = !1,
			ba, u, z, y = document.querySelector("#verification"),
			ta = document.querySelector(".verificationSubSection");
		document.querySelector("#expired");
		var D = document.querySelector("#denied"),
			E = document.querySelector("#expiredTryAgainButton"),
			O = document.querySelector("#pendingNotYouLink"),
			B = document.querySelector("#pending #tryPasswordLink"),
			R = document.querySelector("#resend"),
			Z = document.querySelector(".sentMessage"),
			K = document.querySelector("#passwordInsteadDropDown"),
			W = document.querySelector("#passwordInsteadGroup"),
			Q = document.querySelector("#login"),
			X, N, T, ca = function(v) {
				v || d();
				w.value = v._csrf || w.value;
				switch (v.pollStatus) {
					case "Accepted":
						x();
						(N = N ? !1 : "Accepted" === v.pollStatus) && (a.logger.log({
							evt: "TPD_CLIENT",
							data: "Approved_" + v.tpdTriggerMethod,
							calEvent: !0
						}), a.logger.pushLogs());
						c();
						break;
					case "Downgraded":
						d();
						break;
					case "Denied":
						x();
						$(ta).addClass("hide");
						$(D).removeClass("hide");
						break;
					case "Failed":
						x();
						e(v);
						break;
					default:
						v.errorView ? (b(), a.tpdLogin.instrumentTpdExpired("RCS_SERVICE_ERROR")) : d()
				}
			};
		return E && (E.onclick = n), O && (O.onclick = function(b) {
			x();
			a.tpdLogin.instrumentNotYouClicked();
			a.utils.notYouClickHandler(b)
		}), a.pubsub && a.pubsub.subscribe("WINDOW_CLICK", l), B && $(B).hasClass("showSurvey") ? (p(B, "click", h), p(W, "click", v)) : B && p(B, "click", v), p(R, "click", function(b) {
			b.preventDefault();
			$(b.target).hasClass("greyOut") || (a.tpdLogin.instrumentResendClicked(), x(), m = 0, $(R).addClass("greyOut"),
				r++, $.ajax({
					url: "/signin/challenge/push",
					type: "POST",
					data: {
						_csrf: w.value,
						intent: "resend",
						accessToken: ba,
						authflowDocumentId: u,
						"locale.x": U.value,
						flowId: a.utils.getFlowId(),
						tpdVariant: X,
						tpdTriggerMethod: T
					},
					success: function(b) {
						b && "Success" === b.resendStatus ? (g({
							accessToken: ba,
							authflowDocumentId: u,
							email: z
						}), $(R).addClass("hide"), $(Z).removeClass("hide"), setTimeout(function() {
							$(Z).addClass("hide");
							3 > r && ($(R).removeClass("hide"), $(R).removeClass("greyOut"))
						}, 3E3)) : b && b.notifications && a.view.updateNotificationView(b)
					},
					fail: function() {}
				}))
		}), {
			startPolling: g,
			showResendLink: function() {
				r = 0;
				setTimeout(function() {
					$(R).removeClass("hide")
				}, 5E3)
			},
			updateView: function(b) {
				var c = document.querySelector("#moreOptionsContainer"),
					d = document.querySelector("#tpdButtonContainer"),
					e = document.querySelector('input[name="tpdEligible"]'),
					v = document.querySelector("form[name=login]"),
					l, f = document.querySelector("#btnNext");
				if (b && d && c) {
					if (b.tpdVariant || b.tpdAutoSend) e ? e.value = "true" : (l = document.createElement("input"), l.setAttribute("type",
						"hidden"), l.setAttribute("name", "tpdEligible"), l.setAttribute("value", "true"), $(v).append(l));
					"moreOptions" === b.tpdVariant && ($(c).removeClass("hide"), $(".forgotLink").addClass("hide"));
					"tpdButton" === b.tpdVariant && ($(c).addClass("hide"), $(d).removeClass("hide"), $(".forgotLink").removeClass("hide"), $("#signupContainer").addClass("hide"));
					b.tpdAutoSend && (a.tpdLogin && a.tpdLogin.instrumentTpdLoginAutoTriggered(), a.tpdLogin && a.tpdLogin.attemptTpdLogin("autoSend"));
					"inputEmail" === b.splitLoginContext && ($(c).addClass("hide"),
						$(d).addClass("hide"), e && "true" === e.value && (e.value = ""));
					a.utils.isTpdDemo() && "inputEmail" !== b.splitLoginContext ? (b = document.querySelector("#splitPassword"), f && $(f).addClass("hide"), b && $(b).removeClass("hide")) : f && $(f).removeClass("hide")
				}
			}
		}
	}();
	a.overlayUtils = function() {
		function e(b) {
			y(b);
			clearTimeout(n);
			b = document.getElementById("overlaySpinner");
			var c = document.getElementById("overlaySpinnerSuccess"),
				e = $("body").data("return-url") || "/signin";
			document.getElementById("overlayOptIn").disabled = !0;
			$(c).removeClass("hide");
			$(b).addClass("hide");
			setTimeout(function() {
				d()
			}, 1300);
			var f;
			$.ajax({
				type: "POST",
				url: "/signin/provisionCapabilities/oneTouch",
				data: {
					flowId: a.utils.getFlowId(),
					optInSource: "signin" === a.utils.getIntent() ? "overlay_dl" : "overlay_xo",
					_csrf: document.querySelector("#token").value
				},
				dataType: "json",
				complete: function() {
					f = setInterval(function() {
						if ($(overlayMask).hasClass("hide")) return clearInterval(f), a.logger.log({
								evt: "ONETOUCH",
								data: "REDIRECT_AFTER_ACTIVATION_RESPONSE_" + a.utils.getIntent().toUpperCase(),
								calEvent: !0
							}),
							a.logger.pushLogs(), window.location.href = e
					}, 100)
				}
			});
			a.logger.log({
				evt: "flow_type",
				data: "onetouch",
				instrument: !0
			});
			a.logger.log({
				evt: "actiontype",
				data: "turn_on",
				instrument: !0
			});
			a.logger.log({
				evt: "state_name",
				data: "overlay",
				instrument: !0
			});
			a.logger.log({
				evt: "transition_name",
				data: "process_overlay",
				instrument: !0
			});
			a.logger.log({
				evt: "ONETOUCH",
				data: "CLICK_OPT_IN_BUTTON_OVERLAY_" + a.utils.getIntent().toUpperCase(),
				calEvent: !0
			});
			a.logger.pushLogs();
			setTimeout(function() {
				return a.logger.log({
					evt: "ONETOUCH",
					data: "REDIRECT_WITHOUT_ACTIVATION_RESPONSE_" + a.utils.getIntent().toUpperCase(),
					calEvent: !0
				}), a.logger.pushLogs(), clearInterval(f), window.location.href = e
			}, 1E4)
		}

		function b(b) {
			function c(a) {
				setTimeout(function() {
					window.location.href = f || "/signin"
				}, a || 0)
			}
			y(b);
			clearTimeout(n);
			var e = {
					evt: "state_name",
					data: "FINGERPRINT_OPTIN",
					instrument: !0
				},
				f = $("body").data("return-url");
			a.logger.log({
				evt: "flow_type",
				data: "webauthn",
				instrument: !0
			});
			a.logger.log({
				evt: "actiontype",
				data: "turn_on",
				instrument: !0
			});
			a.logger.log({
				evt: "state_name",
				data: "overlay",
				instrument: !0
			});
			a.logger.log({
				evt: "transition_name",
				data: "process_overlay",
				instrument: !0
			});
			a.logger.log({
				evt: "WEBAUTH_N_CLIENT",
				data: "PROCESS_OVERLAY_" + a.utils.getIntent().toUpperCase(),
				calEvent: !0
			});
			a.logger.pushLogs();
			d();
			a.webAuthnOptInXHR().then(function() {
				a.logger.clientLog([e, {
					evt: "transition_name",
					data: "process_consent_XHR",
					instrument: !0
				}, {
					evt: "WEBAUTH_N_CLIENT",
					data: "BIND_SUCCESS_XHR_OVERLAY_" + a.utils.getIntent().toUpperCase(),
					calEvent: !0
				}], function() {
					return c()
				})
			})["catch"](function() {
				a.logger.clientLog([e,
					{
						evt: "transition_name",
						data: "process_error_XHR",
						instrument: !0
					}, {
						evt: "WEBAUTH_N_CLIENT",
						data: "BIND_FAIL_XHR_OVERLAY_" + a.utils.getIntent().toUpperCase(),
						calEvent: !0,
						status: "ERROR"
					}
				], function() {
					return c()
				})
			})
		}

		function f(a) {
			if ("oneTouch" === $("body").data("overlay-variant")) return e(a);
			if ("webAuthn" === $("body").data("overlay-variant")) return b(a)
		}

		function c() {
			a.logger.log({
				evt: "actiontype",
				data: "close_button",
				instrument: !0
			});
			a.logger.log({
				evt: "flow_type",
				data: $("body").data("overlay-variant").toLowerCase(),
				instrument: !0
			});
			a.logger.log({
				evt: "state_name",
				data: "overlay",
				instrument: !0
			});
			a.logger.log({
				evt: "transition_name",
				data: "process_overlay",
				instrument: !0
			});
			a.logger.log({
				evt: g(),
				data: "CLICK_CLOSE_BUTTON_OVERLAY_" + a.utils.getIntent().toUpperCase(),
				calEvent: !0
			});
			a.logger.pushLogs();
			var b = $("body").data("return-url"),
				c = document.getElementById("overlayContainer"),
				d = document.getElementById("overlayMask");
			$(c).removeClass("overlaySlideDown");
			$(c).addClass("overlaySlideUp");
			setTimeout(function() {
				return $(d).addClass("hide"),
					window.location.href = b || "/signin"
			}, 250)
		}

		function d() {
			var a = document.getElementById("overlayContainer"),
				b = document.getElementById("overlayMask");
			$(a).removeClass("overlaySlideDown");
			$(a).addClass("overlaySlideUp");
			setTimeout(function() {
				$(b).addClass("hide")
			}, 250)
		}

		function h() {
			y(event);
			clearTimeout(n);
			var a = document.getElementById("overlayExpandDetails"),
				b = document.getElementById("overlayCollapseDetails"),
				c = document.getElementById("overlayDetails");
			$(a).toggle();
			$(b).toggle();
			$(c).hasClass("overlaySlideUp") ?
				($(c).removeClass("overlaySlideUp"), $(c).addClass("overlaySlideDown")) : ($(c).removeClass("overlaySlideDown"), $(c).addClass("overlaySlideUp"))
		}

		function g() {
			switch ($("body").data("overlay-variant") || "unknown") {
				case "webAuthn":
					var a = "WEBAUTH_N_CLIENT";
					break;
				case "oneTouch":
					a = "ONETOUCH";
					break;
				default:
					a = "UNIFIED_LOGIN"
			}
			return a
		}
		var n;
		return {
			showOverlay: function(b) {
				var d = document.getElementById("overlayOptIn"),
					e = document.getElementById("overlayExpandDetails"),
					l = document.getElementById("overlayCollapseDetails"),
					k = document.getElementById("overlayClose"),
					m = $("body").data("return-url");
				b = b && b.closeOverlayTimeoutValue;
				d.onclick = f;
				k.onclick = c;
				e.onclick = h;
				l.onclick = h;
				if (!d.onclick || !k.onclick) return window.location.href = m || "/signin";
				d = document.getElementById("email");
				e = document.getElementById("password");
				d && d.blur();
				e && e.blur();
				d = document.getElementById("overlayContainer");
				e = document.getElementById("overlayMask");
				$(e).removeClass("hide");
				$(d).removeClass("overlaySlideUp");
				$(d).addClass("overlaySlideDown");
				a.logger.log({
					evt: "flow_type",
					data: $("body").data("overlay-variant").toLowerCase(),
					instrument: !0
				});
				a.logger.log({
					evt: "state_name",
					data: "overlay",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "prepare_overlay",
					instrument: !0
				});
				a.logger.log({
					evt: g(),
					data: "SHOWN_SUCCESSFULLY_OVERLAY_" + a.utils.getIntent().toUpperCase(),
					calEvent: !0
				});
				a.logger.pushLogs();
				k.focus();
				b && (n = setTimeout(function() {
					a.logger.log({
						evt: "flow_type",
						data: $("body").data("overlay-variant").toLowerCase(),
						instrument: !0
					});
					a.logger.log({
						evt: "state_name",
						data: "overlay",
						instrument: !0
					});
					a.logger.log({
						evt: "transition_name",
						data: "timeout_close_overlay",
						instrument: !0
					});
					a.logger.log({
						evt: g(),
						data: "TIMEOUT_CLOSE_OVERLAY_AND_REDIRECT_" + a.utils.getIntent().toUpperCase(),
						calEvent: !0
					});
					a.logger.pushLogs();
					var b = document.getElementById("overlayContainer"),
						c = document.getElementById("overlayMask");
					$(b).removeClass("overlaySlideDown");
					$(b).addClass("overlaySlideUp");
					setTimeout(function() {
						return $(c).addClass("hide"), window.location.href = m || "/signin"
					}, 250)
				}, b))
			},
			isEligibleToShowOverlay: function(b) {
				var c =
					$("body").data("overlay-variant") || "unknown",
					d = "oneTouch" === c && b && b.oneTouchOverlayPostOptinEligible;
				b = "webAuthn" === c && b && b.webAuthnOverlayPostOptinEligible;
				c = !!document.getElementById("overlay");
				return (d || b) && !c && (a.logger.log({
					evt: g(),
					data: "NOT_SHOWN_SINCE_TEMPLATE_NOT_LOADED_OVERLAY_" + a.utils.getIntent().toUpperCase(),
					calEvent: !0
				}), a.logger.pushLogs()), (d || b) && c
			},
			isLoginXHREligbleForOverlay: function() {
				var b = $("body").data("overlay-variant") || "unknown";
				return "webAuthn" === b || "oneTouch" === b ? (a.logger.log({
					evt: g(),
					data: "XHR_LOGIN_ELIGIBLE_OVERLAY_" + a.utils.getIntent().toUpperCase(),
					calEvent: !0
				}), a.logger.pushLogs(), !0) : !1
			}
		}
	}();
	a.core = function() {
		return function() {
			function e(b) {
				var c = C(b);
				ua && b && c && ($(c).hasClass("moreOptionsInfo") ? (y(b), $(ua).hasClass("hide") && (a.logger.log({
					evt: "state_name",
					data: da ? "begin_hybrid_pwd" : "begin_pwd",
					instrument: !0
				}), a.logger.log({
					evt: "transition_name",
					data: da ? "process_hybrid_pwd_more_opt" : "process_pwd_more_opt",
					instrument: !0
				}), a.logger.log({
					evt: "TPD_CLIENT",
					data: "CLICKED_MORE_OPTIONS",
					calEvent: !0
				}), a.logger.pushLogs()), $(ua).removeClass("hide")) : $(ua).addClass("hide"))
			}

			function b(a) {
				var b = C(a);
				Ja && a && b && $(Ja).addClass("hide")
			}

			function f(b) {
				if (!L || "inputPassword" !== L.value || ea) {
					var c = L && "inputEmail" === L.value;
					!ea && c && "phone" === H && (H = "email");
					a.utils.doesItLookLikeEmail(b) ? "email" !== H && (!ea && L.setAttribute("value", "inputEmail"), H = "email", $(ia) && $(ia).addClass("hide"), $(t.container).removeClass("phoneInputWrapper")) : (A.field.value = b, "phone" !== H && (!ea && L.setAttribute("value", "inputPhone"),
						H = "phone", $(ia).removeClass("hide"), $(t.container).addClass("phoneInputWrapper")))
				}
			}

			function c(b) {
				b = C(b);
				var c = t.field && "true" === $(t.field).attr("data-hybrid-in-email-only-mode");
				c && "email" !== H && (H = "email");
				b && !c && (a.pubsub.publish("CLEAR_OTP_LOGIN_CONTEXT"), f(b.value))
			}

			function d(a) {
				if (a && "string" == typeof a) return a.replace(Ea, "")
			}

			function h(a) {
				return a.field ? d(a.field.value) ? !0 : (k(a), m(a), !1) : !0
			}

			function g(a) {
				var b = a && a.field && a.field.value;
				a && a.field && !a.field.hasAttribute("disabled") ? b ? (b = b &&
					b.replace(Ka, ""), !b || b.match($a) ? (k(a), r(a), $(a.errMsg).addClass("hide"), a = !1) : a = !0) : a = (k(a), m(a), u(a), !1) : a = !0;
				return a
			}

			function n(a) {
				var b = a && a.field && d(a.field.value);
				return a && a.field && a.field.hasAttribute("disabled") ? !0 : b ? b === La ? !0 : b && b.match(ab) ? (k(a), r(a), !1) : !0 : (k(a), m(a), !1)
			}

			function l(b, c) {
				var d, e, qa = !0,
					f = a.utils.getActivespoxElement(L);
				return d = h(b), d ? (e = h(c), e ? (f && f.field && (qa = h(f)), qa ? !0 : !1) : !1) : !1
			}

			function v(a) {
				if ("inputEmail" === a.value) return document.querySelector("#rememberProfileEmail");
				if ("inputPassword" === a.value) return document.querySelector("#rememberProfilePassword")
			}

			function x(a) {
				var b = a.field.value.replace(Ea, "");
				return b === La ? !0 : b.match(Ma) || a.field.hasAttribute("disabled") ? !0 : (k(a), r(a), !1)
			}

			function k(a) {
				$(a.container).addClass("hasError");
				a.container.style["z-index"] = 100;
				$(a.errMsgContainer).addClass("show");
				a.field.focus()
			}

			function m(a) {
				$(a.errMsg).removeClass("hide")
			}

			function r(a) {
				$(a.invalidMsg).removeClass("hide")
			}

			function w(a, b) {
				b && $(a.container).removeClass("hasError");
				a.container.style["z-index"] = 1;
				$(a.errMsgContainer).removeClass("show")
			}

			function u(a) {
				$(a.invalidMsg).addClass("hide")
			}

			function q() {
				var a = /&passwordRecoveryByPhoneEnabled=true/;
				if (fa)
					for (var b = 0; b < fa.length; b++) {
						var c = fa[b].getAttribute("href").replace(a, "");
						fa[b].setAttribute("href", c)
					}
				ka && ka.setAttribute("data-src", ka.getAttribute("data-src").replace(a, ""))
			}

			function F() {
				var a = document.querySelector('input[name="splitLoginContext"]'),
					b = document.querySelector('input[name="splitLoginCookiedFallback"]');
				$(va).removeClass("hide");
				$(wa).addClass("hide");
				la && $(la).addClass("hide");
				t.field && t.field.removeAttribute("disabled");
				G.field && G.field.removeAttribute("disabled");
				P.field && P.field.setAttribute("disabled", "disabled");
				A.field && A.field.setAttribute("disabled", "disabled");
				J.field && J.field.setAttribute("disabled", "disabled");
				xa || $(ja).removeClass("hide");
				ya && $(ya).addClass("hide");
				$(za).removeClass("phonePresent");
				H = "email";
				a && (ha && $(ha).removeClass("hide"), a.value = "inputEmail", b && (a.value = "inputPassword"))
			}

			function ba() {
				var a = document.querySelector('input[name="splitLoginContext"]');
				$(wa).removeClass("hide");
				$(va).addClass("hide");
				la && !$(bb).hasClass("hide") && $(la).removeClass("hide");
				P.field && P.field.removeAttribute("disabled");
				A.field && A.field.removeAttribute("disabled");
				J.field && J.field.removeAttribute("disabled");
				t.field && t.field.setAttribute("disabled", "disabled");
				G.field && G.field.setAttribute("disabled", "disabled");
				$(ja).addClass("hide");
				$(za).addClass("phonePresent");
				Aa && $(Aa).addClass("hide");
				H = "phone";
				ha && $(ha).addClass("hide");
				a && !xa && (a.value = "inputPassword" === a.value ? "inputPin" : "inputPhone")
			}

			function E() {
				var a, b = P.container.querySelector(".countryCode"),
					c = P.container.querySelector(".phoneCode");
				var d = P.field;
				d = (a = d.options[d.selectedIndex].value.split(" ")) && (a[0] || "");
				a = a && (a[1] || "");
				$(b).text(d);
				$(c).text(a)
			}

			function z() {
				a.logger.log({
					evt: "state_name",
					data: "begin_hybrid_login",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "click_change_country_code",
					instrument: !0
				});
				a.logger.pushLogs()
			}

			function D(b) {
				y(b);
				b = document.querySelector('input[name="splitLoginContext"]');
				var c = document.querySelector(".countryPhoneSelectWrapper");
				$(wa).removeClass("hide");
				$(va).addClass("hide");
				$(Aa).addClass("hide");
				$(ya).removeClass("hide");
				w(t, !0);
				P.field && P.field.removeAttribute("disabled");
				A.field && A.field.removeAttribute("disabled");
				A.field.focus();
				ha && $(ha).addClass("hide");
				Ba && $(Ba).removeClass("hide");
				t.field && (t.field.value = "");
				a.view.updateNotificationView({});
				t.field && t.field.setAttribute("disabled",
					"disabled");
				b.value = "inputPhone";
				a.logger.log({
					evt: "state_name",
					data: "begin_email",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "prepare_phone",
					instrument: !0
				});
				a.logger.pushLogs();
				a.logger.log({
					evt: "state_name",
					data: "begin_phone",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "prepare_phone",
					instrument: !0
				});
				a.logger.pushLogs();
				Ca ? (J.field && J.field.removeAttribute("disabled"), G.field && G.field.setAttribute("disabled", "disabled"), H = "phone", $(za).addClass("phonePresent"), $(ja).addClass("hide")) :
					(G.field && G.field.removeAttribute("disabled"), J.field && J.field.setAttribute("disabled", "disabled"), H = "phonePassword", c && $(c).removeClass("hide"))
			}

			function ta(b) {
				y(b);
				b = document.querySelector('input[name="splitLoginContext"]');
				$(va).removeClass("hide");
				$(wa).addClass("hide");
				$(ya).addClass("hide");
				$(Aa).removeClass("hide");
				la && $(la).addClass("hide");
				w(A, !0);
				t.field && t.field.removeAttribute("disabled");
				G.field && G.field.removeAttribute("disabled");
				t.field.focus();
				P.field && P.field.setAttribute("disabled",
					"disabled");
				A.field && A.field.setAttribute("disabled", "disabled");
				J.field && J.field.setAttribute("disabled", "disabled");
				Ba && $(Ba).addClass("hide");
				ha && $(ha).removeClass("hide");
				$(za).removeClass("phonePresent");
				H = "email";
				b.value = "inputEmail";
				a.logger.log({
					evt: "state_name",
					data: "begin_phone",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "prepare_email",
					instrument: !0
				});
				a.logger.pushLogs();
				a.logger.log({
					evt: "state_name",
					data: "begin_email",
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "prepare_email",
					instrument: !0
				});
				a.logger.pushLogs()
			}

			function B(b, c) {
				y(b);
				q();
				H = "email";
				a.utils.notYouClickHandler(b, function() {
					a.logger.log({
						evt: "state_name",
						data: "begin_phone_pwd",
						instrument: !0
					});
					a.logger.log({
						evt: "transition_name",
						data: "prepare_email",
						instrument: !0
					});
					a.logger.pushLogs();
					a.logger.log({
						evt: "state_name",
						data: "begin_email",
						instrument: !0
					});
					a.logger.log({
						evt: "transition_name",
						data: "prepare_email",
						instrument: !0
					});
					a.logger.pushLogs();
					"function" == typeof c && c()
				})
			}

			function Q(b) {
				var c =
					"true" === $("body").data("enableSuppressAutoSubmit"),
					d = Date.now() - window.formAutofilledAt,
					e = parseInt($("body").data("suppressAutosubmitTime")) >= d,
					f = document.querySelector('input[name="isKeychainActivationWithEmailTokenOn8ball"]');
				if (c && d && (a.logger.log({
						evt: "AUTOSUBMIT",
						data: "PREPARE_SUPPRESS_" + d,
						calEvent: !0
					}), a.logger.pushLogs(), e)) {
					y(b);
					delete window.formAutofilledAt;
					return
				}
				d = document.querySelector("input[name=splitLoginContext]");
				c = document.querySelector("input[name=splitLoginCookiedFallback]");
				d = d && d.value || "";
				if (c || f) S(b);
				else if ("inputEmail" === d || "inputPhone" === d || a.utils.isPrefilledEmailNext() || a.utils.isPrefillEmailEnabled()) {
					var l, q = a.utils.getSplitLoginContext();
					if (a.utils.isPrefillEmailEnabled() && "inputEmail" !== q.value && a.utils.isTpdDemo()) y(b), a.tpdLogin && a.tpdLogin.attemptTpdLogin("autoSend");
					else {
						da ? ("phone" === H && t.field && O(t.field.value), l = "email" === H ? n(t) : g(t)) : l = "email" === H ? n(t) : g(A);
						f = document.querySelectorAll("form[name=login] input");
						c = {};
						d = a.utils.getActivespoxElement(L);
						e = v(L);
						var qa = $("body").data("splitPasswordClientTransition"),
							V = document.querySelector("#phoneCode");
						ma = !0;
						y(b);
						l && $(t.field).hasClass("validate") && "inputEmail" === q && (l = x(t));
						l && d && d.field && (l = h(d));
						l && ("inputEmail" === q || "inputPhone" === q) && (a.logger.log({
							evt: "state_name",
							data: a.logger.getStateName(),
							instrument: !0
						}), a.logger.log({
							evt: "transition_name",
							data: "process_next",
							instrument: !0
						}), a.logger.pushLogs());
						if (l) {
							a.utils.showSpinner();
							a.fn.addFnSyncData();
							if ("phonePassword" === H || "phone" === H) {
								if (fa)
									for (q =
										0; q < fa.length; q++) l = fa[q].getAttribute("href") + "&passwordRecoveryByPhoneEnabled=true", fa[q].setAttribute("href", l);
								ka && ka.setAttribute("data-src", ka.getAttribute("data-src") + "&passwordRecoveryByPhoneEnabled=true")
							}
							Na && $(Na).text("");
							if (!qa || "phone" !== H && "phonePassword" !== H)
								if (qa && "email" === H) a.storeInstance.updateModel({
									splitLoginContext: "inputPassword",
									profile: {
										email: t && t.field && t.field.value
									},
									rememberProfile: e && e.checked
								}), a.utils.hideSpinner(), a.utils.setSliderToPasswordContainer();
								else {
									for (l =
										0; l < f.length; l++) c[f[l].name] = f[l].value;
									delete c.login_password;
									delete c.login_pin;
									"inputPhone" === c.splitLoginContext && V && (c.phoneCode = V.value, delete c.login_email);
									"inputEmail" === c.splitLoginContext && (delete c.login_phone, delete c.phoneCode);
									da && ("inputPassword" === c.splitLoginContext && c.login_phone && (c.phoneCode = V.value), "inputPhone" === c.splitLoginContext && t.field ? (t.field.setAttribute("disabled", "disabled"), t.field.value = "") : "inputEmail" === c.splitLoginContext && A.field && (A.field.setAttribute("disabled",
										"disabled"), A.field.value = ""));
									d && d.field && (c.spox = d.field.value);
									e && (c.rememberProfile = e.checked);
									a.utils.isInContextIntegration() && (c.isInContextCheckout = !0);
									C(b);
									$.ajax({
										url: na.getAttribute("action"),
										data: c,
										success: a.utils.successfulXhrHandler,
										fail: a.utils.failedXhrSubmitHandler
									})
								}
							else l = (b = document.querySelector("#phone")) && b.value.replace(Ka, ""), f = (f = document.querySelector("#phoneCode")) && f.value.replace(/[A-Z\s]/ig, ""), b.value = l, a.storeInstance.updateModel({
								splitLoginContext: Ca ? "inputPin" : "inputPassword",
								profile: {
									phone: l,
									phoneCode: f
								}
							}), a.logger.log({
								evt: "state_name",
								data: "begin_phone",
								instrument: !0
							}), a.logger.log({
								evt: "transition_name",
								data: Ca ? "prepare_pin" : "prepare_pwd",
								instrument: !0
							}), a.logger.pushLogs(), a.utils.hideSpinner(), a.utils.setSliderToPasswordContainer()
						}
					}
				} else S(b)
			}

			function O(a) {
				if (P) {
					var b = P.container.querySelector(".phoneCode");
					b = b && $(b).text();
					a = 0 === a.lastIndexOf(b, 0) ? a.substr(b.length) : a
				}
				A.field.value = a;
				t.field.value = a
			}

			function N() {
				var a = document.querySelector('input[name="splitLoginCookiedFallback"]'),
					b = document.querySelector("#phone"),
					c = document.querySelector("#email"),
					d = document.querySelector(".profileDisplayEmail");
				(d = d && d.innerHTML) && !a && c && b && (c.hasAttribute("disabled") && !b.hasAttribute("disabled") ? (b.value = d, c.value = "") : !c.hasAttribute("disabled") && b.hasAttribute("disabled") && (c.value = d, b.value = ""))
			}

			function R() {
				var b = document.querySelector("form[name=login]"),
					c = document.querySelector("#password");
				document.querySelector("#btnLogin");
				c.matches(":-webkit-autofill") && Object.prototype.hasOwnProperty.call(window,
					"getComputedStyle") && (c = (window.getComputedStyle(c).backgroundColor.match(/[0-5]{1,3}/g) || []).join(","), a.utils.addHiddenElement("passwordFieldAutofillColor", c, b))
			}

			function Z(a, b, c, d) {
				b = document.querySelector(".profileDisplayPhoneCode");
				c = (c = document.querySelector("#keepMeLoggedIn")) && c.checked;
				for (var e = document.querySelector("#phoneCode"), f = {}, h = 0; h < a.length; h++) f[a[h].name] = a[h].value;
				return c ? f.rememberMe = "true" : delete f.rememberMe, "inputPassword" === f.splitLoginContext && f.login_phone && e && (f.phoneCode =
					e.value, delete f.login_email), "inputPassword" === f.splitLoginContext && !f.login_phone && b && "" === b.textContent && (delete f.login_phone, delete f.phoneCode), d && "inputPassword" === f.splitLoginContext && f.login_phone && b && "" !== b.textContent && (f.phoneCode = b.textContent), f
			}

			function K(b) {
				b = b || {};
				var c = document.querySelector("#keychain-interstitial"),
					d = document.querySelector("#content"),
					e = b.isSuaRequired,
					f = b.isKeychainOptinRequired,
					h = b.returnUrl || "/signin";
				ra && ra.removeAttribute("disabled");
				h && document.body.setAttribute("data-return-url",
					h);
				if (a.overlayUtils.isEligibleToShowOverlay(b) && (!b.notifications || !b.notifications.msg)) return a.logger.log({
					evt: oa,
					data: "XHR_LOGIN_SUCCESS",
					calEvent: !0
				}), a.logger.pushLogs(), a.overlayUtils.showOverlay(b);
				if (e && h) return a.utils.hideSpinner(), a.utils.hideSpinnerMessage(), a.logger.log({
					evt: oa,
					data: "XHR_LOGIN_SUCCESS",
					calEvent: !0
				}), a.logger.pushLogs(), a.sua(b);
				if (f && h) return a.utils.hideSpinner(), a.utils.hideSpinnerMessage(), c && $(c).removeClass("hide"), d && $(d).addClass("hide"), a.logger.log({
					evt: oa,
					data: "XHR_LOGIN_SUCCESS",
					calEvent: !0
				}), a.logger.pushLogs(), a.keychain(b);
				if (h && !b.notifications) return a.logger.log({
					evt: oa,
					data: "XHR_LOGIN_SUCCESS",
					calEvent: !0
				}), a.logger.pushLogs(), window.location.href = h;
				a.utils.hideSpinner();
				a.utils.hideSpinnerMessage();
				b.notifications && b.notifications.msg && (c = document.querySelector(".notifications"), d = document.createElement("p"), d.innerHTML = b.notifications.msg, d.className += "notification " + (b.notifications.type || ""), d.setAttribute("role", "alert"), c.innerHTML = "",
					c.appendChild(d));
				return G.field && (G.field.value = ""), a.logger.log({
					evt: oa,
					data: "XHR_LOGIN_FAILURE",
					calEvent: !0
				}), a.otp && a.otp.initiate(), a.logger.pushLogs()
			}

			function W() {
				a.utils.hideSpinner();
				a.utils.hideSpinnerMessage();
				ra && ra.removeAttribute("disabled");
				G.field && (G.field.value = "");
				a.logger.log({
					evt: oa,
					data: "XHR_FAILED",
					calEvent: !0
				});
				a.logger.pushLogs();
				a.utils.failedXhrSubmitHandler()
			}

			function M(b) {
				b = b || {};
				b._csrf = document.querySelector("#token").value;
				a.utils.showSpinner();
				$.ajax({
					type: "POST",
					url: "/signin",
					data: b,
					dataType: "json",
					success: function(b) {
						return b ? (a.utils.setCSRFToken(b._csrf), K(b)) : W()
					},
					fail: function(a) {
						return W(a)
					}
				})
			}

			function X() {
				var b = (a.utils.parseJsonSafe($("body").data("keychainFlagsJson")) || {}).isEligibleForXhrLogin,
					c = document.querySelector('input[name="isKeychainActivationWithEmailTokenOn8ball"]');
				return a.utils.isCookieDisabledBrowser() ? !1 : a.overlayUtils.isLoginXHREligbleForOverlay() ? !0 : b && !c
			}

			function S(b) {
				function c() {
					var a = L && L.value;
					A.field && (ea ? d = g(t) && G.field &&
						l(A, G) : "inputPassword" === a ? d = G.field && l(A, G) : d = J.field && l(A, J))
				}
				var d, e = document.querySelector(".profileRememberedEmail"),
					f = $("body").data("isTrackPasswordFieldAutofillEnabled"),
					h = document.querySelector(".transitioning"),
					q = document.querySelectorAll("form[name=login] input") || {},
					V = a.utils.getActivespoxElement(L),
					k = v(L);
				ea && "phone" === H && t.field ? O(t.field.value) : N();
				ma = !0;
				"email" === H ? (d = n(t) && l(t, G), !e && d && $(t.field).hasClass("validate") && (d = x(t))) : c();
				f && R();
				if (d) {
					ea && ("email" === H ? A && A.field && A.field.setAttribute("disabled",
						"disabled") : t && t.field && t.field.setAttribute("disabled", "disabled"));
					a.utils.showSpinner();
					a.utils.showSpinnerMessage();
					a.fn.addFnSyncData();
					y(b);
					if (X()) return a.logger.log({
						evt: "login_type",
						data: "xhr",
						instrument: !0
					}), a.logger.log({
						evt: Fa,
						data: "LOGIN_TYPE_XHR",
						calEvent: !0
					}), a.logger.pushLogs(), $(h).addClass("nonTransparentMask"), a.utils.showSpinnerMessage("checkingInfo"), b = Z(q, V && V.field ? V.field.value : null, k ? k.checked : null, da), M(b);
					a.logger.log({
						evt: "login_type",
						data: "form_submit",
						instrument: !0
					});
					a.logger.log({
						evt: Fa,
						data: "LOGIN_TYPE_FORM_SUBMIT",
						calEvent: !0
					});
					a.logger.pushLogs();
					na && na.submit();
					setTimeout(function() {
						ra.setAttribute("disabled", "disabled")
					}, 10)
				} else y(b)
			}

			function T(a) {
				if (!ma) return !1;
				var b = a.field.value.replace(Ea, "");
				"" === b ? (m(a), "email" === a.type && u(a)) : ($(a.errMsg).addClass("hide"), "email" === a.type && $(a.field).hasClass("validate") ? b.match(Ma) ? (u(a), w(a, !0)) : (k(a), r(a)) : w(a, !0))
			}

			function ca(a) {
				ma = !1;
				w(a)
			}

			function V(a) {
				$(a.container).hasClass("hasError") ? ma = !0 : ma = !1
			}

			function Wa(b) {
				var c =
					a.utils.getActivespoxElement(L),
					d = c.audioTag;
				if (!d.canPlayType || !d.canPlayType("audio/mpeg").replace(/no/, "")) return !0;
				y(b);
				c.field.focus();
				d.play()
			}

			function Xa(b) {
				var c = a.utils.getActivespoxElement(L);
				y(b);
				pa(b);
				$.ajax({
					type: "POST",
					url: "/signin/refreshspox",
					data: {
						_csrf: document.querySelector("#token").value
					},
					dataType: "json",
					success: function(a) {
						a && a.spox && (c.image.setAttribute("src", a.spox.spoxImgUrl), c.audioTag.setAttribute("src", a.spox.spoxAudioUrl), c.playAudioBtn.setAttribute("href",
							a.spox.spoxAudioUrl), c.field.value = "", $("body").hasClass("desktop") && c.field.focus())
					}
				})
			}

			function Ya(a) {
				var b = C(a);
				b && setTimeout(function() {
					$(b).hasClass("scTrack:unifiedlogin-rememberme-profile-opt-in") ? ($(b).removeClass("scTrack:unifiedlogin-rememberme-profile-opt-in"), $(b).addClass("scTrack:unifiedlogin-rememberme-profile-opt-out")) : ($(b).removeClass("scTrack:unifiedlogin-rememberme-profile-opt-out"), $(b).addClass("scTrack:unifiedlogin-rememberme-profile-opt-in"))
				}, 10)
			}

			function Za(a) {
				a = C(a);
				if (a && "iconCloseEducation" === a.id && (a = document.querySelector(".educationMessage"))) {
					var b = document.querySelector(".contentContainer");
					$(a).addClass("hide");
					b && $(b).removeClass("contentContainerShort");
					a = document.createElement("input");
					a.setAttribute("type", "hidden");
					a.setAttribute("name", "removeEducationMsg");
					a.setAttribute("value", "true");
					$(na).append(a)
				}
			}

			function Ha(b) {
				var c = "email" === H ? n(t) : g(A),
					d = C(b);
				y(b);
				a.tpdLogin && a.tpdLogin.instrumentTpdLoginClicked(d.id);
				document.body.setAttribute("data-tpd-survey-enabled",
					!1);
				c && $(t.field).hasClass("validate") && (c = x(t));
				c && a.tpdLogin && a.tpdLogin.attemptTpdLogin(d.id)
			}

			function Ia(b) {
				q();
				H = "email";
				a.utils.notYouClickHandler(b);
				t.container && w(t, !0);
				G.container && w(G, !0);
				A.container && w(A, !0);
				J.container && w(J, !0)
			}
			var Fa = "UNIFIED_LOGIN",
				oa = "XHR_LOGIN",
				Na = document.querySelector("#notifications"),
				aa = document.querySelector('input[name="splitLoginCookiedFallback"]'),
				t = {
					container: document.querySelector("#login_emaildiv"),
					field: document.querySelector("#email"),
					label: document.querySelector('label[for="email"]'),
					errMsgContainer: document.querySelector("#emailErrorMessage"),
					errMsg: document.querySelector("#emailErrorMessage .emptyError"),
					invalidMsg: document.querySelector("#emailErrorMessage .invalidError"),
					phoneEmailToggleIcon: document.querySelector("#login_emaildiv .icon"),
					type: "email"
				},
				Y = document.querySelector(".textInputMask.email"),
				G = {
					container: document.querySelector("#login_passworddiv"),
					field: document.querySelector("#password"),
					errMsgContainer: document.querySelector("#passwordErrorMessage"),
					errMsg: document.querySelector("#passwordErrorMessage .emptyError")
				},
				P = {
					container: document.querySelector("#pinSection") || document.querySelector(".splitPhoneSection"),
					field: document.querySelector("#phoneCode")
				},
				A = {
					container: document.querySelector("#login_phonediv"),
					field: document.querySelector("#phone"),
					errMsgContainer: document.querySelector("#phoneErrorMessage"),
					errMsg: document.querySelector("#phoneErrorMessage .emptyError"),
					invalidMsg: document.querySelector("#phoneErrorMessage .invalidError")
				},
				J = {
					container: document.querySelector("#login_pindiv"),
					field: document.querySelector("#pin"),
					errMsgContainer: document.querySelector("#pinErrorMessage"),
					errMsg: document.querySelector("#pinErrorMessage .emptyError")
				},
				L = document.querySelector("input[name=splitLoginContext]"),
				na = document.querySelector(".proceed");
			document.querySelector("#btnNext");
			var ra = document.querySelector("#btnLogin"),
				za = document.querySelector(".actions"),
				va = document.querySelector("#splitEmailSection") || document.querySelector("#passwordSection"),
				wa = document.querySelector("#splitPhoneSection") || document.querySelector("#pinSection"),
				bb = document.querySelector("#splitPassword") || document.querySelector("#splitPinSection") || document.querySelector("#pinSection"),
				Da = document.querySelector(".email"),
				Oa = document.querySelector(".phone"),
				Aa = document.querySelector("#loginWithPhoneOption"),
				Pa = document.querySelector("#switchToPhone"),
				ya = document.querySelector("#loginWithEmailOption"),
				Qa = document.querySelector("#switchToEmail"),
				ia = document.querySelector(".countryPhoneSelectWrapper"),
				Ra = document.querySelector("#emailPageSwitch"),
				la = document.querySelector(".educationMessage"),
				ha = document.querySelector("#emailSubTagLine"),
				Ba = document.querySelector("#phoneSubTagLine"),
				ja = document.querySelector(".forgotLink"),
				fa = ja && ja.querySelectorAll(".pwrLink"),
				ka = ja && ja.querySelector("#pwdIframe"),
				Sa = document.querySelector("#moreOptionsMobile"),
				ua = document.querySelector("#moreOptionsDropDown"),
				Ta = document.querySelector("#tpdButton"),
				da = a.utils.isHybridLoginExperience(),
				ea = a.utils.isHybridEditableOnCookied(),
				Ja = document.querySelector("#tpdDemo");
			document.querySelector('input[name="ctxId"]');
			var sa = document.querySelector(".keepMeLogin");
			a.utils.isCookieDisabledBrowser() && sa && $(sa).addClass("hide");
			da && (p(t.field, "input", c), p(t.field, "change", c));
			ea && f(t.field.value);
			a.pubsub && (a.pubsub.subscribe("WINDOW_CLICK", e), a.pubsub.subscribe("WINDOW_CLICK", b));
			var Ga = document.querySelector("#createAccount");
			Ga && (Ga.onclick = function(b) {
				var c = a.logger.getStateName();
				a.utils.getOutboundLinksHandler(Ga, c, "process_signup")(b)
			});
			sa = document.querySelector("#backToInputEmailLink");
			var Ua = document.querySelector("#backToEmailPasswordLink"),
				Va = document.querySelector("#rememberProfileEmail"),
				Ea = /^\s+|\s+$/,
				Ma = /^\S+@\S+\.\S+$/,
				$a = /[^\d]+/g,
				ab = /\s/g,
				La = "spox One Touch\u2122",
				Ka = /[-().\s]/ig,
				ma = !1;
			document.querySelector("form[name=smartlockForm]");
			document.querySelector("#secondaryLoginBtn");
			var xa = $("body").data("phonePasswordEnabled"),
				Ca = $("body").data("phonePinEnabled"),
				H = function() {
					var a = A.field && A.field.value;
					return A.field && "hidden" !== $(A.field).attr("type") && (t.field && t.field.hasAttribute("disabled") || L && "inputPhone" === L.value) ? Ca ?
						"phone" : "phonePassword" : L && "inputPin" === L.value || a ? "phone" : "email"
				}();
			t.field && (t.field.onkeyup = T.bind(null, t), t.field.onblur = ca.bind(null, t), t.field.onfocus = V.bind(null, t));
			G.field && (G.field.onkeyup = T.bind(null, G), G.field.onblur = ca.bind(null, G), G.field.onfocus = V.bind(null, G));
			A.field && (A.field.onkeyup = T.bind(null, A), A.field.onblur = ca.bind(null, A), A.field.onfocus = V.bind(null, A));
			J.field && (J.field.onkeyup = T.bind(null, J), J.field.onblur = ca.bind(null, J), J.field.onfocus = V.bind(null, J));
			P && P.field && (P.field.onchange =
				E, da && (P.field.onclick = z));
			(function() {
				for (var b = document.querySelectorAll(".spox-container"), c = 0; c < b.length; c++) {
					var d = a.utils.getspoxDom(b[c]);
					d.playAudioBtn.onclick = Wa;
					d.refreshspoxBtn.onclick = Xa;
					d.field.onkeyup = T.bind(null, d);
					d.field.onblur = ca.bind(null, d);
					d.field.onfocus = V.bind(null, d)
				}
			})();
			Da && Oa ? (Da.onclick = F, Oa.onclick = ba) : Da && (Da.onclick = B);
			xa && Pa && (Pa.onclick = D);
			xa && Qa && (Qa.onclick = ta);
			p(ia, "focusin", function(a) {
				$(ia).addClass("focus")
			});
			p(ia, "focusout", function(a) {
				$(ia).removeClass("focus")
			});
			Ra && p(Ra, "click", function(a) {
				var b = document.querySelector("input[name=forcePhonePasswordOptIn]");
				y(a);
				B(a, function() {
					b.value = "true"
				})
			});
			p(na, "keydown", function(a) {
				var b = C(a);
				a && (a.key ? "Enter" === a.key : a.which ? 13 === a.which : 13 === a.keyCode) && !b.href && !$(b).hasClass("show-hide-password") && Q(a)
			});
			p(na, "submit", Q);
			Sa && p(Sa, "click", Ha);
			Ta && p(Ta, "click", Ha);
			sa && p(sa, "click", function(b) {
				Ia(b);
				da && (A.field.value = null, t.field.value = null, Y && $(Y).addClass("hide"), b = (b = a.storeInstance.getState().model) && b.contextualLogin &&
					b.contextualLogin.content && b.contextualLogin.content.emailOrPhoneLabel, $(t.field).attr("placeholder", b), $(t.label).text(b), t.field.removeAttribute("data-hybrid-in-email-only-mode"))
			});
			Ua && p(Ua, "click", function(a) {
				a.preventDefault();
				aa ? F() : Ia(a)
			});
			Va && (Va.onclick = Ya);
			a.pubsub && a.pubsub.subscribe("WINDOW_CLICK", Za)
		}
	}();
	a.oneTouchLogin = function() {
		function e() {
			var a = [],
				b = document.querySelector('input[name="locale.x"]');
			a.push({
				evt: "state_name",
				data: "Login_UL_RM",
				instrument: !0
			});
			a.push({
				evt: "transition_name",
				data: "prepare_login_UL_RM",
				instrument: !0
			});
			a.push({
				evt: "design",
				data: f.isInContextIntegration() ? "in-context" : "full-context",
				instrument: !0
			});
			b && a.push({
				evt: "page_lang",
				data: b.value,
				instrument: !0
			});
			a.push({
				evt: g,
				data: "PREPARE_PAGE_" + n.toUpperCase(),
				calEvent: !0
			});
			d.clientLog(a, null)
		}

		function b() {
			var b = document.querySelectorAll("form[name=login] input[type=hidden]"),
				d = document.querySelector("input[name=login_email]"),
				h = document.querySelector("input[name=login_password]"),
				g = $("body").data("oneTouchUser"),
				n = $("body").data("oneTouchTenant"),
				k = a.utils.getIntent(),
				w = $("body").data("cookieBannerEnabled");
			$("body").data("isKeychainOptinRequired");
			for (var p = {
					_csrf: 1,
					intent: 1,
					flowId: 1,
					ctxId: 1,
					returnUri: 1,
					state: 1,
					"locale.x": 1
				}, q = {}, F = 0; F < b.length; F++) p[b[F].name] && (q[b[F].name] = b[F].value);
			q.intent && ("prox" === k || q.returnUri) && g ? (q.otLoginIntent = q.intent, q.login_email = d && d.value, n && (q.oneTouchTenant = n), f.showSpinner(), e(), $.ajax({
				url: "",
				method: "POST",
				data: q,
				success: function(b) {
					var e;
					d && d.removeAttribute("disabled");
					h && h.removeAttribute("disabled");
					if (b.keychainDeviceToken && a.keychain) return a.keychain(b);
					if (b.smartlockOptIn && a.smartLock) a.smartLock(b);
					else if (b.incompleteContext) window.location.href = window.location.href;
					else if (b.returnUrl) window.location.href = b.returnUrl;
					else {
						if (e = b.notifications) {
							b = e.msg;
							e = e.type;
							var g = document.querySelector(".notifications"),
								n, l;
							g && (n = document.createElement("p"), l = document.createTextNode(b), n.setAttribute("class", "notification " + e), n.setAttribute("role", "alert"), n.appendChild(l),
								g.appendChild(n))
						}
						f.hideSpinner();
						f.hideSpinnerMessage("secureMessage");
						f.hideSpinnerMessage("oneTouchMessage");
						m({
							error_code: "ot_login_failed"
						});
						w && c && c.showCookieBanner()
					}
				},
				fail: function(a) {
					f.hideSpinner();
					d && d.removeAttribute("disabled");
					h && h.removeAttribute("disabled");
					f.hideSpinnerMessage("secureMessage");
					f.hideSpinnerMessage("oneTouchMessage");
					m({
						error_code: "ot_login_xhr_fail"
					});
					w && c && c.showCookieBanner()
				}
			})) : (f.hideSpinner(), m())
		}
		var f = a.utils,
			c = a.loadResources,
			d = a.logger,
			h = window.spox.ulData || {},
			g = "ONETOUCH_LOGIN",
			n = f.getIntent();
		return function() {
			var a = $("body").data("oneTouchUser"),
				c = "true" === $("body").data("isKeychainOptinRequired"),
				d = $("body").data("tpdAutoSend"),
				e = h.aPayAuth;
			!e && a ? b() : e && h.canNotMakePayment ? b() : d || D() || a || c || f.hideSpinner()
		}
	}();
	a.showHidePassword = function() {
		function e(b, e) {
			function c() {
				$(f).addClass("hide");
				$(g).addClass("hide")
			}

			function d(b) {
				c();
				(a.utils.isFieldPrefilled(n) || 0 < n.value.length) && l && $(l).hasClass("hide") && ("text" === e ? "password" === n.getAttribute("type") ?
					$(f).removeClass("hide") : $(g).removeClass("hide") : $(n).hasClass("tel-password") ? $(f).removeClass("hide") : $(g).removeClass("hide"));
				b.stopPropagation()
			}
			var f = b.querySelector(".showPassword"),
				g = b.querySelector(".hidePassword"),
				n = b.querySelector(".pin-password"),
				l = b.querySelector("#pwFpIcon");
			e = e || "text";
			"tel" === e && $(n).addClass("tel-password");
			f.onclick = function(b) {
				"tel" === e ? $(n).removeClass("tel-password") : n.setAttribute("type", e);
				$(f).addClass("hide");
				$(g).removeClass("hide");
				n.focus();
				b.stopPropagation();
				a.logger.log({
					evt: "is_pwd_sh",
					data: "Y",
					instrument: !0
				});
				a.logger.pushLogs()
			};
			g.onclick = function(b) {
				"tel" === e ? $(n).addClass("tel-password") : n.setAttribute("type", "password");
				$(f).removeClass("hide");
				$(g).addClass("hide");
				n.focus();
				b.stopPropagation();
				a.logger.log({
					evt: "is_pwd_sh",
					data: "N",
					instrument: !0
				});
				a.logger.pushLogs()
			};
			n.onfocus = d;
			p(n, "keyup", d);
			n.onclick = function(a) {
				a.stopPropagation()
			};
			window.onclick = c
		}
		return function() {
			var a = document.querySelector("#signUpSection"),
				f = document.querySelector("#passwordSection"),
				c = document.querySelector("#pinSection") || document.querySelector("#splitPinSection"),
				d;
			c && (d = c.querySelector(".pin-password"));
			a && e(a);
			f && e(f);
			c && d && e(c, "tel" === d.getAttribute("type") ? "tel" : "text")
		}
	}();
	a.oneTouch = function() {
		return function() {
			var e = document.querySelector(".keepMeLoginAbout"),
				b = document.getElementById("keepMeLoginTerms"),
				f = document.querySelector(".keepMeLogin .tagLine"),
				c = a.utils.getKmliCb();
			c && e && b && (e.setAttribute("href", "#"), e.onclick = function() {
				$(b).hasClass("slideUp") ? ($(b).removeClass("slideUp"),
					$(b).addClass("slideDown"), $(e).attr("aria-expanded", "true"), setTimeout(function() {
						$(e).removeClass("scTrack:unifiedlogin-rememberme-about-open");
						$(e).addClass("scTrack:unifiedlogin-rememberme-about-close")
					}, 10)) : ($(b).removeClass("slideDown"), $(b).addClass("slideUp"), $(e).attr("aria-expanded", "false"), setTimeout(function() {
					$(e).removeClass("scTrack:unifiedlogin-rememberme-about-close");
					$(e).addClass("scTrack:unifiedlogin-rememberme-about-open")
				}, 10));
				e.focus();
				f && $(f).toggle();
				setTimeout(function() {
					window.dispatchEvent &&
						window.dispatchEvent(aa("resize"))
				}, 200)
			}, c.onclick = function() {
				setTimeout(function() {
					$(c).hasClass("scTrack:unifiedlogin-rememberme-opt-in") ? ($(c).removeClass("scTrack:unifiedlogin-rememberme-opt-in"), $(c).addClass("scTrack:unifiedlogin-rememberme-opt-out")) : ($(c).removeClass("scTrack:unifiedlogin-rememberme-opt-out"), $(c).addClass("scTrack:unifiedlogin-rememberme-opt-in"))
				}, 10)
			})
		}
	}();
	a.footer = function() {
		function e() {
			var a = document.querySelector(".footer"),
				b = document.querySelector(".activeContent"),
				e = document.querySelector("#returnToMerchant");
			e = e && $(e).outerHeight() || 0;
			b = $(b).outerHeight() + $(a).outerHeight() + e;
			(window.innerHeight || document.documentElement && document.documentElement.clientHeight || window.screen && window.screen.height || document.height || document.body && document.body.offsetHeight) < b ? $(a).addClass("footerStayPut") : $(a).removeClass("footerStayPut")
		}
		for (var b = document.querySelectorAll(".localeSelector li a"), f = 0; f < b.length; f++) b[f].onclick = a.utils.getOutboundLinksHandler(b[f], null, "process_language_change");
		return function() {
			e();
			p(window, "resize", e)
		}
	}();
	a.pwr = function() {
		return function() {
			function e(b) {
				b.preventDefault();
				g = document.createElement("div");
				g.className = "modal-underlay";
				document.body.appendChild(g);
				d.style.display = "block";
				setTimeout(function() {
					g.style.opacity = .7;
					d.style.opacity = 1
				}, 0);
				h.setAttribute("src", $(h).data("src"));
				h.focus();
				h.onload = function() {
					f();
					h.focus()
				};
				a.logger.log({
					evt: "state_name",
					data: a.logger.getStateName(),
					instrument: !0
				});
				a.logger.log({
					evt: "transition_name",
					data: "process_password_recovery",
					instrument: !0
				});
				a.logger.pushLogs()
			}

			function b() {
				var a = document.querySelector(".modal-underlay");
				document.body.removeChild(a);
				d.style.display = "none";
				h.setAttribute("src", "about:blank");
				h.setAttribute("title", "pwdIframe");
				c && 0 < c.length && c[1].focus()
			}

			function f() {
				(window.innerHeight || document.documentElement.clientHeight) <= d.clientHeight ? (d.style.transform = "translate(-50%, 0%)", d.style.top = 0) : (d.style.transform = "translate(-50%, -50%)", d.style.top = "50%")
			}
			var c = document.querySelectorAll(".startPwrFlowBtn"),
				d = document.getElementById("password-recovery-modal"),
				h = document.getElementById("pwdIframe"),
				g;
			h && a.utils.isInIframe() && h.setAttribute("target", "_blank");
			if (c && 0 < c.length && !a.utils.isInIframe()) {
				var n = document.createElement("button");
				n.className = "ui-dialog-titlebar-close";
				n.setAttribute("type", "button");
				n.setAttribute("alt", "Close");
				n.setAttribute("aria-label", "Close");
				d.appendChild(n);
				for (var l = 0; l < c.length; l++) p(c[l], "click", e);
				n.onclick = b;
				p(h, "focusout", function(a) {
					a.preventDefault();
					n.focus()
				});
				n.onkeydown = function(a) {
					9 === a.which && h.focus()
				};
				p(window, "resize", f)
			}
		}
	}();
	a.authspox = function() {
		return function(e) {
			function b(b) {
				var c = !0;
				n && n.field && !e && (c = n, c.field && "string" == typeof c.field.value && !c.field.value.trim() ? ($(c.container).addClass("hasError"), c.container.style["z-index"] = 100, $(c.errMsgContainer).addClass("show"), c.field.focus(), $(c.errMsg).removeClass("hide"), c = !1) : c = !0);
				var d = c;
				c = document.querySelector("form[name=challenge]");
				var f = {};
				l = !0;
				b && y(b);
				if (d) {
					a.utils.showSpinner();
					for (b =
						0; b < c.length; b++) f[c[b].name] = c[b].value;
					$.ajax({
						url: g.getAttribute("action"),
						data: f,
						success: a.utils.successfulXhrHandler,
						fail: a.utils.failedXhrSubmitHandler
					})
				}
			}

			function f(a, b) {
				b && $(a.container).removeClass("hasError");
				a.container.style["z-index"] = 1;
				$(a.errMsgContainer).removeClass("show")
			}
			var c = document.querySelector(".spoxRefresh"),
				d = document.querySelector(".spoxPlay"),
				h = document.querySelector("#spox"),
				g = document.querySelector("#ads-container form"),
				n = function(a) {
					return a ? {
						container: a.querySelector("div.textInput"),
						field: a.querySelector("input[type=text]"),
						errMsgContainer: a.querySelector("div.errorMessage"),
						errMsg: a.querySelector("div.errorMessage .emptyError")
					} : null
				}(h),
				l = !1;
			e ? b() : (c.onclick = function(a) {
				a.preventDefault();
				a.stopPropagation();
				$.ajax({
					method: "GET",
					url: "",
					success: function(a) {
						"" !== a && ($(".spox-container img").attr("src", a.spoxImgUrl), $(".spox-container .audio a").attr("href", a.spoxAudioUrl), $(".spox-container input").val(""), $("#spoxPlayer").attr("src",
							a.spoxAudioUrl), $("body").hasClass("desktop") && $(".spox-container input").focus())
					}
				})
			}, d.onclick = function(a) {
				var b = document.getElementById("spoxPlayer");
				if (!b.canPlayType || !b.canPlayType("audio/mpeg;").replace(/no/, "")) return !0;
				a.preventDefault();
				$(".spox-container input").focus();
				b.play()
			}, g.onsubmit = b, n.field.onfocus = function(a) {
				$(a.container).hasClass("hasError") ? l = !0 : l = !1
			}.bind(null, n), n.field.onblur = function(a) {
				l = !1;
				f(a)
			}.bind(null, n), n.field.onkeyup = function(a) {
				var b = a.field.value.trim();
				if (!l) return !1;
				"" === b ? $(a.errMsg).removeClass("hide") : ($(a.errMsg).addClass("hide"), f(a, !0))
			}.bind(null, n))
		}
	}();
	
	a.bootstrap = function() {
		var e = $("body").data("");
		return (e = a[e]) ? e(function() {
			return S()
		}) : S()
	};
	document.onreadystatechange = function() {
		var e, b = a.utils.getSplitLoginContext(),
			f = a.utils.getIntent(),
			c = $("body").data("cookieBannerEnabled"),
			d = $("body").data("oneTouchUser"),
			h = document.querySelector('input[name=""]');
		"complete" === document.readyState && (a.bootstrap(), e = window.spox && window.spox.ulData || {}, e.preloadScriptUrl && N(e.preloadScriptUrl), b ? r(b) : ("checkout" === f && Y(), "prox" === f && k()), p(document, "click",
			a.utils.documentClickHandler), a.pubsub.subscribe("", a.utils.toggleRememberInfoTooltip), a.pubsub.subscribe("", function(b) {
			b = C(b);
			(b = $(b).data("")) && (a.logger.log({
				evt: "",
				data: b,
				instrument: !0
			}), a.logger.pushLogs())
		}), E(), "" === e.fingerprintProceed && u && u.lookup(), "login" === e.fingerprintProceed && u && u.login(), c && !d && a.loadResources && a.loadResources.showCookieBanner(), a.loadResources && a.loadResources.lazyload(), h && setTimeout(function() {
				a.utils.isFnDataLoaded() && a.xoPlanning.triggerSetBuyerCall(h.value)
			},
			300))
	}
})();
