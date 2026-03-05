# 生成 Android Release Keystore 脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android Release Keystore 生成工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已存在
if (Test-Path "android/app/release.keystore") {
    Write-Host "⚠️  警告: release.keystore 已存在！" -ForegroundColor Yellow
    $overwrite = Read-Host "是否覆盖? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "❌ 已取消" -ForegroundColor Red
        exit 1
    }
}

Write-Host "请输入以下信息（用于生成签名证书）：" -ForegroundColor Green
Write-Host ""

# 收集信息
$storePassword = Read-Host "密钥库密码 (至少6位，请记住此密码)"
$keyPassword = Read-Host "密钥密码 (至少6位，可以与密钥库密码相同)"
$alias = "qa-app-release"
$validity = 10000

Write-Host ""
Write-Host "证书信息（用于标识应用发布者）：" -ForegroundColor Green
$cn = Read-Host "公司/组织名称 (CN)"
$ou = Read-Host "部门 (OU，可选，直接回车跳过)"
$o = Read-Host "组织 (O，可选，直接回车跳过)"
$l = Read-Host "城市 (L，可选，直接回车跳过)"
$st = Read-Host "省份 (ST，可选，直接回车跳过)"
$c = Read-Host "国家代码 (C，如 CN，可选，直接回车跳过)"

# 构建 dname
$dname = "CN=$cn"
if ($ou) { $dname += ", OU=$ou" }
if ($o) { $dname += ", O=$o" }
if ($l) { $dname += ", L=$l" }
if ($st) { $dname += ", ST=$st" }
if ($c) { $dname += ", C=$c" }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始生成 Keystore..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 生成 keystore
$keystorePath = "android/app/release.keystore"
& keytool -genkeypair -v `
    -storetype PKCS12 `
    -keystore $keystorePath `
    -alias $alias `
    -keyalg RSA `
    -keysize 2048 `
    -validity $validity `
    -storepass $storePassword `
    -keypass $keyPassword `
    -dname $dname

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Keystore 生成成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "文件位置: $keystorePath" -ForegroundColor Yellow
    Write-Host "密钥别名: $alias" -ForegroundColor Yellow
    Write-Host ""
    
    # 创建 keystore.properties 文件
    $propertiesPath = "android/keystore.properties"
    $propertiesContent = @"
storePassword=$storePassword
keyPassword=$keyPassword
keyAlias=$alias
storeFile=release.keystore
"@
    
    $propertiesContent | Out-File -FilePath $propertiesPath -Encoding UTF8
    
    Write-Host "✅ 已创建配置文件: $propertiesPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  重要提醒：" -ForegroundColor Red
    Write-Host "1. 请妥善保管 release.keystore 文件（建议备份到安全位置）" -ForegroundColor Yellow
    Write-Host "2. 请记住密码，丢失后无法恢复" -ForegroundColor Yellow
    Write-Host "3. keystore.properties 已添加到 .gitignore，不会提交到 Git" -ForegroundColor Yellow
    Write-Host "4. 首次上传到应用商店后，后续更新必须使用相同的 keystore" -ForegroundColor Yellow
    Write-Host ""
    
    # 验证 keystore
    Write-Host "验证 Keystore 信息：" -ForegroundColor Cyan
    & keytool -list -v -keystore $keystorePath -alias $alias -storepass $storePassword
    
} else {
    Write-Host ""
    Write-Host "❌ Keystore 生成失败！" -ForegroundColor Red
    exit 1
}
