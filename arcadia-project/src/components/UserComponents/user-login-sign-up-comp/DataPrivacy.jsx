import { useState } from "react"
import { Link } from "react-router-dom"

export default function DataPrivacy({ onBack, onContinue }) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!termsAccepted || !privacyAccepted) {
      alert("Please accept both Terms and Conditions and Data Privacy Agreement to continue.")
      return
    }
    // Add your logic here for what happens after successful submission
  }

  const isContinueEnabled = termsAccepted && privacyAccepted

  return (
    <div className="uMain-cont flex h-[600px] bg-white">
      <div className="max-w-md mx-auto p-8  flex flex-col items-center text-center">
        <div className="mb-6">
          <h3 className="text-5xl font-semibold">Before we end...</h3>
        </div>

        <p className="text-black mb-6">
          Please read the Terms and Conditions and the <br />
          Data Privacy Agreement to continue.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 accent-arcadia-red cursor-pointer"
          />
          <label htmlFor="termsCheckbox" className="text-black text-sm cursor-pointer">
            I read the Terms and Conditions
          </label>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="privacyCheckbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="w-5 h-5 accent-arcadia-red cursor-pointer"
          />
          <label htmlFor="privacyCheckbox" className="text-black text-sm cursor-pointer">
            I read the Data Privacy Agreement
          </label>
        </div>

        <div className="flex justify-center items-center gap-4">
        <button onClick={onBack} className="registerBtn">
            Return
          </button>
          <button
            onClick={onContinue}
            disabled={!isContinueEnabled}
            className={`genRedBtns ${!isContinueEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Continue
          </button>
        </div>
      </div>

      <div
        className="w-1/2 relative rounded-2xl bg-cover bg-center"
      >
          <img
                        src="/image/hero2.jpeg"
                        alt="Hero Background"
                        className="w-full h-full object-cover rounded-lg" // Add rounded-lg here
                    />

        <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">
            Knowledge that empowers.
          </h2>
        </div>
      </div>
    </div>
  )
}

