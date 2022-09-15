import { faker } from "@faker-js/faker";

export async function createItem() {
  return {
    title: faker.word.noun(),
    url: faker.internet.avatar(),
    description: faker.lorem.paragraph(),
    amount: faker.datatype.number(),
  };
}
