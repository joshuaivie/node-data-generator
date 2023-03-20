const fs = require("fs");
const faker = require("faker");
const ngfaker = require("ng-faker");
const { writeFile } = require("fs").promises;
const { json2csvAsync } = require("json-2-csv");

const dir = "./test_files/";

const args = process.argv.slice(2);
const numberOfFiles = args[0];
const numberOfRecords = args[1];

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateData = (numberOfRecords) => {
  const result = [];
  for (let i = 0; i < numberOfRecords; i++) {

    const genders = ["female", "male", null, "maaale", "f", "feeeemale"];

    let firstName = ngfaker.name.firstName()
    let lastName = ngfaker.name.lastName()
    let phoneNumber = faker.phone.phoneNumberFormat()
    let gender = faker.random.arrayElement(genders)
    let email = faker.internet.email()
    let dateOfBirth = faker.date.past(70).toLocaleDateString();

    // add dirty data to attributes
    if (i % 3 === 0) {
      // add a number to the first name
      firstName += Math.floor(Math.random() * 10);
    }

    if (i % 5 === 0) {
      // add a number to the first name
      lastName += Math.floor(Math.random() * 10);
    }

    if (i % 7 === 0) {
      // change the date format to something invalid
      dateOfBirth = faker.date.past(50).toISOString().split('T')[0];
    }
    if (i % 11 === 0) {
      // remove the '@' symbol from the email address
      email = email.replace('@', '');
    }

    result.push({
      firstName,
      lastName,
      phoneNumber,
      gender,
      email,
      dateOfBirth
    });
  }
  return result;
};

const convertJSONTOCSV = async (data) => {
  try {
    const csv = await json2csvAsync(data);
    return csv;
  } catch (err) {
    console.error(err);
  }
};

const writeCSV = async (fileName, data) => {
  try {
    await writeFile(dir + fileName, data, "utf8");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  return dd + mm + yyyy;
};

const generateTestFiles = async (numberOfFiles, numberOfRecords) => {
  const date = getDate();

  for (let fileCount = 0; fileCount < numberOfFiles; fileCount++) {
    const fileLabel = String(fileCount + 1).padStart(
      numberOfFiles.toString().length,
      "0"
    );
    const fileName = `${date}.${fileLabel}.mockdata.nifi.elt.test.csv`;
    const testData = generateData(numberOfRecords);
    const csv = await convertJSONTOCSV(testData);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    await writeCSV(fileName, csv);
  }
};

generateTestFiles(numberOfFiles, numberOfRecords);
