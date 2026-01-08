export default function SignatureExamples() {
  return (
    <div className="grid grid-cols-2 gap-8 mt-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src="../../../public/images/exemple-1.png"
            alt="Good signature example"
            width={240}
            height={160}
            className="rounded-lg border shadow-md bg-background object-contain"
          />
          <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src="../../../public/images/exemple-2.png"
            alt="Bad signature example - do not upload like this"
            width={240}
            height={160}
            className="rounded-lg border shadow-md bg-background object-contain"
          />
          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
