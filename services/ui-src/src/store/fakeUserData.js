import { BASE_URL } from "../util/constants";
import { AppRoles } from "../types";

const fakeUserData = {
  AK: {
    name: "Alaska",
    abbr: "AK",
    programType: "medicaid_exp_chip",
    programName: "WTF AK Program Name??",
    // eslint-disable-next-line no-undef
    imageURI: `${BASE_URL}/img/states/ak.svg`,
    formName: "CARTS FY",
    currentUser: {
      role: AppRoles.STATE_USER,
      state: {
        id: "AK",
        name: "Alaska",
      },
      username: "dev-jane.doe@alaska.gov",
    },
  },
  AZ: {
    name: "Arizona",
    abbr: "AZ",
    programType: "separate_chip",
    programName: "AZ Program Name??",
    // eslint-disable-next-line no-undef
    imageURI: `${BASE_URL}/img/states/az.svg`,
    formName: "CARTS FY",
    currentUser: {
      role: AppRoles.STATE_USER,
      state: {
        id: "AZ",
        name: "Arizona",
      },
      username: "dev-john.smith@arizona.gov",
    },
  },
  MA: {
    name: "Massachusetts",
    abbr: "MA",
    programType: "combo",
    programName: "MA Program Name??",
    // eslint-disable-next-line no-undef
    imageURI: `${BASE_URL}/img/states/ma.svg`,
    formName: "CARTS FY",
    currentUser: {
      role: AppRoles.STATE_USER,
      state: {
        id: "MA",
        name: "Massachusetts",
      },
      username: "dev-naoise.murphy@massachusetts.gov",
    },
  },
};
export default fakeUserData;
