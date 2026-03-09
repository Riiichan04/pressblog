import { fallbackAvatarBackgrounds } from "../constants/fallback-avatar";

const colorIndex = (username: string) => (username.charCodeAt(0) || 0) % fallbackAvatarBackgrounds.length;

export const getFallback = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
};

export const fallBackColor = (username: string) => fallbackAvatarBackgrounds[colorIndex(username)]