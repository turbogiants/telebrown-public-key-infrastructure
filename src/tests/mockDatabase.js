// mock functions from database
const createUser = jest.fn();
const getUser = jest.fn();
const updateExisting = jest.fn();
const idExists = jest.fn();
const updatePublicKey = jest.fn();
const getPublicKey = jest.fn();

module.exports = {
    createUser,
    getUser,
    updateExisting,
    idExists,
    updatePublicKey,
    getPublicKey
};
