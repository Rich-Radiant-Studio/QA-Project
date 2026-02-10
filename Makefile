# React Native 项目 Makefile
# 使用方法：make <target>

.PHONY: help install start android ios clean test lint build-dev build-prod

# 默认目标：显示帮助
help:
	@echo "可用的命令："
	@echo "  make install      - 安装依赖"
	@echo "  make start        - 启动开发服务器"
	@echo "  make android      - 启动 Android 开发"
	@echo "  make ios          - 启动 iOS 开发"
	@echo "  make test         - 运行测试"
	@echo "  make lint         - 代码检查"
	@echo "  make clean        - 清理缓存"
	@echo "  make build-dev    - 构建开发版本"
	@echo "  make build-prod   - 构建生产版本"

# 安装依赖
install:
	@echo "安装依赖..."
	npm install

# 启动开发服务器
start:
	@echo "启动 Expo 开发服务器..."
	npx expo start

# 启动开发服务器（Development Build）
start-dev:
	@echo "启动 Development Build 服务器..."
	npx expo start --dev-client

# Android 开发
android:
	@echo "启动 Android 开发..."
	npx expo start --android

# iOS 开发
ios:
	@echo "启动 iOS 开发..."
	npx expo start --ios

# 运行测试
test:
	@echo "运行测试..."
	npm test

# 代码检查
lint:
	@echo "运行 ESLint..."
	npm run lint

# 类型检查（如果有 TypeScript）
type-check:
	@echo "TypeScript 类型检查..."
	npm run type-check

# 清理缓存
clean:
	@echo "清理缓存..."
	rm -rf node_modules
	rm -rf .expo
	rm -rf dist
	npm cache clean --force

# 重新安装
reinstall: clean install

# 构建 Development Build - Android
build-dev-android:
	@echo "构建 Android Development Build..."
	eas build --profile development --platform android

# 构建 Development Build - iOS
build-dev-ios:
	@echo "构建 iOS Development Build..."
	eas build --profile development --platform ios

# 构建 Development Build - 全平台
build-dev: build-dev-android build-dev-ios

# 构建生产版本 - Android
build-prod-android:
	@echo "构建 Android 生产版本..."
	eas build --profile production --platform android

# 构建生产版本 - iOS
build-prod-ios:
	@echo "构建 iOS 生产版本..."
	eas build --profile production --platform ios

# 构建生产版本 - 全平台
build-prod: build-prod-android build-prod-ios

# 提交到应用商店 - Android
submit-android:
	@echo "提交到 Google Play..."
	eas submit --platform android

# 提交到应用商店 - iOS
submit-ios:
	@echo "提交到 App Store..."
	eas submit --platform ios

# 提交到应用商店 - 全平台
submit: submit-android submit-ios

# 查看构建状态
build-status:
	@echo "查看构建状态..."
	eas build:list

# 登录 EAS
login:
	@echo "登录 EAS..."
	eas login

# 配置 EAS
configure:
	@echo "配置 EAS Build..."
	eas build:configure

# 更新依赖
update:
	@echo "更新依赖..."
	npm update

# 检查过期的依赖
outdated:
	@echo "检查过期的依赖..."
	npm outdated

# Git 相关
git-status:
	@echo "Git 状态..."
	git status

git-push:
	@echo "推送到远程仓库..."
	git add .
	git commit -m "Update"
	git push

# 开发环境检查
doctor:
	@echo "检查开发环境..."
	npx expo-doctor

# 完整的开发流程
dev-flow: install start

# 完整的发布流程
release-flow: test lint build-prod submit
