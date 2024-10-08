import path from "node:path";
import * as url from "node:url";
import envSchema from "env-schema";

const schema = {
	type: "object",
	required: [
		"NODE_ENV",
		"POSTGRES_HOST",
		"POSTGRES_USER",
		"POSTGRES_PASSWORD",
		"POSTGRES_DB",
		"GITHUB_CLIENT_ID",
		"GITHUB_CLIENT_SECRET",
		"GITHUB_REDIRECT_URI",
		"REDIS_ADDR",
		"OTEL_SERVICE_NAME",
		"OTEL_EXPORTER_OTLP_ENDPOINT",
	],
	properties: {
		CONVERTER_PORT: {
			type: "number",
			default: 8000,
		},
		AUTH_PORT: {
			type: "number",
			default: 8001,
		},
		LOG_LEVEL: {
			type: "string",
			default: "info",
		},
		NODE_ENV: {
			type: "string",
			default: "development",
			enum: ["development", "testing", "production", "staging"],
		},
		POSTGRES_HOST: {
			type: "string",
			default: "localhost",
		},
		POSTGRES_DB: {
			type: "string",
		},
		POSTGRES_USER: {
			type: "string",
		},
		POSTGRES_PASSWORD: {
			type: "string",
		},
		GITHUB_CLIENT_ID: {
			type: "string",
		},
		GITHUB_CLIENT_SECRET: {
			type: "string",
		},
		GITHUB_REDIRECT_URI: {
			type: "string",
		},
		REDIS_ADDR: {
			type: "string",
		},
		OTEL_SERVICE_NAME: {
			type: "string",
		},
		OTEL_EXPORTER_OTLP_ENDPOINT: {
			type: "string",
		},
	},
};

const config = envSchema({
	schema: schema,
	dotenv: {
		path: path.join(import.meta.dirname, "../.env"),
	},
});

export default {
	converterPort: config.CONVERTER_PORT,
	authPort: config.AUTH_PORT,
	logLevel: config.LOG_LEVEL,
	nodeEnv: config.NODE_ENV,
	postgres: {
		user: config.POSTGRES_USER,
		password: config.POSTGRES_PASSWORD,
		db: config.POSTGRES_DB,
		host: config.POSTGRES_HOST,
	},
	redisAddr: config.REDIS_ADDR,
	github: {
		client_id: config.GITHUB_CLIENT_ID,
		client_secret: config.GITHUB_CLIENT_SECRET,
		redirect_uri: config.GITHUB_REDIRECT_URI,
	},
	otel: {
		service_name: config.OTEL_SERVICE_NAME,
		otlp_endpoint: config.OTEL_EXPORTER_OTLP_ENDPOINT,
	},
};
