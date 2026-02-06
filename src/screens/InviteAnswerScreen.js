import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function InviteAnswerScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [inviteTab, setInviteTab] = useState('本站');
  const [searchLocalUser, setSearchLocalUser] = useState('');
  const [searchTwitterUser, setSearchTwitterUser] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>邀请回答</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* 平台选择标签 */}
      <View style={styles.platformTabs}>
        <TouchableOpacity 
          style={[styles.platformTab, inviteTab === '本站' && styles.platformTabActive]}
          onPress={() => setInviteTab('本站')}
        >
          <Text style={[styles.platformTabText, inviteTab === '本站' && styles.platformTabTextActive]}>本站</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.platformTab, inviteTab === '推特' && styles.platformTabActive]}
          onPress={() => setInviteTab('推特')}
        >
          <Ionicons name="logo-twitter" size={16} color={inviteTab === '推特' ? '#1DA1F2' : '#9ca3af'} />
          <Text style={[styles.platformTabText, inviteTab === '推特' && styles.platformTabTextActive]}>推特</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder={inviteTab === '本站' ? '搜索用户' : '搜索推特用户'}
            placeholderTextColor="#9ca3af"
            value={inviteTab === '本站' ? searchLocalUser : searchTwitterUser}
            onChangeText={(text) => {
              if (inviteTab === '本站') setSearchLocalUser(text);
              else setSearchTwitterUser(text);
            }}
          />
        </View>
      </View>

      {/* 用户列表 */}
      <ScrollView 
        style={styles.userList} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {inviteTab === '本站' && [1, 2, 3, 4, 5].map(i => (
          <View key={`local-${i}`} style={styles.userItem}>
            <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=invite${i}` }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>用户{i}</Text>
              <Text style={styles.userDesc}>Python开发者 · {i * 10}个回答</Text>
            </View>
            <TouchableOpacity 
              style={styles.inviteBtn} 
              onPress={() => {
                alert(`已邀请用户${i}`);
                navigation.goBack();
              }}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.inviteBtnText}>邀请</Text>
            </TouchableOpacity>
          </View>
        ))}
        {inviteTab === '推特' && [1, 2, 3, 4, 5].map(i => (
          <View key={`tw-${i}`} style={styles.userItem}>
            <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=tw${i}` }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>@twitter_user{i}</Text>
              <Text style={styles.userDesc}>{i}k 关注者</Text>
            </View>
            <TouchableOpacity 
              style={[styles.inviteBtn, styles.inviteBtnTwitter]} 
              onPress={() => {
                alert(`已邀请推特用户${i}`);
                navigation.goBack();
              }}
            >
              <Ionicons name="logo-twitter" size={16} color="#fff" />
              <Text style={styles.inviteBtnText}>邀请</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  closeBtn: { 
    padding: 8, 
    minWidth: 44, 
    minHeight: 44, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1f2937', 
    flex: 1, 
    textAlign: 'center' 
  },
  platformTabs: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    gap: 8 
  },
  platformTab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 12, 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    gap: 4 
  },
  platformTabActive: { 
    backgroundColor: '#eff6ff', 
    borderColor: '#3b82f6' 
  },
  platformTabText: { 
    fontSize: 14, 
    color: '#6b7280', 
    fontWeight: '500' 
  },
  platformTabTextActive: { 
    color: '#3b82f6', 
    fontWeight: '600' 
  },
  searchContainer: { 
    paddingHorizontal: 16, 
    marginBottom: 16 
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    gap: 8 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 14, 
    color: '#1f2937', 
    padding: 0 
  },
  userList: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  userItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  userAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22 
  },
  userInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  userName: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#1f2937', 
    marginBottom: 4 
  },
  userDesc: { 
    fontSize: 12, 
    color: '#9ca3af' 
  },
  inviteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    gap: 4 
  },
  inviteBtnText: { 
    fontSize: 12, 
    color: '#fff', 
    fontWeight: '600' 
  },
  inviteBtnTwitter: { 
    backgroundColor: '#1DA1F2' 
  },
});
