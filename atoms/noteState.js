const { atom } = require("recoil");

export const noteState = atom({
    key: 'noteState',
    default: []
})