// 推送通知功能示例
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 配置通知处理器
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 1. 请求通知权限
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('通知权限未授予');
      return false;
    }
    
    console.log('通知权限已授予');
    return true;
  } catch (error) {
    console.error('请求通知权限失败', error);
    return false;
  }
};

// 2. 获取推送通知 Token（用于远程推送）
export const getPushToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // 从 app.json 中的 extra.eas.projectId 获取
    });
    
    console.log('Push Token:', token.data);
    return token.data;
  } catch (error) {
    console.error('获取 Push Token 失败', error);
    return null;
  }
};

// 3. 发送本地通知
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: true,
        badge: 1,
      },
      trigger: null, // 立即发送
    });
    
    console.log('本地通知已发送');
  } catch (error) {
    console.error('发送本地通知失败', error);
  }
};

// 4. 定时通知
export const scheduleNotification = async (title, body, seconds) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: {
        seconds: seconds,
      },
    });
    
    console.log('定时通知已安排，ID:', id);
    return id;
  } catch (error) {
    console.error('安排定时通知失败', error);
    return null;
  }
};

// 5. 取消通知
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('通知已取消');
  } catch (error) {
    console.error('取消通知失败', error);
  }
};

// 6. 监听通知点击
export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('用户点击了通知', response);
    callback(response);
  });
};

// 7. 监听收到通知
export const addNotificationReceivedListener = (callback) => {
  return Notifications.addNotificationReceivedListener((notification) => {
    console.log('收到通知', notification);
    callback(notification);
  });
};

// 8. 清除所有通知
export const clearAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
    console.log('所有通知已清除');
  } catch (error) {
    console.error('清除通知失败', error);
  }
};

// 9. 设置通知角标
export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
    console.log('角标已设置为', count);
  } catch (error) {
    console.error('设置角标失败', error);
  }
};

// 使用示例
export const initializeNotifications = async () => {
  // 1. 请求权限
  const hasPermission = await requestNotificationPermissions();
  
  if (!hasPermission) {
    console.log('用户拒绝了通知权限');
    return;
  }
  
  // 2. 获取 Push Token（用于远程推送）
  const pushToken = await getPushToken();
  
  // 3. 发送 Push Token 到后端
  if (pushToken) {
    // await sendTokenToBackend(pushToken);
    console.log('Push Token 已获取，可以发送到后端');
  }
  
  // 4. 监听通知
  const responseListener = addNotificationResponseListener((response) => {
    // 用户点击通知后的处理
    console.log('通知数据:', response.notification.request.content.data);
  });
  
  const receivedListener = addNotificationReceivedListener((notification) => {
    // 收到通知时的处理
    console.log('收到新通知');
  });
  
  // 返回清理函数
  return () => {
    responseListener.remove();
    receivedListener.remove();
  };
};

// 远程推送通知（后端发送）
// 后端需要调用 Expo Push API
// POST https://exp.host/--/api/v2/push/send
// {
//   "to": "ExponentPushToken[xxxxxx]",
//   "title": "标题",
//   "body": "内容",
//   "data": { "key": "value" }
// }
