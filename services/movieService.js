import { create, getAll } from '../models/testModel.js';

const createTest = async (firstname, lastname, image_url, video_url) => {
  const id = await create(firstname, lastname, image_url, video_url);
  return id;
};
const getAllTests = async () => {
  const tests = await getAll();
  return tests;
};
export { createTest, getAllTests };
