const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 text-center";
      case "error":
        return "bg-red-100 text-red-800 text-center";

      default:
        return "bg-blue-100 text-blue-800 text-center";
    }
  };
  return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>;
};

export default Message;
