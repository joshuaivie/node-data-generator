const fs = require("fs");
const faker = require("faker");
const ngfaker = require("ng-faker");
const { json2csvAsync } = require("json-2-csv");
const { writeFile } = require("fs").promises;

const dir = "./test_files/";

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
      date: String(Math.round(randomDate.getTime() / 1000)),
      time: randomDate.toLocaleTimeString().replace(/([\d]+:[\d]{3})/, "$1$3"),
      first_name: ngfaker.name.firstName(),
      last_name: ngfaker.name.lastName(),
      gender: faker.random.arrayElement(genders),
      address: faker.address.streetAddress(),
      state: ngfaker.address.state(),
      email: faker.internet.email(),
      session_id: faker.datatype.uuid(),
      session_type: sessionType,
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

const generateTestFiles = async (numberOfFiles, minRecord, maxRecord) => {
  for (let fileCount = 0; fileCount < numberOfFiles; fileCount++) {
    const fileLabel = String(fileCount + 1).padStart(
      numberOfFiles.toString().length,
      "0"
    );
    const fileName = `07112021.${fileLabel}.mockdata.nifi.elt.test.csv`;
    const testData = generateData(randomIntFromInterval(minRecord, maxRecord));
    const csv = await convertJSONTOCSV(testData);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    await writeCSV(fileName, csv);
  }
};

generateTestFiles(1, 100, 120);
