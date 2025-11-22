// Load environment variables at the very beginning
// In production (Dokploy), this will use system environment variables
// In development, this will load from .env files
import * as dotenv from "dotenv";

// Only load .env file in non-production environments
// In production/Dokploy, environment variables should be set as system variables
if (process.env.NODE_ENV !== "production") {
	const result = dotenv.config();
	if (result.error) {
		console.warn(
			"⚠️  No .env file found or error loading .env file:",
			result.error.message,
		);
		console.log("📝 Using system environment variables");
	} else {
		console.log("✅ Loaded environment variables from .env file");
	}
} else {
	console.log("🚀 Production mode: Using system environment variables");
}

// Validate required environment variables
const requiredEnvVars = [
	"DATABASE_URL",
	"CORS_ORIGIN",
	"BETTER_AUTH_SECRET",
	"BETTER_AUTH_URL",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error("❌ Missing required environment variables:");
	missingEnvVars.forEach((envVar) => {
		console.error(`  - ${envVar}`);
	});
	console.warn(
		"⚠️  Application may not function correctly without these variables.",
	);
} else {
	console.log("✅ All required environment variables are loaded");
}

// Log environment status for debugging
console.log("🔧 Environment Configuration:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(
	`  - CORS_ORIGIN: ${process.env.CORS_ORIGIN ? "✓ Set" : "✗ Not set"}`,
);
console.log(
	`  - DATABASE_URL: ${process.env.DATABASE_URL ? "✓ Set" : "✗ Not set"}`,
);
console.log(
	`  - BETTER_AUTH_SECRET: ${process.env.BETTER_AUTH_SECRET ? "✓ Set" : "✗ Not set"}`,
);
console.log(
	`  - BETTER_AUTH_URL: ${process.env.BETTER_AUTH_URL ? "✓ Set" : "✗ Not set"}`,
);

import { createContext } from "@better-t-stack/api/context";
import { appRouter } from "@better-t-stack/api/routers/index";
import { auth } from "@better-t-stack/auth";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// app.use(
// 	"/trpc/*",
// 	trpcServer({
// 		router: appRouter,
// 		createContext: (_opts, context) => {
// 			return createContext({ context });
// 		},
// 	}),
// );

app.get("/", (c) => {
	return c.text("OK");
});

app.get("/debug-env", (c) => {
	return c.json({
		status: "OK",
		environment: {
			NODE_ENV: process.env.NODE_ENV || "development",
			CORS_ORIGIN: process.env.CORS_ORIGIN ? "✓ Set" : "✗ Not set",
			DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Not set",
			BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET
				? "✓ Set"
				: "✗ Not set",
			BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? "✓ Set" : "✗ Not set",
		},
		cors: {
			origin: process.env.CORS_ORIGIN || "NOT SET",
		},
		timestamp: new Date().toISOString(),
	});
});

export default app;
