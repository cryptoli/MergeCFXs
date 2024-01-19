# 合并CFXs
## 概述
该项目涉及与 Conflux 区块链上的 CFXs 智能合约进行交互。脚本使用 Ethereum 的 ethers 库进行合约交互，使用 axios 从特定 API 获取数据。

## 安装
在运行脚本之前，请确保您的计算机上已安装 Node.js。您可以使用以下命令安装所需的依赖项：
```
npm install ethers axios
```
## 配置
只需要修改config.json 的文件的privateKey，其余不动：
```
{
    "privateKey": "0x<您的私钥>",
    "url": "https://evm.confluxrpc.com",
    "CFXsAddress": "0xd3a4d837e0a7b40de0b4024fa0f93127dd47b8b8",
    "mergeNum": 24
}
```
将 <您的私钥> 替换为您的实际私钥。

## 执行
要运行脚本，请执行以下命令：
```
node cfxs.js
```
## 注意事项
1. 该脚本可以多次执行
2. 如果某一次合并出现错误，请仔细查看报错信息，可能是某些编号已经合并过
3. 到最后凑不齐24个了，配置文件里可以修改成2个 3个 ....