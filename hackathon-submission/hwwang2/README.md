## project
- 项目名称: Wordle On Sui
> 描述: Wordle猜单词游戏，在不同步骤投注不同金额进行游戏，猜对单词可以赢得1SUI，至高获利100倍。
>1. 管理员可以在后台初始化游戏，提交游戏数据（包括id、签名等）到SUI链上，游戏结果及nonce存在游戏服务器。
>2. 玩家猜单词的时候，会扣除所需sui（0.01～0.8不等），并把单词提交到链上
>3. 后台有event-indexer，把猜测单词等数据更新到游戏数据库中
>4. 如果玩家猜对单词，可以获得1SUI的奖励，6次都不对游戏也结束。游戏结束后，私密数据公开，winner可以领奖，其他玩家如果有疑问可以进行验证
### 项目地址
> github项目地址 [代码](https://github.com/hwwang2/hoh-hackathon)

> 游戏地址 [play wordle to win 100x](https://hoh-hackathon.vercel.app/wordle)


## Member
- hwwang2  github: [hwwang2](https://github.com/hwwang2/)
> 自我介绍&技术栈: 
多年后端开发，有过游戏、app后台、中台等各类项目经验；有一点前端基础。目前对web3感兴趣，被“code is the law”吸引，希望看看能在web3中技术人能做点啥不一样的。


