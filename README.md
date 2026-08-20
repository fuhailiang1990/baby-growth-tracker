# 宝宝成长记

一个专为移动端优化的宝宝生长记录网站，支持 PWA 离线使用。

## 功能

- **每日快速记录**：吃奶、辅食、喝水、小便、大便
- **成长里程碑**：新技能、情绪、运动、补剂 / 维生素
- **生长曲线**：身高 / 体重趋势图
- **阶段建议**：按宝宝月龄给出喂养、睡眠、运动、早教建议
- **数据管理**：本地 localStorage 缓存 + Firebase Realtime Database 云同步，支持 JSON 导入 / 导出 / 清空
- **多设备同步**：使用「同步码」让多台设备共享同一份云端数据，无需手机号/邮箱注册
- **记录人识别**：可设置每台设备的记录人名称，方便区分是谁录入的数据
- **手动同步**：顶部新增同步按钮，下拉/返回前台也会自动刷新
- **安装包**：提供 Android APK（Trusted Web Activity），可添加到主屏幕像原生 App 一样使用

## 如何打开

### 方法一：网页版
直接访问 GitHub Pages：

```
https://fuhailiang1990.github.io/baby-growth-tracker/
```

### 方法二：本地服务器（推荐开发/调试）

```bash
cd baby-growth-tracker
python3 -m http.server 8080
```

然后用手机或电脑访问：

```
http://<电脑IP>:8080
```

### 方法三：Android APK
下载 `download/宝宝成长记.apk` 安装到 Android 手机，打开后会直接加载网页版，可添加到主屏幕像原生 App 一样使用。

## 使用建议

1. 先到「设置」页填写宝宝昵称、出生日期，并设置本机「记录人」。
2. 在「记录」页快速填写每日吃喝拉撒；下拉页面可手动刷新同步。
3. 每周在「成长」页记录一次身高体重，观察曲线变化。
4. 随时在「成长」页记录新技能和情绪变化。
5. 「建议」页会根据当前月龄自动更新养育重点。
6. 多设备共享：在「设置」页把「同步码」设为相同字符串，所有设备即可读写同一份数据。

## 数据安全

- 数据默认保存在浏览器本地（localStorage），同时自动同步到 Firebase Realtime Database。
- 每个设备/浏览器以匿名账号登录，但「同步码」相同的设备会共享同一个云端数据节点。
- 建议定期「导出备份」到本地 JSON，以防浏览器数据被清除。
- 同步码仅用于区分数据节点，没有密码保护，建议只在家用范围内使用。

## Firebase 配置

本项目已集成 Firebase。如需自行部署：

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建项目。
2. 开启 **Authentication → Sign-in method → 匿名登录**。
3. 创建 **Realtime Database**，并设置安全规则（示例）：

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid",
        ".write": "auth.uid == $uid"
      }
    }
  }
}
```

4. 将 `index.html` 中的 `firebaseConfig` 替换为你自己的配置。

## 多设备共享

- 默认使用 **Firebase 匿名登录**，每台设备会生成一个独立的匿名 UID。
- 为了让多设备共享同一份数据而不需要手机号/邮箱，本应用使用「**同步码**」机制：
  1. 在「设置」页填入相同的「同步码」（例如家里统一的一个词或数字）。
  2. 数据会同步到同一个 Firebase 节点 `users/{syncCodeHash}/data`。
  3. 所有设置相同同步码的设备会自动实时同步。
- 如需更严格的身份验证，可在 Firebase Console 启用 **Google 登录** 或 **邮箱/密码登录**，并在代码中替换同步码逻辑。

## 文件说明

- `index.html`：主程序（单页应用，包含所有代码）
- `manifest.json`：PWA 配置
- `icon-192.png` / `icon-512.png`：应用图标
- `README.md`：使用说明
