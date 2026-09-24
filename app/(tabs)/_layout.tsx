import TabBar from "@/src/navigation/TabBar";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown: false}} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="Schedule" options={{ title: "Schedule" }} />
      <Tabs.Screen name="Tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="Analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="Assistant" options={{ title: "AI" }} />
    </Tabs>
  );
};
export default TabsLayout;
