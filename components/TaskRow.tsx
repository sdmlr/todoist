import { Colors } from "@/constants/Colors";
import { todos } from "@/db/schema";
import { Todo } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useRef } from "react";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { useMMKV, useMMKVString } from "react-native-mmkv";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface TaskRowProps {
  task: Todo;
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const hasReachedThresholdUp = useSharedValue(false);
  const hadReachedThresholdDown = useSharedValue(false);

  useAnimatedReaction(() => drag.value, (dragValue) => {
    if (Math.abs(dragValue) > 100 && !hasReachedThresholdUp.value) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      hasReachedThresholdUp.value = true;
      hadReachedThresholdDown.value = false;
    } else if (Math.abs(dragValue) < 100 && !hadReachedThresholdDown.value) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      hadReachedThresholdDown.value = true;
      hasReachedThresholdUp.value = false;
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const absDrag = Math.abs(drag.value);
    return {
      // Set opacity to 0 if drag value is <= 1, else full opacity (1)
      opacity: absDrag <= 10 ? 0 : 1,
      backgroundColor: absDrag > 100 ? Colors.secondary : "#8B8A8A",
    };
  });
  

  return (
    <Reanimated.View style={{ flex: 1 }}>
      <Reanimated.View
        style={[
          {
            height: 90,
            backgroundColor: "#8b8a8a",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            flex: 1,
          },
          animatedStyle,
        ]}
      >
        <Ionicons name="calendar-outline" size={24} color="#fff" />
      </Reanimated.View>
    </Reanimated.View>
  );
}

const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const [previouslySelectedDate, setPreviouslySelectedDate] =
    useMMKVString("selectedDate");

  const markAsCompleted = async () => {
    heightAnim.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    opacityAnim.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    await drizzleDb
      .update(todos)
      .set({ completed: 1, date_completed: Date.now() })
      .where(eq(todos.id, task.id));
  };

  // Animated styles for the swipeable component
  const heightAnim = useSharedValue(70);
  const opacityAnim = useSharedValue(1);
  const reanimatedRef = useRef<SwipeableMethods>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      opacity: opacityAnim.value,
    };
  });

  const onSwipeableWillOpen = () => {
    setPreviouslySelectedDate(new Date(task.date_added || 0).toISOString());
    reanimatedRef.current?.close();
    router.push(`/task/date-select`);
  };

  return (
    <Reanimated.View>
      <ReanimatedSwipeable
        ref={reanimatedRef}
        friction={3}
        enableTrackpadTwoFingerGesture={true}
        rightThreshold={100}
        renderRightActions={RightAction}
        onSwipeableOpen={onSwipeableWillOpen}
      >
        {/* <View> */}
        <Link
          href={`/task/${task.id}`}
          className="p-[14px] bg-white border-b border-lightBorder"
          asChild
        >
          <TouchableOpacity>
            <View className="flex-row items-start gap-[10px]">
              <BouncyCheckbox
                textContainerStyle={{ display: "none" }}
                size={25}
                fillColor={task.project_color}
                unFillColor="#fff"
                isChecked={task.completed === 1}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{
                  color: "#000",
                  fontSize: 16,
                  textDecorationLine: "none",
                }}
                onPress={markAsCompleted}
              />
              <Text className="text-base flex-1">{task.name}</Text>
            </View>
            {/* <View className="w-full"> */}
            <Text
              className="text-xs text-dark"
              style={{ marginTop: 4, alignSelf: "flex-end" }}
            >
              {task.project_name}
            </Text>
            {/* </View> */}
          </TouchableOpacity>
        </Link>
        {/* </View> */}
      </ReanimatedSwipeable>
    </Reanimated.View>
  );
};

export default TaskRow;
