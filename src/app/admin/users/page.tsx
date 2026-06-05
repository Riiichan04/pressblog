"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, ShieldCheck, Loader2, MoreVertical, ChevronLeft, ChevronRight, UserCog } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { getAllUsers, toggleUserStatus, changeUserRole } from "@/services/admin-service";
import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { ROLES } from "@/common/constants/roles";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { AdminUserResponse } from "@/common/types/admin";

export default function AdminUsersPage() {
    const { t } = useTranslation("admin");
    const { user: currentUser, hasPermission } = useAuth();

    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10;

    const canBanUser = hasPermission(PERMISSIONS.BAN_USER);
    const canUpdateRole = hasPermission(PERMISSIONS.UPDATE_USER_ROLE);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await getAllUsers(page, SIZE);
                setUsers(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("users.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [page, t]);

    const handleToggleStatus = async (targetUser: AdminUserResponse) => {
        if (targetUser.id === currentUser?.id) {
            toast.error(t("users.messages.cannotBanSelf"));
            return;
        }

        setProcessingId(targetUser.id);
        try {
            await toggleUserStatus(targetUser.id);
            toast.success(t("users.messages.statusSuccess"));

            setUsers(prev => prev.map(u =>
                u.id === targetUser.id ? { ...u, active: !u.active } : u
            ));
        } catch {
            toast.error(t("approvals.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        setProcessingId(userId);
        try {
            await changeUserRole(userId, newRole);
            toast.success(t("users.messages.roleSuccess"));

            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, roleName: newRole } : u
            ));
        } catch {
            toast.error(t("approvals.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case ROLES.ADMIN: return "bg-purple-500 hover:bg-purple-600";
            case ROLES.CONTENT_MOD: return "bg-blue-500 hover:bg-blue-600";
            case ROLES.COMMENT_MOD: return "bg-teal-500 hover:bg-teal-600";
            default: return "bg-zinc-500 hover:bg-zinc-600";
        }
    };

    return (
        <div className="space-y-6  p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("users.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("users.description")}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Danh sách tài khoản ({users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("users.table.user")}</TableHead>
                                    <TableHead>{t("users.table.role")}</TableHead>
                                    <TableHead>{t("users.table.status")}</TableHead>
                                    <TableHead>{t("users.table.joined")}</TableHead>
                                    <TableHead className="text-right">{t("users.table.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((targetUser) => (
                                        <TableRow key={targetUser.id}>
                                            {/* Info */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={targetUser.avatarUrl || ""} alt={targetUser.username} />
                                                        <AvatarFallback className={`${fallBackColor(targetUser.username)} text-white text-xs`}>
                                                            {getFallback(targetUser.displayName || targetUser.username)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">
                                                            {targetUser.displayName || targetUser.username}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{targetUser.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {/* Roles */}
                                            <TableCell>
                                                {canUpdateRole && targetUser.id !== currentUser?.id ? (
                                                    <Select
                                                        defaultValue={targetUser.roleName}
                                                        onValueChange={(val) => handleRoleChange(targetUser.id, val)}
                                                        disabled={processingId === targetUser.id}
                                                    >
                                                        <SelectTrigger className="w-35 h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={ROLES.USER}>User</SelectItem>
                                                            <SelectItem value={ROLES.CONTENT_MOD}>Content Mod</SelectItem>
                                                            <SelectItem value={ROLES.COMMENT_MOD}>Comment Mod</SelectItem>
                                                            <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Badge className={getRoleBadgeColor(targetUser.roleName)}>
                                                        {targetUser.roleName.replace('ROLE_', '')}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            {/* Status */}
                                            <TableCell>
                                                {targetUser.active ? (
                                                    <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20">
                                                        {t("users.status.active")}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 dark:bg-red-950/20">
                                                        {t("users.status.banned")}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            {/* Joined day */}
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(targetUser.createdAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            {/* Action  */}
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={processingId === targetUser.id}>
                                                            {processingId === targetUser.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreVertical className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {canBanUser && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggleStatus(targetUser)}
                                                                className={targetUser.active ? "text-red-600" : "text-green-600"}
                                                            >
                                                                {targetUser.active ? (
                                                                    <><ShieldAlert className="h-4 w-4 mr-2 text-red-600" /> {t("users.actions.ban")}</>
                                                                ) : (
                                                                    <><ShieldCheck className="h-4 w-4 mr-2" /> {t("users.actions.unban")}</>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 pt-4">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                                <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                            </Button>
                            <div className="text-sm font-medium mx-2">
                                Trang {page + 1} / {totalPages}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                Sau <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}