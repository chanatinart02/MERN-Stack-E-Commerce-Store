const ProgressStep = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {/* Step 1 */}
      <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
        <span className="ml-2">Login</span>
        <div className="mt-2 text-lg text-center">✅</div>
      </div>

      {/* Step 2 (conditional rendering based on step1) */}
      {step2 && (
        <>
          {/* Progress bar if both step1 and step2 are completed */}
          {step1 && <div className="h-0.5 w-[10rem] bg-green-500"></div>}
          {/* Step 2 */}
          <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
            <span>Shipping</span>
            <div className="mt-2 text-lg text-center">✅</div>
          </div>
        </>
      )}

      {/* Step 3 (conditional rendering based on step1 and step2) */}
      <>
        {/* Progress bar if all three steps are completed */}
        {step1 && step2 && step3 ? (
          <div className="h-0.5 w-[10rem] bg-green-500"></div>
        ) : (
          ""
        )}
        {/* Step 3 */}
        <div className={`${step3 ? "text-green-500" : "text-gray-300"}`}>
          <span className={`${!step3 ? "ml-[10rem]" : ""}`}>Summary</span>
          {/* Checkmark if all three steps are completed */}
          {step1 && step2 && step3 ? (
            <div className="mt-2 text-lg text-center">✅</div>
          ) : (
            ""
          )}
        </div>
      </>
    </div>
  );
};

export default ProgressStep;
