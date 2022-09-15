import app from "../src/app";
import supertest from "supertest";
import { createItem } from "./factory/itemFactory";
import { prisma } from "../src/database";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = await createItem();
    console.log(item);
    const result = await supertest(app).post("/items").send(item);
    expect(result.status).toBe(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = await createItem();
    await supertest(app).post("/items").send(item);
    const result = await supertest(app).post("/items").send(item);
    expect(result.status).toBe(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items").send();
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual ao item cadastrado", async () => {
    const item = await createItem();
    await supertest(app).post("/items").send(item);
    const foundItem = await prisma.items.findFirst({
      where: { title: item.title },
    });
    const result = await supertest(app).get(`/items/${foundItem.id}`).send();
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const id = 1000;
    const result = await supertest(app).get(`/items/${id}`).send();
    expect(result.status).toBe(404);
    expect(result.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
