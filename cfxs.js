
const { Contract, JsonRpcProvider, Wallet } = require('ethers');
const axios = require('axios');
const config = require('./config.json');
const cfxsMainMeta = require('./CFXsMain.json');

const provider = new JsonRpcProvider(config.url);
const cfxsMainContract = new Contract(config.CFXsAddress, cfxsMainMeta.abi, provider);
const wallet = new Wallet(config.privateKey, provider);
let cfxsMainContract1 = cfxsMainContract.connect(wallet);

async function fetchData(index) {
    const url = `https://www.cfxs.world/api/cfxs/my/new?index=${index}&merged=0&owner=${wallet.address}&size=60`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

async function getAllIds() {
    let index = 0;
    let allIds = [];

    while (true) {
        const data = await fetchData(index);

        if (!data || data.rows.length === 0) {
            break;
        }
        const ids = data.rows.map(entry => ({ id: parseInt(entry.id), amount: entry.amount }));
        console.log("获取到IDs：", ids)
        allIds = allIds.concat(ids);
        index += 60;
    }

    const idsChunks = [];
    for (let i = 0; i < allIds.length; i += config.mergeNum) {
        idsChunks.push(allIds.slice(i, i + config.mergeNum));
    }

    return idsChunks;
}

async function callProcessTransaction() {
    const idsChunks = await getAllIds();
    const totalChunks = idsChunks.length;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const ids = idsChunks[chunkIndex];
        try {
            // 计算每组的总amount
            const totalAmount = ids.reduce((total, id) => total + id.amount, 0);

            // 创建包含每组总amount的output
            let output = [{ owner: wallet.address, amount: totalAmount, data: '' }];

            const tempIds = ids.map(id => id.id);
            console.log("合并Ids：", tempIds, "， 合并后数量：", totalAmount);

            // 计算当前循环的百分比进度
            const progress = ((chunkIndex + 1) / totalChunks) * 100;
            console.log(`进度：${progress.toFixed(2)}%`);

            // 调用区块链交易处理函数
            const tx = await cfxsMainContract1.processTransaction(tempIds, output);
            await tx.wait();

            console.log('合并成功!');
        } catch (error) {
            console.error('合并失败:', error);
        }
    }
}

callProcessTransaction();
