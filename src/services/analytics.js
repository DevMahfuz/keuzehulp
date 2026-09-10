/**
 * Analytics for the keuzehulp. No measurement ID in this app.
 * Host shop may inject dataLayer / gtag; we only push events.
 */

function emit(event, params = {}) {
  const safe = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    if (typeof value === "string" && value.length > 200) continue;
    safe[key] = value;
  }
  const payload = { event, ...safe, app: "keuzehulp" };
  if (typeof window === "undefined") return payload;
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", event, safe);
  }
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", payload);
  }
  return payload;
}

export const analytics = {
  bannerView: (props = {}) => emit("keuzehulp_banner_view", props),
  bannerBeamerClicked: (props = {}) => emit("keuzehulp_beamer_clicked", props),
  bannerScreenClicked: (props = {}) => emit("keuzehulp_screen_clicked", props),
  bannerSetClicked: (props = {}) => emit("keuzehulp_set_clicked", props),
  started: (props = {}) => emit("keuzehulp_started", props),
  categorySelected: (category) => emit("category_selected", { category }),
  questionAnswered: (questionId, value, extra = {}) =>
    emit("question_answered", { question_id: questionId, value, ...extra }),
  recommendationViewed: (props = {}) => emit("recommendation_viewed", props),
  fallbackShown: (props = {}) => emit("fallback_shown", props),
  productClicked: (props = {}) => emit("product_clicked", props),
  addToCartClicked: (props = {}) => emit("add_to_cart_clicked", props),
  addToCartSuccess: (props = {}) => emit("add_to_cart_success", props),
  addToCartFailed: (props = {}) => emit("add_to_cart_failed", props),
  addToCartError: (props = {}) => emit("add_to_cart_failed", props),
  completed: (props = {}) => {
    emit("wizard_completed", props);
    return emit("keuzehulp_completed", props);
  },
  restart: () => emit("keuzehulp_restart"),
};
