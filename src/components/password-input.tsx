import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <Input
                type={show ? "text" : "password"}
                className="pr-10"
                {...props}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
                {show ? <EyeOff size={"1rem"} className="cursor-pointer" /> : <Eye size={"1rem"} className="cursor-pointer" />}
            </button>
        </div>
    );
}