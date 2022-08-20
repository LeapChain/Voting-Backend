const request = require("supertest");
const app = require("../../index");
const db = require("../db/testDb");

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("POST /api/v1/users/create", () => {
  it("should return account number and nonce for valid request", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
      .send({
        accountNumber:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      })
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("nonce");
  });

  it("should return 400 bad request if account number invalid", async () => {
    const res = await request(app)
      .post("/api/v1/users/create")
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
