import { useWindowDimensions } from "react-native";
import { Stack } from "expo-router";

const Layout = () => {
  const { height } = useWindowDimensions();
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
    </Stack>
  );
};

export default Layout;
