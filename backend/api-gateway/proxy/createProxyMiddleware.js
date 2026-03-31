import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import { serviceUrls } from "../../shared/config/serviceConfig.js";

export function createProxyMiddleware(serviceName) {
  return (req, res) => {
    const targetBaseUrl = serviceUrls[serviceName];

    if (!targetBaseUrl) {
      return res.status(500).json({
        message: `Service '${serviceName}' is not configured`,
      });
    }

    const targetUrl = new URL(req.originalUrl, targetBaseUrl);
    const client = targetUrl.protocol === "https:" ? https : http;

    const proxyRequest = client.request(
      targetUrl,
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: targetUrl.host,
          ...(req.user && { "x-user-id": req.user.userId })
        },
      },
      (proxyResponse) => {
        res.status(proxyResponse.statusCode ?? 502);

        Object.entries(proxyResponse.headers).forEach(([header, value]) => {
          if (value !== undefined) {
            res.setHeader(header, value);
          }
        });

        proxyResponse.pipe(res);
      }
    );

    proxyRequest.on("error", (error) => {
      console.error(`Gateway proxy error for ${serviceName}:`, error.message);

      if (!res.headersSent) {
        res.status(502).json({
          message: `${serviceName} service is unavailable`,
        });
      }
    });

    req.pipe(proxyRequest);
  };
}
