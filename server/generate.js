var faker = require('faker');

var database = { users: []};

for (var i = 1; i<= 20; i++) {
  database.users.push({
    id: i,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    prefix: faker.name.prefix(),
    title: faker.name.title(),    
    jobDescriptor: faker.name.jobDescriptor(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    imageUrl: faker.image.avatar(),

  });
}

console.log(JSON.stringify(database));