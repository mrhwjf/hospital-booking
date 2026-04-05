export const USER_PROFILE_UPDATED_EVENT = "hb:user-profile-updated";

const STORAGE_KEYS = {
    authToken: "auth_token",
    role: "vai_tro",
    userId: "user_id",
    patientId: "benh_nhan_id",
    userName: "user_name",
    payload: "payload",
    userAvatar: "user_avatar",
};

const trimString = (value) =>
    typeof value === "string" ? value.trim() : "";

const setStorageValue = (key, rawValue) => {
    const value = trimString(rawValue);
    const currentValue = localStorage.getItem(key) || "";

    if (value) {
        if (currentValue !== value) {
            localStorage.setItem(key, value);
            return true;
        }
        return false;
    }

    if (currentValue) {
        localStorage.removeItem(key);
        return true;
    }

    return false;
};

export const emitUserProfileUpdated = () => {
    window.dispatchEvent(new Event(USER_PROFILE_UPDATED_EVENT));
};

export const getStoredAuthToken = () =>
    localStorage.getItem(STORAGE_KEYS.authToken) || "";

export const getStoredUserName = () =>
    localStorage.getItem(STORAGE_KEYS.userName) || "";

export const getStoredUserAvatar = () =>
    localStorage.getItem(STORAGE_KEYS.userAvatar) || "";

export const setStoredUserProfile = ({ userName, avatarUrl } = {}) => {
    let hasChanged = false;

    if (userName !== undefined) {
        hasChanged = setStorageValue(STORAGE_KEYS.userName, userName) || hasChanged;
    }

    if (avatarUrl !== undefined) {
        hasChanged =
            setStorageValue(STORAGE_KEYS.userAvatar, avatarUrl) || hasChanged;
    }

    if (hasChanged) {
        emitUserProfileUpdated();
    }
};

export const clearStoredAuthState = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    emitUserProfileUpdated();
};

export const subscribeUserProfileUpdates = (listener) => {
    if (typeof listener !== "function") {
        return () => { };
    }

    const handleChange = () => {
        listener({
            isAuthenticated: Boolean(getStoredAuthToken()),
            userName: getStoredUserName(),
            avatarUrl: getStoredUserAvatar(),
        });
    };

    window.addEventListener("storage", handleChange);
    window.addEventListener(USER_PROFILE_UPDATED_EVENT, handleChange);

    return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(USER_PROFILE_UPDATED_EVENT, handleChange);
    };
};
