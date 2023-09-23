import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography";
import { usePrivy } from "@privy-io/react-auth";

const Login = () => {
  const { login } = usePrivy();
  return (
    <main className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="space-y-2">
        <img src="assets/logo.png" width={220} alt="FRAMED!"></img>
        <TypographyH4 className="text-slate-700 text-base">in it for the art 🫡</TypographyH4>
        <Button size={"lg"} onClick={login}>
          PLAY!
        </Button>
      </div>
    </main>
  );
};
export default Login;
