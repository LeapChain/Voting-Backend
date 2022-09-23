const request = require("supertest");
const jwt = require("jsonwebtoken");

const getOrCreateUser = require("../../src/utils/getOrCreateUser");
const app = require("../../index");
const db = require("../../src/db/testDb");
const {
  GOVERNOR_REQUEST_FEE,
  TREASURY_ACCOUNT_NUMBER,
  MemoType,
  JWT_SECRET_KEY,
} = require("../../src/constants");

beforeAll(async () => {
  await db.connect();
  secretKey =
    "0000000000000000000000000000000000000000000000000000000000000000";
  publicKey =
    "3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29";
});
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const generateUserJWT = async () => {
  const user = await getOrCreateUser(publicKey);
  const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken: accessToken, userId: user._id };
};

const generateBlankJWT = async () => {
  const accessToken = jwt.sign({}, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken: accessToken };
};

const generateGovernorJWT = async () => {
  const user = await getOrCreateUser(publicKey);
  user.type = "GOVERNOR";
  user.save();
  const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken: accessToken };
};

const generateGovernorWithChangedUsernameJWT = async () => {
  const user = await getOrCreateUser(publicKey);
  user.type = "GOVERNOR";
  user.usernameChanged = true;
  user.save();
  const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken: accessToken };
};

const generateGovernorWithDuplicateUsernameJWT = async () => {
  const user = await getOrCreateUser(publicKey);
  user.type = "GOVERNOR";
  user.save();

  const duplicatedUser = await getOrCreateUser(secretKey);
  duplicatedUser.username = "duplicateUsername";
  duplicatedUser.save();

  const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  return { accessToken: accessToken };
};

describe("POST /api/v1/users/create", () => {
  it("should return account number and nonce for valid request", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("nonce");
  });

  it("should return 400 bad request if account number invalid", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        accountNumber: "invalidAccountNumber",
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "accountNumber must be 64 character long..",
            param: "accountNumber",
            location: "body",
          }),
        ]),
      })
    );
  });
});

describe("POST /api/v1/users/apply", () => {
  it("should check if the no authorization token passed", async () => {
    const res = await request(app)
      .post("/api/v1/governors/apply")
      .send()
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "Authentication Failed: Please include `Authorization: Bearer JWT` in your headers.",
      })
    );
  });

  it("should check if the valid JWT token passed", async () => {
    const res = await request(app)
      .post("/api/v1/governors/apply")
      .send()
      .set("Accept", "application/json")
      .set("Authorization", "Bearer JWT");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Authentication Failed: Invalid access token.",
      })
    );
  });

  it("should return 404 if user matching JWT not found", async () => {
    const { accessToken } = await generateBlankJWT();
    const res = await request(app)
      .post("/api/v1/governors/apply")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "User validation failed: User associated with that JWT does not exist.",
      })
    );
  });

  it("should return 403 if the user is already a governor", async () => {
    const { accessToken } = await generateGovernorJWT();
    const res = await request(app)
      .post("/api/v1/governors/apply")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "user with type governor can not apply to be a governor",
      })
    );
  });

  it("should return payment info for valid request", async () => {
    const { accessToken, userId } = await generateUserJWT();
    const res = await request(app)
      .post("/api/v1/governors/apply")
      .send({
        accountNumber: publicKey,
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("paymentInfo");
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toEqual(
      expect.objectContaining({
        paymentInfo: expect.objectContaining({
          accountNumber: TREASURY_ACCOUNT_NUMBER,
          metadata: `${MemoType.GOVERNOR_REQUEST}_${userId}`,
          amount: GOVERNOR_REQUEST_FEE,
        }),
      })
    );
  });
});

describe("PATCH /api/v1/users", () => {
  it("should check if the no authorization token passed", async () => {
    const res = await request(app)
      .patch("/api/v1/users")
      .send()
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "Authentication Failed: Please include `Authorization: Bearer JWT` in your headers.",
      })
    );
  });

  it("should return 401 if invalid JWT token passed", async () => {
    const res = await request(app)
      .patch("/api/v1/users")
      .send()
      .set("Accept", "application/json")
      .set("Authorization", "Bearer JWT");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Authentication Failed: Invalid access token.",
      })
    );
  });

  it("should return 404 if user matching JWT not found", async () => {
    const { accessToken } = await generateBlankJWT();
    const res = await request(app)
      .patch("/api/v1/users")
      .send({
        username: "testuser",
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          "User validation failed: User associated with that JWT does not exist.",
      })
    );
  });

  it("should return 400 if username length is invalid", async () => {
    const { accessToken } = await generateUserJWT();
    const res = await request(app)
      .patch("/api/v1/users")
      .send({
        username: "a",
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "username must be between 3-32 character long.",
            param: "username",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 400 if username contains invalid characters", async () => {
    const { accessToken } = await generateUserJWT();
    const res = await request(app)
      .patch("/api/v1/users")
      .send({
        username: "a!@#",
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: "username can only contain alphanumeric and - characters.",
            param: "username",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 409 if username is taken", async () => {
    const { accessToken } = await generateGovernorWithDuplicateUsernameJWT();

    const res = await request(app)
      .patch("/api/v1/users")
      .send({
        username: "duplicateUsername",
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Username is already taken.",
      })
    );
  });

  it("should return 403 if user is not governor", async () => {
    const { accessToken } = await generateUserJWT();

    const res = await request(app)
      .patch("/api/v1/users")
      .send({
        username: "testuser1",
      })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "user type GOVERNOR is required to change the username.",
      })
    );
  });

  it("should return 403 if username is already changed", async () => {
    const { accessToken } = await generateGovernorWithChangedUsernameJWT();

    const res = await request(app)
      .patch("/api/v1/users")
      .send({ username: "testuser1" })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Username can only be changed once." })
    );
  });

  it("should return 200 for a valid request", async () => {
    const { accessToken } = await generateGovernorJWT();
    const res = await request(app)
      .patch("/api/v1/users")
      .send({ username: "testuser1" })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("type");
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("usernameChanged");

    expect(res.body.username).toBe("testuser1");
    expect(res.body.usernameChanged).toBe(true);
  });
});
