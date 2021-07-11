const faker = require('faker')
const ngfaker = require('ng-faker');
const { Parser } = require('json2csv');


function generateData() {
  const result = [];
  for(let i=0; i<1; i++) {
    const randomDate = faker.date.recent(10)

   result.push({
    msisdn: faker.phone.phoneNumber('23480#######'),
    date:  Math.round(randomDate.getTime() / 1000),
    time: randomDate.toLocaleTimeString().replace(/([\d]+:[\d]{3})/, "$1$3"),
    firstName: ngfaker.name.firstName(),
    lastName: ngfaker.name.lastName(),
    gender: faker.name.gender(),
    address: faker.address.streetAddress(),
    state: ngfaker.address.state(),
    email: faker.internet.email(),
    city: faker.address.city(),
    company: faker.company.companyName(),
    userName: faker.internet.userName(),
    phoneNumber: faker.phone.phoneNumber()
   });
  }
  return result;
 }

 console.log(ngfaker.address.state())
