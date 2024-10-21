import React from 'react'

const Login = () => {
  return (
    <div className="h-96 justify-center items-center gap-5 inline-flex">
  <div className="w-96 self-stretch flex-col justify-start items-start gap-6 inline-flex">
    <div className="h-96 px-6 py-12 bg-neutral-50 rounded-2xl border border-zinc-300 flex-col justify-start items-center gap-12 flex">
      <img className="w-72 h-14" src="https://via.placeholder.com/274x58" />
      <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-center items-center gap-3.5 inline-flex">
          <div className="self-stretch h-14 flex-col justify-start items-start gap-2.5 flex">
            <div className="w-96 justify-start items-center gap-2.5 inline-flex">
              <div className="w-48 text-black text-base font-medium font-['Zen Kaku Gothic Antique']">Email:</div>
            </div>
            <div className="self-stretch px-2.5 py-0.5 rounded-2xl border border-zinc-300 justify-start items-center gap-2.5 inline-flex">
              <div className="text-black text-base font-medium font-['Zen Kaku Gothic Antique']">shiori.novella@lpunetwork.edu.ph</div>
            </div>
          </div>
          <div className="self-stretch h-14 flex-col justify-start items-start gap-2.5 flex">
            <div className="w-96 justify-between items-center inline-flex">
              <div className="w-48 text-black text-base font-medium font-['Zen Kaku Gothic Antique']">Password:</div>
              <div className="text-[#902323] text-xs font-medium font-['Zen Kaku Gothic Antique'] underline">Forgot password?</div>
            </div>
            <div className="self-stretch px-2.5 py-0.5 rounded-2xl border border-zinc-300 justify-start items-center gap-2.5 inline-flex">
              <div className="text-black text-base font-medium font-['Zen Kaku Gothic Antique']">************</div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-center items-center gap-6 inline-flex">
        <div className="h-8 px-2.5 py-1 bg-zinc-900 rounded-3xl justify-center items-center gap-2.5 flex">
          <div className="text-center text-neutral-50 text-base font-medium font-['Zen Kaku Gothic Antique']">Login</div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Login