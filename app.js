const fs = require("fs");
const faker = require("faker");
const ngfaker = require("ng-faker");
const { writeFile } = require("fs").promises;
const { json2csvAsync } = require("json-2-csv");

const dir = "./test_files/";

const args = process.argv.slice(2);
const numberOfFiles = args[0];
const minRecord = args[1];
const maxRecord = args[2];

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateData = (numberOfRecords) => {
  const result = [];
  for (let i = 0; i < numberOfRecords; i++) {
    const randomDate = faker.date.recent(10);
    const genders = ["female", "male", null];
    const sessionTypes = ["voice", "data", "sms"];
    const sessionType = faker.random.arrayElement(sessionTypes);
    const sessionDuration =
      sessionType === "voice"
        ? String(faker.datatype.number({ min: 1, max: 3600 })).padStart(4, "0")
        : null;
    const sessionCost =
      sessionType === "voice"
        ? String(((parseInt(sessionDuration) * 11) / 100).toFixed(2))
        : sessionType === "sms"
        ? "4"
        : String(faker.datatype.number({ min: 1, max: 10000 }));

    result.push({
      msisdn: faker.phone.phoneNumber("23480#######"),
      first_name: ngfaker.name.firstName(),
      last_name: ngfaker.name.lastName(),
      gender: faker.random.arrayElement(genders),
      address: faker.address.streetAddress(),
      state: ngfaker.address.state(),
      email: faker.internet.email(),
      session_id: faker.datatype.uuid(),
      session_type: sessionType,
      session_date: String(Math.round(randomDate.getTime() / 1000)),
      session_start: randomDate
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{3})/, "$1$3"),
      session_duration: sessionDuration,
      session_cost: sessionCost,
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

const generateTestFiles = async (numberOfFiles, minRecord, maxRecord) => {
  const date = getDate();

  for (let fileCount = 0; fileCount < numberOfFiles; fileCount++) {
    const fileLabel = String(fileCount + 1).padStart(
      numberOfFiles.toString().length,
      "0"
    );
    const fileName = `${date}.${fileLabel}.mockdata.nifi.elt.test.csv`;
    const testData = generateData(randomIntFromInterval(minRecord, maxRecord));
    const csv = await convertJSONTOCSV(testData);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    await writeCSV(fileName, csv);
  }
};

generateTestFiles(numberOfFiles, minRecord, maxRecord);
