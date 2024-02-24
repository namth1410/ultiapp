import { PathNames } from "../helpers/PathNames";
import { Roles } from "../helpers/Roles";

export const handleHomeRedirect = (myselfRedux, navigate) => {
  let redirectPath = "/";

  switch (myselfRedux?.main_role) {
    case Roles.User:
      redirectPath = `${PathNames.home}`;
      break;
    case Roles.Manager:
      redirectPath = `${PathNames.admin}${PathNames.physicianManagement}`;
      break;
    case Roles.Physician:
      redirectPath = `${PathNames.admin}${PathNames.patientManagement}`;
      break;
    default:
      break;
  }
  navigate(redirectPath);
};
