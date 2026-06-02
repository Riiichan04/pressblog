export const ROLES = {
    ADMIN: "ROLE_ADMIN",
    MOD: "ROLE_MOD",
    USER: "ROLE_USER",
    CONTENT_MOD: "ROLE_CONTENT_MOD",
    USER_MOD: "ROLE_USER_MOD",
    COMMENT_MOD: "ROLE_COMMENT_MOD",
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];