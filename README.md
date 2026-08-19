# 宝宝成长记

一个专为移动端优化的宝宝生长记录网站，支持 PWA 离线使用。

## 功能

- **每日快速记录**：吃奶、辅食、喝水、小便、大便
- **成长里程碑**：新技能、情绪、运动、补剂 / 维生素
- **生长曲线**：身高 / 体重趋势图
- **阶段建议**：按宝宝月龄给出喂养、睡眠、运动、早教建议
- **数据管理**：本地 localStorage 缓存 + Firebase Realtime Database 云同步，支持 JSON 导入 / 导出 / 清空
- **云同步**：自动同步到 Firebase，换设备登录同一账号可共享数据

## 如何打开

### 方法一：直接打开
在浏览器中打开 `index.html` 即可使用。

### 方法二：本地服务器（推荐，PWA 功能更完整）

```bash
cd baby-growth-tracker
python3 -m http.server 8080
```

然后用手机或电脑访问：

```
http://<电脑IP>:8080
```

手机浏览器打开后，可点击「添加到主屏幕」，即可像 App 一样使用。

## 使用建议

1. 先到「设置」页填写宝宝昵称和出生日期。
2. 在「记录」页快速填写每日吃喝拉撒。
3. 每周在「成长」页记录一次身高体重，观察曲线变化。
4. 随时在「成长」页记录新技能和情绪变化。
5. 「建议」页会根据当前月龄自动更新养育重点。

## 数据安全

- 数据默认保存在浏览器本地（localStorage），同时自动同步到 Firebase Realtime Database。
- 每个设备/浏览器以匿名账号登录，数据隔离存储。
- 建议定期「导出备份」到本地 JSON，以防浏览器数据被清除。

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

- 当前默认使用 **Firebase 匿名登录**，每台设备会生成一个独立的匿名 UID，因此不同设备之间的数据**不会自动合并**。
- 如需在手机、平板、电脑之间共享同一份数据：
  1. 在 Firebase Console 启用 **Google 登录** 或 **邮箱/密码登录**。
  2. 在「设置」页（或代码中）调用 `firebase.auth().signInWithPopup(provider)` 或 `signInWithEmailAndPassword(...)`。
  3. 所有设备登录同一个账号后，数据会同步到同一个 `users/{uid}/data` 节点。

## 文件说明

- `index.html`：主程序（单页应用，包含所有代码）
- `manifest.json`：PWA 配置
- `icon-192.png` / `icon-512.png`：应用图标
- `README.md`：使用说明
