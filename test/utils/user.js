const UserModel = require('../../models/user');

const invalidId = () => '5edbd0b2b05bc5322cd2f7a6';

const validData = (number) => ({
  "name": `Test User${number ? ` Number ${number}` : ''}`,
  "email": `test${number ? `.${number}` : ''}@user.com`,
  "password": `testing${number ? number : ''}`,
  "avatar": `test${number ? `-${number}` : ''}-avatar.jpg`,
  "roles": ["admin"]
});

const multipleValidData = (total = 1) => (
  [ ...Array(total) ].map((_, index) => (validData(index + 1)))
);

const updatedData = (originalData) => {
  const data = originalData || validData();
  return {
    ...data,
    "name": `Updated ${data.name}`,
    "email": `updated.${data.email}`,
    "password": `${data.password}-updated`,
  };
};

const createSeveralUsers = async (total) => {
  const users = [];
  const randomCount = total || (Math.round(Math.random() * 10) + 1);
  const usersData = multipleValidData(randomCount);
  for (const data of usersData)
    users.push(await UserModel.create(data));

  return users;
};

const pickOne = (usersList = []) => {
  return usersList[Math.round(Math.random() * (usersList.length - 1))];
};

module.exports = {
  invalidId,
  validData,
  updatedData,
  multipleValidData,
  createSeveralUsers,
  pickOne
};