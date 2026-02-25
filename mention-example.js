// @提及功能示例（纯 JS，不需要原生库）
import { Linking, Text, TouchableOpacity } from 'react-native';

// 1. 检测文本中的 @mention
export const detectMentions = (text) => {
  // 匹配 @username 格式
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      index: match.index,
      length: match[0].length,
    });
  }
  
  return mentions;
};

// 2. 解析文本，将 @mention 转换为可点击的链接
export const parseMentions = (text) => {
  const mentionRegex = /@(\w+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    // 添加普通文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }
    
    // 添加 mention
    parts.push({
      type: 'mention',
      username: match[1],
      content: match[0],
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }
  
  return parts;
};

// 3. 打开外部平台链接
export const openPlatformProfile = (platform, username) => {
  const urls = {
    twitter: `https://twitter.com/${username}`,
    instagram: `https://instagram.com/${username}`,
    facebook: `https://facebook.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    github: `https://github.com/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
  };
  
  const url = urls[platform.toLowerCase()];
  
  if (url) {
    Linking.openURL(url).catch((err) => {
      console.error('无法打开链接', err);
    });
  }
};

// 4. 检测平台前缀的 mention（如 @twitter:username）
export const detectPlatformMentions = (text) => {
  // 匹配 @platform:username 格式
  const platformMentionRegex = /@(twitter|instagram|facebook|linkedin|github|tiktok):(\w+)/gi;
  const mentions = [];
  let match;
  
  while ((match = platformMentionRegex.exec(text)) !== null) {
    mentions.push({
      platform: match[1].toLowerCase(),
      username: match[2],
      fullMatch: match[0],
      index: match.index,
    });
  }
  
  return mentions;
};

// 5. React 组件：可点击的 Mention 文本
export const MentionText = ({ text, onMentionPress, style }) => {
  const parts = parseMentions(text);
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.type === 'mention') {
          return (
            <Text
              key={index}
              style={{ color: '#1DA1F2', fontWeight: 'bold' }}
              onPress={() => onMentionPress && onMentionPress(part.username)}
            >
              {part.content}
            </Text>
          );
        }
        return <Text key={index}>{part.content}</Text>;
      })}
    </Text>
  );
};

// 6. React 组件：支持平台前缀的 Mention 文本
export const PlatformMentionText = ({ text, style }) => {
  const platformMentions = detectPlatformMentions(text);
  
  if (platformMentions.length === 0) {
    return <Text style={style}>{text}</Text>;
  }
  
  const parts = [];
  let lastIndex = 0;
  
  platformMentions.forEach((mention, index) => {
    // 添加普通文本
    if (mention.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, mention.index),
      });
    }
    
    // 添加平台 mention
    parts.push({
      type: 'platform-mention',
      platform: mention.platform,
      username: mention.username,
      content: mention.fullMatch,
    });
    
    lastIndex = mention.index + mention.fullMatch.length;
  });
  
  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (part.type === 'platform-mention') {
          return (
            <Text
              key={index}
              style={{ color: '#1DA1F2', fontWeight: 'bold' }}
              onPress={() => openPlatformProfile(part.platform, part.username)}
            >
              {part.content}
            </Text>
          );
        }
        return <Text key={index}>{part.content}</Text>;
      })}
    </Text>
  );
};

// 7. 输入框自动补全 @mention
export const MentionInput = ({ value, onChangeText, suggestions = [] }) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [currentMention, setCurrentMention] = React.useState('');
  
  const handleTextChange = (text) => {
    onChangeText(text);
    
    // 检测是否正在输入 @mention
    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = text.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setCurrentMention(textAfterAt);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };
  
  const selectSuggestion = (username) => {
    const lastAtIndex = value.lastIndexOf('@');
    const newText = value.substring(0, lastAtIndex) + `@${username} `;
    onChangeText(newText);
    setShowSuggestions(false);
  };
  
  // 返回输入框和建议列表
  return {
    handleTextChange,
    showSuggestions,
    filteredSuggestions: suggestions.filter((s) =>
      s.toLowerCase().includes(currentMention.toLowerCase())
    ),
    selectSuggestion,
  };
};

// 使用示例
/*
// 1. 简单的 @mention
<MentionText
  text="Hello @john, check out @twitter:elonmusk"
  onMentionPress={(username) => {
    console.log('点击了', username);
    // 导航到用户页面或打开外部链接
  }}
/>

// 2. 支持平台前缀
<PlatformMentionText
  text="Follow me @twitter:username and @instagram:username"
/>

// 3. 检测 mentions
const text = "Hello @john and @jane";
const mentions = detectMentions(text);
console.log(mentions); // [{ username: 'john', ... }, { username: 'jane', ... }]

// 4. 打开外部平台
openPlatformProfile('twitter', 'elonmusk');
*/
