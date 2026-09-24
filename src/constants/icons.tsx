import { Feather } from "@expo/vector-icons";

const icon = {
  index: (props: any) => (
    <Feather name="home" size={24} {...props} />
  ),
  Schedule: (props: any) => (
    <Feather name="calendar" size={24} {...props} />
  ),
  Tasks: (props: any) => (
    <Feather name="check-square" size={24} {...props} />
  ),
  Analytics: (props: any) => (
    <Feather name="bar-chart-2" size={24} {...props} />
  ),
  Profile: (props: any) => (
    <Feather name="user" size={24} {...props} />
  ),
  Assistant: (props: any) => (
    <Feather name="message-circle" size={24} {...props} />
  ),
};

export { icon };

