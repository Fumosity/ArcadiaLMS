import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReturnSupportButton() {
  const navigate = useNavigate();

  const handleReturnToSearch = () => {
    navigate(-1);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <button
      onClick={handleReturnToSearch}
      className="w-[300px] h-[44px] border border-grey rounded-xl px-5 text-md text-black hover:bg-light-gray transition-colors flex items-center justify-center gap-2"
    >
      <span className="w-5 h-5 border border-grey rounded-full bg-gray-100 flex items-center justify-center">
        <ArrowLeft className="w-3 h-3 text-black" />
      </span>
      Return
    </button>
  );
}
