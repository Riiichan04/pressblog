import { PublicUserProfileResponse } from "@/common/types/public-user";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import Link from "next/link";

export default function PublicUserCard({ author }: { author: PublicUserProfileResponse }) {
    return (
        <Card key={author.username} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={author.avatar || ""} alt={author.username} className="object-cover" />
                    <AvatarFallback className={`${fallBackColor(author.username)} text-white`}>
                        {getFallback(author.displayName || author.username)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <Link href={`/author/${author.username}`} className="font-bold text-lg hover:text-primary truncate block">
                        {author.displayName}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate">@{author.username}</p>
                </div>
            </CardContent>
        </Card>
    )
}