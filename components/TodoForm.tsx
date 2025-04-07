import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Todo } from "@/types/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { projects, todos } from "@/db/schema";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, DATE_COLORS } from "@/constants/Colors";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import { format, isSameDay, isTomorrow } from "date-fns";

type TodoFormProps = {
  todo?: Todo & {
    project_name: string;
    project_color: string;
    project_id: number;
  };
};

type TodoFormData = {
  name: string;
  description: string;
};

const TodoForm = ({ todo }: TodoFormProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
    },
    mode: "onChange",
  });

  const [showProjects, setShowProjects] = useState(false);
  const { data } = useLiveQuery(drizzleDb.select().from(projects));
  const [selectedProject, setSelectedProject] = useState(
    todo?.project_id
      ? {
          id: todo.project_id,
          name: todo.project_name,
          color: todo.project_color,
        }
      : {
          id: 1,
          name: "Inbox",
          color: "#000",
        }
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    todo?.due_date ? new Date(todo.due_date) : new Date()
  );

  const [previouslySelectedDate, setPreviouslySelectedDate] =
    useMMKVString("selectedDate");

  useEffect(() => {
    if (previouslySelectedDate) {
      setSelectedDate(new Date(previouslySelectedDate));
      setPreviouslySelectedDate(undefined);
    }
  }, [previouslySelectedDate]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (todo) {
      //UPDATE
      await drizzleDb
        .update(todos)
        .set({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          due_date: selectedDate.getTime(),
        })
        .where(eq(todos.id, todo.id));
    } else {
      //create
      await drizzleDb.insert(todos).values({
        name: data.name,
        description: data.description,
        project_id: selectedProject.id,
        priority: 0,
        date_added: Date.now(),
        completed: 0,
        due_date: selectedDate.getTime(),
      });
    }
  };

  const changeDate = () => {
    const dateString = selectedDate.toISOString();
    setPreviouslySelectedDate(dateString);
    router.push("/task/date-select");
  };

  const getDateObject = (date: Date) => {
    if (isSameDay(date, new Date())) {
      return {
        name: "Today",
        color: DATE_COLORS.today,
      };
    } else if (isTomorrow(new Date(date))) {
      return {
        name: "Tomorrow",
        color: DATE_COLORS.tomorrow,
      };
    } else {
      return {
        name: format(new Date(date), "EEE, d MMM"),
        color: DATE_COLORS.other,
      };
    }
  };

  return (
    <View>
      <Modal visible={showProjects} transparent={true} animationType="fade" onRequestClose={() => {
        setShowProjects(false)
      }}>
        <View className="flex-1 justify-center items-center">
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 16,
              boxShadow: "0 0 10 px 0 rgba(0, 0, 0, 0.2)",
              width: Dimensions.get("window").width - 60,
              height: 200,
              elevation: 5,
            }}
          >
            <Text>Projects</Text>
          </View>
        </View>
      </Modal>

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          backgroundColor: "#fff",
          gap: 12,
          paddingTop: 16,
        }}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Task name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoFocus
              autoCorrect={false}
              style={{ fontSize: 20, paddingHorizontal: 16 }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              style={{ fontSize: 18, paddingHorizontal: 16 }}
            />
          )}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          className="space-x-2"
          style={{ flexDirection: "row", paddingHorizontal: 16 }}
        >
          <Pressable
            onPress={() => changeDate()}
            className="border-[0.5px] border-lightBorder rounded-md justify-center items-center flex-row px-3"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color={getDateObject(selectedDate).color}
            />
            <Text
              className="text-[14px] font-medium"
              style={{ color: getDateObject(selectedDate).color }}
            >
              {getDateObject(selectedDate).name}
            </Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={({ pressed }) => {
              return [
                {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: Colors.lightBorder,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                },
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="flag-outline" size={24} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Priority</Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons name="location-outline" size={20} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Location</Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons name="pricetags-outline" size={20} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Label</Text>
          </Pressable>
        </ScrollView>

        <View
          className="flex-row items-center border-t-[0.5px] border-lightBorder justify-between"
          style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          <Pressable
            onPress={() => setShowProjects(true)}
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={[
              { paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
              { opacity: errors.name ? 0.5 : 1 },
            ]}
          >
            {selectedProject.id === 1 && (
              <Ionicons
                name="file-tray-outline"
                size={20}
                color={Colors.dark}
              />
            )}

            {selectedProject.id !== 1 && (
              <Text style={{ color: selectedProject.color }}>
                #{selectedProject.id}
              </Text>
            )}
            <Text className="text-[14px] text-dark font-medium">
              {selectedProject.name}
            </Text>
            <Ionicons name="caret-down" size={20} color={Colors.dark} />
          </Pressable>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="rounded-full"
            style={{
              backgroundColor: Colors.dark,
              padding: 6,
              opacity: errors.name ? 0.5 : 1,
            }}
          >
            <Ionicons name="arrow-up" size={24} color={"#fff"} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default TodoForm;
