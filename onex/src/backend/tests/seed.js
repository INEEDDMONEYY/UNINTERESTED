const { faker } = require('@faker-js/faker');
const Post = require('../models/Post');

const seedPosts = async (count = 5) => {
  const mockPosts = Array.from({ length: count }).map(() => ({
    username: faker.internet.username(),               // ✅ required
    title: faker.lorem.words(3),                       // ✅ required
    description: faker.lorem.paragraph(),              // ✅ required
    picture: faker.image.url(),                        
    city: faker.location.city(),                       
    state: faker.location.state(),                     
    category: faker.word.noun(),                       
    visibility: faker.helpers.arrayElement(['Men', 'Women', 'Both']),
    acknowledgedPayment: faker.datatype.boolean(),     
  }));

  await Post.deleteMany();
  await Post.insertMany(mockPosts);
};

module.exports = seedPosts;
