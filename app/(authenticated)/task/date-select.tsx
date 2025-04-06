import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useMMKV, useMMKVString } from "react-native-mmkv";
import { Ionicons } from "@expo/vector-icons";
import { Colors, DATE_COLORS } from "@/constants/Colors";
import { addDays, addWeeks, format, nextSaturday } from "date-fns";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

const Page = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useMMKVString("selectedDate");

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const onSave = (date: Date) => {
    const dateString = date.toISOString();
    setSelectedDate(dateString);
    router.dismiss();
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, date) => {
        // If the user cancels, date will be undefined
        if (date) {
          onSave(date);
        }
      },
      mode: "date",
      display: "default",
      accentColor: Colors.primary,
    });
  };

  return (
    <View className="bg-white justify-center items-center">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => onSave(currentDate)}>
              <Text className="text-primary font-medium text-[18px]">Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="w-full gap-8 py-5">
        <TouchableOpacity
          className="items-center flex-row justify-center gap-5 px-4"
          onPress={() => {
            onSave(new Date());
          }}
        >
          <Ionicons name="today-outline" size={20} color={DATE_COLORS.today} />
          <Text className="text-[16px] font-bold flex-1">Today</Text>
          <Text className="text-[16px] text-dark">
            {format(new Date(), "EEE")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center flex-row justify-center gap-5 px-4"
          onPress={() => {
            onSave(addDays(new Date(), 1));
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.tomorrow}
          />
          <Text className="text-[16px] font-bold flex-1">Tomorrow</Text>
          <Text className="text-[16px] text-dark">
            {format(addDays(new Date(), 1), "EEE")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center flex-row justify-center gap-5 px-4"
          onPress={() => {
            onSave(nextSaturday(new Date()));
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.weekend}
          />
          <Text className="text-[16px] font-bold flex-1">This Weekend</Text>
          <Text className="text-[16px] text-dark">
            {format(nextSaturday(new Date()), "EEE")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center flex-row justify-center gap-5 px-4"
          onPress={() => {
            onSave(addWeeks(new Date(), 1));
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={DATE_COLORS.other}
          />
          <Text className="text-[16px] font-bold flex-1">Next Week</Text>
          <Text className="text-[16px] text-dark">
            {format(addWeeks(new Date(), 1), "EEE")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Button to open DateTimePickerAndroid */}
      {Platform.OS === "android" && (
          <TouchableOpacity
            className="flex-row mt-5 gap-3 justify-center items-center"
            onPress={openDatePicker}
          >
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text className="text-[16px] font-bold">Pick a custom date</Text>
          </TouchableOpacity>
       
      )}
      {Platform.OS === "ios" && (
        <DateTimePicker
          value={new Date(currentDate)}
          mode="date"
          display="inline"
          onChange={(event, date) => {
            const currentDate = date || new Date();
            onSave(currentDate);
          }}
          accentColor={Colors.primary}
        />
      )}
    </View>
  );
};

export default Page;
