import mixpanel from "mixpanel-browser";

mixpanel.init(import.meta.env.VITE_REACT_APP_MIXPANEL_TOKEN as string, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});
export default mixpanel;
