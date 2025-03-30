import { PROJECT_COLORS, DEFAULT_PROJECT_COLOR } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useMMKVString } from "react-native-mmkv";

const Page = () => {
  const [selected, setSelected] = useMMKVString("selectedColor");
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const onColorSelect = (color: string) => {
    setSelected(color);
    // router.setParams({ bg: color });
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      <View className="flex-row flex-grow flex-wrap justify-center">
        {PROJECT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            className="h-[60px] w-[60px] m-[5px] rounded-full justify-center items-center"
            style={{ backgroundColor: color }}
            onPress={() => onColorSelect(color)}
          >
            {selected === color && (
              <Ionicons name="checkmark" size={24} color={"#fff"} style={{}} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default Page;
