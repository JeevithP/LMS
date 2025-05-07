//U03TKaUokd7AuuKT
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi.js"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // default
    });

    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSucess }] = useRegisterUserMutation();
    const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSucess }] = useLoginUserMutation();
    const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        } else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    };
    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        console.log(loginIsSucess);
        const res = await action(inputData);
        console.log(res);
        
        console.log(loginIsSucess);
    };
    useEffect(() => {
        if (registerIsSucess && registerData) {
            toast.success(registerData.message || "Signup Successful!");
            navigate("/");
        }
        if (loginIsSucess && loginData) {
            toast.success(loginData.message || "Login Successful!");
            navigate("/");
        }
        if (registerError) {
            toast.error(registerError.data?.message || "Signup Failed.");
        }
        if (loginError) {
            toast.error(loginError.data?.message || "Login Failed.");
        }
    }, [registerIsSucess, registerData, registerError, loginIsSucess, loginData, loginError]);


    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUp</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>SignUp</CardTitle>
                            <CardDescription>
                                Create Your Account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" placeholder="Eg. jeevith" required="true" name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" placeholder="Eg. jeev123@gmail.com" required={true} name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" placeholder="" required={true} name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    name="role"
                                    value={signupInput.role}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                </select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={(e) => handleRegistration("signup")}>
                                {
                                    registerIsLoading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : "SignUp"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter Acoount Details to login
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Email</Label>
                                <Input type="email" placeholder="Eg. jeev123@gmail.com" required={true} name="email" value={loginInput.email} onChange={(e) => changeInputHandler(e, "login")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input type="password" placeholder="" required={true} name="password" value={loginInput.password} onChange={(e) => changeInputHandler(e, "login")} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={(e) => handleRegistration("login")}>
                                {
                                    loginIsLoading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : "Login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Login