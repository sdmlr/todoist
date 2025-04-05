import { Button, useWindowDimensions } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const Layout = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="task/new"
        options={{
          presentation: "formSheet",
          title: "",
          headerShown: false,
          sheetAllowedDetents: height > 700 ? [0.25] : "fitToContents",
          sheetGrabberVisible: false,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
        }}
      />
      <Stack.Screen
        name="task/[id]"
        options={{
          presentation: "formSheet",
          title: "",
          headerShown: false,
          sheetAllowedDetents: height > 700 ? [0.25] : "fitToContents",
          sheetGrabberVisible: false,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
        }}
      />
      <Stack.Screen
        name="task/date-select"
        options={{
          presentation: "formSheet",
          title: "Schedule",
          headerShown: true,
          sheetAllowedDetents: height > 700 ? [0.6, 0.9] : "fitToContents",
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: false,
          sheetCornerRadius: 10,
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => router.back()}
              color={Colors.primary}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
