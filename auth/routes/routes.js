import {
	completeGithubAuth,
	redirectToGitHub,
} from "../controllers/auth.controller.js";
import User from "../db/models/user.model.js";
import redisConn from "../redis.js";

async function requireAuth(req, reply) {
	const cookie = req.cookies.sessionCookieKey;
	if (!cookie) {
		return reply.redirect("/auth");
	}

	const email = await redisConn.getSessionToken(cookie);
	if (!email) {
		return reply.redirect("/auth");
	}

	req.email = email;
}

export default async function fastifyRoutes(fastify) {
	fastify.get(
		"/",
		{
			preValidation: requireAuth,
		},
		async (req, reply) => {
			const user = await User.findOne({
				where: {
					email: req.email,
				},
			});
			if (!user) {
				return reply.redirect("/auth");
			}

			return reply.render("home", {
				user,
			});
		},
	);

	fastify.post(
		"/convert",
		{
			preValidation: requireAuth,
		},
		async (req, reply) => {
			return reply.from("/convert-yaml", {
				body: req.body,
			});
		},
	);

	fastify.register(
		async (instance) => {
			instance.get("/github", redirectToGitHub);
			instance.get("/github/callback", completeGithubAuth);
			instance.get("/logout", async (req, reply) => {
				const cookie = req.cookies.sessionCookieKey;
				if (!cookie) {
					return reply.redirect("/auth");
				}

				await redisConn.deleteSessionToken(cookie);
				reply
					.clearCookie("sessionCookieKey", {
						path: "/",
						httpOnly: true,
						expires: new Date(0),
					})
					.redirect("/auth");
			});

			instance.get("/", (req, reply) => {
				const cookie = req.cookies.sessionCookieKey;
				if (cookie) {
					return reply.redirect("/");
				}

				reply.render("auth");
			});
		},
		{ prefix: "/auth" },
	);

	fastify.get("/health", (req, reply) => {
		reply.send({ status: "ok" });
	});
}
