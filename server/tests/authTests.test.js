import request from "supertest";
import authRoutes from "../routes/authRoutes.js";
import express from "express";
import app from "../app.js";
/* const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/api/auth", authRoutes); */

test("Testing login route", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({
      username: "mary123",
      password: "mary123",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("Testing login route - no input", (done) => {
  request(app)
    .post("/api/auth/login")
    .send({
      username: "",
      password: "",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("Sign up route - username exists", (done) => {
  request(app)
    .post("/api/auth/signup")
    .send({
      username: "abcd",
      email: "abcd@123.com",
      password: "abcd",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});

test("Sign up route - no input", (done) => {
  request(app)
    .post("/api/auth/signup")
    .send({
      username: "",
      email: "",
      password: "",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    });
});
