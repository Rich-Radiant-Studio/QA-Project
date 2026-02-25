# 临时设置 Java 环境变量（当前 PowerShell 窗口有效）

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "临时设置 Java 环境变量" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置 JAVA_HOME
$env:JAVA_HOME = "D:\java JDK"
Write-Host "✓ JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Green

# 添加到 PATH
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
Write-Host "✓ 已添加到 PATH" -ForegroundColor Green

Write-Host ""
Write-Host "验证 Java 安装..." -ForegroundColor Yellow
Write-Host ""

# 验证
try {
    java -version
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Java 配置成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "现在可以运行: npx expo run:android" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ Java 仍然无法运行" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查 Java 安装路径是否正确" -ForegroundColor Yellow
    Write-Host "当前设置: D:\java JDK" -ForegroundColor Yellow
}
