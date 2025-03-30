import { Colors, DEFAULT_PROJECT_COLOR } from "@/constants/Colors";
import { projects } from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMMKVString } from "react-native-mmkv";

const Page = () => {
  const router = useRouter();
  const { bg } = useLocalSearchParams();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const headerHeight = useHeaderHeight();

  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useMMKVString("selectedColor");

  if (!selectedColor) {
    setSelectedColor(DEFAULT_PROJECT_COLOR);
  }


  const onCreateProject = async () => {
    await drizzleDb.insert(projects).values({
      name: projectName,
      color: selectedColor,
    });
    setSelectedColor(DEFAULT_PROJECT_COLOR);
    router.dismiss();
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={onCreateProject}
              disabled={projectName.length === 0}
            >
              <Text
                className={
                  projectName.length === 0 ? "text-[#ccc]" : "text-primary"
                }
              >
                Create
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="mx-5 bg-white rounded-xl">
        <TextInput
          placeholder="Name"
          value={projectName}
          onChangeText={setProjectName}
          className="border-t-[0.5px] border-b-[0.5px] border-lightBorder p-3 text-base"
          autoFocus
        />
        <Link
          href={"/(authenticated)/(tabs)/browse/new-project/color-select"}
          asChild
        >
          <TouchableOpacity className="flex-row items-center p-3 bg-white gap-4">
            <Ionicons
              name="color-palette-outline"
              size={24}
              color={Colors.dark}
            />
            <Text className="flex-1 text-base font-medium">Color</Text>
            <View
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: selectedColor }}
            />
            <Ionicons name="chevron-forward" size={22} color={Colors.dark} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Page;
