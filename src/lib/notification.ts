import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications"
import { Platform } from "react-native";


const channel_id = "lsync-default"
const habit_reminder_id = "habit-reminder"

const notify_task = "lsync:notifyTasks";
const notify_classes ="lsync:notifyClasses";

async function isTypeEnabled(key: string): Promise<boolean> {
    const stored = await AsyncStorage.getItem(key);
    return stored !== "false";

}

export async function setTaskRemindersEnabled(enabled: boolean){
    await AsyncStorage.setItem(notify_task, enabled ? "true" : "false");
    if(!enabled) await cancelAllTaskReminders()
}

export async function setClassRemindersEnabled(enabled: boolean){
    await AsyncStorage.setItem(notify_classes, enabled ? "true" : "false");
    if(!enabled) await cancelAllClassReminders()
}

export async function cancelAllTaskReminders() {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        all
        .filter((n) => n.identifier.startsWith("task-"))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    )
}

export async function cancelAllClassReminders() {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
        all
        .filter((n) => n.identifier.startsWith("class-"))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
    )
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowList: true

    })
})


export async function ensureAndroidChannel() {
    if (Platform.OS !== "android") return;
    await Notifications.setNotificationChannelAsync(channel_id,{
        name: "lsync",
        importance: Notifications.AndroidImportance.DEFAULT
    })
}


export async function requestNotificationPermission(): Promise<boolean>{
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;

    const requested = await Notifications.requestPermissionsAsync()
    return requested.granted;

}


export async function notifyPomodoroComplete(){
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Focus session complete",
            body: "Nice work. Time for a short break before the next one."
        },
        trigger: null
    })
}


export async function scheduleDailyHabitReminder(hour: number, minute: number){
    await cancelDailyHabitReminder();

    await Notifications.scheduleNotificationAsync({
        identifier: habit_reminder_id,
        content: {
            title: "Don't break streak",
            body: "You've got habits waiting to be checked off today."
        },
        trigger:{
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour, minute,
            channelId: channel_id,
        }
    })
}


export async function cancelDailyHabitReminder() {
    await Notifications.cancelScheduledNotificationAsync(habit_reminder_id).catch(
        () => {
            // no-op: fine if there was nothing scheduled yet
        }
    )
}

const schedule_id = "schedule-digest";


export async function scheduleDailyScheduleDigest(hour:number, minute: number){
    await cancelDailyScheduleDigest()

    await Notifications.scheduleNotificationAsync({
        identifier: schedule_id,
        content: { 
            title: "check today's schedule",
            body: "Take a look at what classes and plans you've got today."
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour, minute,
            channelId: channel_id
        }
    })
}


export async function cancelDailyScheduleDigest(){
    await Notifications.cancelScheduledNotificationAsync(schedule_id).catch(
        () =>{
            //no
        }
    )
}


interface ReminderableTask {
    id: string;
    title: string;
    done: boolean;
    dueDate?: string
}

function taskReminderIds(taskId: string) {
    return{
        before: `task-${taskId}-before`,
        dayof: `task-${taskId}-dayof`
    };
}

export async function cancelTaskRminders(taskId: string){
    const ids = taskReminderIds(taskId);
    await Promise.all([
        Notifications.cancelScheduledNotificationAsync(ids.before).catch(()=>{}),
        Notifications.cancelScheduledNotificationAsync(ids.dayof).catch(()=>{}
    )
    ])
}

export async function scheduleTaskReminders(tasks: ReminderableTask[]) {
    const enabled = await isTypeEnabled(notify_task);
    if(!enabled){
        await cancelAllTaskReminders();
        return
    }

    const now = new Date();

    for (const task of tasks){
        await cancelTaskRminders(task.id);
        if (task.done || !task.dueDate) continue;

        const ids = taskReminderIds(task.id);
        const [year, month, day] = task.dueDate.split("-").map(Number);

        const beforeDate = new Date(year, month - 1, day - 1, 18, 0, 0);
        if(beforeDate > now){
            await Notifications.scheduleNotificationAsync({
                identifier: ids.before,
                content:{
                    title: "Due tomorrow",
                    body: `"${task.title}" is due tomorrow.`
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: beforeDate,
                    channelId: channel_id
                }
            })
        }

        const dayOfDate = new Date(year, month - 1, day - 1, 18, 0, 0);
        if (dayOfDate > now){
            await Notifications.scheduleNotificationAsync({
                identifier: ids.dayof,
                content: {
                    title: "Due today",
                    body:`"${task.title}" is due today.`
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: dayOfDate,
                    channelId: channel_id
                }
            })
        }
    }
}


const reminder_minutes_bf_class = 15;

function parsedClassTime(time: string): {hour: number; minute: number} | null{
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour !== 12) hour = 0;
    return {hour, minute}

}

function classReminderId(classId: string) {
    return `class-${classId}`;
}

export async function cancelClassReminder(classId: string){
    await Notifications.cancelScheduledNotificationAsync(
        classReminderId(classId),
    ).catch(() => {});
}

interface ReminderableClass {
    id: string;
    name: string;
    time: string;
    dayOfWeek: number
}

export async function scheduleClassReminders(classes: ReminderableClass[]){
    const enabled = await isTypeEnabled(notify_classes);
    if (!enabled) {
        await cancelAllClassReminders();
        return;
    }

    for (const cls of classes) {
        await cancelClassReminder(cls.id)
        const parsed = parsedClassTime(cls.time);
        if(!parsed) continue;

        let { hour, minute} = parsed;
        minute -= reminder_minutes_bf_class;
        if (minute < 0){
            minute += 60;
            hour -= 1;
            if (hour < 0) hour += 24;
        }

        const expoWeekday = cls.dayOfWeek + 1;

        await Notifications.scheduleNotificationAsync({
            identifier: classReminderId(cls.id),
            content: {
                title: "Class starting soon",
                body: `${cls.name} starts in ${reminder_minutes_bf_class} minutes.`
            },
            trigger:{
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: expoWeekday,
                hour, minute,
                channelId: channel_id
            }
        })
    }
}