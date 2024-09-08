import { useEffect } from "react";

const PrivateComponent = () => {
  useEffect(() => {
    const privateData = async () => {
      const response = await fetch("/api/privateroute", {
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
    };
    privateData;
  }, []);
  return <div>PrivateComponent</div>;
};

export default PrivateComponent;
