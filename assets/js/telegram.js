(function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function subscribe(store, ...callbacks) {
		if (store == null) {
			for (const callback of callbacks) {
				callback(undefined);
			}
			return noop;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}

	/** @returns {void} */
	function component_subscribe(component, store, callback) {
		component.$$.on_destroy.push(subscribe(store, callback));
	}

	function null_to_empty(value) {
		return value == null ? '' : value;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {string} style_sheet_id
	 * @param {string} styles
	 * @returns {void}
	 */
	function append_styles(target, style_sheet_id, styles) {
		const append_styles_to = get_root_for_style(target);
		if (!append_styles_to.getElementById(style_sheet_id)) {
			const style = element('style');
			style.id = style_sheet_id;
			style.textContent = styles;
			append_stylesheet(append_styles_to, style);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}
	/** */
	class HtmlTag {
		/**
		 * @private
		 * @default false
		 */
		is_svg = false;
		/** parent for creating node */
		e = undefined;
		/** html tag nodes */
		n = undefined;
		/** target */
		t = undefined;
		/** anchor */
		a = undefined;
		constructor(is_svg = false) {
			this.is_svg = is_svg;
			this.e = this.n = null;
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		c(html) {
			this.h(html);
		}

		/**
		 * @param {string} html
		 * @param {HTMLElement | SVGElement} target
		 * @param {HTMLElement | SVGElement} anchor
		 * @returns {void}
		 */
		m(html, target, anchor = null) {
			if (!this.e) {
				if (this.is_svg)
					this.e = svg_element(/** @type {keyof SVGElementTagNameMap} */ (target.nodeName));
				/** #7364  target for <template> may be provided as #document-fragment(11) */ else
					this.e = element(
						/** @type {keyof HTMLElementTagNameMap} */ (
							target.nodeType === 11 ? 'TEMPLATE' : target.nodeName
						)
					);
				this.t =
					target.tagName !== 'TEMPLATE'
						? target
						: /** @type {HTMLTemplateElement} */ (target).content;
				this.c(html);
			}
			this.i(anchor);
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		h(html) {
			this.e.innerHTML = html;
			this.n = Array.from(
				this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes
			);
		}

		/**
		 * @returns {void} */
		i(anchor) {
			for (let i = 0; i < this.n.length; i += 1) {
				insert(this.t, this.n[i], anchor);
			}
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		p(html) {
			this.d();
			this.h(html);
			this.i(this.a);
		}

		/**
		 * @returns {void} */
		d() {
			this.n.forEach(detach);
		}
	}

	/**
	 * @param {HTMLElement} element
	 * @returns {{}}
	 */
	function get_custom_elements_slots(element) {
		const result = {};
		element.childNodes.forEach(
			/** @param {Element} node */ (node) => {
				result[node.slot || 'default'] = true;
			}
		);
		return result;
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	/** @returns {void} */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				const nodes = children(options.target);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	let SvelteElement;

	if (typeof HTMLElement === 'function') {
		SvelteElement = class extends HTMLElement {
			/** The Svelte component constructor */
			$$ctor;
			/** Slots */
			$$s;
			/** The Svelte component instance */
			$$c;
			/** Whether or not the custom element is connected */
			$$cn = false;
			/** Component props data */
			$$d = {};
			/** `true` if currently in the process of reflecting component props back to attributes */
			$$r = false;
			/** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
			$$p_d = {};
			/** @type {Record<string, Function[]>} Event listeners */
			$$l = {};
			/** @type {Map<Function, Function>} Event listener unsubscribe functions */
			$$l_u = new Map();

			constructor($$componentCtor, $$slots, use_shadow_dom) {
				super();
				this.$$ctor = $$componentCtor;
				this.$$s = $$slots;
				if (use_shadow_dom) {
					this.attachShadow({ mode: 'open' });
				}
			}

			addEventListener(type, listener, options) {
				// We can't determine upfront if the event is a custom event or not, so we have to
				// listen to both. If someone uses a custom event with the same name as a regular
				// browser event, this fires twice - we can't avoid that.
				this.$$l[type] = this.$$l[type] || [];
				this.$$l[type].push(listener);
				if (this.$$c) {
					const unsub = this.$$c.$on(type, listener);
					this.$$l_u.set(listener, unsub);
				}
				super.addEventListener(type, listener, options);
			}

			removeEventListener(type, listener, options) {
				super.removeEventListener(type, listener, options);
				if (this.$$c) {
					const unsub = this.$$l_u.get(listener);
					if (unsub) {
						unsub();
						this.$$l_u.delete(listener);
					}
				}
			}

			async connectedCallback() {
				this.$$cn = true;
				if (!this.$$c) {
					// We wait one tick to let possible child slot elements be created/mounted
					await Promise.resolve();
					if (!this.$$cn) {
						return;
					}
					function create_slot(name) {
						return () => {
							let node;
							const obj = {
								c: function create() {
									node = element('slot');
									if (name !== 'default') {
										attr(node, 'name', name);
									}
								},
								/**
								 * @param {HTMLElement} target
								 * @param {HTMLElement} [anchor]
								 */
								m: function mount(target, anchor) {
									insert(target, node, anchor);
								},
								d: function destroy(detaching) {
									if (detaching) {
										detach(node);
									}
								}
							};
							return obj;
						};
					}
					const $$slots = {};
					const existing_slots = get_custom_elements_slots(this);
					for (const name of this.$$s) {
						if (name in existing_slots) {
							$$slots[name] = [create_slot(name)];
						}
					}
					for (const attribute of this.attributes) {
						// this.$$data takes precedence over this.attributes
						const name = this.$$g_p(attribute.name);
						if (!(name in this.$$d)) {
							this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, 'toProp');
						}
					}
					this.$$c = new this.$$ctor({
						target: this.shadowRoot || this,
						props: {
							...this.$$d,
							$$slots,
							$$scope: {
								ctx: []
							}
						}
					});

					// Reflect component props as attributes
					const reflect_attributes = () => {
						this.$$r = true;
						for (const key in this.$$p_d) {
							this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
							if (this.$$p_d[key].reflect) {
								const attribute_value = get_custom_element_value(
									key,
									this.$$d[key],
									this.$$p_d,
									'toAttribute'
								);
								if (attribute_value == null) {
									this.removeAttribute(key);
								} else {
									this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
								}
							}
						}
						this.$$r = false;
					};
					this.$$c.$$.after_update.push(reflect_attributes);
					reflect_attributes(); // once initially because after_update is added too late for first render

					for (const type in this.$$l) {
						for (const listener of this.$$l[type]) {
							const unsub = this.$$c.$on(type, listener);
							this.$$l_u.set(listener, unsub);
						}
					}
					this.$$l = {};
				}
			}

			// We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
			// and setting attributes through setAttribute etc, this is helpful
			attributeChangedCallback(attr, _oldValue, newValue) {
				if (this.$$r) return;
				attr = this.$$g_p(attr);
				this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, 'toProp');
				this.$$c?.$set({ [attr]: this.$$d[attr] });
			}

			disconnectedCallback() {
				this.$$cn = false;
				// In a microtask, because this could be a move within the DOM
				Promise.resolve().then(() => {
					if (!this.$$cn) {
						this.$$c.$destroy();
						this.$$c = undefined;
					}
				});
			}

			$$g_p(attribute_name) {
				return (
					Object.keys(this.$$p_d).find(
						(key) =>
							this.$$p_d[key].attribute === attribute_name ||
							(!this.$$p_d[key].attribute && key.toLowerCase() === attribute_name)
					) || attribute_name
				);
			}
		};
	}

	/**
	 * @param {string} prop
	 * @param {any} value
	 * @param {Record<string, CustomElementPropDefinition>} props_definition
	 * @param {'toAttribute' | 'toProp'} [transform]
	 */
	function get_custom_element_value(prop, value, props_definition, transform) {
		const type = props_definition[prop]?.type;
		value = type === 'Boolean' && typeof value !== 'boolean' ? value != null : value;
		if (!transform || !props_definition[prop]) {
			return value;
		} else if (transform === 'toAttribute') {
			switch (type) {
				case 'Object':
				case 'Array':
					return value == null ? null : JSON.stringify(value);
				case 'Boolean':
					return value ? '' : null;
				case 'Number':
					return value == null ? null : value;
				default:
					return value;
			}
		} else {
			switch (type) {
				case 'Object':
				case 'Array':
					return value && JSON.parse(value);
				case 'Boolean':
					return value; // conversion already handled above
				case 'Number':
					return value != null ? +value : value;
				default:
					return value;
			}
		}
	}

	/**
	 * @internal
	 *
	 * Turn a Svelte component into a custom element.
	 * @param {import('./public.js').ComponentType} Component  A Svelte component constructor
	 * @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
	 * @param {string[]} slots  The slots to create
	 * @param {string[]} accessors  Other accessors besides the ones for props the component has
	 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
	 * @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
	 */
	function create_custom_element(
		Component,
		props_definition,
		slots,
		accessors,
		use_shadow_dom,
		extend
	) {
		let Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, use_shadow_dom);
				this.$$p_d = props_definition;
			}
			static get observedAttributes() {
				return Object.keys(props_definition).map((key) =>
					(props_definition[key].attribute || key).toLowerCase()
				);
			}
		};
		Object.keys(props_definition).forEach((prop) => {
			Object.defineProperty(Class.prototype, prop, {
				get() {
					return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
				},
				set(value) {
					value = get_custom_element_value(prop, value, props_definition);
					this.$$d[prop] = value;
					this.$$c?.$set({ [prop]: value });
				}
			});
		});
		accessors.forEach((accessor) => {
			Object.defineProperty(Class.prototype, accessor, {
				get() {
					return this.$$c?.[accessor];
				}
			});
		});
		if (extend) {
			// @ts-expect-error - assigning here is fine
			Class = extend(Class);
		}
		Component.element = /** @type {any} */ (Class);
		return Class;
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	const subscriber_queue = [];

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}

	const showChatBoolean = writable(false);

	/* src/Admin.svelte generated by Svelte v4.2.0 */

	function add_css$2(target) {
		append_styles(target, "svelte-19lt9ee", ".chat_msg_item_admin.svelte-19lt9ee{overflow-wrap:break-word;letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;border-radius:3px;animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999;margin-left:60px;float:left;background:rgba(0, 0, 0, 0.03);color:#666}.chat_avatar.svelte-19lt9ee{letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;color:#666;position:absolute;top:0;width:40px;height:40px;text-align:center;border-radius:50%;left:-52px;background:rgba(0, 0, 0, 0.03)}img.svelte-19lt9ee{letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;color:#666;width:40px;height:40px;text-align:center;border-radius:50%}");
	}

	function create_fragment$3(ctx) {
		let span;
		let div;
		let t;
		let html_tag;

		return {
			c() {
				span = element("span");
				div = element("div");
				div.innerHTML = `<img alt="" src="https://ayzom.com/assets/img/akhilesh.png" class="svelte-19lt9ee"/>`;
				t = space();
				html_tag = new HtmlTag(false);
				attr(div, "class", "chat_avatar svelte-19lt9ee");
				html_tag.a = null;
				attr(span, "class", "chat_msg_item chat_msg_item_admin svelte-19lt9ee");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				append(span, div);
				append(span, t);
				html_tag.m(/*text*/ ctx[0], span);
			},
			p(ctx, [dirty]) {
				if (dirty & /*text*/ 1) html_tag.p(/*text*/ ctx[0]);
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(span);
				}
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { text } = $$props;

		$$self.$$set = $$props => {
			if ('text' in $$props) $$invalidate(0, text = $$props.text);
		};

		return [text];
	}

	class Admin extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$2, create_fragment$3, safe_not_equal, { text: 0 }, add_css$2);
		}

		get text() {
			return this.$$.ctx[0];
		}

		set text(text) {
			this.$$set({ text });
			flush();
		}
	}

	customElements.define("my-admin", create_custom_element(Admin, {"text":{}}, [], [], true));

	/* src/User.svelte generated by Svelte v4.2.0 */

	function add_css$1(target) {
		append_styles(target, "svelte-1yqi94n", ".chat_msg_item_user.svelte-1yqi94n{overflow-wrap:break-word;letter-spacing:.1px;text-rendering:optimizeLegibility;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-size:12px;line-height:18px;position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;border-radius:3px;animation:zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999;margin-right:20px;float:right;background:#42a5f5;color:#eceff1}");
	}

	function create_fragment$2(ctx) {
		let span;

		return {
			c() {
				span = element("span");
				attr(span, "class", "chat_msg_item chat_msg_item_user svelte-1yqi94n");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				span.innerHTML = /*text*/ ctx[0];
			},
			p(ctx, [dirty]) {
				if (dirty & /*text*/ 1) span.innerHTML = /*text*/ ctx[0];		},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(span);
				}
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { text } = $$props;

		$$self.$$set = $$props => {
			if ('text' in $$props) $$invalidate(0, text = $$props.text);
		};

		return [text];
	}

	class User extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$2, safe_not_equal, { text: 0 }, add_css$1);
		}

		get text() {
			return this.$$.ctx[0];
		}

		set text(text) {
			this.$$set({ text });
			flush();
		}
	}

	customElements.define("my-user", create_custom_element(User, {"text":{}}, [], [], true));

	/* src/App.svelte generated by Svelte v4.2.0 */

	function add_css(target) {
		append_styles(target, "svelte-1gtarpt", ".hide-div.svelte-1gtarpt.svelte-1gtarpt{visibility:hidden}.fabs.svelte-1gtarpt.svelte-1gtarpt{bottom:0;position:fixed;margin:1em;right:0;z-index:998}.fab.svelte-1gtarpt.svelte-1gtarpt{display:block;width:56px;height:56px;border-radius:50%;text-align:center;color:#f0f0f0;margin:25px auto 0;box-shadow:0 0 4px rgba(0, 0, 0, .14), 0 4px 8px rgba(0, 0, 0, .28);cursor:pointer;-webkit-transition:all .1s ease-out;transition:all .1s ease-out;position:relative;z-index:998;overflow:hidden;background:#42a5f5}.fab.svelte-1gtarpt.svelte-1gtarpt:not(:last-child){width:0;height:0;margin:20px auto 0;opacity:0;visibility:hidden;line-height:40px}.fab:not(:last-child).is-visible.svelte-1gtarpt.svelte-1gtarpt{width:40px;height:40px;margin:15px auto 10;opacity:1;visibility:visible}.fab.svelte-1gtarpt.svelte-1gtarpt:nth-last-child(1){-webkit-transition-delay:25ms;transition-delay:25ms}.fab.svelte-1gtarpt.svelte-1gtarpt:not(:last-child):nth-last-child(2){-webkit-transition-delay:20ms;transition-delay:20ms}.fab.svelte-1gtarpt.svelte-1gtarpt:not(:last-child):nth-last-child(3){-webkit-transition-delay:40ms;transition-delay:40ms}.fab.svelte-1gtarpt.svelte-1gtarpt:not(:last-child):nth-last-child(4){-webkit-transition-delay:60ms;transition-delay:60ms}.fab.svelte-1gtarpt.svelte-1gtarpt:not(:last-child):nth-last-child(5){-webkit-transition-delay:80ms;transition-delay:80ms}.fab.svelte-1gtarpt.svelte-1gtarpt:active,.fab.svelte-1gtarpt.svelte-1gtarpt:focus,.fab.svelte-1gtarpt.svelte-1gtarpt:hover{box-shadow:0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32)}.chat.svelte-1gtarpt.svelte-1gtarpt{position:fixed;right:85px;bottom:20px;width:400px;font-size:12px;line-height:22px;font-family:'Roboto';font-weight:500;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;opacity:0;box-shadow:1px 1px 100px 2px rgba(0, 0, 0, 0.22);border-radius:10px;-webkit-transition:all .2s ease-out;-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.chat_header.svelte-1gtarpt.svelte-1gtarpt{font-size:13px;font-family:'Roboto';font-weight:500;color:#f3f3f3;height:55px;background:#42a5f5;border-top-left-radius:10px;border-top-right-radius:10px;padding-top:8px}.chat.is-visible.svelte-1gtarpt.svelte-1gtarpt{opacity:1;-webkit-animation:svelte-1gtarpt-zoomIn .2s cubic-bezier(.42, 0, .58, 1);animation:svelte-1gtarpt-zoomIn .2s cubic-bezier(.42, 0, .58, 1)}.chat_option.svelte-1gtarpt.svelte-1gtarpt{float:left;font-size:15px;list-style:none;position:relative;height:100%;width:100%;text-align:relative;margin-right:10px;letter-spacing:0.5px;font-weight:400\n         }.chat_option.svelte-1gtarpt img.svelte-1gtarpt{border-radius:50%;width:55px;float:left;margin:-30px 20px 10px 20px;border:4px solid rgba(0, 0, 0, 0.21)}.chat_option.svelte-1gtarpt .agent.svelte-1gtarpt{font-size:12px;font-weight:300}.chat_option.svelte-1gtarpt .online.svelte-1gtarpt{opacity:0.4;font-size:11px;font-weight:300}.chat_body.svelte-1gtarpt.svelte-1gtarpt{background:#fff;width:100%;display:inline-block;text-align:center;overflow-y:auto}.chat_body.svelte-1gtarpt p.svelte-1gtarpt{padding:20px;color:#888\n         }.chat_field.svelte-1gtarpt.svelte-1gtarpt{position:relative;margin:5px 0 5px 0;width:50%;font-family:'Roboto';font-size:12px;line-height:30px;font-weight:500;color:#4b4b4b;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;border:none;outline:none;display:inline-block}.chat_field.chat_message.svelte-1gtarpt.svelte-1gtarpt{height:30px;resize:none;font-size:13px;font-weight:400}.fab_field.svelte-1gtarpt.svelte-1gtarpt{width:100%;display:inline-block;text-align:center;background:#fff;border-top:1px solid #eee;border-bottom-right-radius:10px;border-bottom-left-radius:10px}.fab_field.svelte-1gtarpt a.svelte-1gtarpt{display:inline-block;text-align:center}#fab_send.svelte-1gtarpt.svelte-1gtarpt{float:right;background:rgba(0, 0, 0, 0)}.fab_field.svelte-1gtarpt .fab.svelte-1gtarpt{width:35px;height:35px;box-shadow:none;margin:5px}.chat_converse.svelte-1gtarpt.svelte-1gtarpt{position:relative;background:#fff;margin:6px 0 0px 0;height:300px;min-height:0;font-size:12px;line-height:18px;overflow-y:auto;width:100%;float:right;padding-bottom:30px}.chat.svelte-1gtarpt .chat_converse .chat_msg_item.svelte-1gtarpt{position:relative;margin:8px 0 15px 0;padding:8px 10px;max-width:60%;display:block;word-wrap:break-word;border-radius:3px;-webkit-animation:svelte-1gtarpt-zoomIn .5s cubic-bezier(.42, 0, .58, 1);animation:svelte-1gtarpt-zoomIn .5s cubic-bezier(.42, 0, .58, 1);clear:both;z-index:999}.chat.svelte-1gtarpt .chat_converse .chat_msg_item .chat_avatar.svelte-1gtarpt{position:absolute;top:0}.chat.svelte-1gtarpt .chat_converse .chat_msg_item.chat_msg_item_admin .chat_avatar.svelte-1gtarpt{left:-52px;background:rgba(0, 0, 0, 0.03)}.chat.svelte-1gtarpt .chat_converse .chat_msg_item .chat_avatar.svelte-1gtarpt,.chat_avatar.svelte-1gtarpt img.svelte-1gtarpt{width:40px;height:40px;text-align:center;border-radius:50%}.chat.svelte-1gtarpt .chat_converse .chat_msg_item.chat_msg_item_admin.svelte-1gtarpt{margin-left:60px;float:left;background:rgba(0, 0, 0, 0.03);color:#666}.chat.svelte-1gtarpt .chat_converse .chat_msg_item.chat_msg_item_admin.svelte-1gtarpt:before{content:'';position:absolute;top:15px;left:-12px;z-index:998;border:6px solid transparent;border-right-color:rgba(255, 255, 255, .4)}input.svelte-1gtarpt.svelte-1gtarpt{position:relative;width:90%;font-family:'Roboto';font-size:12px;line-height:20px;font-weight:500;color:#4b4b4b;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;outline:none;background:#fff;display:inline-block;resize:none;padding:5px;border-radius:3px}.svelte-1gtarpt.svelte-1gtarpt::-webkit-scrollbar{width:6px}.svelte-1gtarpt.svelte-1gtarpt::-webkit-scrollbar-track{border-radius:0}.svelte-1gtarpt.svelte-1gtarpt::-webkit-scrollbar-thumb{margin:2px;border-radius:10px;background:rgba(0, 0, 0, 0.2)}.is-float.svelte-1gtarpt.svelte-1gtarpt{box-shadow:0 0 6px rgba(0, 0, 0, .16), 0 6px 12px rgba(0, 0, 0, .32)}@-webkit-keyframes svelte-1gtarpt-zoomIn{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes svelte-1gtarpt-zoomIn{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes svelte-1gtarpt-load{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}50%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:0}}@keyframes svelte-1gtarpt-load{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0.0}50%{-webkit-transform:scale(1.5);transform:scale(1.5);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:0}}@media only screen and (min-width: 300px){.chat.svelte-1gtarpt.svelte-1gtarpt{width:250px}}@media only screen and (min-width: 480px){.chat.svelte-1gtarpt.svelte-1gtarpt{width:300px}.chat_field.svelte-1gtarpt.svelte-1gtarpt{width:65%}}@media only screen and (min-width: 768px){.chat.svelte-1gtarpt.svelte-1gtarpt{width:300px}.chat_field.svelte-1gtarpt.svelte-1gtarpt{width:65%}}@media only screen and (min-width: 1024px){.chat.svelte-1gtarpt.svelte-1gtarpt{width:300px}.chat_field.svelte-1gtarpt.svelte-1gtarpt{width:65%}}@-webkit-keyframes svelte-1gtarpt-ripple{100%{opacity:0;-moz-transform:scale(5);-ms-transform:scale(5);webkit-transform:scale(5);-webkit-transform:scale(5);transform:scale(5)}}@keyframes svelte-1gtarpt-ripple{100%{opacity:0;-moz-transform:scale(5);-ms-transform:scale(5);webkit-transform:scale(5);-webkit-transform:scale(5);transform:scale(5)}}.svelte-1gtarpt.svelte-1gtarpt::-webkit-input-placeholder{color:#bbb}.svelte-1gtarpt.svelte-1gtarpt:-ms-input-placeholder{color:#bbb}.svelte-1gtarpt.svelte-1gtarpt::-moz-placeholder{color:#bbb}.svelte-1gtarpt.svelte-1gtarpt:-moz-placeholder{color:#bbb}.label-color.svelte-1gtarpt.svelte-1gtarpt{color:black}");
	}

	// (157:9) {#if $showChatBoolean}
	function create_if_block_1(ctx) {
		let svg;
		let g;
		let path;

		return {
			c() {
				svg = svg_element("svg");
				g = svg_element("g");
				path = svg_element("path");
				set_style(path, "text-indent", "0");
				set_style(path, "text-transform", "none");
				set_style(path, "direction", "ltr");
				set_style(path, "block-progression", "tb");
				set_style(path, "baseline-shift", "baseline");
				set_style(path, "color", "#000000");
				set_style(path, "enable-background", "accumulate");
				attr(path, "d", "m 34.79625,986.35968 a 1.0001,1.0001 0 0 0 -0.5,1.71875 l 14.28125,14.28127 -14.28125,14.2812 a 1.0054782,1.0054782 0 1 0 1.40625,1.4375 l 14.3125,-14.2812 14.28125,14.2812 a 1.0054782,1.0054782 0 1 0 1.40625,-1.4375 L 51.42125,1002.3597 65.7025,988.07843 a 1.0001,1.0001 0 0 0 -0.71875,-1.71875 1.0001,1.0001 0 0 0 -0.6875,0.28125 L 50.015,1000.9222 35.7025,986.64093 a 1.0001,1.0001 0 0 0 -0.71875,-0.28125 1.0001,1.0001 0 0 0 -0.1875,0 z");
				attr(path, "fill", "#000000");
				attr(path, "fill-opacity", "1");
				attr(path, "fill-rule", "evenodd");
				attr(path, "stroke", "none");
				attr(path, "marker", "none");
				attr(path, "visibility", "visible");
				attr(path, "display", "inline");
				attr(path, "overflow", "visible");
				attr(path, "class", "svelte-1gtarpt");
				attr(g, "transform", "translate(0,-952.36218)");
				attr(g, "class", "svelte-1gtarpt");
				attr(svg, "xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
				attr(svg, "xmlns:svg", "http://www.w3.org/2000/svg");
				attr(svg, "xmlns", "http://www.w3.org/2000/svg");
				attr(svg, "version", "1.1");
				attr(svg, "x", "0px");
				attr(svg, "y", "0px");
				attr(svg, "viewBox", "0 0 100 125");
				attr(svg, "class", "svelte-1gtarpt");
			},
			m(target, anchor) {
				insert(target, svg, anchor);
				append(svg, g);
				append(g, path);
			},
			d(detaching) {
				if (detaching) {
					detach(svg);
				}
			}
		};
	}

	// (161:9) {#if !$showChatBoolean}
	function create_if_block(ctx) {
		let svg;
		let g;
		let path0;
		let path1;
		let path2;
		let path3;

		return {
			c() {
				svg = svg_element("svg");
				g = svg_element("g");
				path0 = svg_element("path");
				path1 = svg_element("path");
				path2 = svg_element("path");
				path3 = svg_element("path");
				set_style(path0, "text-indent", "0");
				set_style(path0, "text-transform", "none");
				set_style(path0, "direction", "ltr");
				set_style(path0, "block-progression", "tb");
				set_style(path0, "baseline-shift", "baseline");
				set_style(path0, "color", "#000000");
				set_style(path0, "enable-background", "accumulate");
				attr(path0, "d", "m 92,964.37773 a 2.000005,2.000005 0 0 1 1.99969,1.99969 l 0,57.27998 A 2.000005,2.000005 0 0 1 92,1025.6571 l -12.44969,0 2.315,12.3209 a 2.000005,2.000005 0 0 1 -3.15719,1.975 l -19.25906,-14.2959 -51.4490599,0 a 2.000005,2.000005 0 0 1 -1.99969,-1.9997 l 0,-57.27998 a 2.000005,2.000005 0 0 1 1.99969,-1.99969 l 83.9999999,0 z m -1.99969,3.99938 -80.0006199,0 0,53.28059 50.1103099,0 a 2.000005,2.000005 0 0 1 1.19188,0.394 l 15.69,11.6466 -1.81719,-9.6716 a 2.000005,2.000005 0 0 1 1.96531,-2.369 l 12.86031,0 0,-53.28059 z");
				attr(path0, "fill", "#000000");
				attr(path0, "fill-opacity", "1");
				attr(path0, "fill-rule", "evenodd");
				attr(path0, "stroke", "none");
				attr(path0, "marker", "none");
				attr(path0, "visibility", "visible");
				attr(path0, "display", "inline");
				attr(path0, "overflow", "visible");
				attr(path0, "class", "svelte-1gtarpt");
				set_style(path1, "text-indent", "0");
				set_style(path1, "text-transform", "none");
				set_style(path1, "direction", "ltr");
				set_style(path1, "block-progression", "tb");
				set_style(path1, "baseline-shift", "baseline");
				set_style(path1, "color", "#000000");
				set_style(path1, "enable-background", "accumulate");
				attr(path1, "d", "m 66.84281,998.4894 a 2.000005,2.000005 0 0 1 1.26063,3.5597 c -10.69712,8.8358 -25.59226,8.7744 -36.2075,-3e-4 a 2.000005,2.000005 0 1 1 2.54812,-3.0828 c 9.22476,7.6253 21.80962,7.6839 31.1125,-3e-4 a 2.000005,2.000005 0 0 1 1.28625,-0.4762 z");
				attr(path1, "fill", "#000000");
				attr(path1, "fill-opacity", "1");
				attr(path1, "fill-rule", "evenodd");
				attr(path1, "stroke", "none");
				attr(path1, "marker", "none");
				attr(path1, "visibility", "visible");
				attr(path1, "display", "inline");
				attr(path1, "overflow", "visible");
				attr(path1, "class", "svelte-1gtarpt");
				set_style(path2, "text-indent", "0");
				set_style(path2, "text-transform", "none");
				set_style(path2, "direction", "ltr");
				set_style(path2, "block-progression", "tb");
				set_style(path2, "baseline-shift", "baseline");
				set_style(path2, "color", "#000000");
				set_style(path2, "enable-background", "accumulate");
				attr(path2, "d", "m 69.53,981.37757 c 3.84202,0 6.99969,3.15798 6.99969,7 a 2.000005,2.000005 0 1 1 -3.99938,0 c 0,-1.67798 -1.32233,-3.00031 -3.00031,-3.00031 -1.67798,0 -3.00031,1.32233 -3.00031,3.00031 a 2.000005,2.000005 0 1 1 -3.99938,0 c 0,-3.84202 3.15767,-7 6.99969,-7 z");
				attr(path2, "fill", "#000000");
				attr(path2, "fill-opacity", "1");
				attr(path2, "fill-rule", "evenodd");
				attr(path2, "stroke", "none");
				attr(path2, "marker", "none");
				attr(path2, "visibility", "visible");
				attr(path2, "display", "inline");
				attr(path2, "overflow", "visible");
				attr(path2, "class", "svelte-1gtarpt");
				set_style(path3, "text-indent", "0");
				set_style(path3, "text-transform", "none");
				set_style(path3, "direction", "ltr");
				set_style(path3, "block-progression", "tb");
				set_style(path3, "baseline-shift", "baseline");
				set_style(path3, "color", "#000000");
				set_style(path3, "enable-background", "accumulate");
				attr(path3, "d", "m 30.47,981.37757 c 3.84202,0 6.99969,3.15798 6.99969,7 a 2.000005,2.000005 0 1 1 -3.99938,0 c 0,-1.67798 -1.32233,-3.00031 -3.00031,-3.00031 -1.67798,0 -3.00031,1.32233 -3.00031,3.00031 a 2.000005,2.000005 0 1 1 -3.99938,0 c 0,-3.84202 3.15767,-7 6.99969,-7 z");
				attr(path3, "fill", "#000000");
				attr(path3, "fill-opacity", "1");
				attr(path3, "fill-rule", "evenodd");
				attr(path3, "stroke", "none");
				attr(path3, "marker", "none");
				attr(path3, "visibility", "visible");
				attr(path3, "display", "inline");
				attr(path3, "overflow", "visible");
				attr(path3, "class", "svelte-1gtarpt");
				attr(g, "transform", "translate(0,-952.36218)");
				attr(g, "class", "svelte-1gtarpt");
				attr(svg, "xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
				attr(svg, "height", "40");
				attr(svg, "width", "40");
				attr(svg, "xmlns:svg", "http://www.w3.org/2000/svg");
				attr(svg, "xmlns", "http://www.w3.org/2000/svg");
				attr(svg, "version", "1.1");
				attr(svg, "x", "0px");
				attr(svg, "y", "0px");
				attr(svg, "viewBox", "0 0 100 55");
				attr(svg, "class", "svelte-1gtarpt");
			},
			m(target, anchor) {
				insert(target, svg, anchor);
				append(svg, g);
				append(g, path0);
				append(g, path1);
				append(g, path2);
				append(g, path3);
			},
			d(detaching) {
				if (detaching) {
					detach(svg);
				}
			}
		};
	}

	function create_fragment$1(ctx) {
		let main;
		let div9;
		let div8;
		let div2;
		let t7;
		let div6;
		let t13;
		let div7;
		let form;
		let a0;
		let t14;
		let input;
		let div8_class_value;
		let t15;
		let a1;
		let t16;
		let a1_class_value;
		let mounted;
		let dispose;
		let if_block0 = /*$showChatBoolean*/ ctx[2] && create_if_block_1();
		let if_block1 = !/*$showChatBoolean*/ ctx[2] && create_if_block();

		return {
			c() {
				main = element("main");
				div9 = element("div");
				div8 = element("div");
				div2 = element("div");
				div2.innerHTML = `<div class="chat_option svelte-1gtarpt"><div class="header_img svelte-1gtarpt"><img alt="" src="https://ayzom.com/assets/img/akhilesh.png" class="svelte-1gtarpt"/></div> <span id="chat_head" class="svelte-1gtarpt">Akhilesh Yadav</span> <br class="svelte-1gtarpt"/> <span class="agent label-color svelte-1gtarpt">Status</span> <span class="online label-color svelte-1gtarpt">(Online)</span></div>`;
				t7 = space();
				div6 = element("div");

				div6.innerHTML = `<div class="chat_body svelte-1gtarpt"><p class="svelte-1gtarpt">Ask me anything. Please drop your email/phone/social media profile link so I can connect later in case I am offline.</p></div> <span class="chat_msg_item chat_msg_item_admin svelte-1gtarpt"><div class="chat_avatar svelte-1gtarpt"><img alt="" src="https://ayzom.com/assets/img/akhilesh.png" class="svelte-1gtarpt"/></div>
				Hey there! Any question?</span> <span class="chat_msg_item chat_msg_item_admin svelte-1gtarpt"><div class="chat_avatar svelte-1gtarpt"><img alt="" src="https://ayzom.com/assets/img/akhilesh.png" class="svelte-1gtarpt"/></div>
				Let me know your name and query.</span>`;

				t13 = space();
				div7 = element("div");
				form = element("form");
				a0 = element("a");
				a0.innerHTML = `<svg height="30" width="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 64 60" style="enable-background:new 0 0 64 64;" xml:space="preserve" class="svelte-1gtarpt"><g class="svelte-1gtarpt"><path d="M9.4,35v3h1H13l2.7,14h0.8h6.5l-2.7-14h3.8l25.1,6.3V43v-8h3.3V21h-3.3v-9.3L24.2,18H9.4v3h-6v14h1H9.4z M49.4,23h1.3v10   h-1.3V23z M25.4,19.8l22-5.5V21h0v14h0v6.7l-22-5.5V19.8z M20.7,50h-3.3l-2.3-12h3.3L20.7,50z M11.4,35V21v-1h12v16H20h-7.4h-1.3   V35z M5.4,23h4v10h-4V23z" class="svelte-1gtarpt"></path><rect x="54.9" y="27" width="4.8" height="2" class="svelte-1gtarpt"></rect><rect x="54.7" y="20" transform="matrix(0.9126 -0.4088 0.4088 0.9126 -3.5859 25.19)" width="5" height="2" class="svelte-1gtarpt"></rect><rect x="56.1" y="32.5" transform="matrix(0.4088 -0.9126 0.9126 0.4088 1.827 72.8513)" width="2" height="5" class="svelte-1gtarpt"></rect></g></svg>`;
				t14 = space();
				input = element("input");
				t15 = space();
				a1 = element("a");
				if (if_block0) if_block0.c();
				t16 = space();
				if (if_block1) if_block1.c();
				attr(div2, "class", "chat_header svelte-1gtarpt");
				attr(div6, "id", "chat_converse");
				attr(div6, "class", "chat_conversion chat_converse svelte-1gtarpt");
				set_style(div6, "display", "block");
				attr(a0, "id", "fab_send");
				attr(a0, "tabindex", "0");
				attr(a0, "role", "button");
				attr(a0, "class", "fab is-visible svelte-1gtarpt");
				attr(input, "id", "chatSend");
				attr(input, "name", "chat_message");
				attr(input, "placeholder", "Send a message1");
				attr(input, "class", "chat_field chat_message svelte-1gtarpt");
				attr(form, "class", "svelte-1gtarpt");
				attr(div7, "class", "fab_field svelte-1gtarpt");

				attr(div8, "class", div8_class_value = "" + (null_to_empty(/*$showChatBoolean*/ ctx[2]
				? 'chat is-visible'
				: 'chat hide-div') + " svelte-1gtarpt"));

				attr(a1, "role", "button");
				attr(a1, "tabindex", "0");
				attr(a1, "id", "prime");

				attr(a1, "class", a1_class_value = "" + (null_to_empty(/*$showChatBoolean*/ ctx[2]
				? 'fab is-float is-visible'
				: 'fab') + " svelte-1gtarpt"));

				attr(div9, "class", "fabs svelte-1gtarpt");
				attr(main, "class", "svelte-1gtarpt");
			},
			m(target, anchor) {
				insert(target, main, anchor);
				append(main, div9);
				append(div9, div8);
				append(div8, div2);
				append(div8, t7);
				append(div8, div6);
				/*div6_binding*/ ctx[5](div6);
				append(div8, t13);
				append(div8, div7);
				append(div7, form);
				append(form, a0);
				append(form, t14);
				append(form, input);
				set_input_value(input, /*msg_text*/ ctx[0]);
				append(div9, t15);
				append(div9, a1);
				if (if_block0) if_block0.m(a1, null);
				append(a1, t16);
				if (if_block1) if_block1.m(a1, null);

				if (!mounted) {
					dispose = [
						listen(a0, "click", /*sendMsg*/ ctx[4]),
						listen(a0, "keypress", /*sendMsg*/ ctx[4]),
						listen(input, "input", /*input_input_handler*/ ctx[6]),
						listen(form, "submit", prevent_default(/*submit_handler*/ ctx[7])),
						listen(a1, "click", /*toggleFab*/ ctx[3]),
						listen(a1, "keypress", /*toggleFab*/ ctx[3])
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*msg_text*/ 1 && input.value !== /*msg_text*/ ctx[0]) {
					set_input_value(input, /*msg_text*/ ctx[0]);
				}

				if (dirty & /*$showChatBoolean*/ 4 && div8_class_value !== (div8_class_value = "" + (null_to_empty(/*$showChatBoolean*/ ctx[2]
				? 'chat is-visible'
				: 'chat hide-div') + " svelte-1gtarpt"))) {
					attr(div8, "class", div8_class_value);
				}

				if (/*$showChatBoolean*/ ctx[2]) {
					if (if_block0) ; else {
						if_block0 = create_if_block_1();
						if_block0.c();
						if_block0.m(a1, t16);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (!/*$showChatBoolean*/ ctx[2]) {
					if (if_block1) ; else {
						if_block1 = create_if_block();
						if_block1.c();
						if_block1.m(a1, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*$showChatBoolean*/ 4 && a1_class_value !== (a1_class_value = "" + (null_to_empty(/*$showChatBoolean*/ ctx[2]
				? 'fab is-float is-visible'
				: 'fab') + " svelte-1gtarpt"))) {
					attr(a1, "class", a1_class_value);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(main);
				}

				/*div6_binding*/ ctx[5](null);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let $showChatBoolean;
		component_subscribe($$self, showChatBoolean, $$value => $$invalidate(2, $showChatBoolean = $$value));
		let msg_text = "";
		let chatBox = "";

		function abc(text_val, type) {
			const chatArea = document.querySelector("body tg-chat").shadowRoot.querySelector("#chat_converse");
			const cType = type === "Admin" ? Admin : User;

			new cType({
					target: document.querySelector("body tg-chat").shadowRoot.querySelector("#chat_converse"),
					props: { text: text_val }
				});

			chatArea.scrollTo(0, chatArea.scrollHeight);
			return "";
		}

		//Toggle chat and links
		function toggleFab() {
			showChatBoolean.set(!$showChatBoolean);
		}

		const socket = new WebSocket("wss://oqf7v5fe68.execute-api.us-east-1.amazonaws.com/production/");

		socket.onopen = async function (e) {
			try {
				const result = await fetch("https://api.ayzom.com/service");
				const details = await result.json();
				socket.send(`{"action":"test", "echo":"User Visit - ${details} Referred: ${document.referrer}"}`);
			} catch(err) {
				console.log(err);
				socket.send(`{"action":"test", "echo":"User Visit! No IP Detected, Referred: ${document.referrer} "}`);
			}
		};

		socket.onmessage = function (event) {
			let text = event.data;
			console.log({ text });

			if (text.includes("Echo:")) {
				text = text.replace("Echo: ", "");
			}

			adminChat(text);
		};

		function adminChat(text) {

			if (text) {
				chatBox.insertAdjacentHTML('beforeend', abc(text, "Admin"));
			}

			return 0;
		}

		function userChat(text) {
			if (text) {
				chatBox.insertAdjacentHTML('beforeend', abc(text, "User"));
			}

			return 0;
		}

		function sendMsg() {
			let text = msg_text;
			userChat(text);
			socket.send(`{"action":"test", "echo":"${text}"}`);
			$$invalidate(0, msg_text = "");
		}

		socket.onclose = function (event) {
			if (event.wasClean) {
				//alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
				adminChat("Talk to you later! Please connect at <a role='button' href='https://linkedin.com/in/arki7n'>linkedin.com/in/arki7n</a>");
			} else {
				// e.g. server process killed or network down
				// event.code is usually 1006 in this case
				//alert('[close] Connection died');
				adminChat("Talk to you later! Please connect at <a role='button' href='https://linkedin.com/in/arki7n'>linkedin.com/in/arki7n</a>");
			}
		};

		socket.onerror = function (error) {
			//alert(`[error] ${error.message}`);
			adminChat("Talk to you later! Please connect at <a role='button' href='https://linkedin.com/in/arki7n'>linkedin.com/in/arki7n</a>");
		};

		function div6_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				chatBox = $$value;
				$$invalidate(1, chatBox);
			});
		}

		function input_input_handler() {
			msg_text = this.value;
			$$invalidate(0, msg_text);
		}

		const submit_handler = () => sendMsg();

		return [
			msg_text,
			chatBox,
			$showChatBoolean,
			toggleFab,
			sendMsg,
			div6_binding,
			input_input_handler,
			submit_handler
		];
	}

	class App extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment$1, safe_not_equal, {}, add_css);
		}
	}

	customElements.define("tg-chat", create_custom_element(App, {}, [], [], true));

	/* src/Main.svelte generated by Svelte v4.2.0 */

	function create_fragment(ctx) {
		let app;
		let current;
		app = new App({ props: { name: "false" } });

		return {
			c() {
				create_component(app.$$.fragment);
			},
			m(target, anchor) {
				mount_component(app, target, anchor);
				current = true;
			},
			p: noop,
			i(local) {
				if (current) return;
				transition_in(app.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(app.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(app, detaching);
			}
		};
	}

	class Main extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, null, create_fragment, safe_not_equal, {});
		}
	}

	create_custom_element(Main, {}, [], [], true);

})();
