# 安装 Java (JDK) 指南

## 问题

构建 Android 时出现错误：
```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

## 解决方案

### 方法 1：安装 OpenJDK 17（推荐，最简单）

#### 步骤 1：下载

访问：https://adoptium.net/temurin/releases/?version=17

选择：
- Operating System: Windows
- Architecture: x64
- Package Type: JDK
- Version: 17 (LTS)

点击下载 `.msi` 安装包

#### 步骤 2：安装

1. 运行下载的 `.msi` 文件
2. 选择 "Install for all users"
3. **重要：勾选 "Set JAVA_HOME variable"**
4. **重要：勾选 "Add to PATH"**
5. 点击 "Install"
6. 等待安装完成

#### 步骤 3：验证

打开**新的** PowerShell 窗口：

```bash
java -version
```

应该显示：
```
openjdk version "17.x.x"
```

#### 步骤 4：继续构建

```bash
npx expo run:android
```

### 方法 2：使用 Chocolatey（适合开发者）

如果你已安装 Chocolatey：

```bash
# 以管理员身份运行 PowerShell
choco install openjdk17
```

### 方法 3：手动配置环境变量

如果安装后仍然报错，手动配置：

#### 步骤 1：找到 Java 安装路径

默认路径：
```
C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\
```

#### 步骤 2：设置环境变量

1. 右键 "此电脑" → "属性"
2. 点击 "高级系统设置"
3. 点击 "环境变量"
4. 在 "系统变量" 中点击 "新建"：
   - 变量名：`JAVA_HOME`
   - 变量值：`C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
5. 编辑 "Path" 变量，添加：
   - `%JAVA_HOME%\bin`
6. 点击 "确定"

#### 步骤 3：重启 PowerShell

关闭所有 PowerShell 窗口，重新打开。

#### 步骤 4：验证

```bash
echo $env:JAVA_HOME
java -version
```

### 方法 4：临时设置（快速测试）

在当前 PowerShell 窗口临时设置：

```powershell
# 设置 JAVA_HOME（替换为你的实际路径）
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot"
$env:Path += ";$env:JAVA_HOME\bin"

# 验证
java -version

# 继续构建
npx expo run:android
```

**注意：这个设置只在当前窗口有效，关闭后失效。**

## 推荐版本

- **JDK 17**（LTS，长期支持）
- 或 JDK 11（也可以）

**不推荐：**
- JDK 8（太旧）
- JDK 21+（可能有兼容性问题）

## 常见问题

### Q1: 安装后仍然报错？

A: 确保：
1. 关闭并重新打开 PowerShell
2. 检查环境变量是否正确设置
3. 运行 `java -version` 验证

### Q2: 找不到 JAVA_HOME？

A: 运行：
```bash
echo $env:JAVA_HOME
```

如果为空，说明环境变量没有设置。

### Q3: 多个 Java 版本冲突？

A: 确保 JAVA_HOME 指向正确的版本：
```bash
echo $env:JAVA_HOME
# 应该指向 JDK 17
```

### Q4: 使用 Android Studio 自带的 JDK？

A: 可以，但需要手动配置：
```bash
# 找到 Android Studio JDK 路径
# 通常在：C:\Program Files\Android\Android Studio\jbr

# 设置环境变量
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path += ";$env:JAVA_HOME\bin"
```

## 下一步

安装完成后：

```bash
# 1. 验证 Java
java -version

# 2. 继续构建 Android
npx expo run:android
```

## 需要帮助？

如果遇到问题，提供以下信息：
1. Java 版本：`java -version`
2. JAVA_HOME：`echo $env:JAVA_HOME`
3. 错误信息
