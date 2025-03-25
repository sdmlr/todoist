import { Image, Text, TouchableOpacity, View } from "react-native";
import "../global.css";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
  const redirectUrl = AuthSession.makeRedirectUri();

  const { startSSOFlow: googleOAuth } = useSSO({
    strategy: "oauth_google",
    redirectUrl,
  });
  const { startSSOFlow: appleOAuth } = useSSO({
    strategy: "oauth_apple",
    redirectUrl,
  });
  const { top } = useSafeAreaInsets();
// 
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await googleOAuth();
      console.log(
        "🚀 - handleGoogleOAuth - createdSessionId",
        createdSessionId
      );

      // If sign in was successful, set the active session
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await appleOAuth();
      console.log("🚀 - handleAppleOAuth - createdSessionId", createdSessionId);

      // If sign in was successful, set the active session
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openLink = async () => {
    await WebBrowser.openBrowserAsync("https://galaxies.dev");
  };

  return (
    <View className="gap-[40px]" style={{ paddingTop: top }}>
      <Image
        className="h-[40px] self-center"
        resizeMode="contain"
        source={require("@/assets/images/todoist-logo.png")}
      />
      <Image
        className="h-[200px]"
        resizeMode="contain"
        source={require("@/assets/images/login.png")}
      />
      <View className="gap-[20px] mx-[40px]">
        <TouchableOpacity
          className="flex-row items-center justify-center p-[12px] gap-[10px] rounded-[6px] border-[0.5px] border-[#D9D9D9]"
          onPress={handleAppleSignIn}
        >
          <Ionicons name="logo-apple" size={24} />
          <Text className="text-base font-medium">Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center p-[12px] gap-[10px] rounded-[6px] border-[0.5px] border-[#D9D9D9]"
          onPress={handleGoogleSignIn}
        >
          <Ionicons name="logo-google" size={24} />
          <Text className="text-base font-medium">Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center p-[12px] gap-[10px] rounded-[6px] border-[0.5px] border-[#D9D9D9]">
          <Ionicons name="mail" size={24} />
          <Text className="text-base font-medium">Continue with Email</Text>
        </TouchableOpacity>

        <Text className="text-xs text-center text-lightText">
          By continuing you agree to Todoist's{" "}
          <Text
            className="text-lightText text-xs text-center underline"
            onPress={openLink}
          >
            Terms of Service
          </Text>{" "}
          <Text>
            and{" "}
            <Text
              className="text-lightText text-xs text-center underline"
              onPress={openLink}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </Text>
      </View>
    </View>
  );
}
