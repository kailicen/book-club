import { atom } from "recoil";

interface ProfilePicState {
  url: string | null;
}

const defaultProfilePicState: ProfilePicState = {
  url: null,
};

export const profilePicState = atom<ProfilePicState>({
  key: "profilePicState",
  default: defaultProfilePicState,
});
