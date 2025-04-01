import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, LOG_LEVEL } from "react-native-purchases";

const APIKeys = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
};

interface RevenueCatProps {
  isPro: boolean;
}

const RevenueCatContext = createContext<Partial<RevenueCatProps>>({});

export const RevenueCatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Purchases.configure({
      apiKey: APIKeys[Platform.OS as keyof typeof APIKeys],
    });
    setIsReady(true);

    Purchases.setLogLevel(LOG_LEVEL.ERROR);

    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log("customerInfo:", customerInfo);
      updateCustomerInfo(customerInfo);
    });
  };

  const updateCustomerInfo = async (customerInfo: CustomerInfo) => {
    if (customerInfo.entitlements.active["Pro"] !== undefined) {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  };

  if (!isReady) return <></>;

  return (
    <RevenueCatContext.Provider value={{ isPro }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};
