import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

const Login = () => {
  const { login } = usePrivy();
  return (
    <main className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="space-y-6">
        <img src="assets/logo.png" width={220} alt="FRAMED!"></img>
        <Button size={"lg"} onClick={login}>
          PLAY!
        </Button>
      </div>
    </main>
  );
};
export default Login;
