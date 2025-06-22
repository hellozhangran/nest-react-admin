import { faker } from "@faker-js/faker";
import { http, HttpResponse, delay } from "msw";

import { UserApi } from "@/api/services/userService";

import { USER_LIST } from "../assets";

const userList = http.get("/api/user", async () => {
	await delay(1000);
	return HttpResponse.json(
		Array.from({ length: 10 }).map(() => ({
			fullname: faker.person.fullName(),
			email: faker.internet.email(),
			avatar: faker.image.avatarGitHub(),
			address: faker.location.streetAddress(),
		})),
		{
			status: 200,
		},
	);
});

export default [signIn, userList];
