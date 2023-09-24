import { Button } from "./ui/button";
import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const { logout } = usePrivy();

  return (
    <div className="w-full">
      <nav className="justify-between w-full flex border-b border-slate-200 items-center py-1 px-8 z-20">
        {/* <span className="text-red-500 font-bold ">Framed!</span> */}
        <img src="/assets/logo_small.png" className="w-20"></img>
        {/* {user?.wallet ? (
        <p>{user.wallet.address}</p>
          ) : (
        <Button size="sm" onClick={async () => await createWallet()}>
          Create Wallet
        </Button>
          )} */}
        <Button size="sm" variant="outline" onClick={logout}>
          Log out
        </Button>
      </nav>
    </div>
  );
};
export default Navbar;
