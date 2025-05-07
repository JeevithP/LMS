import { Menu, School, User, Users } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link, useNavigate } from "react-router-dom";
import DarkMode from '@/DarkMode';
import { useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

export default function Navbar() {
    const { user } = useSelector(store => store.auth);
    //console.log(user);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate()
    const logoutHandler = async () => {
        const res = await logoutUser();
        console.log(res);
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Logout Sucessfull");
            navigate("/login");
        }
    }, [isSuccess])
    return (
        <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-4">
                {/* Left Section */}
                <div className="flex items-center gap-2">
                    <School size={"30"} />
                    <Link to="/">
                        <h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1>
                    </Link>
                </div>

                {/* Right Section for Large Screens */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage
                                        className='h-10 w-10 rounded-full'
                                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel> My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    style={{ cursor: "pointer" }}
                                    onClick={() => (window.location.href = "/my-learning")}
                                >
                                    My Learning
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    style={{ cursor: "pointer" }}
                                    onClick={() => (window.location.href = "/profile")}
                                >
                                    Edit Profile
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    style={{ cursor: "pointer" }}
                                    onClick={logoutHandler}
                                >
                                    Log Out
                                </DropdownMenuItem>

                                {user?.role === "instructor" && (
                                    <DropdownMenuItem
                                        style={{ cursor: "pointer" }}
                                        onClick={() => (window.location.href = "/admin/dashboard")}
                                    >
                                        Dashboard
                                    </DropdownMenuItem>
                                )}



                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => { navigate("/login") }}>Login</Button>
                            <Button onClick={() => { navigate("/login") }}>Signup</Button>
                        </div>
                    )}
                    <DarkMode />
                </div>

                {/* Mobile Device Button and Heading for Small Screens */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* E-Learning Heading (Mobile View Only) */}
                    <h1 className="font-extrabold text-lg">E-Learning</h1>

                    {/* Mobile Menu Button */}
                    <MobileDevice user={user} />
                </div>
            </div>
        </div>
    );
}

const MobileDevice = ({ user }) => {
    const navigate = useNavigate();

    return (
        <Sheet>
            <SheetTrigger>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-300"
                    variant="outline"
                >
                    {/* Icon or Text for Mobile Button */}
                    ☰
                </Button>
            </SheetTrigger>
            <SheetContent className='flex flex-col'>
                <SheetHeader className='flex flex-row items-center justify-between'>
                    <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile" >Edit Profile</Link>

                </nav>
                {user?.role === "instructor" && (
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => navigate("/admin/dashboard")} >Dashboard</Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
