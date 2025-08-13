import Axios from "axios";

const createCpClient = () => {
  const baseURL =
    process.env.REACT_APP_API_BASE_URL ||
    "http://a551937d589ef4c34871b54a8a65e5be-1186892383.us-east-1.elb.amazonaws.com"; 

  const basicUsername = process.env.REACT_APP_FAST_NAME || 'fast_name';
  const basicPassword = process.env.REACT_APP_FAST_PASSWORD || 'fast_password';

  const basicAuthHeader = (() => {
    if (!basicUsername || !basicPassword) {
      if (typeof console !== "undefined") {
        console.warn(
          "Missing REACT_APP_FAST_NAME or REACT_APP_FAST_PASSWORD; Basic Auth header will be empty."
        );
      }
      return null;
    }
    try {
      // Browser
      return `Basic ${btoa(`${basicUsername}:${basicPassword}`)}`;
    } catch {
      // Node (during SSR/build)
      // eslint-disable-next-line no-undef
      return typeof Buffer !== "undefined"
        ? `Basic ${Buffer.from(`${basicUsername}:${basicPassword}`, "utf-8").toString("base64")}`
        : null;
    }
  })();

  const client = Axios.create({
    baseURL,
    timeout: 30000,
    headers: basicAuthHeader ? { Authorization: basicAuthHeader } : {},
    // withCredentials: true,
  });

  // Request interceptor: keep Basic on every request, set Content-Type, append profile_id
  client.interceptors.request.use(
    (config) => {
      // Always enforce Basic Auth
      if (basicAuthHeader) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = basicAuthHeader;
      }

      // Content-Type logic
      if (config.data instanceof FormData) {
        if (config.headers) delete config.headers["Content-Type"];
      } else {
        if (config.headers) config.headers["Content-Type"] = "application/json";
      }

      // Optional: pass profile_id as query param
      const profileId = typeof window !== "undefined" ? localStorage.getItem("profile_id") : null;
      if (profileId && profileId !== "null" && profileId !== "undefined") {
        config.params = {
          ...config.params,
          profile_id: profileId,
        };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // No refresh logic — return responses/errors as-is
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return client;
};

const cpClient = createCpClient();

export default cpClient;
