import { fakerEN_US, fakerPL, fakerKA_GE } from "@faker-js/faker";
import { UserRecord, Region } from "../types/types";

const getLocaleFaker = (region: Region) => {
  return region === "Poland"
    ? fakerPL
    : region === "Georgia"
    ? fakerKA_GE
    : fakerEN_US;
};

export const generateUserRecord = (
  index: number,
  region: Region
): UserRecord => {
  const faker = getLocaleFaker(region);

  return {
    index,
    id: faker.string.uuid(),
    name: `${faker.person.firstName()} ${faker.person.middleName()} ${faker.person.lastName()}`,
    address: `${faker.location.country()}, ${faker.location.city()}, ${faker.location.street()}`,
    phone: faker.phone.number({ style: "international" }),
  };
};

export const generateRecords = (
  page: number,
  seed: string,
  region: Region,
  count: number
): UserRecord[] => {
  const faker = getLocaleFaker(region);

  faker.seed(parseInt(seed + page, 36));
  const records = [];
  for (let i = 1; i <= count; i++) {
    records.push(generateUserRecord(i + (page - 1) * count, region));
  }
  return records;
};

export const injectErrors = (
  record: UserRecord,
  errorCount: number
): UserRecord => {
  const newRecord = { ...record };
  for (let i = 0; i < errorCount; i++) {
    const errorType = Math.random();
    if (errorType < 0.33) {
      newRecord.name = deleteRandomCharacter(newRecord.name);
    } else if (errorType < 0.66) {
      newRecord.name = addRandomCharacter(newRecord.name);
    } else {
      newRecord.name = swapAdjacentCharacters(newRecord.name);
    }
  }
  return newRecord;
};

const deleteRandomCharacter = (str: string): string => {
  const index = Math.floor(Math.random() * str.length);
  return str.slice(0, index) + str.slice(index + 1);
};

const addRandomCharacter = (str: string): string => {
  const index = Math.floor(Math.random() * str.length);
  const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return str.slice(0, index) + randomChar + str.slice(index);
};

const swapAdjacentCharacters = (str: string): string => {
  const index = Math.floor(Math.random() * (str.length - 1));
  return (
    str.slice(0, index) + str[index + 1] + str[index] + str.slice(index + 2)
  );
};
