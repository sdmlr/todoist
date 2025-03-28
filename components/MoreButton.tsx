import { View, Text, TouchableOpacity } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";
import { ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

type MoreButtonProps = {
  pageName: string;
};

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const copyToClipboard = async () => {
    const path = `todoist://(authenticated)/(tabs)/${pageName.toLocaleLowerCase()}`;
    await Clipboard.setStringAsync(path);
    ToastAndroid.show("Coppied to clipboard", ToastAndroid.SHORT);
    toast.success("Coppied to clipboard");
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity className="">
          <Ionicons name="ellipsis-horizontal-outline" size={39} color={Colors.primary} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="link" onSelect={copyToClipboard}>
          <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "link",
              pointSize: 24,
            }}
          ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>
      </DropdownMenu.Content>

      <DropdownMenu.Group>
        <DropdownMenu.Item key="select">
          <DropdownMenu.ItemTitle>Select Tasks</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "square.stack",
              pointSize: 24,
            }}
          ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Item key="view">
          <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "slider.horizontal.3",
              pointSize: 24,
            }}
          ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Item key="activity">
          <DropdownMenu.ItemTitle>Activity Log</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "chart.xyaxis.line",
              pointSize: 24,
            }}
          ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Root>
  );
};

export default MoreButton;
