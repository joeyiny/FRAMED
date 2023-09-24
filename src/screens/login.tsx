import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography";
import { usePrivy } from "@privy-io/react-auth";

const Login = () => {
  const { login } = usePrivy();
  return (
    <main className="flex items-center justify-center min-h-screen min-w-screen">
      <img src="assets/frame.png" className="w-[480px] absolute -z-20" />
      <div className="space-y-2 flex flex-col items-center">
        <img src="assets/logo.png" width={220} alt="FRAMED!" />
        {/* the image below */}
        <img src="assets/sticker.png" className="absolute right-[450px] bottom-[90px]" width={320} />
        <TypographyH4 className="text-slate-700 text-base">in it for the art 🫡</TypographyH4>

        {/* <TypographyH4 className="text-slate-700 text-base">Groundbreaking encrypted blockchain game</TypographyH4> */}
        <Button size={"lg"} onClick={login}>
          PLAY!
        </Button>
      </div>
    </main>
  );
};
export default Login;
